# Database Initialization Guide

## Quick Setup

### Option 1: Using psql directly

```bash
# Connect to PostgreSQL as admin
psql -U postgres

# Run the schema file
\i /path/to/backend/database.sql

# Or type the schema directly
```

### Option 2: Using command line

```bash
# Create database and import schema in one command
psql -U postgres -f backend/database.sql
```

## Database Schema Details

### Users Table
Stores user accounts for both admins and tenants.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'tenant')),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `email`: User's email (must be unique)
- `password`: Bcrypt hashed password
- `role`: Either 'admin' or 'tenant'
- `full_name`: User's full name
- `phone`: Optional phone number
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Rooms Table
Stores information about rental rooms.

```sql
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  room_number VARCHAR(50) UNIQUE NOT NULL,
  total_beds INT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `room_number`: Unique room identifier (e.g., "101", "A1")
- `total_beds`: Number of beds in the room
- `description`: Room description (optional)
- `status`: Current room status
- `created_at`: Room creation timestamp
- `updated_at`: Last update timestamp

**Status values:**
- `available`: Room is available for rent
- `occupied`: Room has active tenants
- `maintenance`: Room is under maintenance

### Tenants Table
Stores tenant information linked to users and rooms.

```sql
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id INT NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  move_in_date DATE NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2),
  advance_amount DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  permanent_address TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  employment_info TEXT,
  identity_document_type VARCHAR(50),
  identity_document_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `user_id`: Foreign key to users table (one tenant per user)
- `room_id`: Foreign key to rooms table
- `move_in_date`: Date when tenant moved in
- `monthly_rent`: Monthly rent amount in rupees
- `security_deposit`: Optional security deposit amount
- `advance_amount`: Optional advance payment
- `status`: Tenant's current status
- `permanent_address`: Tenant's permanent address
- `emergency_contact_name`: Emergency contact name
- `emergency_contact_phone`: Emergency contact phone
- `employment_info`: Tenant's employment information
- `identity_document_type`: Type of ID document (Aadhar, PAN, etc.)
- `identity_document_number`: ID document number
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Status values:**
- `active`: Tenant is currently active
- `inactive`: Tenant is no longer active
- `suspended`: Tenant account is suspended

**Constraints:**
- One user can have only one tenant record (UNIQUE user_id)
- Cascading delete: If user is deleted, tenant record is deleted
- Restrict delete: Cannot delete room while it has tenants

### Rent Payments Table
Stores monthly rent payment records for each tenant.

