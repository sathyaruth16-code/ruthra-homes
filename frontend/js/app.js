// Global state
let currentUser = null;
const UPI_QR_STORAGE_KEY = 'ruthrahomes.upiQrImage';

// ============================================================
// GOOGLE OAUTH CONFIGURATION
// ============================================================

// Admin emails - users with these emails will automatically be admins
const ADMIN_EMAILS = [
  'sathyaruth16@gmail.com',
  'ruthirakotti574@gmail.com'
];

const GOOGLE_CLIENT_ID = '324209073202-ce7n2pk77gmmiefvd45b0sa9d7rf3nl2.apps.googleusercontent.com';

/**
 * Check if email is admin
 */
function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Handles the response from Google Sign-In
 */
function handleCredentialResponse(response) {
  try {
    // Decode the JWT from Google
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const googleUser = JSON.parse(jsonPayload);
    
    console.log('Google Sign-In successful:', googleUser);
    
    // Send to backend for verification and JWT generation
    authenticateWithGoogle(googleUser);
  } catch (error) {
    console.error('Error decoding Google credential:', error);
    showMessage('Error processing Google sign-in', 'error');
  }
}

/**
 * Authenticates user with backend using Google credentials
 */
async function authenticateWithGoogle(googleUser) {
  try {
    // Determine role based on email
    const userRole = isAdminEmail(googleUser.email) ? 'admin' : 'tenant';
    
    // Call backend Google auth endpoint
    const result = await API.googleAuth(
      googleUser.email, 
      googleUser.name, 
      userRole,
      googleUser.sub
    );
    
    if (result.token) {
      // Store authentication data
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.user.role);
      localStorage.setItem('userId', result.user.id);
      localStorage.setItem('userName', result.user.full_name);
      currentUser = result.user;
      
      showMessage('Google sign-in successful!', 'success');
      
      // Navigate based on role and status
      if (result.user.role === 'admin') {
        // Load and show admin dashboard
        setTimeout(() => {
          loadAdminDashboard();
          showPage(pages.adminDashboard);
        }, 500);
      } else {
        // Non-admin: check if new user or existing
        // If new user (just created), show registration page
        // Otherwise show tenant dashboard
        if (result.isNewUser) {
          // New tenant - show registration/onboarding
          document.getElementById('reg-name').value = result.user.full_name;
          document.getElementById('reg-email').value = result.user.email;
          setTimeout(() => {
            showPage(pages.tenantRegistration);
          }, 500);
        } else {
          // Existing tenant - show dashboard
          setTimeout(() => {
            loadTenantDashboard();
            showPage(pages.tenantDashboard);
          }, 500);
        }
      }
    } else {
      showMessage(result.message || 'Google authentication failed', 'error');
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    showMessage('Error during authentication', 'error');
  }
}

/**
 * Initialize Google Sign-In when the page loads
 */
function initGoogleSignIn() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false
    });
    
    // Render the button
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { 
          theme: 'filled_blue',
          size: 'large',
          width: '100%',
          text: 'signin'
        }
      );
    }
  } else {
    console.warn('Google Sign-In library not loaded, retrying...');
    setTimeout(initGoogleSignIn, 500);
  }
}

// Initialize Google Sign-In when window loads
window.addEventListener('load', initGoogleSignIn);

// ============================================================
// END GOOGLE OAUTH CONFIGURATION
// ============================================================

