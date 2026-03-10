// Admin Gateway check
const pass = prompt('Enter Admin Passcode:');
if (pass !== 'admin123') {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const rawOrders = JSON.parse(localStorage.getItem('cs_orders') || '[]');

    function renderDashboard() {
        if (rawOrders.length === 0) {
            renderEmpty();
            return;
        }

        // Calculate Stats
        const totalBookings = rawOrders.length;
        let totalRevenue = 0;
        const serviceCounts = {};

        rawOrders.forEach(order => {
            totalRevenue += order.total;
            order.services.forEach(s => {
                serviceCounts[s] = (serviceCounts[s] || 0) + 1;
            });
        });

        const aov = Math.round(totalRevenue / totalBookings);

        // Find top service
        let maxCount = 0;
        let topService = '-';
        for (const [s, count] of Object.entries(serviceCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topService = s;
            }
        }

        // Animate numbers
        animateValue('stat-bookings', 0, totalBookings, 1000, '');
        animateValue('stat-revenue', 0, totalRevenue, 1000, '₹');
        animateValue('stat-aov', 0, aov, 1000, '₹');
        document.getElementById('stat-top').textContent = topService;

        // Render Table
        renderTable();

        // Render Chart
        renderChart(serviceCounts, maxCount);
    }

    function renderEmpty() {
        document.getElementById('table-container').innerHTML = '<div class="empty-state">No orders have been placed yet.</div>';
        document.getElementById('chart-container').innerHTML = '<div class="empty-state">Not enough data.</div>';
    }

    function animateValue(id, start, end, duration, prefix) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = prefix + Math.floor(progress * (end - start) + start).toLocaleString('en-IN');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function renderTable() {
        // Show newest first
        const orders = [...rawOrders].reverse();

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date & Time</th>
                        <th>Services</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        orders.forEach(order => {
            const statusClass = `status-${order.status.toLowerCase().replace(/\s+/g, '-')}`;
            const servicesText = order.services.join(', ');

            html += `
                <tr>
                    <td class="order-id">${order.id}</td>
                    <td>${order.date || 'N/A'}<br><span class="admin-td-time">${order.time || ''}</span></td>
                    <td><div class="service-tags">${servicesText}</div></td>
                    <td class="admin-td-amount">₹${order.total.toLocaleString()}</td>
                    <td>
                        <select class="status-select ${statusClass}" data-order-id="${order.id}">
                            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="On The Way" ${order.status === 'On The Way' ? 'selected' : ''}>On The Way</option>
                            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        document.getElementById('table-container').innerHTML = html;
        
        // Attach event listeners for status updates
        document.querySelectorAll('.status-select').forEach(selectEl => {
            selectEl.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-order-id');
                updateOrderStatus(id, e.target);
            });
        });
    }

    function renderChart(counts, maxCount) {
        // Sort by count descending
        const sortedServices = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        // Take top 5
        const top5 = sortedServices.slice(0, 5);

        let html = '';
        top5.forEach(([service, count]) => {
            const percent = (count / maxCount) * 100;
            html += `
                <div class="bar-item">
                    <div class="bar-label">
                        <span>${service}</span>
                        <span>${count}</span>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: 0%" data-target="${percent}%"></div>
                    </div>
                </div>
            `;
        });

        const container = document.getElementById('chart-container');
        container.innerHTML = html;

        // Trigger animation on next frame
        setTimeout(() => {
            const fills = container.querySelectorAll('.bar-fill');
            fills.forEach(fill => {
                fill.style.width = fill.getAttribute('data-target');
            });
        }, 50);
    }

    // Updater moved out of global scope
    function updateOrderStatus(id, selectEl) {
        const newStatus = selectEl.value;
        const orderIndex = rawOrders.findIndex(o => o.id === id);

        if (orderIndex > -1) {
            rawOrders[orderIndex].status = newStatus;
            localStorage.setItem('cs_orders', JSON.stringify(rawOrders));
            
            // Check statusClass construction carefully – some browsers might trip over undefined newStatus but we know options are safe
            let lowerStatus = newStatus.toLowerCase().replace(/\s+/g, '-');
            selectEl.className = `status-select status-${lowerStatus}`;
        }
    }

    // Init
    renderDashboard();
});
