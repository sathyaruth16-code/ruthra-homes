const express = require('express');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validationResult, body } = require('express-validator');

const router = express.Router();

// Helper function to determine rent status
const determineRentStatus = (rentMonth, paymentRecord) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const dueDay = 7;

  const [rentYear, rentMonthStr] = rentMonth.split('-');
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

// Record a rent payment (Admin only)
router.post('/payment', authMiddleware, adminMiddleware, [
  body('tenant_id').isInt(),
  body('rent_month').matches(/^\d{4}-\d{2}$/),
  body('amount_paid').isDecimal(),
  body('payment_date').isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      tenant_id,
      rent_month,
      expected_rent,
      amount_paid,
      payment_date,
      payment_method,
      transaction_reference,
      admin_remarks
    } = req.body;

    // Determine payment status
    let status = 'paid';
    if (amount_paid < expected_rent) {
      status = 'partially_paid';
    }

    const result = await pool.query(
      `INSERT INTO rent_payments 
       (tenant_id, rent_month, expected_rent, amount_paid, payment_date, status, payment_method, transaction_reference, admin_remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (tenant_id, rent_month)
       DO UPDATE SET
         amount_paid = $4,
         payment_date = $5,
         status = $6,
         payment_method = $7,
         transaction_reference = $8,
         admin_remarks = $9,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        tenant_id, rent_month, expected_rent, amount_paid, payment_date,
        status, payment_method || null, transaction_reference || null, admin_remarks || null
      ]
    );

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rent payments for a specific month (Admin only)
router.get('/month/:rentMonth', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rentMonth } = req.params;

    const result = await pool.query(
      `SELECT rp.*, t.id as tenant_id, u.full_name, r.room_number
       FROM rent_payments rp
       JOIN tenants t ON rp.tenant_id = t.id
       JOIN users u ON t.user_id = u.id
       JOIN rooms r ON t.room_id = r.id
       WHERE rp.rent_month = $1 AND t.status = 'active'
       ORDER BY r.room_number, u.full_name`,
      [rentMonth]
    );

    const today = new Date();
    const payments = result.rows.map(payment => ({
      ...payment,
      status: determineRentStatus(payment.rent_month, payment.payment_date ? payment : null)
    }));

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rent history for a tenant (Admin only)
router.get('/tenant/:tenantId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenantResult = await pool.query(
      'SELECT * FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const result = await pool.query(
      `SELECT * FROM rent_payments WHERE tenant_id = $1 ORDER BY rent_month DESC`,
      [tenantId]
    );

    const payments = result.rows.map(payment => ({
      ...payment,
      status: determineRentStatus(payment.rent_month, payment.payment_date ? payment : null)
    }));

    res.json({
      tenant: tenantResult.rows[0],
      rentHistory: payments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
