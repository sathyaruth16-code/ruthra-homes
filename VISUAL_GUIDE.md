# 🎨 PROJECT VISUAL GUIDE

## Complete File Tree with Descriptions

```
ruthrahomes/ (Root Directory)
│
├─ 📚 DOCUMENTATION LAYER (11 files)
│  │
│  ├─ 📖 README.md
│  │  └─ Overview of the project, features, tech stack
│  │
│  ├─ ⚡ QUICKSTART.md
│  │  └─ 5-step quick start guide
│  │
│  ├─ 🪟 WINDOWS_SETUP.md  
│  │  └─ Comprehensive Windows setup with screenshots
│  │
│  ├─ 🎯 SETUP_OVERVIEW.md
│  │  └─ Visual overview with file structure
│  │
│  ├─ 📋 QUICK_REFERENCE.md
│  │  └─ One-page cheat sheet (print-friendly)
│  │
│  ├─ 🚀 STARTUP_DASHBOARD.txt
│  │  └─ ASCII dashboard for quick reference
│  │
│  ├─ ✅ SETUP_COMPLETION_REPORT.md
│  │  └─ Complete verification & statistics
│  │
│  ├─ 🔌 API_DOCUMENTATION.md
│  │  └─ All 20 API endpoints with examples
│  │
│  ├─ 💾 DATABASE.md
│  │  └─ Database schema, tables, queries
│  │
│  ├─ 🌍 DEPLOYMENT.md
│  │  └─ Production deployment guide
│  │
│  └─ 🆘 TROUBLESHOOTING.md
│     └─ Common issues & solutions
│
├─ ⚙️ CONFIGURATION LAYER (4 files)
│  │
│  ├─ .env [CREATED]
│  │  ├─ PORT=5000
│  │  ├─ DB_USER=postgres
│  │  ├─ DB_PASSWORD=password
│  │  ├─ DB_HOST=localhost
│  │  ├─ DB_PORT=5432
│  │  ├─ DB_NAME=ruthrahomes
│  │  ├─ JWT_SECRET=secret_key
│  │  └─ JWT_EXPIRE=7d
│  │
│  ├─ .env.example
│  │  └─ Configuration template
│  │
│  ├─ .gitignore
│  │  ├─ node_modules/
│  │  ├─ .env
│  │  └─ IDE files
│  │
│  └─ ruthrahomes.code-workspace
│     ├─ VS Code configuration
│     ├─ Multi-folder workspace
│     └─ Pre-configured tasks & debugging
│
├─ 🔧 SETUP SCRIPTS LAYER (3 files)
│  │
│  ├─ setup.bat (Windows)
│  │  └─ Automated Windows setup
│  │
│  ├─ setup.sh (Unix)
│  │  └─ Automated Linux/Mac setup
│  │
│  └─ setup-helper.bat (Quick)
│     └─ Quick setup verification
│
├─ 🖥️ BACKEND LAYER (Node.js + Express + PostgreSQL)
│  │
│  ├─ server.js
│  │  ├─ Express app initialization
│  │  ├─ Middleware setup (cors, bodyParser)
│  │  ├─ Route mounting
│  │  └─ Server startup on port 5000
│  │
│  ├─ package.json
│  │  ├─ "name": "ruthrahomes"
│  │  ├─ "version": "1.0.0"
│  │  ├─ Dependencies:
│  │  │  ├─ express@4.18.0
│  │  │  ├─ pg@8.8.0
│  │  │  ├─ cors@2.8.5
│  │  │  ├─ dotenv@16.0.3
│  │  │  ├─ bcryptjs@2.4.3
│  │  │  ├─ jsonwebtoken@9.0.0
│  │  │  ├─ express-validator@7.0.0
│  │  │  └─ nodemon@2.0.20
│  │  └─ Scripts: "start", "dev"
│  │
│  ├─ database.sql
│  │  ├─ CREATE DATABASE ruthrahomes
│  │  ├─ Table: users (id, email, password, role, full_name, phone, ...)
│  │  ├─ Table: rooms (id, room_number, total_beds, description, status, ...)
│  │  ├─ Table: tenants (id, user_id, room_id, move_in_date, monthly_rent, ...)
│  │  ├─ Table: rent_payments (id, tenant_id, rent_month, amount_paid, ...)
│  │  ├─ Constraints: FOREIGN KEY, UNIQUE, CHECK
│  │  ├─ Cascading: ON DELETE CASCADE
│  │  └─ Indexes: 8 covering key lookups
│  │
│  ├─ config/
│  │  │
│  │  └─ database.js
│  │     ├─ PostgreSQL Pool setup
│  │     ├─ Connection from .env
│  │     ├─ Exports: pool, query
│  │     └─ Used by: All route handlers
│  │
│  ├─ middleware/
│  │  │
│  │  └─ auth.js
│  │     ├─ authMiddleware: JWT verification
│  │     ├─ adminMiddleware: role check (admin)
│  │     ├─ tenantMiddleware: role check (tenant)
│  │     ├─ Extracts: user id, email, role, full_name
│  │     └─ Used by: All protected routes
│  │
│  └─ routes/
│     │
│     ├─ auth.js (95 lines)
│     │  ├─ POST /api/auth/register
│     │  │  ├─ Validate: email, password, full_name, role
│     │  │  ├─ Hash password (bcrypt)
│     │  │  ├─ Create user record
│     │  │  └─ Return: user data
│     │  │
│     │  └─ POST /api/auth/login
│     │     ├─ Find user by email
│     │     ├─ Compare password
│     │     ├─ Generate JWT token
│     │     └─ Return: token (7-day expiry)
│     │
│     ├─ admin.js (185 lines)
│     │  ├─ GET /api/admin/dashboard
│     │  │  ├─ Total rooms count
│     │  │  ├─ Active tenants count
│     │  │  ├─ Expected rent (month)
│     │  │  ├─ Collected amount
│     │  │  ├─ Pending count
│     │  │  └─ Overdue count
│     │  │
│     │  ├─ GET|POST /api/admin/rooms
│     │  │  ├─ List all rooms with tenant count
│     │  │  └─ Create new room
│     │  │
│     │  ├─ GET|POST|PUT /api/admin/tenants
│     │  │  ├─ List all tenants
│     │  │  ├─ Create new tenant (auto-generates 12 months rent records)
│     │  │  └─ Update tenant info
│     │  │
│     │  └─ Middleware: authMiddleware, adminMiddleware
│     │
│     ├─ rent.js (95 lines)
│     │  ├─ Status Logic:
│     │  │  ├─ Before 7th of month = PENDING
│     │  │  ├─ After 7th + paid = PAID
│     │  │  └─ After 7th + unpaid = OVERDUE
│     │  │
│     │  ├─ POST /api/rent/payment
│     │  │  ├─ tenant_id, rent_month, amount_paid
│     │  │  ├─ Supports partial payments
│     │  │  ├─ Status: paid/partially_paid/overdue
│     │  │  └─ Optional: payment_method, reference, remarks
│     │  │
│     │  ├─ GET /api/rent/month/:rentMonth
│     │  │  ├─ Get all payments for month
│     │  │  └─ Sorted by room number
│     │  │
│     │  └─ GET /api/rent/tenant/:tenantId
│     │     ├─ Full payment history for tenant
│     │     └─ All 12 months with status
│     │
│     └─ tenant.js (100 lines)
│        ├─ GET /api/tenant/profile
│        │  ├─ Only logged-in user's data
│        │  ├─ User info + room info
│        │  └─ Middleware: tenantMiddleware
│        │
│        ├─ GET /api/tenant/rent
│        │  ├─ Next 12 rent months
│        │  ├─ With status
│        │  └─ Amount tracking
│        │
│        └─ GET /api/tenant/rent-history
│           ├─ Complete payment history
│           └─ Privacy-controlled
│
├─ 🎨 FRONTEND LAYER (HTML + CSS + JavaScript)
│  │
│  ├─ index.html (300+ lines)
│  │  ├─ Single Page Application (SPA)
│  │  ├─ Pages:
│  │  │  ├─ Login Page
│  │  │  │  ├─ Email input
│  │  │  │  └─ Password input
│  │  │  │
│  │  │  ├─ Signup Page
│  │  │  │  ├─ Full name
│  │  │  │  ├─ Email
│  │  │  │  ├─ Phone
│  │  │  │  ├─ Password
│  │  │  │  └─ Role (Admin/Tenant)
│  │  │  │
│  │  │  ├─ Admin Dashboard
│  │  │  │  ├─ Overview (Stat Cards)
│  │  │  │  ├─ Rooms Management
│  │  │  │  ├─ Tenants Management
│  │  │  │  └─ Rent Management
│  │  │  │
│  │  │  └─ Tenant Dashboard
│  │  │     ├─ My Rent (Current)
│  │  │     └─ My History (All payments)
│  │  │
│  │  ├─ Modals/Dialogs:
│  │  │  ├─ Add Room Modal
│  │  │  ├─ Add Tenant Modal
│  │  │  └─ Record Payment Modal
│  │  │
│  │  └─ Navigation:
│  │     ├─ .nav-link elements
│  │     └─ data-section attributes
│  │
│  ├─ css/
│  │  │
│  │  └─ style.css (500+ lines)
│  │     ├─ Color Scheme:
│  │     │  ├─ Primary: #667eea (Purple)
│  │     │  ├─ Secondary: #764ba2 (Darker Purple)
│  │     │  ├─ Background: #f5f7fa
│  │     │  └─ Text: #333333
│  │     │
│  │     ├─ Components:
│  │     │  ├─ .dashboard-grid (3 columns)
│  │     │  ├─ .rent-grid (4 columns)
│  │     │  ├─ .card (white with shadow)
│  │     │  ├─ .table (data display)
│  │     │  ├─ .modal (dialog styling)
│  │     │  ├─ .form-group (input styling)
│  │     │  └─ .badge-* (status indicators)
│  │     │
│  │     ├─ Status Colors:
│  │     │  ├─ .badge-active = Green
│  │     │  ├─ .badge-pending = Orange
│  │     │  ├─ .badge-paid = Green
│  │     │  ├─ .badge-overdue = Red
│  │     │  └─ .badge-inactive = Gray
│  │     │
│  │     ├─ Responsive:
│  │     │  ├─ Desktop (1200px+)
│  │     │  ├─ Tablet (768px - 1199px)
│  │     │  └─ Mobile (<768px)
│  │     │
│  │     └─ Features:
│  │        ├─ Hover effects
│  │        ├─ Smooth transitions
│  │        ├─ Gradient backgrounds
│  │        └─ Print-friendly styles
│  │
│  └─ js/
│     │
│     ├─ api.js (75+ lines)
│     │  ├─ API.getToken()
│     │  │  └─ Get JWT from localStorage
│     │  │
│     │  ├─ API.getHeaders()
│     │  │  ├─ Content-Type: application/json
│     │  │  └─ Authorization: Bearer <token>
│     │  │
│     │  ├─ Static methods for each endpoint:
│     │  │  ├─ API.register(data)
│     │  │  ├─ API.login(email, password)
│     │  │  ├─ API.getDashboard()
│     │  │  ├─ API.getRooms()
│     │  │  ├─ API.createRoom(data)
│     │  │  ├─ API.getTenants()
│     │  │  ├─ API.createTenant(data)
│     │  │  ├─ API.recordPayment(data)
│     │  │  ├─ API.getRentMonth(month)
│     │  │  └─ ... (20+ total)
│     │  │
│     │  └─ All return Promise chains
│     │
│     └─ app.js (500+ lines)
│        ├─ Global Variables:
│        │  ├─ currentUser
│        │  ├─ allRooms[]
│        │  ├─ allTenants[]
│        │  └─ allPayments[]
│        │
│        ├─ Main Functions:
│        │  ├─ showPage(page)
│        │  │  └─ Toggle visibility
│        │  │
│        │  ├─ showMessage(msg, type)
│        │  │  ├─ Success (Green)
│        │  │  ├─ Error (Red)
│        │  │  └─ Warning (Orange)
│        │  │
│        │  ├─ loadAdminDashboard()
│        │  │  ├─ Fetch statistics
│        │  │  ├─ Update stat cards
│        │  │  └─ Load tables
│        │  │
│        │  ├─ loadRooms()
│        │  │  └─ Populate rooms table
│        │  │
│        │  ├─ loadTenants()
│        │  │  └─ Populate tenants table
│        │  │
│        │  ├─ loadRentManagement()
│        │  │  ├─ Filter by month
│        │  │  └─ Show payments
│        │  │
│        │  └─ ... (20+ functions)
│        │
│        ├─ Event Listeners:
│        │  ├─ Login form submit
│        │  ├─ Signup form submit
│        │  ├─ Navigation clicks
│        │  ├─ Modal opens/closes
│        │  └─ Form submissions
│        │
│        ├─ Format Functions:
│        │  ├─ formatDate(date)
│        │  │  └─ Convert to DD/MM/YYYY
│        │  │
│        │  ├─ formatCurrency(amount)
│        │  │  └─ Convert to ₹ currency
│        │  │
│        │  └─ formatRentMonth(month)
│        │     └─ Convert YYYY-MM to "Month Year"
│        │
│        └─ Page Logic:
│           ├─ Login → API.login() → localStorage
│           ├─ Signup → API.register() → success msg
│           ├─ Admin nav → showPage() → load data
│           └─ Tenant nav → showPage() → load data
│
├─ 💾 DATABASE LAYER
│  │
│  └─ PostgreSQL Schema:
│     │
│     ├─ users table
│     │  ├─ id (SERIAL PRIMARY KEY)
│     │  ├─ email (VARCHAR UNIQUE)
│     │  ├─ password (VARCHAR hashed)
│     │  ├─ role (VARCHAR CHECK admin/tenant)
│     │  ├─ full_name (VARCHAR)
│     │  ├─ phone (VARCHAR)
│     │  ├─ created_at (TIMESTAMP)
│     │  └─ updated_at (TIMESTAMP)
│     │
│     ├─ rooms table
│     │  ├─ id (SERIAL PRIMARY KEY)
│     │  ├─ room_number (VARCHAR UNIQUE)
│     │  ├─ total_beds (INTEGER)
│     │  ├─ description (TEXT)
│     │  ├─ status (VARCHAR CHECK: available/occupied/maintenance)
│     │  ├─ created_at (TIMESTAMP)
│     │  └─ updated_at (TIMESTAMP)
│     │
│     ├─ tenants table
│     │  ├─ id (SERIAL PRIMARY KEY)
│     │  ├─ user_id (FOREIGN KEY → users.id CASCADE)
│     │  ├─ room_id (FOREIGN KEY → rooms.id RESTRICT)
│     │  ├─ move_in_date (DATE)
│     │  ├─ monthly_rent (DECIMAL)
│     │  ├─ security_deposit (DECIMAL)
│     │  ├─ advance_amount (DECIMAL)
│     │  ├─ status (VARCHAR CHECK: active/inactive/suspended)
│     │  ├─ permanent_address (TEXT)
│     │  ├─ emergency_contact_name (VARCHAR)
│     │  ├─ emergency_contact_phone (VARCHAR)
│     │  ├─ employment_info (TEXT)
│     │  ├─ identity_document_type (VARCHAR)
│     │  ├─ identity_document_number (VARCHAR)
│     │  ├─ created_at (TIMESTAMP)
│     │  └─ updated_at (TIMESTAMP)
│     │
│     ├─ rent_payments table
│     │  ├─ id (SERIAL PRIMARY KEY)
│     │  ├─ tenant_id (FOREIGN KEY → tenants.id CASCADE)
│     │  ├─ rent_month (VARCHAR YYYY-MM UNIQUE per tenant)
│     │  ├─ expected_rent (DECIMAL)
│     │  ├─ amount_paid (DECIMAL)
│     │  ├─ payment_date (DATE)
│     │  ├─ status (VARCHAR CHECK: pending/paid/overdue/partially_paid)
│     │  ├─ payment_method (VARCHAR)
│     │  ├─ transaction_reference (VARCHAR)
│     │  ├─ admin_remarks (TEXT)
│     │  ├─ created_at (TIMESTAMP)
│     │  └─ updated_at (TIMESTAMP)
│     │
│     └─ Indexes:
│        ├─ idx_users_email
│        ├─ idx_rooms_number
│        ├─ idx_tenants_user_id
│        ├─ idx_tenants_room_id
│        ├─ idx_payments_tenant_id
│        ├─ idx_payments_month
│        ├─ idx_payments_status
│        └─ idx_payments_date
│
└─ 🏠 ADDITIONAL FILES
   ├─ # Updated Rental & Rent...md
   │  └─ Original requirements document
   │
   ├─ FILE_STRUCTURE.md
   │  └─ Detailed file descriptions
   │
   └─ PROJECT_SUMMARY.md
      └─ Complete project statistics
```

