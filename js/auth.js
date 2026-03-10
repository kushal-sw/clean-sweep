/* ========================================
   CLEANSWEEP - Authentication System
   ======================================== */

/**
 * Sign up a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function signUp(name, email, password) {
  const users = JSON.parse(localStorage.getItem('cs_users') || '[]');

  // Check if email already exists
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // Store new user
  users.push({ name, email, password });
  localStorage.setItem('cs_users', JSON.stringify(users));

  // Auto-login after signup
  localStorage.setItem('cs_currentUser', JSON.stringify({ name, email }));

  return { success: true, message: 'Account created successfully!' };
}

/**
 * Log in an existing user
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, message: string }}
 */
function login(email, password) {
  const users = JSON.parse(localStorage.getItem('cs_users') || '[]');

  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  localStorage.setItem('cs_currentUser', JSON.stringify({ name: user.name, email: user.email }));
  return { success: true, message: `Welcome back, ${user.name}!` };
}

/**
 * Log out the current user
 */
function logout() {
  localStorage.removeItem('cs_currentUser');
  window.location.href = 'index.html';
}

/**
 * Get the currently logged-in user
 * @returns {{ name: string, email: string } | null}
 */
function getCurrentUser() {
  const data = localStorage.getItem('cs_currentUser');
  return data ? JSON.parse(data) : null;
}

/**
 * Update the navbar on every page to reflect auth state
 * Looks for #nav-auth-area and replaces its content
 */
function updateNavbarAuth() {
  const authArea = document.getElementById('nav-auth-area');
  if (!authArea) return;

  const user = getCurrentUser();

  if (user) {
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (isIndexPage) {
      authArea.innerHTML = `
        <a href="dashboard.html" class="nav-link" style="color: var(--pink); font-weight: 700;">Dashboard</a>
      `;
    } else {
      authArea.innerHTML = `
        <a href="dashboard.html" class="nav-link" style="color: var(--pink); font-weight: 700;">Dashboard</a>
        <a href="order-history.html" class="nav-link nav-orders-link">My Orders</a>
        <span class="nav-user-name">${user.name}</span>
        <button class="nav-logout-btn" onclick="logout()">Logout</button>
      `;
    }
  } else {
    authArea.innerHTML = `
      <a href="login.html" class="nav-auth-link">Login</a>
    `;
  }
}

// Auto-run on every page load
document.addEventListener('DOMContentLoaded', () => {
  updateNavbarAuth();
  protectRoutes();
});

/**
 * Basic route protection for dashboard pages.
 * Redirects to login.html if a user tries to access a protected page while not logged in.
 */
function protectRoutes() {
  const protectedPages = ['dashboard.html', 'services.html', 'order-history.html', 'tracker.html'];
  const currentPagePath = window.location.pathname;
  
  // Check if current page is one of the protected pages
  const isProtectedPage = protectedPages.some(page => currentPagePath.includes(page));

  if (isProtectedPage && !getCurrentUser()) {
    // Redirect to login if trying to access a protected page without session
    window.location.href = 'login.html';
  }
}
