import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import logos from '../../assets/Section - Logos.png';

const App = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const togglePricing = () => setIsAnnual(!isAnnual);

  const plans = [
    { title: 'Starter', price: isAnnual ? 500 : 50, features: ['2 team members', '20GB Cloud storage', 'Integration help', 'Sketch Files', 'API Access', 'Complete documentation'] },
    { title: 'Premium', price: isAnnual ? 890 : 89, features: ['10 team members', '40GB Cloud storage', 'Integration help', 'Sketch Files', 'API Access', 'Complete documentation'] },
    { title: 'Enterprise', price: isAnnual ? 990 : 99, features: ['Unlimited team members', '100GB Cloud storage', 'Integration help', 'Sketch Files', 'API Access', 'Complete documentation'] },
  ];

  const faqs = [
    { question: 'How do I order?', answer: 'To order, follow the checkout process and complete the payment.' },
    { question: 'How can I make the payment?', answer: 'Payments can be made via credit card, PayPal, or bank transfer.' },
    { question: 'How much time does it take to receive the order?', answer: 'Orders are processed immediately and delivered within 24-48 hours.' },
    { question: 'Can I resell the products?', answer: 'Yes, you can resell the products under specific conditions.' },
    { question: 'Where do I find the shipping details?', answer: 'Shipping details are shared via email after the order is placed.' },
  ];

  return (
    <Box
      sx={{
        padding: '20px 42px', 
        margin: 0,
        marginTop: '64px',
        marginLeft: '191px',
        backgroundColor: '#F5F6FA',
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden', 
        width: 'calc(101vw - 226px)', 
        fontFamily: ' sans-serif'
      }}
    >
      <Box p={4}>
        {/* Pricing Section */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
          <Typography>Monthly</Typography>
          <Switch checked={isAnnual} onChange={togglePricing} />
          <Typography>Annual</Typography>
        </Box>
        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom align="center">
                    {plan.title}
                  </Typography>
                  <Typography variant="h4" align="center">
                    ${plan.price}/mo
                  </Typography>
                  <Box mt={2}>
                    {plan.features.map((feature, i) => (
                      <Typography key={i} variant="body2" color="textSecondary">
                        ✓ {feature}
                      </Typography>
                    ))}
                  </Box>
                  <Box mt={3} textAlign="center">
                    <Button variant="contained" color={index === 1 ? 'primary' : 'secondary'}>
                      {index === 1 ? 'Try Premium' : 'Join'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Brand Logos Section */}
        <Box textAlign="center" my={4}>
          <Typography variant="h6" gutterBottom>
            More than 50+ brands trust Material
          </Typography>
          <Grid >
            <img
              src={logos} 
              alt="logo"
              style={{ width: '900px', height: '900', objectFit: 'contain' }}
            />
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Typography variant="h4" align="center"  color= '#344767' gutterBottom sx={{ fontFamily: ' sans-serif',fontWeight: 'bold',fontSize: '20px' }}>
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ marginTop: '16px', marginBottom: '16px' }}
        >
          A lot of people don't appreciate the moment until it's passed.
          I'm not trying my hardest, and I'm not trying to do.
        </Typography>

        <Box>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default App;
