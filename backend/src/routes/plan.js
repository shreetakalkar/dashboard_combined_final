import express from 'express';
import db from '../db/index.js'; // Assuming db is exported from this path

const router = express.Router();

router.get('/plan-status', async (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter' });
  }
  try {
    const result = await db.query(
      'SELECT plan, product_limit FROM subscriptions WHERE shop_id = $1 AND active = true',
      [shop]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'No active subscription' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to fetch plan status:', err);
    res.status(500).json({ error: 'Failed to fetch plan status' });
  }
});

export default router;
