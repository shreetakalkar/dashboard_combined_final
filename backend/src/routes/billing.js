import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/create-charge', async (req, res) => {
  const { planName, shop } = req.body;
  if (!planName || !shop) {
    return res.status(400).json({ error: 'Missing planName or shop parameter' });
  }

  const priceMap = {
    free: 0,
    startup: 49,
    business: 99,
    enterprise: 199,
  };

  const price = priceMap[planName.toLowerCase()];
  if (price === undefined) {
    return res.status(400).json({ error: 'Invalid planName' });
  }

  const charge = {
    recurring_application_charge: {
      name: `Bargenix - ${planName} Plan`,
      price: price,
      return_url: `https://${shop}/apps/bargenix-dashboard/plan-success`,
      test: true,
    },
  };

  try {
    const result = await axios.post(
      `https://${shop}/admin/api/2023-01/recurring_application_charges.json`,
      charge,
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ confirmation_url: result.data.recurring_application_charge.confirmation_url });
  } catch (err) {
    console.error('Billing charge creation failed:', err);
    res.status(500).json({ error: 'Billing charge creation failed' });
  }
});

export default router;
