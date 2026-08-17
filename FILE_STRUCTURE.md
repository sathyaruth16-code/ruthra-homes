# Project File Structure

## Complete Directory Tree

```
ruthrahomes/
├── README.md                    # Main documentation
├── QUICKSTART.md                # Quick start guide
├── # Updated Rental & Rent Management Requi.md  # Original requirements
├── .gitignore                   # Git ignore file
├── setup.sh                     # Setup script for Mac/Linux
├── setup.bat                    # Setup script for Windows
│
├── backend/
│   ├── package.json             # Node.js dependencies
│   ├── server.js                # Main Express server
│   ├── .env.example             # Environment variables template
│   ├── database.sql             # Database schema
│   │
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   │
│   └── routes/
│       ├── auth.js              # Authentication endpoints
│       ├── admin.js             # Admin dashboard & management
│       ├── tenant.js            # Tenant information endpoints
│       └── rent.js              # Rent payment management
│
└── frontend/
    ├── index.html               # Main HTML file (SPA)
    │
    ├── css/
    │   └── style.css            # Responsive styling
    │
    └── js/
        ├── api.js               # API client wrapper
        └── app.js               # Application logic
```

## File Descriptions

### Backend Files

#### `server.js`
- Entry point for the Express server
- Configures middleware (CORS, JSON parsing)
- Mounts all API routes
- Starts the server on port 5000

#### `config/database.js`
- PostgreSQL connection pool configuration
- Reads credentials from .env file
- Provides database connection to all routes

#### `middleware/auth.js`
- JWT token verification
- Role-based access control (admin, tenant)
- Protects routes requiring authentication

#### `routes/auth.js`
- User registration with bcrypt password hashing
- User login with JWT token generation
- Form validation

#### `routes/admin.js`
- Dashboard statistics calculation
- Room CRUD operations
- Tenant CRUD operations
- Automatic rent payment record creation

#### `routes/rent.js`
- Rent payment recording
- Monthly rent summary
- Tenant rent history
- Automatic status determination

#### `routes/tenant.js`
- Tenant profile retrieval
- Tenant's rent information
- Tenant's payment history
- Privacy: tenants only see their own data

#### `database.sql`
- Complete PostgreSQL schema
- 4 main tables: users, rooms, tenants, rent_payments
- Indexes for performance optimization
- Foreign key constraints and referential integrity

#### `package.json`
- Express.js - Web framework
- pg - PostgreSQL driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin requests
- express-validator - Input validation
- dotenv - Environment variables

#### `.env.example`
- Template for environment variables
- Database credentials
- JWT secret
- Port configuration

### Frontend Files

#### `index.html`
- Single Page Application (SPA)
- Two main sections: Login/Signup pages
- Admin dashboard with sections for rooms, tenants, rent
- Tenant dashboard with rent and history views
- Modal dialogs for forms
- Current date: 2026-08-15 for testing

#### `css/style.css`
- Responsive design (mobile-friendly)
- Color scheme: Purple gradient theme
- Dashboard statistics cards
- Table styling
- Modal styling
- Badge system for status indicators
- Form styling with validation

#### `js/api.js`
- Wrapper class for all API calls
- Handles JWT token management
- Methods for:
  - User authentication
  - Room management
  - Tenant management
  - Rent payment tracking
  - Data retrieval

#### `js/app.js`
- Main application logic (~500+ lines)
- Page navigation system
- Admin dashboard functionality:
  - Load and display statistics
  - Manage rooms and tenants
  - Record rent payments
  - View rent data
- Tenant dashboard functionality:
  - Display rent information
  - Show payment history
- Event listeners for all user interactions
- Message/alert system

### Documentation Files

#### `README.md`
- Complete project overview
- Feature list
- Installation instructions
- API endpoint documentation
- Database schema
- Usage guide for admins and tenants
- Troubleshooting guide

#### `QUICKSTART.md`
- Step-by-step setup guide
- Prerequisites installation
- Database setup instructions
- Backend and frontend startup
- Test account creation
- Quick troubleshooting

#### `.gitignore`
- Excludes node_modules
- Excludes .env files
- Excludes IDE files
- Excludes log files

### Setup Files

#### `setup.sh`
- Bash script for Mac/Linux
- Checks for Node.js, npm, PostgreSQL
- Creates .env from template
- Installs npm dependencies

#### `setup.bat`
- Batch script for Windows
- Checks for Node.js, npm, PostgreSQL
- Creates .env from template
- Installs npm dependencies

## File Sizes (Approximate)

- server.js: ~25 lines
- database.js: ~20 lines
- auth.js (middleware): ~28 lines
- auth.js (routes): ~95 lines
- admin.js: ~185 lines
- rent.js: ~95 lines
- tenant.js: ~100 lines
- database.sql: ~95 lines
- index.html: ~300 lines
- style.css: ~500 lines
- api.js: ~75 lines
- app.js: ~500+ lines
- README.md: ~300 lines
- QUICKSTART.md: ~250 lines

**Total Code: ~2500+ lines**

## Key Features Implemented

1. **Authentication**
   - User registration with role selection
   - Password hashing
   - JWT token-based login
   - Role-based access control

2. **Admin Features**
   - Dashboard with statistics
   - Room management
   - Tenant management across multiple rooms
   - Rent payment recording
   - Monthly rent summary
   - Overdue tracking

3. **Tenant Features**
   - View personal rent information
   - See upcoming rent with status
   - View complete payment history
   - Private data (only their own)

4. **Rent Management**
   - Automatic status calculation
   - Support for partial payments
   - Payment method tracking
   - Transaction reference tracking
   - Admin remarks

5. **Database**
   - Normalized schema
   - Cascading deletes
   - Referential integrity
   - Performance indexes

6. **Security**
   - JWT authentication
   - Password hashing
   - CORS protection
   - Input validation
   - Role-based authorization

## Next Steps for Enhancement

- Add email notifications
- Implement payment gateway
- Add advanced reporting
- Multi-property support
- Audit logging
- Backup automation
- Mobile app
