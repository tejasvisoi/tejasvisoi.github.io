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

        // Keyboard navigation
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            this.pauseAutoPlay();
        }, { passive: true });
        
        this.track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(touchStartX, touchEndX);
            this.resumeAutoPlay();
        });

        // Auto play
        this.startAutoPlay();
        
        // Pause auto play on hover or focus
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.resumeAutoPlay());
        this.carousel.addEventListener('focusin', () => this.pauseAutoPlay());
        this.carousel.addEventListener('focusout', () => this.resumeAutoPlay());
    }

    createDots() {
        this.dots = this.slides.map((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            this.dotsNav.appendChild(dot);
            return dot;
        });
    }

    updateDots() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
            dot.setAttribute('aria-current', i === this.currentSlide ? 'true' : 'false');
        });
    }

    updateSlides() {
        this.slides.forEach((slide, i) => {
            // Remove all state classes
            slide.classList.remove('active', 'prev', 'next');
            
            // Calculate the position relative to current slide
            if (i === this.currentSlide) {
                slide.classList.add('active');
            } else if (i === this.getPrevIndex()) {
                slide.classList.add('prev');
            } else if (i === this.getNextIndex()) {
                slide.classList.add('next');
            }

            // Update transform for smooth transition
            const offset = i - this.currentSlide;
            slide.style.transform = `translateX(${offset * 100}%)`;
        });

        // Update ARIA labels
        this.slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== this.currentSlide);
        });
    }

    getPrevIndex() {
        return (this.currentSlide - 1 + this.slidesLength) % this.slidesLength;
    }

    getNextIndex() {
        return (this.currentSlide + 1) % this.slidesLength;
    }

    nextSlide() {
        this.currentSlide = this.getNextIndex();
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = this.getPrevIndex();
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

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 2000);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    resumeAutoPlay() {
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }
}); 