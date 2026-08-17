const express = require('express');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validationResult, body } = require('express-validator');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const rentMonth = `${currentYear}-${currentMonth}`;
    const day = today.getDate();

    // Get total rooms
    const roomsResult = await pool.query('SELECT COUNT(*) as count FROM rooms');
    const totalRooms = parseInt(roomsResult.rows[0].count);

    // Get active tenants
    const tenantsResult = await pool.query(
      "SELECT COUNT(*) as count FROM tenants WHERE status = 'active'"
    );
    const activeTenants = parseInt(tenantsResult.rows[0].count);

    // Get pending applications (we can track this separately if needed)
    const pendingApps = 0;

    // Get rent information for current month
    const rentResult = await pool.query(
      `SELECT 
        SUM(expected_rent) as total_expected,
        SUM(CASE WHEN status = 'paid' THEN amount_paid ELSE 0 END) as total_collected,
        SUM(CASE WHEN status = 'pending' AND $1 < 7 THEN expected_rent
                 WHEN status = 'pending' AND $1 >= 7 THEN expected_rent ELSE 0 END) as pending_amount,
        SUM(CASE WHEN status = 'overdue' THEN expected_rent ELSE 0 END) as overdue_amount,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status IN ('pending', 'overdue') THEN 1 END) as unpaid_count
      FROM rent_payments 
      WHERE rent_month = $2`,
      [day, rentMonth]
    );

    const rentData = rentResult.rows[0];

    res.json({
      totalRooms,
      activeTenants,
      pendingApplications: pendingApps,
      currentMonth: rentMonth,
      rent: {
        totalExpected: parseFloat(rentData.total_expected) || 0,
        totalCollected: parseFloat(rentData.total_collected) || 0,
        pending: parseFloat(rentData.pending_amount) || 0,
        overdue: parseFloat(rentData.overdue_amount) || 0,
        paidCount: parseInt(rentData.paid_count),
        unpaidCount: parseInt(rentData.unpaid_count)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, COUNT(t.id) as tenant_count
       FROM rooms r
       LEFT JOIN tenants t ON r.id = t.room_id AND t.status = 'active'
       GROUP BY r.id
       ORDER BY r.room_number`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a room
router.post('/rooms', [
  body('room_number').notEmpty(),
  body('total_beds').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { room_number, total_beds, description } = req.body;
    const result = await pool.query(
      'INSERT INTO rooms (room_number, total_beds, description) VALUES ($1, $2, $3) RETURNING *',
      [room_number, total_beds, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tenants
router.get('/tenants', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.email, u.phone, u.full_name, r.room_number
       FROM tenants t
       JOIN users u ON t.user_id = u.id
       JOIN rooms r ON t.room_id = r.id
       ORDER BY r.room_number, t.created_at`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a tenant
router.post('/tenants', [
  body('user_id').isInt(),
  body('room_id').isInt(),
  body('move_in_date').isISO8601(),
  body('monthly_rent').isDecimal()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      user_id, room_id, move_in_date, monthly_rent,
      security_deposit, advance_amount, status,
      permanent_address, emergency_contact_name, emergency_contact_phone,
      employment_info, identity_document_type, identity_document_number
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tenants (
        user_id, room_id, move_in_date, monthly_rent, security_deposit,
        advance_amount, status, permanent_address, emergency_contact_name,
        emergency_contact_phone, employment_info, identity_document_type,
        identity_document_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        user_id, room_id, move_in_date, monthly_rent, security_deposit || null,
        advance_amount || null, status || 'active', permanent_address || null,
        emergency_contact_name || null, emergency_contact_phone || null,
        employment_info || null, identity_document_type || null,
        identity_document_number || null
      ]
    );

    // Create initial rent payment records for the tenant starting from current month
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const moveInDate = new Date(move_in_date);

    for (let i = 0; i < 12; i++) {
      let year = currentYear;
      let month = parseInt(currentMonth) + i;
      if (month > 12) {
        year += Math.floor(month / 12);
        month = month % 12 || 12;
      }
      const rentMonthStr = `${year}-${String(month).padStart(2, '0')}`;
      
      // Only create rent records for months after move-in
      if (new Date(`${rentMonthStr}-01`) >= moveInDate) {
        await pool.query(
          `INSERT INTO rent_payments (tenant_id, rent_month, expected_rent, status)
           VALUES ($1, $2, $3, 'pending')`,
          [result.rows[0].id, rentMonthStr, monthly_rent]
        );
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update tenant
router.put('/tenants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, monthly_rent, ...otherUpdates } = req.body;

    const result = await pool.query(
      `UPDATE tenants 
       SET status = COALESCE($1, status),
           monthly_rent = COALESCE($2, monthly_rent),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status || null, monthly_rent || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tenant details with rent history
router.get('/tenants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tenantResult = await pool.query(
      `SELECT t.*, u.email, u.phone, u.full_name, r.room_number
       FROM tenants t
       JOIN users u ON t.user_id = u.id
       JOIN rooms r ON t.room_id = r.id
       WHERE t.id = $1`,
      [id]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const rentResult = await pool.query(
      `SELECT * FROM rent_payments WHERE tenant_id = $1 ORDER BY rent_month DESC`,
      [id]
    );

    res.json({
      tenant: tenantResult.rows[0],
      rentHistory: rentResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
