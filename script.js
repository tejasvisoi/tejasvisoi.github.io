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

    // Minecraft Building Animation
    function initMinecraftAnimation() {
        const minecraftContainer = document.querySelector('.minecraft-container');
        const phonepeLink = document.querySelector('.phonepe-link');
        
        if (!minecraftContainer || !phonepeLink) return;

        // Position Minecraft character at the start of PhonePe text
        minecraftContainer.style.left = '0px';

        // Building animation - character moves across PhonePe and builds
        const buildingAnimation = () => {
            const phonepeWidth = phonepeLink.offsetWidth;
            const charWidth = 50; // Minecraft character width
            
            // Move from left to right across PhonePe
            gsap.to(minecraftContainer, {
                x: phonepeWidth - charWidth,
                duration: 4,
                ease: "power1.inOut",
                onComplete: () => {
                    // Move back from right to left
                    gsap.to(minecraftContainer, {
                        x: 0,
                        duration: 4,
                        ease: "power1.inOut",
                        onComplete: buildingAnimation // Loop the animation
                    });
                }
            });
        };

        // Minecraft character building motion
        const buildingMotion = () => {
            // Animate arms for building effect (hammering motion)
            gsap.to('.char-arm', {
                duration: 0.4,
                rotation: 15,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.2,
                transformOrigin: "top center"
            });

            // Animate legs for slight movement
            gsap.to('.char-leg', {
                duration: 0.6,
                y: -2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.3
            });

            // Animate head for building focus
            gsap.to('.char-head', {
                duration: 0.8,
                y: -1,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });

            // Animate body for building motion
            gsap.to('.char-body', {
                duration: 0.5,
                scaleY: 1.05,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1
            });
        };

        // Start animations after a delay
        setTimeout(() => {
            buildingAnimation();
            buildingMotion();
        }, 1000);
    }

    // Initialize Minecraft animation when GSAP is loaded
    if (typeof gsap !== 'undefined') {
        initMinecraftAnimation();
    } else {
        // Wait for GSAP to load
        window.addEventListener('load', () => {
            if (typeof gsap !== 'undefined') {
                initMinecraftAnimation();
            }
        });
    }
}); 