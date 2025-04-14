import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderStep1 from './RenderStep1';
import RenderStep2 from './RenderStep2';
import RenderStep3 from './RenderStep3';
import { Box } from '@mui/material';

const Register = () => {
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        companyName: '',
        companyWebsite: '',
        employeeSize: '',
        companyLinkedInUrl: '',
        kindsOfProducts: [],
        country: '',
        state: '',
        city: '',
        monthlyOrders: 50,
        inventorySize: 100,
        customerCount: 200,
        annualRevenue: 50000,
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        designation: '',
        linkedIn: '',
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleKindsOfProductsChange = (e) => {
        const { value, checked } = e.target;
        let updatedProducts = [...formData.kindsOfProducts];
        if (checked) {
            updatedProducts.push(value);
        } else {
            updatedProducts = updatedProducts.filter((product) => product !== value);
        }
        setFormData({ ...formData, kindsOfProducts: updatedProducts });
    };

    const updateFormData = (updatedFields) => {
        setFormData((prevData) => ({ ...prevData, ...updatedFields }));
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        console.log('Form Data being sent:', formData); 

        try {
            const response = await fetch('http://localhost:5000/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.status === 201) {
                console.log('User registered successfully');
                console.log('Redirecting to OTP verification...');

                navigate('/otp-verification', { state: { email: formData.email } });
            } else {
                const error = await response.json();
                console.error('Error from server:', error.message);
                alert(error.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <Box>
            {step === 1 && (
                <RenderStep1
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleKindsOfProductsChange={handleKindsOfProductsChange}
                    nextStep={nextStep}
                />
            )}
            {step === 2 && (
                <RenderStep2
                    handleNext={nextStep}
                    handleBack={prevStep}
                    formData={formData}
                    updateFormData={updateFormData}
                />
            )}
            {step === 3 && (
                <RenderStep3
                    formData={formData}
                    handleBack={prevStep}
                    handleSubmit={handleSubmit}
                    updateFormData={updateFormData}
                />
            )}
        </Box>
    );
};

export default Register;