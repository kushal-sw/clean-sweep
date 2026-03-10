class RatingWidget {
    constructor(container, serviceName, onRate) {
        this.container = container;
        this.serviceName = serviceName;
        this.onRate = onRate; // callback when a rating is submitted
        this.currentRating = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.classList.add('rating-widget');
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★'; // solid star, colored via CSS
            star.classList.add('rating-star');
            star.dataset.value = i;
            
            star.addEventListener('mouseover', () => this.highlight(i));
            star.addEventListener('mouseout', () => this.highlight(this.currentRating));
            star.addEventListener('click', () => this.rate(i));
            
            this.container.appendChild(star);
        }
        this.highlight(0); // initial: all grey
    }

    highlight(val) {
        const stars = this.container.querySelectorAll('.rating-star');
        stars.forEach((star, index) => {
            if (index < val) {
                star.classList.add('active-star');
            } else {
                star.classList.remove('active-star');
            }
        });
    }

    rate(val) {
        if (this.currentRating > 0) return; // Prevent multiple ratings for the same widget instance

        this.currentRating = val;
        this.highlight(val);
        
        // Save to localStorage
        const ratings = JSON.parse(localStorage.getItem('cs_ratings') || '{}');
        const current = ratings[this.serviceName] || { sum: 0, count: 0 };
        ratings[this.serviceName] = {
            sum: current.sum + val,
            count: current.count + 1
        };
        localStorage.setItem('cs_ratings', JSON.stringify(ratings));
        
        // Disable further interactions on these stars
        const stars = this.container.querySelectorAll('.rating-star');
        stars.forEach(star => {
            star.style.pointerEvents = 'none';
        });

        // Add a small animation for feedback
        this.container.style.transform = 'scale(1.05)';
        setTimeout(() => this.container.style.transform = 'scale(1)', 200);

        if (this.onRate) this.onRate(val);
    }
}
