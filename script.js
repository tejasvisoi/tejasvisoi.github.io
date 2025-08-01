// Enhanced animations and interactions for retro portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for floating circles
    const circles = document.querySelectorAll('.floating-circle');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            circle.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
        });
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Interactive hover effects for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing effect for the main name (optional)
    const mainName = document.querySelector('.main-name');
    if (mainName) {
        const originalText = mainName.textContent;
        mainName.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                mainName.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 150);
            }
        };
        
        // Start typing after initial animations
        setTimeout(typeWriter, 2000);
    }

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.main-content, .side-nav, .social-links');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Mouse trail effect (subtle)
    let mouseTrail = [];
    const maxTrailLength = 5;
    
    window.addEventListener('mousemove', function(e) {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            timestamp: Date.now()
        });
        
        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
    });

    // Background grid animation
    const gridLines = document.querySelector('.grid-lines');
    if (gridLines) {
        let offset = 0;
        
        function animateGrid() {
            offset += 0.5;
            gridLines.style.backgroundPosition = `${offset}px ${offset}px`;
            requestAnimationFrame(animateGrid);
        }
        
        animateGrid();
    }

    // Year counter animation
    const yearElement = document.querySelector('.year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        let displayYear = 2020;
        
        const yearCounter = setInterval(() => {
            if (displayYear < currentYear) {
                displayYear++;
                yearElement.textContent = displayYear;
            } else {
                clearInterval(yearCounter);
            }
        }, 100);
    }

    // Add CSS for additional animations
    const additionalCSS = `
        .animate-in {
            animation: slideInFromBottom 0.8s ease-out forwards;
        }
        
        @keyframes slideInFromBottom {
            0% {
                opacity: 0;
                transform: translateY(50px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .main-content {
            transition: transform 0.3s ease;
        }
        
        .main-content:hover {
            transform: scale(1.02);
        }
        
        .floating-circle {
            transition: all 0.3s ease;
        }
        
        .floating-circle:hover {
            transform: scale(1.2) !important;
            background: rgba(139, 69, 19, 0.2) !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);

    // Add subtle cursor trail effect
    const cursorTrail = document.createElement('div');
    cursorTrail.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: rgba(139, 69, 19, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
    `;
    document.body.appendChild(cursorTrail);

    window.addEventListener('mousemove', function(e) {
        cursorTrail.style.left = e.clientX - 3 + 'px';
        cursorTrail.style.top = e.clientY - 3 + 'px';
    });

    // Add hover effect to cursor trail
    document.addEventListener('mouseenter', function() {
        cursorTrail.style.transform = 'scale(1.5)';
        cursorTrail.style.background = 'rgba(139, 69, 19, 0.6)';
    });

    document.addEventListener('mouseleave', function() {
        cursorTrail.style.transform = 'scale(1)';
        cursorTrail.style.background = 'rgba(139, 69, 19, 0.3)';
    });
}); 