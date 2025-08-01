// Minimal retro effects for the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Time spent tracking functionality
    const lastVisitText = document.getElementById('last-visit-text');
    let startTime = Date.now();
    let totalTimeSpent = 0;
    
    // Load total time spent from localStorage
    const savedTime = localStorage.getItem('totalTimeSpent');
    if (savedTime) {
        totalTimeSpent = parseInt(savedTime);
    }
    
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
    
    function updateTimeTracker() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        
        lastVisitText.textContent = `You have spent ${formatTime(totalTime)} here.`;
        
        // Save total time to localStorage
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    }
    
    // Update timer every second
    setInterval(updateTimeTracker, 1000);
    updateTimeTracker(); // Initial update
    
    // Update total time when page is about to unload
    window.addEventListener('beforeunload', function() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    });
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // LoveFrom-style Bear Animation
    function initBearAnimation() {
        const bearContainer = document.querySelector('.bear-container');
        const phonepeLink = document.querySelector('.phonepe-link');
        
        if (!bearContainer || !phonepeLink) return;

        // Position bear container relative to PhonePe link
        const phonepeRect = phonepeLink.getBoundingClientRect();
        
        // Position bear at the start of PhonePe text, relative to the link
        bearContainer.style.left = '0px';
        bearContainer.style.top = '-30px'; // Slightly above the text

        // Walking animation
        const walkAnimation = () => {
            const phonepeWidth = phonepeLink.offsetWidth;
            const bearWidth = 40; // Bear container width
            
            // Walk from left to right across PhonePe
            gsap.to(bearContainer, {
                x: phonepeWidth - bearWidth, // Walk across the width of PhonePe
                duration: 3,
                ease: "power1.inOut",
                onComplete: () => {
                    // Walk back from right to left
                    gsap.to(bearContainer, {
                        x: 0,
                        duration: 3,
                        ease: "power1.inOut",
                        onComplete: walkAnimation // Loop the animation
                    });
                }
            });
        };

        // Bear walking motion (legs and arms)
        const walkingMotion = () => {
            // Animate legs for walking effect
            gsap.to('.bear-leg', {
                duration: 0.3,
                attr: {
                    d: (i) => i === 0 ? 'M35 80 L35 85' : 'M65 80 L65 85'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.15
            });

            // Animate arms for walking effect
            gsap.to('.bear-arm', {
                duration: 0.3,
                attr: {
                    d: (i) => i === 0 ? 'M25 65 Q20 58 25 52' : 'M75 65 Q80 58 75 52'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.15
            });

            // Subtle head bob
            gsap.to('.bear-head', {
                duration: 0.6,
                attr: {
                    cy: '43'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
        };

        // Start animations after a delay
        setTimeout(() => {
            walkAnimation();
            walkingMotion();
        }, 1000);
    }

    // Initialize bear animation when GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initBearAnimation();
    } else {
        // Wait for GSAP to load
        window.addEventListener('load', () => {
            if (typeof gsap !== 'undefined') {
                initBearAnimation();
            }
        });
    }
}); 