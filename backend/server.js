const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tenantRoutes = require('./routes/tenant');
const rentRoutes = require('./routes/rent');

dotenv.config();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://ruthra-homes.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/rent', rentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Test database connection
app.get('/api/db-health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', database: 'Connected', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;

// Test database connection on startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Environment variables check:');
    console.error('  DB_USER:', process.env.DB_USER ? '✓ Set' : '✗ NOT SET');
    console.error('  DB_PASSWORD:', process.env.DB_PASSWORD ? '✓ Set' : '✗ NOT SET');
    console.error('  DB_HOST:', process.env.DB_HOST ? '✓ Set' : '✗ NOT SET');
    console.error('  DB_PORT:', process.env.DB_PORT ? '✓ Set' : '✗ NOT SET');
    console.error('  DB_NAME:', process.env.DB_NAME ? '✓ Set' : '✗ NOT SET');
  } else {
    console.log('✓ Database connected successfully');
  }
});

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ CORS enabled for: https://ruthra-homes.vercel.app`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
