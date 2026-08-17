# Updated Rental & Rent Management Requirements

## 1. Rental Information

For each active tenant, store:

* Room number
* Move-in date
* Monthly rent amount
* Security deposit — optional
* Advance amount — optional
* Tenant status

Do NOT collect or store an expected move-out date.

Do NOT include an expected move-out date field anywhere in the tenant registration form.

---

# 2. Room and Tenant Relationship

One room can have multiple tenants.

Example:

Room 1:

* Tenant A
* Tenant B
* Tenant C
* Tenant D

Each tenant should have their own:

* Monthly rent
* Move-in date
* Payment history
* Tenant status

The monthly rent can be different for different tenants in the same room if required.

---

# 3. Monthly Rent

The system must support monthly rent tracking.

Each active tenant should have a monthly rent amount.

Example:

Tenant: Sathya
Room: 1
Monthly Rent: ₹8,000

Tenant: Rahul
Room: 1
Monthly Rent: ₹7,500

---

# 4. Rent Due Date

The monthly rent must be paid **on or before the 7th day of every month**.

The system should consider:

**7th of each month = Rent Due Date**

Example:

For August 2026:

* Rent month: August 2026
* Due date: 7 August 2026

For September 2026:

* Rent month: September 2026
* Due date: 7 September 2026

---

# 5. Rent Payment Status

Each tenant should have a monthly rent payment record.

Possible statuses:

* Pending
* Paid
* Overdue
* Partially Paid — optional

Example:

| Tenant | Month       |   Rent | Due Date    | Status  |
| ------ | ----------- | -----: | ----------- | ------- |
| Sathya | August 2026 | ₹8,000 | 07-Aug-2026 | Paid    |
| Rahul  | August 2026 | ₹7,500 | 07-Aug-2026 | Pending |
| Arun   | August 2026 | ₹8,000 | 07-Aug-2026 | Overdue |

---

# 6. Admin Rent Dashboard

The admin dashboard should display rent information.

Example:

```text
Monthly Rent — August 2026

Total Expected Rent       ₹1,20,000
Total Collected           ₹95,000
Pending                   ₹15,000
Overdue                   ₹10,000
```

Also show:

* Number of tenants who paid
* Number of tenants who haven't paid
* Number of overdue payments

---

# 7. Tenant Rent Dashboard

Each tenant should be able to see their own rent information.

Example:

```text
My Rent

Room: 1
Monthly Rent: ₹8,000

August 2026
Due Date: 07-Aug-2026
Status: Paid

September 2026
Due Date: 07-Sep-2026
Status: Pending
```

A tenant must only be able to see **their own payment information**.

---

# 8. Admin Payment Management

Admin should be able to record a tenant's rent payment.

When recording payment, store:

* Tenant
* Rent month
* Expected rent
* Amount paid
* Payment date
* Payment status
* Payment method — optional
* Transaction/reference number — optional
* Admin remarks — optional

Example:

```text
Tenant: Sathya
Rent Month: August 2026
Expected Rent: ₹8,000
Amount Paid: ₹8,000
Payment Date: 05-Aug-2026
Status: Paid
Payment Method: Bank Transfer
Reference: TXN123456
```

---

# 9. Automatic Rent Status

The system should automatically determine the rent status based on the current date and payment record.

Before the 7th:

**Pending**

If payment is recorded:

**Paid**

After the 7th and payment has not been recorded:

**Overdue**

Example:

```text
Due Date: 07-Aug-2026

Payment recorded:
→ Paid

No payment after 07-Aug-2026:
→ Overdue
```

Do not rely only on the frontend to calculate this. The server/database logic should enforce the status rules.

---

# 10. Rent Reminder

The system should be designed so that rent reminders can be added.

Recommended reminder schedule:

### Before due date

Send a reminder to the tenant.

For example:

**5th of the month**

> Your monthly rent of ₹8,000 is due by 7th August.

### On due date

**7th of the month**

> Today is the rent due date. Please make your monthly rent payment.

### After due date

If unpaid:

> Your monthly rent payment is overdue.

The exact notification mechanism can initially be email.

WhatsApp/SMS notifications can be added later.

---

# 11. Rent History

Admin should be able to see complete payment history for every tenant.

Example:

```text
Sathya — Rent History

June 2026
₹8,000 — Paid — 05-Jun-2026

July 2026
₹8,000 — Paid — 06-Jul-2026

August 2026
₹8,000 — Paid — 05-Aug-2026

September 2026
₹8,000 — Pending
```

The tenant should also be able to see their own history.

---

# 12. No Move-Out Date

Do NOT include:

* Expected move-out date
* Planned move-out date
* Move-out date in tenant registration

Do not create a move-out-date field in the database.

If the property owner later needs to stop a tenant's active status, use:

**Tenant Status**

For example:

* Active
* Inactive
* Suspended

The system should retain the tenant's historical records rather than deleting them.

---

# 13. Updated Tenant Data Structure

Conceptually, each tenant should have:

```text
Tenant
│
├── Personal Information
├── Contact Information
├── Permanent Address
├── Emergency Contact
├── Employment Information
├── Identity Documents
│
├── Room
│   └── Room 1
│
├── Move-in Date
│
├── Monthly Rent
│
├── Tenant Status
│
└── Rent Payment History
    ├── June
    ├── July
    ├── August
    └── September
```

---

# 14. Updated Admin Dashboard

Include:

```text
Total Rooms
16

Active Tenants
42

Pending Applications
3

This Month's Expected Rent
₹1,20,000

Rent Collected
₹95,000

Rent Pending
₹15,000

Rent Overdue
₹10,000
```

The dashboard should clearly highlight tenants whose rent is overdue.

---

# 15. Future Payment Integration

For the first version, do NOT require automatic online payment unless specifically requested.

Initially, allow the admin to record payments manually.

Design the database so that online payment can later be added using a payment provider.

Future possibilities:

* UPI payment
* Payment gateway
* Automatic payment confirmation
* Payment receipt
* Automated reminders
* Payment history
* Monthly rent reports

The architecture should allow these features to be added later without redesigning the tenant system.
