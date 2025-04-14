import React, { useState } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepConnector,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CompanyDetails from './CompanyDetails';
import BusinessRequirements from './BusinessRequirements';
import PersonalDetails from './PersonalDetails';

const steps = ['Company details', 'Business requirements', 'Personal details'];

// Custom StepConnector styles remain the same...
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    borderColor: '#C4C4C4',
    borderWidth: 2,
  },
}));

// Custom StepIcon styles remain the same...
const CustomStepIcon = styled('div')(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: ownerState.active || ownerState.completed ? '#ADF2A7' : '#FFFFFF',
  border: ownerState.active || ownerState.completed ? 'none' : '2px solid #C4C4C4',
  color: ownerState.active || ownerState.completed ? '#000000' : '#C4C4C4',
  fontWeight: 'bold',
}));

const StepIcon = (props) => {
  const { active, completed, className, icon } = props;
  return (
    <CustomStepIcon ownerState={{ active, completed }} className={className}>
      {icon}
    </CustomStepIcon>
  );
};

const MultiStepForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Company Details
    companyName: '',
    companyWebsite: '',
    employeeSize: '',
    linkedInUrl: '',
    country: '',
    state: '',
    city: '',
    categories: [],

    // Business Requirements
    monthlyOrders: 50,
    inventorySize: 100,
    customerCount: 200,
    annualRevenue: 50000,

    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    designation: '',
    linkedIn: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateFormData = (data) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitting form data:", formData);

      const response = await fetch(
        "http://localhost:5000/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! OTP sent to your email.");
      navigate("/otp-verification", { state: { email: formData.email } });
    } catch (error) {
      console.error("Full error details:", error);
      console.error("Form data that caused error:", formData);
      alert(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: { xs: '90%', md: '50%' }, margin: 'auto', mt: 5 }}>
      <Typography
        variant="h3"
        textAlign="center"
        sx={{
          fontFamily: 'sans-serif',
          fontSize: { xs: '28px', md: '50px' },
          fontWeight: '600',
        }}
      >
        Smart Bargaining Chatbot <br /> for Shopify Stores
      </Typography>

      {/* Rest of the header Typography remains the same... */}

      <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', mt: 5 }}>
        <Stepper activeStep={activeStep} alternativeLabel connector={<CustomStepConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ mt: 5 }}>
        {activeStep === 0 && (
          <CompanyDetails
            handleNext={handleNext}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeStep === 1 && (
          <BusinessRequirements
            handleNext={handleNext}
            handleBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        {activeStep === 2 && (
          <PersonalDetails
            handleBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
};

export default MultiStepForm;