```sql
CREATE TABLE rent_payments (
  id SERIAL PRIMARY KEY,
  tenant_id INT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rent_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  expected_rent DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2),
  payment_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partially_paid')),
  payment_method VARCHAR(50), -- bank_transfer, cash, upi, check, etc.
  transaction_reference VARCHAR(100),
  admin_remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, rent_month)
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `tenant_id`: Foreign key to tenants table
- `rent_month`: Month for which rent is due (YYYY-MM format)
- `expected_rent`: Expected monthly rent amount
- `amount_paid`: Amount actually paid (NULL if not paid)
- `payment_date`: Date when payment was made
- `status`: Current payment status
- `payment_method`: Method used to pay (optional)
- `transaction_reference`: Reference number for tracking
- `admin_remarks`: Admin notes about the payment
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Status values:**
- `pending`: Rent not yet due or not yet due date
- `paid`: Rent has been paid in full
- `overdue`: Rent due date has passed without payment
- `partially_paid`: Partial payment received

**Constraints:**
- Unique combination of tenant_id and rent_month
- Cannot have duplicate entries for same tenant and month
- Cascading delete: If tenant is deleted, payment records are deleted

## Indexes

Indexes are created for performance optimization:

```sql
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
CREATE INDEX idx_tenants_room_id ON tenants(room_id);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_rent_payments_tenant_id ON rent_payments(tenant_id);
CREATE INDEX idx_rent_payments_rent_month ON rent_payments(rent_month);
CREATE INDEX idx_rent_payments_status ON rent_payments(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_rooms_room_number ON rooms(room_number);
```

## Data Relationships

```
users
  ↓ (one-to-one)
tenants (with user_id foreign key)
  ↓ (many-to-one)
rooms (with room_id foreign key)

tenants
  ↓ (one-to-many)
rent_payments (with tenant_id foreign key)
```

### One Room, Multiple Tenants Example

```
Room 101
├── Tenant A (John Doe) - ₹8000/month
├── Tenant B (Jane Smith) - ₹7500/month
└── Tenant C (Bob Wilson) - ₹8000/month
```

Each tenant has their own:
- user account
- tenant record with move-in date and rent
- individual rent_payments records

## Sample Data Insert

### Insert a room

```sql
INSERT INTO rooms (room_number, total_beds, description)
VALUES ('101', 2, 'Double room with attached bathroom');
```

### Insert a user (tenant)

```sql
INSERT INTO users (email, password, full_name, phone, role)
VALUES ('john@example.com', 'hashed_password_here', 'John Doe', '9876543210', 'tenant');
```

### Link tenant to room

```sql
INSERT INTO tenants (user_id, room_id, move_in_date, monthly_rent, security_deposit, advance_amount, status)
VALUES (1, 1, '2026-08-01', 8000.00, 16000.00, 8000.00, 'active');
```

### Create rent payment record

```sql
INSERT INTO rent_payments (tenant_id, rent_month, expected_rent, status)
VALUES (1, '2026-08', 8000.00, 'pending');
```

### Record a payment

```sql
UPDATE rent_payments
SET amount_paid = 8000.00,
    payment_date = '2026-08-05',
    status = 'paid',
    payment_method = 'bank_transfer',
    transaction_reference = 'TXN123456',
    admin_remarks = 'Payment received'
WHERE tenant_id = 1 AND rent_month = '2026-08';
```

## Useful Queries

### Check all users
```sql
SELECT * FROM users;
```

### Check all rooms with tenant count
```sql
SELECT r.*, COUNT(t.id) as tenant_count
FROM rooms r
LEFT JOIN tenants t ON r.id = t.room_id AND t.status = 'active'
GROUP BY r.id;
```

### Check all active tenants
```sql
SELECT t.id, u.full_name, u.email, r.room_number, t.monthly_rent
FROM tenants t
JOIN users u ON t.user_id = u.id
JOIN rooms r ON t.room_id = r.id
WHERE t.status = 'active'
ORDER BY r.room_number;
```

### Check rent for a specific month
```sql
SELECT rp.*, u.full_name, r.room_number
FROM rent_payments rp
JOIN tenants t ON rp.tenant_id = t.id
JOIN users u ON t.user_id = u.id
JOIN rooms r ON t.room_id = r.id
WHERE rp.rent_month = '2026-08'
ORDER BY r.room_number;
```

### Check overdue payments
```sql
SELECT u.full_name, r.room_number, rp.rent_month, rp.expected_rent
FROM rent_payments rp
JOIN tenants t ON rp.tenant_id = t.id
JOIN users u ON t.user_id = u.id
JOIN rooms r ON t.room_id = r.id
WHERE rp.status = 'overdue'
ORDER BY rp.rent_month;
```

### Check tenant payment history
```sql
SELECT * FROM rent_payments
WHERE tenant_id = 1
ORDER BY rent_month DESC;
```

### Check room occupancy
```sql
SELECT r.room_number, COUNT(t.id) as active_tenants
FROM rooms r
LEFT JOIN tenants t ON r.id = t.room_id AND t.status = 'active'
GROUP BY r.id, r.room_number;
```

### Calculate total rent collected for a month
```sql
SELECT 
  SUM(expected_rent) as total_expected,
  SUM(amount_paid) as total_collected,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
  COUNT(CASE WHEN status IN ('pending', 'overdue') THEN 1 END) as unpaid_count
FROM rent_payments
WHERE rent_month = '2026-08';
```

## Database Maintenance

### Backup database
```bash
pg_dump -U postgres -d ruthrahomes > backup.sql
```

### Restore from backup
```bash
psql -U postgres -d ruthrahomes < backup.sql
```

### Vacuum and analyze (optimize)
```sql
VACUUM ANALYZE;
```

### Check table sizes
```sql
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check index usage
```sql
SELECT * FROM pg_stat_user_indexes ORDER BY idx_scan DESC;
```

## Data Integrity

### Foreign Key Relationships
- `tenants.user_id` → `users.id` (Cascading delete)
- `tenants.room_id` → `rooms.id` (Restrict delete)
- `rent_payments.tenant_id` → `tenants.id` (Cascading delete)

### Unique Constraints
- `users.email` (unique email per user)
- `rooms.room_number` (unique room numbers)
- `tenants.user_id` (one tenant per user)
- `rent_payments(tenant_id, rent_month)` (one payment record per month)

## Reset Database

To completely reset and start fresh:

```bash
# Connect to PostgreSQL
psql -U postgres

# Drop existing database
DROP DATABASE IF EXISTS ruthrahomes;

# Create new database
CREATE DATABASE ruthrahomes;

# Connect to new database
\c ruthrahomes

# Exit and run schema
\q

psql -U postgres -d ruthrahomes -f backend/database.sql
```

## Troubleshooting

### "relation does not exist"
- Ensure database.sql has been run
- Check you're connected to correct database: `SELECT current_database();`

### "permission denied"
- Verify PostgreSQL user has correct permissions
- May need to run as superuser: `psql -U postgres`

### "duplicate key value"
- Check UNIQUE constraints are not violated
- Use `ON CONFLICT` in INSERT statements

### Connection refused
- Ensure PostgreSQL service is running
- Check connection parameters in .env
