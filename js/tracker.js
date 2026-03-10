document.addEventListener('DOMContentLoaded', () => {
    // Load last order info
    const orders = JSON.parse(localStorage.getItem('cs_orders') || '[]');
    const bookingInfo = document.getElementById('booking-info');

    if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];
        const serviceTags = lastOrder.services.map(s =>
            `<span class="tracker-service-tag">${s}</span>`
        ).join('');

        bookingInfo.innerHTML = `
            <div class="tracker-booking-id">Order ${lastOrder.id}</div>
            <div class="tracker-services-list">${serviceTags}</div>
            <div class="tracker-total">Total: ₹${lastOrder.total.toLocaleString()}</div>
        `;
    } else {
        bookingInfo.innerHTML = `
            <div class="tracker-booking-id">No recent booking found</div>
            <p style="color: var(--text-grey); font-size: 0.9rem;">Book a service to see your tracker here.</p>
        `;
    }

    // Set initial timestamp
    const now = new Date();
    document.getElementById('time-1').textContent = formatTime(now);

    // Timeline progress heights (percentage of total line)
    const progressEl = document.getElementById('timeline-progress');
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ];

    progressEl.style.height = '0%';

    // Step 1 is already active
    setTimeout(() => { progressEl.style.height = '5%'; }, 300);

    // Step 2: Expert Assigned — after 2s
    setTimeout(() => {
        steps[0].classList.remove('active');
        steps[0].classList.add('completed');
        steps[1].classList.add('active');
        steps[1].querySelector('.step-circle').textContent = '✓';
        document.getElementById('time-2').textContent = formatTime(new Date());
        progressEl.style.height = '37%';
    }, 2000);

    // Step 3: On The Way — after 5s
    setTimeout(() => {
        steps[1].classList.remove('active');
        steps[1].classList.add('completed');
        steps[2].classList.add('active');
        steps[2].querySelector('.step-circle').textContent = '✓';
        document.getElementById('time-3').textContent = formatTime(new Date());
        progressEl.style.height = '68%';
    }, 5000);

    // Step 4: Arrived — after 9s
    setTimeout(() => {
        steps[2].classList.remove('active');
        steps[2].classList.add('completed');
        steps[3].classList.add('active');
        steps[3].querySelector('.step-circle').textContent = '✓';
        document.getElementById('time-4').textContent = formatTime(new Date());
        progressEl.style.height = '100%';

        // Generate and display a 4-digit OTP
        let otp = '----';
        if (orders.length > 0) {
            const lastOrder = orders[orders.length - 1];
            // Retrieve existing OTP or generate a new one
            if (!lastOrder.otp) {
                lastOrder.otp = Math.floor(1000 + Math.random() * 9000).toString();
                localStorage.setItem('cs_orders', JSON.stringify(orders));
            }
            otp = lastOrder.otp;
        }
        document.getElementById('arrival-otp').textContent = otp;

        // Show Rate CTA & OTP
        setTimeout(() => {
            document.getElementById('rate-cta').classList.add('visible');
        }, 600);

        // Update order status
        if (orders.length > 0) {
            orders[orders.length - 1].status = 'Completed';
            localStorage.setItem('cs_orders', JSON.stringify(orders));
        }
    }, 9000);

    function formatTime(date) {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    // Attach listener to rate button instead of inline onclick
    const rateBtn = document.getElementById('rate-btn-action');
    if (rateBtn) {
        rateBtn.addEventListener('click', () => {
            window.location.href = 'order-history.html';
        });
    }
});
