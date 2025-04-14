import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/smtp.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sendToken } from "../utils/sendToken.js";
// import { CompanyDetails } from "../models/companyDetails.model.js";
import { ShopifyDetails } from "../models/shopifyDetails.model.js";
import { randomBytes } from "crypto";
import crypto from 'crypto';
import CompanyDetails from "../models/companyDetails.model.js";


export const signup = asyncHandler(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        designation,
        linkedInUrl,
        companyName,
        companyWebsite,
        employeeSize,
        kindsOfProducts,
        country,
        state,
        city,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !contactNumber || !companyName) {
        throw new ApiError(400, "Missing required fields");
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ email: normalizedEmail }, { contactNumber }],
    });

    if (existingUser) {
        throw new ApiError(400, "User with email or contact number already exists");
    }

    // Determine role
    const role = normalizedEmail.includes('@bargenix.com') ? 'ADMIN' : 'STORE_OWNER';

    // Generate a default password if not provided
    const generatedPassword = password || crypto.randomBytes(10).toString('hex');

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email: normalizedEmail,
        contactNumber,
        password: generatedPassword,
        designation,
        linkedInUrl,
        isUserVerified: false,
        role,
    });

    // Generate OTP and save user
    const { OTP } = user.generateVerificationTokenAndOtp();
    await user.save();

    // Create company details
    await CompanyDetails.create({
        companyName,
        companyWebsite,
        employeeSize,
        kindsOfProducts,
        country,
        state,
        city,
        userId: user._id,
    });

    // Send verification email
    try {
        await sendEmail({
            email: user.email,
            subject: "Verify Your Email - Bargenix",
            message: `Your verification OTP is: ${OTP}. This OTP will expire in 15 minutes.`,
        });
    } catch (error) {
        // Rollback user creation if email fails
        await User.findByIdAndDelete(user._id);
        throw new ApiError(500, "Error sending verification email. Please try again.");
    }

    res.status(201).json(
        new ApiResponse(201, "Registration successful. Please check your email for OTP verification.")
    );
});

export const verifyUser = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Please provide both email and OTP");
    }

    const user = await User.findOne({
        email,
        verificationOTP: otp,
        isUserVerified: false
    });

    if (!user) {
        return next(new ApiError(400, "Invalid OTP or email"));
    }

    const password = randomBytes(8).toString('hex');

    user.password = password;
    user.isUserVerified = true;
    user.verificationOTP = undefined;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Account Verified - Bargenix",
        message: `Your account has been successfully verified. Your login credentials are as follows:\n\nUsername: ${user.email}\nPassword: ${password}\n\nPlease change your password after logging in.`
    });

    sendToken(user, 200, res, "Account verified and password sent successfully");
});


export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    console.log('Login attempt with:', { email, passwordProvided: !!password });

    // Validate input
    if (!email || !password) {
        console.log('Missing email or password');
        throw new ApiError(400, "Please provide email and password");
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();
    console.log('Normalized email:', normalizedEmail);

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    console.log('User found:', !!user);

    if (!user) {
        console.log('User not found with email:', normalizedEmail);
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if password matches
    const isPasswordMatched = await user.isPasswordCorrect(password);
    console.log('Password match result:', isPasswordMatched);

    if (!isPasswordMatched) {
        console.log('Password does not match for user:', normalizedEmail);
        throw new ApiError(401, "Invalid email or password");
    }

    // Check if user is verified
    console.log('User verification status:', user.isUserVerified);
    if (!user.isUserVerified) {
        console.log('User not verified, generating new OTP');
        const { OTP } = user.generateVerificationTokenAndOtp();
        await user.save();

        try {
            await sendEmail({
                email: user.email,
                subject: "Verify Your Email - Bargenix",
                message: `Your verification OTP is: ${OTP}. This OTP will expire in 15 minutes.`,
            });
            console.log('Verification email sent successfully');
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new ApiError(500, "Error sending verification email. Please try again.");
        }

        throw new ApiError(401, "Please verify your email first. A new OTP has been sent.");
    }

    console.log('Authentication successful, generating token');
    // Send token and user details
    sendToken(user, 200, res, {
        user: {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
    });
});
// export const signin = async (req, res, next) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return next(new ApiError(400, "Please provide email and password"));
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//         return next(new ApiError(401, "Invalid email or password"));
//     }

//     const isPasswordMatched = await user.isPasswordCorrect(password);

//     if (!isPasswordMatched) {
//         return next(new ApiError(401, "Invalid email or password"));
//     }

//     if (!user.isUserVerified) {
//         const { OTP } = user.generateVerificationTokenAndOtp();
//         await user.save();

//         await sendEmail({
//             email: user.email,
//             subject: "Verify Your Email - Bargenix",
//             message: `Your verification OTP is: ${OTP}. This OTP will expire in 15 minutes.`,
//         });

//         return next(new ApiError(401, "Please verify your email first. New OTP has been sent."));
//     }

//     // Send Token
//     sendToken(user, 200, res, {
//         user: {
//             _id: user._id,
//             email: user.email,
//             role: user.role,
//         },
//     });
// };


export const signout = asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json(
        new ApiResponse(200, "Logged out successfully")
    );
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(
        new ApiResponse(200, user)
    );
});

export const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    console.log("Received body:", req.body); // Debugging

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Please provide both old and new password");
    }

    const user = await User.findById(req.user._id);
    const isPasswordMatched = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordMatched) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Password Changed - Bargenix",
        message: "Your password has been changed successfully. If you didn't make this change, please contact support immediately."
    });

    sendToken(user, 200, res, "Password changed successfully");
});


export const updateUserDetails = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, designation, linkedInUrl } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                firstName,
                lastName,
                designation,
                linkedInUrl
            }
        },
        { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(
        new ApiResponse(200, user, "Profile updated successfully")
    );
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { OTP } = user.generateVerificationTokenAndOtp();
    user.resetPasswordToken = OTP;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset - Bargenix",
            message: `Your password reset OTP is: ${OTP}. This OTP will expire in 15 minutes.`
        });

        res.status(200).json(
            new ApiResponse(200, "Password reset OTP sent to email")
        );
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        throw new ApiError(500, "Error sending password reset email");
    }
});

// In the admin users controller
export const updateUserRole = asyncHandler(async (req, res) => {
    const { userId, newRole } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user: {
            _id: user._id,
            email: user.email,
            role: user.role
        }
    });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        throw new ApiError(400, "Please provide email, OTP and new password");
    }

    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Password Reset Successful - Bargenix",
        message: "Your password has been reset successfully. If you didn't make this change, please contact support immediately."
    });

    sendToken(user, 200, res, "Password reset successful");
});


export const getAllUsers = async (req, res) => {
    try {
        // Fetch users with selected fields
        const users = await User.find()
            .select("role designation isUserVerified firstName lastName email contactNumber");

        // Count the total number of users
        const totalUsers = await User.countDocuments();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        // Return users and the count of total users
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
            totalUsers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};