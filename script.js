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
        const phonepeLink = document.querySelector('.phonepe-link');
        const fallingBricksContainer = document.querySelector('.falling-bricks-container');
        
        if (!phonepeLink || !fallingBricksContainer) return;

        // Create falling bricks
        function createFallingBrick() {
            const brick = document.createElement('div');
            brick.className = 'falling-brick';
            
            // Random position within PhonePe text area
            const phonepeWidth = phonepeLink.offsetWidth;
            const randomX = Math.random() * phonepeWidth;
            
            brick.style.left = randomX + 'px';
            brick.style.top = '-10px';
            
            fallingBricksContainer.appendChild(brick);
            
            // Animate brick falling
            gsap.to(brick, {
                y: 100,
                rotation: Math.random() * 360,
                duration: 2 + Math.random() * 2,
                ease: "power2.in",
                onComplete: () => {
                    fallingBricksContainer.removeChild(brick);
                }
            });
        }

        // Minecraft character building motion (stationary characters)
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

            // Animate hammer for hammering effect
            gsap.to('.hammer-handle', {
                duration: 0.3,
                rotation: 25,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.15,
                transformOrigin: "right center"
            });

            gsap.to('.hammer-head', {
                duration: 0.3,
                rotation: 25,
                ease: "power2.inOut",
                yoyo: true,
                repeat: -1,
                stagger: 0.15,
                transformOrigin: "right center"
            });
        };

        // Start animations after a delay
        setTimeout(() => {
            buildingMotion();
            
            // Create falling bricks periodically
            setInterval(createFallingBrick, 800);
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