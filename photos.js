class Carousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = element.parentElement.querySelector('.carousel-next');
        this.prevButton = element.parentElement.querySelector('.carousel-prev');
        this.dotsNav = element.parentElement.querySelector('.carousel-dots');
        
        this.slideWidth = this.slides[0].getBoundingClientRect().width;
        this.currentSlide = 0;
        this.slidesLength = this.slides.length;
        
        this.createDots();
        this.updateDots();
        this.updateSlides();
        
        // Event listeners
        this.nextButton.addEventListener('click', () => this.nextSlide());
        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.dotsNav.addEventListener('click', e => {
            if (e.target.classList.contains('carousel-dot')) {
                const targetDot = e.target;
                const targetIndex = this.dots.indexOf(targetDot);
                this.goToSlide(targetIndex);
            }
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
        });

        // Auto play
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        
        // Pause auto play on hover
        this.carousel.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
        });
    }

    createDots() {
        this.dots = this.slides.map((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            this.dotsNav.appendChild(dot);
            return dot;
        });
    }

    updateDots() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }

    updateSlides() {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
            const offset = i - this.currentSlide;
            const translateX = offset * 100;
            slide.style.transform = `translateX(${translateX}%)`;
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slidesLength;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slidesLength) % this.slidesLength;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.updateDots();
        this.updateSlides();
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
}); 