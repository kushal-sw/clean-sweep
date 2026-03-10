document.addEventListener('DOMContentLoaded', () => {
    // Redirect if already logged in
    if (getCurrentUser()) {
        window.location.href = 'dashboard.html';
        return;
    }

    // --- Validation Helpers ---
    function setError(id, msg) {
        const el = document.getElementById(id);
        const inputId = id.replace('-error', '');
        const input = document.getElementById(inputId);
        el.textContent = msg;
        el.classList.add('visible');
        if (input) input.classList.add('input-error');
    }
    
    function clearError(id) {
        const el = document.getElementById(id);
        const inputId = id.replace('-error', '');
        const input = document.getElementById(inputId);
        el.textContent = '';
        el.classList.remove('visible');
        if (input) input.classList.remove('input-error');
    }

    // Clear errors on input
    ['login-email', 'login-password', 'signup-name', 'signup-email', 'signup-password', 'signup-confirm'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => clearError(id + '-error'));
    });

    // --- Tab Switching ---
    function switchTab(tab) {
        const loginTab = document.getElementById('tab-login');
        const signupTab = document.getElementById('tab-signup');
        const loginForm = document.getElementById('form-login');
        const signupForm = document.getElementById('form-signup');

        if (tab === 'login') {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    // Attach Tab Switch events
    const loginTabBtn = document.getElementById('tab-login');
    const signupTabBtn = document.getElementById('tab-signup');
    const goToSignupLinks = document.querySelectorAll('p.auth-footer a');
    
    if (loginTabBtn) loginTabBtn.addEventListener('click', () => switchTab('login'));
    if (signupTabBtn) signupTabBtn.addEventListener('click', () => switchTab('signup'));
    
    // Wire up footer links dynamically based on their text
    goToSignupLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.textContent.includes('Sign Up')) {
                switchTab('signup');
            } else if (link.textContent.includes('Login')) {
                switchTab('login');
            }
        });
    });

    // --- Handle Login ---
    function handleLogin(e) {
        e.preventDefault();
        let valid = true;

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('login-email-error', 'Enter a valid email address.');
            valid = false;
        }
        if (!password) {
            setError('login-password-error', 'Password is required.');
            valid = false;
        }
        if (!valid) return;

        const result = login(email, password);
        if (result.success) {
            showToast(result.message, 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
        } else {
            setError('login-password-error', result.message);
        }
    }

    // --- Handle Signup ---
    function handleSignup(e) {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (name.length < 3) {
            setError('signup-name-error', 'Name must be at least 3 characters.');
            valid = false;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('signup-email-error', 'Enter a valid email address.');
            valid = false;
        }
        if (password.length < 6) {
            setError('signup-password-error', 'Password must be at least 6 characters.');
            valid = false;
        }
        if (password !== confirm) {
            setError('signup-confirm-error', 'Passwords do not match.');
            valid = false;
        }
        if (!valid) return;

        const result = signUp(name, email, password);
        if (result.success) {
            showToast(result.message, 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
        } else {
            setError('signup-email-error', result.message);
        }
    }

    const formLogin = document.getElementById('form-login');
    const formSignup = document.getElementById('form-signup');
    if (formLogin) formLogin.addEventListener('submit', handleLogin);
    if (formSignup) formSignup.addEventListener('submit', handleSignup);
});
