document.addEventListener('DOMContentLoaded', () => {
    // Dashboard specific initialization
    const user = getCurrentUser();
    if (user) {
        if (document.getElementById('dropdown-user-name')) {
            document.getElementById('dropdown-user-name').textContent = user.name;
        }
        if (document.getElementById('header-user-name')) {
            document.getElementById('header-user-name').textContent = user.name.split(' ')[0];
        }
    }

    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }

    // Handle instant booking card click
    const instantCard = document.querySelector('.instant-card');
    if (instantCard) {
        instantCard.addEventListener('click', () => {
            const today = new Date().getDate();
            sessionStorage.setItem('cs_selectedDates', JSON.stringify([today]));
            sessionStorage.setItem('cs_selectionMode', 'single');
            sessionStorage.setItem('cs_isInstant', 'true');
        });
    }

    // Handle logout click
    const logoutBtn = document.getElementById('dashboard-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});
