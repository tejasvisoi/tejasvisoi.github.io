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

    // Cat Animation
    function initCatAnimation() {
        const catContainer = document.querySelector('.cat-container');
        const phonepeLink = document.querySelector('.phonepe-link');
        
        if (!catContainer || !phonepeLink) return;

        // Position cat at the start of "making things"
        catContainer.style.left = '0px';

        // Walking animation around the text
        const walkAnimation = () => {
            const textWidth = phonepeLink.offsetWidth;
            const catWidth = 60; // Cat container width
            const catSprite = catContainer.querySelector('.cat-sprite');
            
            // Walk from left to right across "making things"
            gsap.to(catContainer, {
                x: textWidth - catWidth,
                duration: 30, // 30 seconds to reach one end
                ease: "none", // Linear animation
                onComplete: () => {
                    // Flip cat to face right (unflip)
                    gsap.to(catSprite, {
                        scaleX: 1,
                        duration: 0.2
                    });
                    
                    // Walk back from right to left
                    gsap.to(catContainer, {
                        x: 0,
                        duration: 30, // 30 seconds to reach other end
                        ease: "none", // Linear animation
                        onComplete: () => {
                            // Flip cat back to face left
                            gsap.to(catSprite, {
                                scaleX: -1,
                                duration: 0.2,
                                onComplete: walkAnimation // Loop the animation
                            });
                        }
                    });
                }
            });
        };

        // Start walking animation after a delay
        setTimeout(() => {
            walkAnimation();
        }, 1000);
    }

    // Initialize cat animation when GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initCatAnimation();
    } else {
        // Wait for GSAP to load
        window.addEventListener('load', () => {
            if (typeof gsap !== 'undefined') {
                initCatAnimation();
            }
        });
    }
}); 