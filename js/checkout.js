document.addEventListener('DOMContentLoaded', () => {
    const billContent = document.getElementById('bill-content');
    const confirmBtn = document.getElementById('confirm-book-btn');

    // Retrieve and populate selected dates from schedule.html
    const storedDatesStr = sessionStorage.getItem('cs_selectedDates');
    const dateInput = document.getElementById('checkout-date');
    if (storedDatesStr && dateInput) {
        try {
            const datesArr = JSON.parse(storedDatesStr);
            if (Array.isArray(datesArr) && datesArr.length > 0) {
                const currentYear = new Date().getFullYear();
                dateInput.value = `March ${datesArr.join(', ')}, ${currentYear}`;
            }
        } catch (e) { }
    }

    // Retrieve cart from sessionStorage
    const cartDataStr = sessionStorage.getItem('cleansweepCart');

    if (!cartDataStr) {
        billContent.innerHTML = '<div class="empty-bill-msg">No services selected. Please go back to services page.</div>';
        confirmBtn.style.display = 'none';
        return;
    }

    const cartData = JSON.parse(cartDataStr);
    const items = Object.values(cartData.items);

    if (items.length === 0) {
        billContent.innerHTML = '<div class="empty-bill-msg">No services selected. Please go back to services page.</div>';
        confirmBtn.style.display = 'none';
        return;
    }

    // Generate Bill HTML
    let html = '<div class="bill-items">';
    items.forEach(item => {
        html += `
            <div class="bill-item">
                <div class="bill-item-details">
                    <span class="bill-item-name">${item.name}</span>
                    <span class="bill-item-calc">${item.time} hrs @ ₹${item.basePricePerHour}/hr</span>
                </div>
                <span class="bill-item-price">₹${item.cost}</span>
            </div>
        `;
    });
    html += '</div>';

    // Fixed convenience/tax fees for realistic bill
    const subtotal = cartData.totalPrice;
    const visitingCharge = 49;
    const taxes = Math.round(subtotal * 0.18); // 18% GST
    const finalTotal = subtotal + visitingCharge + taxes;

    html += `
        <div class="bill-summary-row">
            <span>Subtotal (${cartData.totalTime} hrs)</span>
            <span>₹${subtotal}</span>
        </div>
        <div class="bill-summary-row">
            <span>Visiting Charge</span>
            <span>₹${visitingCharge}</span>
        </div>
        <div class="bill-summary-row">
            <span>Taxes & Fees</span>
            <span>₹${taxes}</span>
        </div>
        <div class="bill-total">
            <span>Total Amount</span>
            <span>₹${finalTotal}</span>
        </div>
    `;

    billContent.innerHTML = html;

    // Handle confirm
    confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementById('checkout-form');
        if (validateCheckoutForm()) {
            // Save order to localStorage (F2)
            const serviceNames = items.map(i => i.name);
            const customerName = document.getElementById('checkout-name').value.trim();
            const serviceDate = document.getElementById('checkout-date').value;
            const serviceTime = document.getElementById('checkout-time').value;

            const order = {
                id: 'CS-' + Date.now().toString().slice(-6),
                customerName: customerName,
                date: serviceDate,
                time: serviceTime,
                services: serviceNames,
                total: finalTotal,
                status: 'Confirmed',
                isInstant: sessionStorage.getItem('cs_isInstant') === 'true'
            };

            const orders = JSON.parse(localStorage.getItem('cs_orders') || '[]');
            orders.push(order);
            localStorage.setItem('cs_orders', JSON.stringify(orders));

            showToast('Booking Confirmed! Your expert will contact you shortly.', 'success');
            sessionStorage.removeItem('cleansweepCart');
            sessionStorage.removeItem('cs_isInstant');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            // Inline errors are already shown by validateCheckoutForm()
        }
    });

    // --- Custom Form Validation (F9) ---
    function setError(id, msg) {
        const el = document.getElementById(id);
        const input = document.getElementById(id.replace('-error', '').replace('checkout-', 'checkout-'));
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
    ['checkout-name', 'checkout-phone', 'checkout-date', 'checkout-time', 'checkout-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearError(id + '-error'));
        }
    });

    function validateCheckoutForm() {
        let valid = true;

        const name = document.getElementById('checkout-name').value.trim();
        if (name.length < 3) {
            setError('name-error', 'Name must be at least 3 characters.');
            valid = false;
        } else { clearError('name-error'); }

        const phone = document.getElementById('checkout-phone').value.trim();
        if (!/^[0-9]{10}$/.test(phone)) {
            setError('phone-error', 'Enter a valid 10-digit phone number.');
            valid = false;
        } else { clearError('phone-error'); }

        const date = document.getElementById('checkout-date').value;
        if (!date) {
            setError('date-error', 'Please select a service date from the Schedule page.');
            valid = false;
        } else { clearError('date-error'); }

        const time = document.getElementById('checkout-time').value;
        if (!time) {
            setError('time-error', 'Please select a service time.');
            valid = false;
        } else { clearError('time-error'); }

        const address = document.getElementById('checkout-address').value.trim();
        if (address.length < 20) {
            setError('address-error', 'Address must be at least 20 characters.');
            valid = false;
        } else { clearError('address-error'); }

        return valid;
    }
});