---

## 🎯 Quick Navigation

### Want to...

**Get Started?**
→ Read `QUICKSTART.md` (5 steps)

**Setup on Windows?**
→ Read `WINDOWS_SETUP.md` (detailed)

**Understand Architecture?**
→ Read `PROJECT_SUMMARY.md` (complete overview)

**Use the API?**
→ Read `API_DOCUMENTATION.md` (20 endpoints)

**Access Database?**
→ Read `DATABASE.md` (schema & queries)

**Fix Problems?**
→ Read `TROUBLESHOOTING.md` (solutions)

**Deploy?**
→ Read `DEPLOYMENT.md` (production setup)

**Quick Reference?**
→ Read `QUICK_REFERENCE.md` (1 page)

---

## 🔑 Key Statistics

- **Files**: 33 total
- **Documentation**: 11 guides (2000+ lines)
- **Backend Code**: 800+ lines
- **Frontend Code**: 1000+ lines
- **Database Tables**: 4
- **Database Columns**: 50+
- **API Endpoints**: 20
- **Indexes**: 8
- **Size**: ~150 KB
- **Setup Time**: ~15 minutes

---

## ⚙️ Technology Stack Breakdown

```
┌─────────────────────────────────────────┐
│         BROWSER (Frontend)              │
│  • HTML5 + CSS3 + JavaScript (ES6+)    │
│  • Single Page Application              │
│  • Responsive Design (Mobile-friendly)  │
│  • Port: 8000 (Python HTTP Server)     │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │    API (JSON)       │
        │ 20 RESTful Endpoints│
        │     Port: 5000      │
        └──────────┬──────────┘
                   │
┌──────────────────┴──────────────────────┐
│     Backend (API Server)                │
│  • Node.js v16+                         │
│  • Express.js 4.18                      │
│  • JWT Authentication + bcrypt          │
│  • Input Validation (express-validator) │
│  • CORS Middleware                      │
│  • Port: 5000                           │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│      Database (PostgreSQL)              │
│  • PostgreSQL v12+                      │
│  • 4 Normalized Tables                  │
│  • Foreign Key Constraints              │
│  • 8 Performance Indexes                │
│  • Cascading Deletes                    │
│  • Port: 5432                           │
└─────────────────────────────────────────┘
```

---

Generated: 2026-08-15
Version: 1.0.0
Status: ✅ COMPLETE