// Page navigation
const pages = {
  login: document.getElementById('login-page'),
  signup: document.getElementById('signup-page'),
  adminDashboard: document.getElementById('admin-dashboard'),
  tenantDashboard: document.getElementById('tenant-dashboard'),
  tenantRegistration: document.getElementById('tenant-registration')
};

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Helper function to format currency
function formatCurrency(amount) {
  if (!amount) return '₹0';
  return '₹' + parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// Helper function to get rent due date
function getRentDueDate(rentMonth) {
  return `${rentMonth}-07`;
}

// Helper function to format rent month
function formatRentMonth(rentMonth) {
  const [year, month] = rentMonth.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

// Show page
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  page.classList.add('active');
}

function updateUpiQrDisplay() {
  const qrData = localStorage.getItem(UPI_QR_STORAGE_KEY);
  const adminPreview = document.getElementById('admin-upi-preview');
  const adminPlaceholder = document.getElementById('upi-placeholder');
  const tenantPreview = document.getElementById('tenant-upi-qr');
  const tenantEmpty = document.getElementById('tenant-upi-empty');
  const modalPreview = document.getElementById('upi-modal-preview-image');

  if (adminPreview) {
    if (qrData) {
      adminPreview.src = qrData;
      adminPreview.classList.remove('hidden');
      adminPlaceholder.classList.add('hidden');
    } else {
      adminPreview.classList.add('hidden');
      adminPlaceholder.classList.remove('hidden');
    }
  }

  if (tenantPreview) {
    if (qrData) {
      tenantPreview.src = qrData;
      tenantPreview.classList.remove('hidden');
      tenantEmpty.classList.add('hidden');
    } else {
      tenantPreview.classList.add('hidden');
      tenantEmpty.classList.remove('hidden');
    }
  }

  if (modalPreview) {
    if (qrData) {
      modalPreview.src = qrData;
      modalPreview.classList.remove('hidden');
    } else {
      modalPreview.classList.add('hidden');
    }
  }
}

// Show message
function showMessage(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alert, container.firstChild);
  
  setTimeout(() => alert.remove(), 5000);
}

// Auth event listeners
document.getElementById('signup-toggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(pages.signup);
});

document.getElementById('login-toggle')?.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(pages.login);
});

// Tenant Registration Form
document.getElementById('tenant-registration-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const phone = document.getElementById('reg-phone').value;
  const room = document.getElementById('reg-room').value || null;
  
  try {
    // Call backend to update tenant profile
    const result = await API.updateTenant(localStorage.getItem('userId'), {
      phone: phone,
      room_number: room
    });
    
    if (result.success || result.message) {
      showMessage('Profile completed successfully!', 'success');
      localStorage.setItem('profileCompleted', 'true');
      
      setTimeout(() => {
        loadTenantDashboard();
        showPage(pages.tenantDashboard);
      }, 500);
    } else {
      showMessage('Failed to save profile', 'error');
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    showMessage('Error saving profile', 'error');
  }
});

// Skip registration
document.getElementById('skip-registration')?.addEventListener('click', () => {
  showMessage('You can update your profile later in settings', 'info');
  localStorage.setItem('profileCompleted', 'true');
  
  setTimeout(() => {
    loadTenantDashboard();
    showPage(pages.tenantDashboard);
  }, 500);
});

document.querySelectorAll('[data-close="upi-qr-modal"]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById('upi-qr-modal').classList.remove('show');
    document.getElementById('upi-qr-form').reset();
  });
});

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const result = await API.login(email, password);
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.user.role);
      currentUser = result.user;
      
      if (result.user.role === 'admin') {
        loadAdminDashboard();
        showPage(pages.adminDashboard);
      } else {
        loadTenantDashboard();
        showPage(pages.tenantDashboard);
      }
      
      document.getElementById('login-form').reset();
    } else {
      showMessage(result.message || 'Login failed', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Login failed', 'error');
  }
});

document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const full_name = document.getElementById('signup-name').value;
  const phone = document.getElementById('signup-phone').value;
  const role = document.getElementById('signup-role').value;
  
  try {
    const result = await API.register(email, password, full_name, phone, role);
    if (result.user) {
      showMessage('Registration successful! Please login.', 'success');
      showPage(pages.login);
      document.getElementById('signup-form').reset();
    } else {
      showMessage(result.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Registration failed', 'error');
  }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  currentUser = null;
  showPage(pages.login);
});

document.getElementById('tenant-logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  currentUser = null;
  showPage(pages.login);
});

document.getElementById('upload-upi-btn')?.addEventListener('click', () => {
  document.getElementById('upi-qr-modal').classList.add('show');
});

document.getElementById('upi-qr-file')?.addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const result = e.target.result;
    const preview = document.getElementById('upi-modal-preview-image');
    preview.src = result;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

