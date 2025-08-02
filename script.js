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
    
    function getQuirkyMessage(totalSeconds) {
        if (totalSeconds <= 10) {
            return "JUST GETTING STARTED? 👀";
        } else if (totalSeconds <= 30) {
            return "30 SECONDS ALREADY? THAT'S COMMITMENT! ⏰";
        } else if (totalSeconds <= 60) {
            return "YOU'VE OFFICIALLY SPENT MORE TIME HERE THAN ON SOME HINGE DATES 💔";
        } else if (totalSeconds <= 300) {
            return "OKAY, NOW WE'RE BASICALLY FRIENDS 🤝";
        } else {
            return "RENT'S DUE NEXT WEEK IF YOU STAY LONGER 🏠";
        }
    }

    function updateTimeTracker() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        const totalSeconds = Math.floor(totalTime / 1000);
        
        lastVisitText.textContent = `You have spent ${formatTime(totalTime)} here.`;
        
        // Save total time to localStorage
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    }

    // Add hover interactions for the time tracker
    function addHoverInteractions() {
        // Add CSS for smooth transitions
        const style = document.createElement('style');
        style.textContent = `
            .visit-tracker {
                position: relative;
                overflow: hidden;
                height: 24px;
            }
            #last-visit-text {
                transition: transform 0.3s ease;
                display: block;
            }
            #last-visit-text.hovered {
                transform: translateY(-100%);
            }
            #quirky-text {
                position: absolute;
                top: 100%;
                left: 0;
                transform: translateY(0);
                transition: transform 0.3s ease;
                font-family: 'Technor', 'Space Mono', monospace;
                font-size: 16px;
                color: #888888;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
        `;
        document.head.appendChild(style);
        
        let isHovering = false;
        let quirkyText = null;
        
        lastVisitText.addEventListener('mouseenter', function() {
            if (isHovering) return; // Prevent multiple triggers
            isHovering = true;
            
            const currentTime = Date.now();
            const sessionTime = currentTime - startTime;
            const totalTime = totalTimeSpent + sessionTime;
            const totalSeconds = Math.floor(totalTime / 1000);
            const quirkyMessage = getQuirkyMessage(totalSeconds);
            
            // Create quirky text element
            quirkyText = document.createElement('span');
            quirkyText.id = 'quirky-text';
            quirkyText.textContent = quirkyMessage;
            
            // Add quirky text to container
            const container = lastVisitText.parentElement;
            container.appendChild(quirkyText);
            
            // Trigger animations
            requestAnimationFrame(() => {
                lastVisitText.classList.add('hovered');
                quirkyText.style.transform = 'translateY(-100%)';
            });
        });
        
        lastVisitText.addEventListener('mouseleave', function() {
            isHovering = false;
            
            // Reset original text
            lastVisitText.classList.remove('hovered');
            
            // Remove quirky text after animation
            if (quirkyText) {
                quirkyText.style.transform = 'translateY(0)';
                setTimeout(() => {
                    if (quirkyText && quirkyText.parentElement) {
                        quirkyText.remove();
                    }
                }, 300);
            }
        });
    }
    
    // Update timer every second
    setInterval(updateTimeTracker, 1000);
    updateTimeTracker(); // Initial update
    
    // Add hover interactions
    addHoverInteractions();
    
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
        const visitTracker = document.querySelector('.visit-tracker');
        
        if (!catContainer || !visitTracker) return;

        const catSprite = catContainer.querySelector('.cat-sprite');

        // Position cat 10px below the visit tracker text
        const visitTrackerRect = visitTracker.getBoundingClientRect();
        const relativeTop = visitTrackerRect.bottom + 10;
        catContainer.style.top = relativeTop + 'px';

        // Walking animation across the entire screen
        const walkAnimation = () => {
            const screenWidth = window.innerWidth;
            const catWidth = 60;
            
            // Determine animation duration based on screen size
            let animationDuration;
            if (screenWidth >= 1440) {
                // Large desktop screens (1440px and above) - longer animation
                animationDuration = 180; // 3 minutes
            } else {
                // Tablet and below devices - 1 minute
                animationDuration = 60; // 1 minute
            }
            
            // Show cat and reset position
            gsap.set(catContainer, { 
                x: screenWidth,
                opacity: 1 
            });
            gsap.set(catSprite, { scaleX: -1 }); // Face left
            
            // Walk from right to left across entire screen
            gsap.to(catContainer, {
                x: -(catWidth),
                duration: animationDuration, // Responsive duration
                ease: "none", // Linear animation
                onComplete: () => {
                    // Small pause then restart
                    setTimeout(() => {
                        walkAnimation();
                    }, 1000);
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