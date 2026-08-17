const express = require('express');
const pool = require('../config/database');
const { authMiddleware, tenantMiddleware } = require('../middleware/auth');

const router = express.Router();

// Helper function to determine rent status
const determineRentStatus = (rentMonth, paymentRecord) => {
  const today = new Date();
  const dueDay = 7;

  const dueDate = new Date(`${rentMonth}-${String(dueDay).padStart(2, '0')}`);

  if (paymentRecord && paymentRecord.status === 'paid') {
    return 'paid';
  }

  if (today < dueDate) {
    return 'pending';
  }

  if (today >= dueDate && (!paymentRecord || paymentRecord.status === 'pending')) {
    return 'overdue';
  }

  return 'pending';
};

// Get tenant's own profile and rent information
router.get('/profile', authMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const tenantResult = await pool.query(
      `SELECT t.*, u.email, u.phone, u.full_name, r.room_number
       FROM tenants t
       JOIN users u ON t.user_id = u.id
       JOIN rooms r ON t.room_id = r.id
       WHERE t.user_id = $1`,
      [userId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant profile not found' });
    }

    res.json(tenantResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tenant's rent information
router.get('/rent', authMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // First get tenant ID
    const tenantResult = await pool.query(
      'SELECT id, room_id, monthly_rent FROM tenants WHERE user_id = $1',
      [userId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant profile not found' });
    }

    const tenant = tenantResult.rows[0];

    // Get room information
    const roomResult = await pool.query(
      'SELECT room_number FROM rooms WHERE id = $1',
      [tenant.room_id]
    );

    // Get rent history
    const rentResult = await pool.query(
      `SELECT * FROM rent_payments WHERE tenant_id = $1 ORDER BY rent_month DESC LIMIT 12`,
      [tenant.id]
    );

    const rentHistory = rentResult.rows.map(payment => ({
      ...payment,
      status: determineRentStatus(payment.rent_month, payment.payment_date ? payment : null)
    }));

    res.json({
      room: roomResult.rows[0],
      monthlyRent: tenant.monthly_rent,
      rentHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tenant's complete rent history
router.get('/rent-history', authMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const tenantResult = await pool.query(
      'SELECT id, monthly_rent FROM tenants WHERE user_id = $1',
      [userId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant profile not found' });
    }

    const tenantId = tenantResult.rows[0].id;

    const result = await pool.query(
      `SELECT * FROM rent_payments WHERE tenant_id = $1 ORDER BY rent_month DESC`,
      [tenantId]
    );

    const rentHistory = result.rows.map(payment => ({
      ...payment,
      status: determineRentStatus(payment.rent_month, payment.payment_date ? payment : null)
    }));

    res.json(rentHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