document.getElementById('upi-qr-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const preview = document.getElementById('upi-modal-preview-image');
  const fileInput = document.getElementById('upi-qr-file');

  if (!preview.src || preview.src === window.location.href || !fileInput.value) {
    showMessage('Please choose a QR image first', 'error');
    return;
  }

  localStorage.setItem(UPI_QR_STORAGE_KEY, preview.src);
  updateUpiQrDisplay();
  document.getElementById('upi-qr-modal').classList.remove('show');
  document.getElementById('upi-qr-form').reset();
  showMessage('UPI QR updated successfully', 'success');
});

document.getElementById('remove-upi-qr-btn')?.addEventListener('click', () => {
  localStorage.removeItem(UPI_QR_STORAGE_KEY);
  updateUpiQrDisplay();
  document.getElementById('upi-qr-modal').classList.remove('show');
  document.getElementById('upi-qr-form').reset();
  showMessage('UPI QR removed', 'success');
});

// ========== ADMIN DASHBOARD ==========

async function loadAdminDashboard() {
  try {
    const data = await API.getDashboard();
    
    document.getElementById('total-rooms').textContent = data.totalRooms;
    document.getElementById('active-tenants').textContent = data.activeTenants;
    document.getElementById('pending-apps').textContent = data.pendingApplications;
    
    document.getElementById('current-month').textContent = formatRentMonth(data.currentMonth);
    document.getElementById('total-expected').textContent = formatCurrency(data.rent.totalExpected);
    document.getElementById('total-collected').textContent = formatCurrency(data.rent.totalCollected);
    document.getElementById('total-pending').textContent = formatCurrency(data.rent.pending);
    document.getElementById('total-overdue').textContent = formatCurrency(data.rent.overdue);
    document.getElementById('paid-count').textContent = data.rent.paidCount;
    document.getElementById('unpaid-count').textContent = data.rent.unpaidCount;
    
    loadRooms();
    loadTenants();
    loadRentManagement();
  } catch (error) {
    console.error(error);
    showMessage('Failed to load dashboard', 'error');
  }
}

// Navigation in admin dashboard
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    
    document.querySelectorAll('.navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    document.querySelectorAll('.admin-section, .tenant-section').forEach(s => s.classList.remove('active'));
    
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
      sectionElement.classList.add('active');
    }
  });
});

