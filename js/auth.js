

function signUp(name, email, password) {
  const users = JSON.parse(localStorage.getItem('cs_users') || '[]');

  
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  
  users.push({ name, email, password });
  localStorage.setItem('cs_users', JSON.stringify(users));

  
  localStorage.setItem('cs_currentUser', JSON.stringify({ name, email }));

  return { success: true, message: 'Account created successfully!' };
}

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

function logout() {
  localStorage.removeItem('cs_currentUser');
  window.location.href = 'index.html';
}

function getCurrentUser() {
  const data = localStorage.getItem('cs_currentUser');
  return data ? JSON.parse(data) : null;
}

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

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarAuth();
  protectRoutes();
});

function protectRoutes() {
  const protectedPages = ['dashboard.html', 'services.html', 'order-history.html', 'tracker.html'];
  const currentPagePath = window.location.pathname;
  
  
  const isProtectedPage = protectedPages.some(page => currentPagePath.includes(page));

  if (isProtectedPage && !getCurrentUser()) {
    
    window.location.href = 'login.html';
  }
}
