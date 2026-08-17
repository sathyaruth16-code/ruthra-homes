# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except `/auth/*` require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses are JSON:
```json
{
  "message": "Success message",
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "9876543210",
  "role": "admin" // or "tenant"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin",
    "full_name": "John Doe"
  }
}
```

**Errors:**
- 400: Invalid email or short password
- 400: User already exists

---

### Login User
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin",
    "full_name": "John Doe"
  }
}
```

**Errors:**
- 401: Invalid email or password

---

## Admin Endpoints

### Get Dashboard Statistics
```
GET /admin/dashboard
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalRooms": 16,
  "activeTenants": 42,
  "pendingApplications": 3,
  "currentMonth": "2026-08",
  "rent": {
    "totalExpected": 120000,
    "totalCollected": 95000,
    "pending": 15000,
    "overdue": 10000,
    "paidCount": 35,
    "unpaidCount": 7
  }
}
```

---

### Get All Rooms
```
GET /admin/rooms
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "room_number": "101",
    "total_beds": 2,
    "description": "Double room with attached bathroom",
    "status": "occupied",
    "tenant_count": 2,
    "created_at": "2026-08-01T10:00:00Z",
    "updated_at": "2026-08-01T10:00:00Z"
  }
]
```

---

### Create Room
```
POST /admin/rooms
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "room_number": "101",
  "total_beds": 2,
  "description": "Double room"
}
```

**Response (201):**
```json
{
  "id": 1,
  "room_number": "101",
  "total_beds": 2,
  "description": "Double room",
  "status": "available"
}
```

---

### Get All Tenants
```
GET /admin/tenants
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 5,
    "room_id": 1,
    "move_in_date": "2026-06-15",
    "monthly_rent": 8000,
    "security_deposit": 16000,
    "advance_amount": 8000,
    "status": "active",
    "email": "tenant@example.com",
    "phone": "9876543210",
    "full_name": "John Doe",
    "room_number": "101"
  }
]
```

---

### Create Tenant
```
POST /admin/tenants
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "user_id": 5,
  "room_id": 1,
  "move_in_date": "2026-08-01",
  "monthly_rent": 8000,
  "security_deposit": 16000,
  "advance_amount": 8000,
  "status": "active",
  "permanent_address": "123 Main St, City",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "9876543211",
  "employment_info": "Engineer at XYZ Corp",
  "identity_document_type": "Aadhar",
  "identity_document_number": "1234 5678 9012"
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 5,
  "room_id": 1,
  "move_in_date": "2026-08-01",
  "monthly_rent": 8000,
  "status": "active"
}
```

**Note:** This endpoint automatically creates rent payment records for the next 12 months.

---

### Get Tenant Details
```
GET /admin/tenants/:id
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "tenant": {
    "id": 1,
    "user_id": 5,
    "room_id": 1,
    "move_in_date": "2026-08-01",
    "monthly_rent": 8000,
    "status": "active",
    "full_name": "John Doe",
    "email": "tenant@example.com",
    "room_number": "101"
  },
  "rentHistory": [
    {
      "id": 1,
      "tenant_id": 1,
      "rent_month": "2026-08",
      "expected_rent": 8000,
      "amount_paid": 8000,
      "payment_date": "2026-08-05",
      "status": "paid"
    }
  ]
}
```

---

### Update Tenant
```
PUT /admin/tenants/:id
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "inactive",
  "monthly_rent": 8500
}
```

**Response (200):**
```json
{
  "id": 1,
  "status": "inactive",
  "monthly_rent": 8500,
  "updated_at": "2026-08-15T12:00:00Z"
}
```

---

## Rent Management Endpoints

### Record Rent Payment
```
POST /rent/payment
Headers: Authorization: Bearer <token>
```

**Request:**
```json
{
  "tenant_id": 1,
  "rent_month": "2026-08",
  "expected_rent": 8000,
  "amount_paid": 8000,
  "payment_date": "2026-08-05",
  "payment_method": "bank_transfer",
  "transaction_reference": "TXN123456",
  "admin_remarks": "Payment received via bank transfer"
}
```

**Response (201):**
```json
{
  "message": "Payment recorded successfully",
  "payment": {
    "id": 1,
    "tenant_id": 1,
    "rent_month": "2026-08",
    "expected_rent": 8000,
    "amount_paid": 8000,
    "payment_date": "2026-08-05",
    "status": "paid",
    "payment_method": "bank_transfer",
    "transaction_reference": "TXN123456"
  }
}
```

**Note:** If amount_paid < expected_rent, status is set to "partially_paid"

---

### Get Rent by Month
```
GET /rent/month/2026-08
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "tenant_id": 1,
    "rent_month": "2026-08",
    "expected_rent": 8000,
    "amount_paid": 8000,
    "payment_date": "2026-08-05",
    "status": "paid",
    "full_name": "John Doe",
    "room_number": "101"
  },
  {
    "id": 2,
    "tenant_id": 2,
    "rent_month": "2026-08",
    "expected_rent": 7500,
    "amount_paid": null,
    "payment_date": null,
    "status": "overdue",
    "full_name": "Jane Smith",
    "room_number": "102"
  }
]
```

---

### Get Tenant Rent History
```
GET /rent/tenant/:tenantId
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "tenant": {
    "id": 1,
    "move_in_date": "2026-08-01",
    "monthly_rent": 8000
  },
  "rentHistory": [
    {
      "id": 1,
      "rent_month": "2026-08",
      "expected_rent": 8000,
      "amount_paid": 8000,
      "payment_date": "2026-08-05",
      "status": "paid",
      "payment_method": "bank_transfer",
      "transaction_reference": "TXN123456",
      "admin_remarks": "Payment confirmed"
    },
    {
      "id": 2,
      "rent_month": "2026-09",
      "expected_rent": 8000,
      "amount_paid": null,
      "payment_date": null,
      "status": "pending",
      "payment_method": null,
      "transaction_reference": null,
      "admin_remarks": null
    }
  ]
}
```

---

## Tenant Endpoints

### Get Tenant Profile
```
GET /tenant/profile
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 5,
  "room_id": 1,
  "move_in_date": "2026-08-01",
  "monthly_rent": 8000,
  "status": "active",
  "email": "tenant@example.com",
  "phone": "9876543210",
  "full_name": "John Doe",
  "room_number": "101"
}
```

---

### Get Tenant's Rent Information
```
GET /tenant/rent
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "room": {
    "room_number": "101"
  },
  "monthlyRent": 8000,
  "rentHistory": [
    {
      "id": 1,
      "rent_month": "2026-08",
      "expected_rent": 8000,
      "amount_paid": 8000,
      "payment_date": "2026-08-05",
      "status": "paid"
    },
    {
      "id": 2,
      "rent_month": "2026-09",
      "expected_rent": 8000,
      "amount_paid": null,
      "payment_date": null,
      "status": "pending"
    }
  ]
}
```

---

### Get Tenant's Rent History
```
GET /tenant/rent-history
Headers: Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "rent_month": "2026-06",
    "expected_rent": 8000,
    "amount_paid": 8000,
    "payment_date": "2026-06-05",
    "status": "paid"
  },
  {
    "id": 2,
    "rent_month": "2026-07",
    "expected_rent": 8000,
    "amount_paid": 8000,
    "payment_date": "2026-07-06",
    "status": "paid"
  },
  {
    "id": 3,
    "rent_month": "2026-08",
    "expected_rent": 8000,
    "amount_paid": 8000,
    "payment_date": "2026-08-05",
    "status": "paid"
  },
  {
    "id": 4,
    "rent_month": "2026-09",
    "expected_rent": 8000,
    "amount_paid": null,
    "payment_date": null,
    "status": "pending"
  }
]
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "message": "No token provided"
}
```

or

```json
{
  "message": "Invalid token"
}
```

### 403 - Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "message": "Tenant not found"
}
```

### 500 - Server Error
```json
{
  "message": "Server error"
}
```

---

## Rent Status Logic

The system automatically determines rent status based on:

1. **Due Date**: 7th of each month
2. **Current Date**: System uses current date

### Status Rules:
- **Pending**: Before 7th of month (regardless of payment)
- **Paid**: Payment has been recorded
- **Overdue**: After 7th AND no payment recorded
- **Partially Paid**: Payment recorded but amount_paid < expected_rent

---

## Rate Limiting
Currently not implemented. Can be added using:
```bash
npm install express-rate-limit
```

---

## Pagination
Currently not implemented. Endpoints return all records. Can be added to:
- GET /admin/tenants
- GET /rent/month/:rentMonth

---

## Filter/Search
Currently not implemented. Can be added for:
- Search tenants by name/email
- Filter rent by status
- Filter rooms by status

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","full_name":"Admin","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Get Dashboard (replace TOKEN)
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Create Room
curl -X POST http://localhost:5000/api/admin/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"room_number":"101","total_beds":2,"description":"Double room"}'
```

---

## Health Check
```
GET /api/health
```

**Response (200):**
```json
{
  "status": "OK"
}
```
