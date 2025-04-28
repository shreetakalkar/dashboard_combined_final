import express from 'express';
import db from '../db/index.js'; // Assuming db is exported from this path

const router = express.Router();

router.post('/charge_activated', async (req, res) => {
  const { id, name, status, trial_days, activated_on, shop_domain } = req.body;

  try {
    // Update subscriptions table with activated plan info
    await db.query(
      `UPDATE subscriptions
       SET active = true, billing_status = $1, charge_id = $2
       WHERE charge_id = $2 OR (shop_id = $3 AND plan = $4)`,
      [status, id, shop_domain, name]
    );

    // If no existing subscription, insert new record (optional)
    // This depends on your app logic; adjust as needed

    res.sendStatus(200);
  } catch (err) {
    console.error('Error processing charge_activated webhook:', err);
    res.status(500).json({ error: 'Failed to process charge_activated webhook' });
  }
});

router.post('/charge_cancelled', async (req, res) => {
  const { id, shop_domain } = req.body;

  try {
    // Set subscription as inactive in DB
    await db.query(
      `UPDATE subscriptions
       SET active = false, billing_status = 'cancelled'
       WHERE charge_id = $1 OR shop_id = $2`,
      [id, shop_domain]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error('Error processing charge_cancelled webhook:', err);
    res.status(500).json({ error: 'Failed to process charge_cancelled webhook' });
  }
});

export default router;
