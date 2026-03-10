document.addEventListener('DOMContentLoaded', () => {
    // 1. Define Services Data
    const services = [
        {
            id: 'service-general',
            name: 'General Cleaning',
            image: '../images/service-general.png',
            basePricePerHour: 199,
            minTime: 1,
            maxTime: 6
        },
        {
            id: 'service-dishwashing',
            name: 'Dishwashing',
            image: '../images/service-dishwashing.png',
            basePricePerHour: 149,
            minTime: 1,
            maxTime: 4
        },
        {
            id: 'service-laundry',
            name: 'Laundry',
            image: '../images/service-laundry.png',
            basePricePerHour: 149,
            minTime: 1,
            maxTime: 4
        },
        {
            id: 'service-kitchen-prep',
            name: 'Kitchen Prep',
            image: '../images/service-kitchen-prep.png',
            basePricePerHour: 199,
            minTime: 1,
            maxTime: 5
        },
        {
            id: 'service-bathroom',
            name: 'Bathroom Cleaning',
            image: '../images/service-bathroom.png',
            basePricePerHour: 249,
            minTime: 1,
            maxTime: 3
        },
        {
            id: 'service-kitchen-clean',
            name: 'Kitchen Cleaning',
            image: '../images/service-kitchen-prep.png', // reusing prep image from index
            basePricePerHour: 249,
            minTime: 1,
            maxTime: 4
        }
    ];

    // State
    const cart = {};

    // Elements
    const gridEl = document.getElementById('services-grid');
    const cartListEl = document.getElementById('cart-list');
    const totalTimeEl = document.getElementById('total-time');
    const totalPriceEl = document.getElementById('total-price');
    const bookBtn = document.getElementById('book-btn');

    // 2. Render Service Cards
    function renderServices() {
        gridEl.innerHTML = '';
        const ratings = JSON.parse(localStorage.getItem('cs_ratings') || '{}');

        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('service-booking-card');

            // Default time state
            let currentTime = service.minTime;

            // Rating logic
            const ratingData = ratings[service.name];
            let ratingHtml = '';
            if (ratingData && ratingData.count > 0) {
                const avg = (ratingData.sum / ratingData.count).toFixed(1);
                ratingHtml = `
                    <div class="service-rating-display">
                        ★ ${avg} <span class="rating-count">(${ratingData.count})</span>
                    </div>
                `;
            } else {
                ratingHtml = `
                    <div class="service-rating-display" style="color: #ccc;">
                        ☆ <span class="rating-count">New</span>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="service-booking-img">
                    <img src="${service.image}" alt="${service.name}">
                </div>
                <div class="service-booking-content">
                    <h3 class="service-booking-title">${service.name}</h3>
                    ${ratingHtml}
                    <div class="service-booking-rate">₹${service.basePricePerHour}/hr</div>
                    
                    <div class="service-controls">
                        <div class="time-selector">
                            <button class="time-btn minus-btn" data-id="${service.id}">-</button>
                            <span class="time-display" id="time-${service.id}">${currentTime}h</span>
                            <button class="time-btn plus-btn" data-id="${service.id}">+</button>
                        </div>
                        <button class="add-service-btn" id="btn-${service.id}" data-id="${service.id}">Add</button>
                    </div>
                </div>
            `;
            gridEl.appendChild(card);

            // Time Selector Logic
            const minusBtn = card.querySelector('.minus-btn');
            const plusBtn = card.querySelector('.plus-btn');
            const addBtn = card.querySelector('.add-service-btn');
            const timeDisplay = card.querySelector(`#time-${service.id}`);

            minusBtn.addEventListener('click', () => {
                if (currentTime > service.minTime) {
                    currentTime--;
                    timeDisplay.textContent = `${currentTime}h`;
                    if(cart[service.id]) {
                        addToCart(service.id, currentTime); // update cart if already added
                    }
                }
            });

            plusBtn.addEventListener('click', () => {
                if (currentTime < service.maxTime) {
                    currentTime++;
                    timeDisplay.textContent = `${currentTime}h`;
                    if(cart[service.id]) {
                        addToCart(service.id, currentTime); // update cart if already added
                    }
                }
            });

            // Add button logic
            addBtn.addEventListener('click', () => {
                if (cart[service.id]) {
                    removeFromCart(service.id);
                    addBtn.textContent = 'Add';
                    addBtn.classList.remove('added');
                } else {
                    addToCart(service.id, currentTime);
                    addBtn.textContent = 'Added ✓';
                    addBtn.classList.add('added');
                }
            });
        });
    }

    // 3. Cart Functions
    function addToCart(serviceId, time) {
        const service = services.find(s => s.id === serviceId);
        cart[serviceId] = {
            ...service,
            time: time,
            cost: time * service.basePricePerHour
        };
        updateEstimator();
    }

    function removeFromCart(serviceId) {
        delete cart[serviceId];
        updateEstimator();
        
        // Update button UI if triggered from elsewhere
        const addBtn = document.getElementById(`btn-${serviceId}`);
        if(addBtn) {
            addBtn.textContent = 'Add';
            addBtn.classList.remove('added');
        }
    }

    // 4. Update Price Estimator UI
    function updateEstimator() {
        const cartItems = Object.values(cart);
        
        if (cartItems.length === 0) {
            cartListEl.innerHTML = '<div class="empty-cart-msg">No services selected yet. Add services to estimate price.</div>';
            totalTimeEl.textContent = '0 hrs';
            totalPriceEl.textContent = '₹0';
            bookBtn.disabled = true;
            return;
        }

        let html = '';
        let totalTime = 0;
        let totalPrice = 0;

        cartItems.forEach(item => {
            totalTime += item.time;
            totalPrice += item.cost;

            html += `
                <div class="cart-item">
                    <div>
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-time">${item.time} hrs x ₹${item.basePricePerHour}/hr</div>
                    </div>
                    <div class="cart-item-price">₹${item.cost}</div>
                </div>
            `;
        });

        cartListEl.innerHTML = html;
        totalTimeEl.textContent = `${totalTime} hrs`;
        totalPriceEl.textContent = `₹${totalPrice}`;
        bookBtn.disabled = false;
    }

    // 5. Checkout Navigation
    bookBtn.addEventListener('click', () => {
        // Save to sessionStorage
        sessionStorage.setItem('cleansweepCart', JSON.stringify({
            items: cart,
            totalTime: parseInt(totalTimeEl.textContent),
            totalPrice: parseInt(totalPriceEl.textContent.replace('₹', ''))
        }));
        window.location.href = 'checkout.html';
    });

    // Initialize
    renderServices();
});
