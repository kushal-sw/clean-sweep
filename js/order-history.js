document.addEventListener('DOMContentLoaded', () => {
    // Protect page — redirect if not logged in
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const container = document.getElementById('orders-container');
    const subtitle = document.getElementById('orders-subtitle');

    // Keep a reference to the plain array to modify and save later
    let rawOrders = JSON.parse(localStorage.getItem('cs_orders') || '[]');

    // Show orders newest first for viewing
    const reversedOrders = [...rawOrders].reverse();

    if (reversedOrders.length === 0) {
        subtitle.textContent = 'No bookings yet';
        container.innerHTML = `
            <div class="orders-empty">
                <div class="orders-empty-icon">📋</div>
                <h2 class="orders-empty-title">No Orders Yet</h2>
                <p class="orders-empty-text">You haven't booked any services yet. Start by browsing our services!</p>
                <a href="services.html" class="orders-empty-btn">Book Your First Service</a>
            </div>
        `;
        return;
    }

    subtitle.textContent = `${reversedOrders.length} booking${reversedOrders.length > 1 ? 's' : ''}`;

    // Stats
    const totalSpent = reversedOrders.reduce((sum, o) => sum + o.total, 0);
    let html = `
        <div class="orders-stats">
            <div class="orders-stat-card">
                <div class="stat-value">${reversedOrders.length}</div>
                <div class="stat-label">Total Bookings</div>
            </div>
            <div class="orders-stat-card">
                <div class="stat-value">₹${totalSpent.toLocaleString()}</div>
                <div class="stat-label">Total Spent</div>
            </div>
            <div class="orders-stat-card">
                <div class="stat-value">₹${Math.round(totalSpent / reversedOrders.length)}</div>
                <div class="stat-label">Avg Order</div>
            </div>
        </div>
    `;

    // Order cards
    reversedOrders.forEach(order => {
        const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');
        const serviceTags = order.services.map(s => `<span class="order-service-tag">${s}</span>`).join('');

        let orderFooter = '';
        if (order.status.toLowerCase() === 'completed') {
            if (!order.rated) {
                orderFooter = `
                    <div class="order-rating-area order-rating-area-box" id="rating-area-${order.id}">
                        <button class="rate-now-btn order-rate-now-btn" data-order-id="${order.id}">★ Rate Services</button>
                    </div>
                `;
            } else {
                orderFooter = `
                    <div class="order-rating-area-box">
                        <span class="order-thanks-rating">★ Thanks for rating!</span>
                    </div>
                `;
            }
        }

        // Wrap original card content in a flex div, and set outer card to column
        const instantBadge = order.isInstant ? `<span class="order-instant-badge">Instant</span>` : '';

        html += `
            <div class="order-card order-card-col">
                <div class="order-row-mobile order-row-mobile-inner">
                    <div class="order-id-col">
                        <div class="order-id">${order.id}${instantBadge}</div>
                        <div class="order-date">${order.date || 'N/A'}</div>
                    </div>
                    <div class="order-services">${serviceTags}</div>
                    <div class="order-total">₹${order.total.toLocaleString()}</div>
                    <span class="order-status status-${statusClass}">${order.status}</span>
                </div>
                ${orderFooter}
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach event listeners for dynamically added rate buttons
    const rateBtns = document.querySelectorAll('.rate-now-btn');
    rateBtns.forEach(btn => {
        btn.addEventListener('click', (e) => showRatingForm(e.target.getAttribute('data-order-id')));
    });

    // Rating Form Logic moved out of global scope where possible, kept globally accessible if generic
    function showRatingForm(orderId) {
        const orderIndex = rawOrders.findIndex(o => o.id === orderId);
        const order = rawOrders[orderIndex];
        const area = document.getElementById(`rating-area-${orderId}`);

        area.innerHTML = `
            <div class="order-rating-prompt">Rate your experience:</div>
            <div id="stars-container-${orderId}"></div>
        `;

        const starsContainer = document.getElementById(`stars-container-${orderId}`);
        let ratedCount = 0;

        order.services.forEach(service => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.marginBottom = '8px';

            const name = document.createElement('span');
            name.className = 'order-rating-service-name';
            name.textContent = service;

            const widgetContainer = document.createElement('div');

            row.appendChild(name);
            row.appendChild(widgetContainer);
            starsContainer.appendChild(row);

            new RatingWidget(widgetContainer, service, (val) => {
                ratedCount++;
                if (ratedCount === order.services.length) {
                    // All services in this order have been rated
                    order.rated = true;
                    localStorage.setItem('cs_orders', JSON.stringify(rawOrders));
                    showToast('Thank you for your feedback! 🌟', 'success');
                    setTimeout(() => {
                        area.innerHTML = `<span class="order-thanks-rating">★ Thanks for rating!</span>`;
                    }, 1000);
                }
            });
        });
    }
});
