// Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const cursor = document.querySelector('.custom-cursor');
    const lastVisitText = document.getElementById('last-visit-text');
    const catContainer = document.querySelector('.cat-container');
    const visitTracker = document.querySelector('.visit-tracker');
    
    // State variables
    let startTime = Date.now();
    let totalTimeSpent = parseInt(localStorage.getItem('totalTimeSpent')) || 0;
    let originalText = '';
    window.isHovering = false;
    
    // Custom cursor functionality
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .main-link, .past-work-link, .social-link, #last-visit-text');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
    
    // Time formatting utility
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    // Quirky message generator
    function getQuirkyMessage(totalSeconds) {
        if (totalSeconds <= 10) return "JUST GETTING STARTED? 👀";
        if (totalSeconds <= 30) return "30 SECONDS ALREADY? THAT'S COMMITMENT! ⏰";
        if (totalSeconds <= 60) return "YOU'VE OFFICIALLY SPENT MORE TIME HERE THAN ON SOME HINGE DATES 💔";
        if (totalSeconds <= 300) return "OKAY, NOW WE'RE BASICALLY FRIENDS 🤝";
        return "RENT'S DUE NEXT WEEK IF YOU STAY LONGER 🏠";
    }
    
    // Time tracker update
    function updateTimeTracker() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        
        if (!window.isHovering) {
            lastVisitText.textContent = `You have spent ${formatTime(totalTime)} here.`;
        }
        
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    }
    
    // Hover interactions for time tracker
    if (lastVisitText) {
        lastVisitText.addEventListener('mouseenter', function() {
            window.isHovering = true;
            const currentTime = Date.now();
            const sessionTime = currentTime - startTime;
            const totalTime = totalTimeSpent + sessionTime;
            const totalSeconds = Math.floor(totalTime / 1000);
            
            originalText = this.textContent;
            this.textContent = getQuirkyMessage(totalSeconds);
        });
        
        lastVisitText.addEventListener('mouseleave', function() {
            window.isHovering = false;
            this.textContent = originalText;
        });
    }
    
    // Cat animation
    function initCatAnimation() {
        if (!catContainer || !visitTracker || typeof gsap === 'undefined') return;
        
        const catSprite = catContainer.querySelector('.cat-sprite');
        if (!catSprite) return;
        
        // Position cat below visit tracker
        const visitTrackerRect = visitTracker.getBoundingClientRect();
        catContainer.style.top = (visitTrackerRect.bottom + 10) + 'px';
        
        function walkAnimation() {
            const screenWidth = window.innerWidth;
            const catWidth = 60;
            const animationDuration = screenWidth >= 1440 ? 180 : 60; // 3 min on large screens, 1 min on others
            
            gsap.set(catContainer, { x: screenWidth, opacity: 1 });
            gsap.set(catSprite, { scaleX: -1 });
            
            gsap.to(catContainer, {
                x: -(catWidth),
                duration: animationDuration,
                ease: "none",
                onComplete: () => {
                    setTimeout(walkAnimation, 1000);
                }
            });
        }
        
        setTimeout(walkAnimation, 1000);
    }
    
    // Initialize functionality
    updateTimeTracker();
    setInterval(updateTimeTracker, 1000);
    
    // Initialize cat animation
    if (typeof gsap !== 'undefined') {
        initCatAnimation();
    } else {
        window.addEventListener('load', initCatAnimation);
    }
    
    // Save time on page unload
    window.addEventListener('beforeunload', function() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    });
}); 