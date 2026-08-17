// Backend URL configuration for production
// For local development: uses localhost:5000
// For production: uses your Render backend URL
const RENDER_BACKEND_URL = 'https://ruthra-homes-backend.onrender.com';

const API_BASE = 
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : `${RENDER_BACKEND_URL}/api`;

class API {
  static getToken() {
    return localStorage.getItem('token');
  }

  static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    };
  }

  // Auth endpoints
  static async register(email, password, full_name, phone, role) {
    return fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, phone, role })
    }).then(r => r.json());
  }

  static async login(email, password) {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());
  }

  static async googleAuth(email, full_name, role = 'tenant', googleId = null) {
    return fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name, role, google_id: googleId })
    }).then(r => r.json());
  }

  // Admin endpoints
  static async getDashboard() {
    return fetch(`${API_BASE}/admin/dashboard`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async getRooms() {
    return fetch(`${API_BASE}/admin/rooms`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async createRoom(room_number, total_beds, description) {
    return fetch(`${API_BASE}/admin/rooms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ room_number, total_beds, description })
    }).then(r => r.json());
  }

  static async getTenants() {
    return fetch(`${API_BASE}/admin/tenants`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async createTenant(payload) {
    return fetch(`${API_BASE}/admin/tenants`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    }).then(r => r.json());
  }

  static async getTenantDetails(tenantId) {
    return fetch(`${API_BASE}/admin/tenants/${tenantId}`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async updateTenant(tenantId, payload) {
    return fetch(`${API_BASE}/admin/tenants/${tenantId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    }).then(r => r.json());
  }

  // Rent endpoints
  static async recordPayment(payload) {
    return fetch(`${API_BASE}/rent/payment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    }).then(r => r.json());
  }

  static async getRentByMonth(rentMonth) {
    return fetch(`${API_BASE}/rent/month/${rentMonth}`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async getRentHistory(tenantId) {
    return fetch(`${API_BASE}/rent/tenant/${tenantId}`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  // Tenant endpoints
  static async getTenantProfile() {
    return fetch(`${API_BASE}/tenant/profile`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async getTenantRent() {
    return fetch(`${API_BASE}/tenant/rent`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }

  static async getTenantRentHistory() {
    return fetch(`${API_BASE}/tenant/rent-history`, {
      headers: this.getHeaders()
    }).then(r => r.json());
  }
}
