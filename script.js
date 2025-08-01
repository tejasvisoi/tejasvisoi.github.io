// Minimal retro effects for the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Visit tracking functionality
    const lastVisitText = document.getElementById('last-visit-text');
    
    function updateVisitTracker() {
        const now = new Date();
        const lastVisit = localStorage.getItem('lastVisit');
        
        if (lastVisit) {
            const lastVisitDate = new Date(lastVisit);
            const timeDiff = now - lastVisitDate;
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeString = '';
            if (days > 0) {
                timeString = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                timeString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (minutes > 0) {
                timeString = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else {
                timeString = 'just now';
            }
            
            lastVisitText.textContent = `You visited this page ${timeString}`;
        } else {
            lastVisitText.textContent = 'Welcome! This is your first visit.';
        }
        
        localStorage.setItem('lastVisit', now.toISOString());
    }
    
    updateVisitTracker();

    // Enhanced Lumberjack Animation
    const lumberjackAnimation = document.querySelector('.lumberjack-animation');
    const lumberjackCharacter = document.querySelector('.lumberjack-character');
    const letters = document.querySelectorAll('.letter');
    
    // Add hammer to lumberjack character
    const hammer = document.createElement('div');
    hammer.className = 'hammer';
    lumberjackCharacter.appendChild(hammer);
    
    // Create brick pieces falling effect
    function createBrickPieces(x, y, letter) {
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E'];
        const numPieces = 8;
        
        for (let i = 0; i < numPieces; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'absolute';
            piece.style.left = x + 'px';
            piece.style.top = y + 'px';
            piece.style.width = Math.random() * 6 + 4 + 'px';
            piece.style.height = Math.random() * 6 + 4 + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = '1px';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = '11';
            piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
            
            // Random falling animation
            const fallDistance = 100 + Math.random() * 100;
            const fallDuration = 0.8 + Math.random() * 0.4;
            const horizontalDistance = (Math.random() - 0.5) * 60;
            
            piece.style.animation = `brickFall ${fallDuration}s ease-in forwards`;
            piece.style.setProperty('--fall-distance', fallDistance + 'px');
            piece.style.setProperty('--horizontal-distance', horizontalDistance + 'px');
            
            lumberjackAnimation.appendChild(piece);
            
            // Remove piece after animation
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, fallDuration * 1000);
        }
    }
    
    // Add CSS for brick falling effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes brickFall {
            0% {
                opacity: 1;
                transform: translate(0, 0) rotate(0deg);
            }
            50% {
                opacity: 0.8;
                transform: translate(var(--horizontal-distance), calc(var(--fall-distance) * 0.5)) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: translate(var(--horizontal-distance), var(--fall-distance)) rotate(360deg);
            }
        }
        
        .lumberjack-character {
            transition: transform 0.1s ease;
        }
        
        .lumberjack-character.hammering {
            transform: translateY(-50%) scale(1.1);
        }
        
        .letter.building {
            animation: letterHammerEnhanced 0.5s ease-out forwards;
        }
        
        @keyframes letterHammerEnhanced {
            0% {
                opacity: 0;
                transform: scale(0) rotate(-10deg);
                filter: brightness(0.5);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.3) rotate(5deg);
                filter: brightness(1.2);
            }
            100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
                filter: brightness(1);
            }
        }
        
        .letter.brick {
            background: linear-gradient(45deg, #8B4513, #A0522D);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Enhanced animation sequence
    function startLumberjackAnimation() {
        let currentLetterIndex = 0;
        
        // Start the animation sequence
        const animationInterval = setInterval(() => {
            if (currentLetterIndex < letters.length) {
                const letter = letters[currentLetterIndex];
                const letterRect = letter.getBoundingClientRect();
                const characterRect = lumberjackCharacter.getBoundingClientRect();
                
                // Position character near the letter
                const targetX = letterRect.left + letterRect.width / 2 - characterRect.width / 2;
                lumberjackCharacter.style.left = targetX + 'px';
                
                // Hammering animation
                lumberjackCharacter.classList.add('hammering');
                createBrickPieces(targetX + 25, letterRect.top + 20, letter.textContent);
                
                setTimeout(() => {
                    lumberjackCharacter.classList.remove('hammering');
                    letter.classList.add('building', 'brick');
                    
                    setTimeout(() => {
                        letter.classList.remove('building');
                    }, 500);
                }, 300);
                
                currentLetterIndex++;
            } else {
                clearInterval(animationInterval);
                
                // Final flourish
                setTimeout(() => {
                    letters.forEach((letter, index) => {
                        setTimeout(() => {
                            letter.style.animation = 'letterFinalFlourish 0.5s ease-out';
                        }, index * 100);
                    });
                }, 1000);
            }
        }, 800);
    }
    
    // Add final flourish animation
    const finalStyle = document.createElement('style');
    finalStyle.textContent = `
        @keyframes letterFinalFlourish {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
    `;
    document.head.appendChild(finalStyle);
    
    // Start animation after page load
    setTimeout(() => {
        startLumberjackAnimation();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 