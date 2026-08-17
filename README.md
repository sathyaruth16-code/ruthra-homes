# Ruther Homes - Rental & Rent Management System

A comprehensive rental property management system built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## Features

### Core Features
- **Multi-Tenant Support**: One room can have multiple tenants with different rent amounts
- **Rent Tracking**: Complete monthly rent tracking with payment status (Pending, Paid, Overdue, Partially Paid)
- **Admin Dashboard**: Real-time overview of rooms, tenants, and rent collection
- **Tenant Dashboard**: Tenants can view their rent information and payment history
- **Payment Management**: Admin can record rent payments with optional payment method and reference
- **Automatic Status**: System automatically determines rent status based on due date and payment

### Database
- PostgreSQL with relational schema
- Automatic indexes for performance
- Cascading deletes and referential integrity

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Tenant)

## Project Structure

```
ruthrahomes/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── admin.js             # Admin routes
│   │   ├── tenant.js            # Tenant routes
│   │   └── rent.js              # Rent management routes
│   ├── .env.example             # Environment variables template
│   ├── database.sql             # Database schema
│   ├── package.json             # Node dependencies
│   └── server.js                # Main server file
└── frontend/
    ├── css/
    │   └── style.css            # Styling
    ├── js/
    │   ├── api.js               # API client
    │   └── app.js               # Main application logic
    └── index.html               # Single page application
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Database Setup

```bash
# Open PostgreSQL
psql -U postgres

# Run the database schema
\i backend/database.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Default values:
# DB_USER=postgres
# DB_PASSWORD=password
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=ruthrahomes
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000

# Start the server
npm start
# Or for development with auto-reload
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Open index.html in a web browser
# Or use a simple HTTP server

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

Access the application at `http://localhost:8000` (or the port your server is running on)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/rooms` - List all rooms
- `POST /api/admin/rooms` - Create a new room
- `GET /api/admin/tenants` - List all tenants
- `POST /api/admin/tenants` - Create a new tenant
- `GET /api/admin/tenants/:id` - Get tenant details
- `PUT /api/admin/tenants/:id` - Update tenant

### Rent Management
- `POST /api/rent/payment` - Record a rent payment
- `GET /api/rent/month/:rentMonth` - Get rent records for a specific month
- `GET /api/rent/tenant/:tenantId` - Get rent history for a tenant

### Tenant Routes
- `GET /api/tenant/profile` - Get tenant's profile
- `GET /api/tenant/rent` - Get tenant's current rent information
- `GET /api/tenant/rent-history` - Get tenant's complete rent history

## Usage

### For Admins

1. **Register as Admin**: Click "Sign up" and select "Admin" role
2. **Dashboard**: View overall statistics and rent collection summary
3. **Manage Rooms**: Add new rooms with bed count and description
4. **Manage Tenants**: Add tenants to rooms with move-in date and monthly rent
5. **Record Payments**: Use the rent management section to record monthly payments
6. **View Rent History**: Click on a tenant to view their complete payment history

### For Tenants

1. **Register as Tenant**: Click "Sign up" and select "Tenant" role
2. **View My Rent**: See room number and monthly rent amount
3. **Upcoming Rent**: View next 6 months of rent with status (Pending/Paid/Overdue)
4. **Rent History**: View complete payment history

## Rent Due Date

- Rent is due on the **7th of each month**
- Automatic status calculation:
  - **Before 7th**: Pending (even if not paid)
  - **After 7th with payment**: Paid
  - **After 7th without payment**: Overdue

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- role (admin/tenant)
- full_name
- phone
- created_at, updated_at

### Rooms Table
- id (Primary Key)
- room_number (Unique)
- total_beds
- description
- status (available/occupied/maintenance)
- created_at, updated_at

### Tenants Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- room_id (Foreign Key to Rooms)
- move_in_date
- monthly_rent
- security_deposit
- advance_amount
- status (active/inactive/suspended)
- permanent_address
- emergency_contact_name
- emergency_contact_phone
- employment_info
- identity_document_type
- identity_document_number
- created_at, updated_at

### Rent Payments Table
- id (Primary Key)
- tenant_id (Foreign Key to Tenants)
- rent_month (YYYY-MM format)
- expected_rent
- amount_paid
- payment_date
- status (pending/paid/overdue/partially_paid)
- payment_method
- transaction_reference
- admin_remarks
- created_at, updated_at
- Unique constraint on (tenant_id, rent_month)

## Future Enhancements

The system is designed to support:
- Online payment integration (UPI, payment gateways)
- Automated email/SMS notifications
- Advanced reporting and analytics
- Rent reminders
- Multiple properties management
- Payment receipts generation
- Ledger reports
- Tenant application workflows

## Security Considerations

1. Always use environment variables for sensitive data
2. Change default JWT_SECRET in production
3. Use HTTPS in production
4. Implement rate limiting for API endpoints
5. Add CORS restrictions for production
6. Regularly backup your PostgreSQL database
7. Use strong passwords for database users

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check credentials in .env file
- Verify database exists: `createdb ruthrahomes`

### CORS Error
- Backend and frontend must be on same or configured domains
- Check API_BASE in frontend/js/api.js
- Verify CORS is enabled in server.js

### Token Not Working
- Clear browser localStorage and login again
- Check JWT_SECRET in .env matches between sessions
- Verify token expiration time

### No Rent Records Created
- Ensure tenant move-in date is set
- Rent records are created starting from current month for dates >= move-in date

## Support

For issues or questions, refer to the requirements document or check the code comments.

## License

MIT License
