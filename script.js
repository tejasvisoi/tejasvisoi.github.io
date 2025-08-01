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
        const bear = document.querySelector('.bear-svg');
        if (!bear) return;

        // Bear morphing animation
        const bearAnimation = () => {
            // Morph body
            gsap.to('.bear-body', {
                duration: 2,
                attr: {
                    d: 'M30 60 Q40 55 50 60 Q60 65 50 75 L30 75 Q20 65 30 60 Z'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });

            // Morph head
            gsap.to('.bear-head', {
                duration: 2,
                attr: {
                    cy: '43'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });

            // Morph ears
            gsap.to('.bear-ear', {
                duration: 1.5,
                attr: {
                    cy: '36'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.2
            });

            // Morph eyes
            gsap.to('.bear-eye', {
                duration: 1.8,
                attr: {
                    r: '2'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.1
            });

            // Morph arms
            gsap.to('.bear-arm', {
                duration: 2.2,
                attr: {
                    d: (i) => i === 0 ? 'M25 65 Q18 58 25 52' : 'M75 65 Q82 58 75 52'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.3
            });

            // Morph legs
            gsap.to('.bear-leg', {
                duration: 1.6,
                attr: {
                    d: (i) => i === 0 ? 'M35 80 L35 88' : 'M65 80 L65 88'
                },
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.2
            });
        };

        // Start animation after a delay
        setTimeout(bearAnimation, 1000);
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