// Rooms
async function loadRooms() {
  try {
    const rooms = await API.getRooms();
    const tbody = document.getElementById('rooms-table-body');
    tbody.innerHTML = '';
    
    rooms.forEach(room => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${room.room_number}</td>
        <td>${room.total_beds}</td>
        <td><span class="badge badge-active">${room.status}</span></td>
        <td>${room.tenant_count}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-edit">Edit</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
    
    // Also update room dropdown for adding tenants
    const roomSelect = document.getElementById('tenant-room-id');
    if (roomSelect) {
      roomSelect.innerHTML = '<option value="">Select a room...</option>';
      rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.room_number;
        roomSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error(error);
    showMessage('Failed to load rooms', 'error');
  }
}

document.getElementById('add-room-btn')?.addEventListener('click', () => {
  document.getElementById('add-room-modal').classList.add('show');
});

document.getElementById('add-room-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const room_number = document.getElementById('room-number').value;
  const total_beds = parseInt(document.getElementById('room-beds').value);
  const description = document.getElementById('room-description').value;
  
  try {
    const result = await API.createRoom(room_number, total_beds, description);
    if (result.id) {
      showMessage('Room added successfully', 'success');
      document.getElementById('add-room-form').reset();
      document.getElementById('add-room-modal').classList.remove('show');
      loadRooms();
    } else {
      showMessage(result.message || 'Failed to add room', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Failed to add room', 'error');
  }
});

// Tenants
async function loadTenants() {
  try {
    const tenants = await API.getTenants();
    const tbody = document.getElementById('tenants-table-body');
    tbody.innerHTML = '';
    
    tenants.forEach(tenant => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tenant.full_name}</td>
        <td>${tenant.email}</td>
        <td>${tenant.room_number}</td>
        <td>${formatCurrency(tenant.monthly_rent)}</td>
        <td>${formatDate(tenant.move_in_date)}</td>
        <td><span class="badge badge-${tenant.status}">${tenant.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-edit" data-tenant-id="${tenant.id}">View</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
      
      row.querySelector('.btn-edit')?.addEventListener('click', () => {
        viewTenantDetails(tenant.id);
      });
    });
    
    // Also update tenant user dropdown
    const userSelect = document.getElementById('tenant-user-id');
    if (userSelect) {
      const tenantUsers = await API.getTenants();
      userSelect.innerHTML = '<option value="">Select a tenant user...</option>';
      // In a real app, we'd fetch users with role 'tenant'
    }
  } catch (error) {
    console.error(error);
    showMessage('Failed to load tenants', 'error');
  }
}

document.getElementById('add-tenant-btn')?.addEventListener('click', () => {
  document.getElementById('add-tenant-modal').classList.add('show');
});

document.getElementById('add-tenant-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    user_id: parseInt(document.getElementById('tenant-user-id').value),
    room_id: parseInt(document.getElementById('tenant-room-id').value),
    move_in_date: document.getElementById('tenant-move-in').value,
    monthly_rent: parseFloat(document.getElementById('tenant-monthly-rent').value),
    security_deposit: document.getElementById('tenant-security-deposit').value ? parseFloat(document.getElementById('tenant-security-deposit').value) : null,
    advance_amount: document.getElementById('tenant-advance').value ? parseFloat(document.getElementById('tenant-advance').value) : null,
    status: 'active'
  };
  
  try {
    const result = await API.createTenant(payload);
    if (result.id) {
      showMessage('Tenant added successfully', 'success');
      document.getElementById('add-tenant-form').reset();
      document.getElementById('add-tenant-modal').classList.remove('show');
      loadTenants();
      loadAdminDashboard();
    } else {
      showMessage(result.message || 'Failed to add tenant', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Failed to add tenant', 'error');
  }
});

async function viewTenantDetails(tenantId) {
  try {
    const data = await API.getTenantDetails(tenantId);
    console.log('Tenant details:', data);
    showMessage('View tenant details (see console)', 'success');
  } catch (error) {
    console.error(error);
    showMessage('Failed to load tenant details', 'error');
  }
}

// Rent Management
async function loadRentManagement() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  document.getElementById('rent-month-filter').value = `${currentYear}-${currentMonth}`;
  
  await filterRent();
}

async function filterRent() {
  const rentMonth = document.getElementById('rent-month-filter').value;
  
  try {
    const payments = await API.getRentByMonth(rentMonth);
    const tbody = document.getElementById('rent-table-body');
    tbody.innerHTML = '';
    
    payments.forEach(payment => {
      const dueDate = getRentDueDate(payment.rent_month);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${payment.room_number}</td>
        <td>${payment.full_name}</td>
        <td>${formatRentMonth(payment.rent_month)}</td>
        <td>${formatCurrency(payment.expected_rent)}</td>
        <td>${payment.amount_paid ? formatCurrency(payment.amount_paid) : '-'}</td>
        <td>${formatDate(dueDate)}</td>
        <td><span class="badge badge-${payment.status}">${payment.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-pay" data-tenant-id="${payment.tenant_id}" data-rent-month="${payment.rent_month}" data-expected="${payment.expected_rent}">Record Payment</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
      
      row.querySelector('.btn-pay')?.addEventListener('click', (e) => {
        openPaymentModal(e.target.dataset.tenantId, e.target.dataset.rentMonth, e.target.dataset.expected);
      });
    });
  } catch (error) {
    console.error(error);
    showMessage('Failed to load rent data', 'error');
  }
}

document.getElementById('filter-rent-btn')?.addEventListener('click', filterRent);

function openPaymentModal(tenantId, rentMonth, expectedRent) {
  document.getElementById('payment-tenant-id').value = tenantId;
  document.getElementById('payment-rent-month').value = rentMonth;
  document.getElementById('payment-expected-rent').value = expectedRent;
  document.getElementById('payment-amount').value = expectedRent;
  document.getElementById('payment-date').valueAsDate = new Date();
  
  document.getElementById('record-payment-modal').classList.add('show');
}

document.getElementById('record-payment-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    tenant_id: parseInt(document.getElementById('payment-tenant-id').value),
    rent_month: document.getElementById('payment-rent-month').value,
    expected_rent: parseFloat(document.getElementById('payment-expected-rent').value),
    amount_paid: parseFloat(document.getElementById('payment-amount').value),
    payment_date: document.getElementById('payment-date').value,
    payment_method: document.getElementById('payment-method').value || null,
    transaction_reference: document.getElementById('payment-reference').value || null,
    admin_remarks: document.getElementById('payment-remarks').value || null
  };
  
  try {
    const result = await API.recordPayment(payload);
    if (result.payment) {
      showMessage('Payment recorded successfully', 'success');
      document.getElementById('record-payment-form').reset();
      document.getElementById('record-payment-modal').classList.remove('show');
      loadRentManagement();
      loadAdminDashboard();
    } else {
      showMessage(result.message || 'Failed to record payment', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('Failed to record payment', 'error');
  }
});

// ========== TENANT DASHBOARD ==========

async function loadTenantDashboard() {
  try {
    const rentData = await API.getTenantRent();
    updateUpiQrDisplay();
    
    document.getElementById('my-room').textContent = rentData.room.room_number;
    document.getElementById('my-monthly-rent').textContent = formatCurrency(rentData.monthlyRent);
    
    // Display upcoming rent months
    const container = document.getElementById('upcoming-rent-container');
    container.innerHTML = '';
    
    rentData.rentHistory.slice(0, 6).forEach(payment => {
      const card = document.createElement('div');
      card.className = 'rent-month-card';
      
      const dueDate = getRentDueDate(payment.rent_month);
      
      card.innerHTML = `
        <div class="rent-month-header">${formatRentMonth(payment.rent_month)}</div>
        <div class="rent-month-details">
          <div class="detail-item">
            <span class="detail-label">Due Date</span>
            <span class="detail-value">${formatDate(dueDate)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="detail-value"><span class="badge badge-${payment.status}">${payment.status.toUpperCase()}</span></span>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    loadTenantRentHistory();
  } catch (error) {
    console.error(error);
    showMessage('Failed to load rent information', 'error');
  }
}

async function loadTenantRentHistory() {
  try {
    const rentHistory = await API.getTenantRentHistory();
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';
    
    rentHistory.forEach(payment => {
      const dueDate = getRentDueDate(payment.rent_month);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${formatRentMonth(payment.rent_month)}</td>
        <td>${formatDate(dueDate)}</td>
        <td>${formatCurrency(payment.expected_rent)}</td>
        <td>${payment.amount_paid ? formatCurrency(payment.amount_paid) : '-'}</td>
        <td>${payment.payment_date ? formatDate(payment.payment_date) : '-'}</td>
        <td><span class="badge badge-${payment.status}">${payment.status}</span></td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    showMessage('Failed to load rent history', 'error');
  }
}

// Tenant navigation
document.querySelectorAll('#tenant-dashboard .navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    
    document.querySelectorAll('#tenant-dashboard .navbar-nav .nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    document.querySelectorAll('.tenant-section').forEach(s => s.classList.remove('active'));
    
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
      sectionElement.classList.add('active');
    }
  });
});

// Modal closes
document.querySelectorAll('.close').forEach(closeBtn => {
  closeBtn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.remove('show');
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', async () => {
  updateUpiQrDisplay();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (token) {
    try {
      // For admin, verify token is still valid
      if (userRole === 'admin') {
        const dashboardResult = await API.getDashboard();
        if (dashboardResult && !dashboardResult.error) {
          // Token is valid
          loadAdminDashboard();
          showPage(pages.adminDashboard);
        } else {
          // Token is invalid, show login
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          showPage(pages.login);
        }
      } else {
        // For tenant, just show the dashboard (token is valid if it's in storage)
        loadTenantDashboard();
        showPage(pages.tenantDashboard);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      showPage(pages.login);
    }
  } else {
    // No token, show login page
    showPage(pages.login);
  }
});
