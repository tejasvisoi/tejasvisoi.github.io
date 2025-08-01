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

    // Cat Animation - End to End Screen Walking
    function initCatAnimation() {
        const catContainer = document.querySelector('.cat-container');
        
        if (!catContainer) return;

        const catSprite = catContainer.querySelector('.cat-sprite');
        let isFlipped = false; // Track flip state

        // Walking animation across the entire screen
        const walkAnimation = () => {
            const screenWidth = window.innerWidth;
            const catWidth = 60;
            
            // Start from right edge (off-screen)
            catContainer.style.left = screenWidth + 'px';
            
            // Walk from right to left across entire screen
            gsap.to(catContainer, {
                x: -(screenWidth + catWidth),
                duration: 20, // 20 seconds to cross screen
                ease: "none", // Linear animation
                onUpdate: function() {
                    // Flip cat to face left when starting
                    if (this.progress() < 0.05 && !isFlipped) {
                        gsap.to(catSprite, {
                            scaleX: -1,
                            duration: 0.2
                        });
                        isFlipped = true;
                    }
                },
                onComplete: () => {
                    // Reset position to right edge and continue
                    setTimeout(() => {
                        walkAnimation(); // Loop the animation
                    }, 500); // Small pause before restarting
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