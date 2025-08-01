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

    // Enhanced Minecraft Animation
    const minecraftAnimation = document.querySelector('.minecraft-animation');
    const minecraftCharacter = document.querySelector('.minecraft-character');
    const letters = document.querySelectorAll('.letter');
    
    // Add breaking/building effects
    function createBlockEffect(x, y, isBreaking = true) {
        const block = document.createElement('div');
        block.style.position = 'absolute';
        block.style.left = x + 'px';
        block.style.top = y + 'px';
        block.style.width = '8px';
        block.style.height = '8px';
        block.style.background = isBreaking ? '#8B4513' : '#90EE90';
        block.style.borderRadius = '1px';
        block.style.pointerEvents = 'none';
        block.style.zIndex = '11';
        
        // Add breaking animation
        if (isBreaking) {
            block.style.animation = 'blockBreak 0.5s ease-out forwards';
        } else {
            block.style.animation = 'blockBuild 0.3s ease-out forwards';
        }
        
        minecraftAnimation.appendChild(block);
        
        // Remove block after animation
        setTimeout(() => {
            if (block.parentNode) {
                block.parentNode.removeChild(block);
            }
        }, isBreaking ? 500 : 300);
    }
    
    // Add CSS for block effects
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blockBreak {
            0% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.2) rotate(180deg);
            }
            100% {
                opacity: 0;
                transform: scale(0) rotate(360deg);
            }
        }
        
        @keyframes blockBuild {
            0% {
                opacity: 0;
                transform: scale(0) translateY(-10px);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.1) translateY(-5px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .minecraft-character {
            transition: transform 0.1s ease;
        }
        
        .minecraft-character.mining {
            transform: translateY(-50%) scale(1.1);
        }
        
        .minecraft-character.building {
            transform: translateY(-50%) scale(1.05);
        }
        
        .letter.building {
            animation: letterBuildEnhanced 0.5s ease-out forwards;
        }
        
        @keyframes letterBuildEnhanced {
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
    `;
    document.head.appendChild(style);
    
    // Enhanced animation sequence
    function startMinecraftAnimation() {
        let currentLetterIndex = 0;
        
        // Start the animation sequence
        const animationInterval = setInterval(() => {
            if (currentLetterIndex < letters.length) {
                const letter = letters[currentLetterIndex];
                const letterRect = letter.getBoundingClientRect();
                const characterRect = minecraftCharacter.getBoundingClientRect();
                
                // Position character near the letter
                const targetX = letterRect.left + letterRect.width / 2 - characterRect.width / 2;
                minecraftCharacter.style.left = targetX + 'px';
                
                // Mining animation
                minecraftCharacter.classList.add('mining');
                createBlockEffect(targetX + 20, letterRect.top + 10, true);
                
                setTimeout(() => {
                    minecraftCharacter.classList.remove('mining');
                    minecraftCharacter.classList.add('building');
                    
                    // Building animation
                    createBlockEffect(targetX + 20, letterRect.top + 10, false);
                    letter.classList.add('building');
                    
                    setTimeout(() => {
                        minecraftCharacter.classList.remove('building');
                        letter.classList.remove('building');
                    }, 300);
                }, 200);
                
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
        startMinecraftAnimation();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 