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
            
            lastVisitText.textContent = `Nice to see you here again, you last visited this page ${timeString}.`;
        } else {
            lastVisitText.textContent = 'Welcome! This is your first visit.';
        }
        
        localStorage.setItem('lastVisit', now.toISOString());
    }
    
    updateVisitTracker();

    // PhonePe Brick Animation
    const phonepeLink = document.querySelector('.phonepe-link');
    const svg = document.querySelector('.phonepe-svg');
    
    // Letter definitions for PhonePe
    const letters = {
        'P': [
            [0,0, 1,0, 1,1, 0,1, 0,0], // Vertical line
            [1,0, 2,0, 2,0.5, 1,0.5, 1,0], // Top horizontal
            [1,0.5, 2,0.5, 2,1, 1,1, 1,0.5] // Bottom curve
        ],
        'h': [
            [0,0, 0.3,0, 0.3,1, 0,1, 0,0], // Vertical line
            [0.3,0.5, 1,0.5, 1,0.7, 0.3,0.7, 0.3,0.5], // Middle horizontal
            [0.3,0.7, 1,0.7, 1,1, 0.3,1, 0.3,0.7] // Bottom curve
        ],
        'o': [
            [0.2,0.2, 0.8,0.2, 0.8,0.8, 0.2,0.8, 0.2,0.2] // Circle
        ],
        'n': [
            [0,0.5, 0.3,0.5, 0.3,1, 0,1, 0,0.5], // Vertical line
            [0.3,0.5, 0.7,0.5, 0.7,0.7, 0.3,0.7, 0.3,0.5], // Middle horizontal
            [0.3,0.7, 0.7,0.7, 0.7,1, 0.3,1, 0.3,0.7] // Bottom curve
        ],
        'e': [
            [0.2,0.3, 0.8,0.3, 0.8,0.5, 0.2,0.5, 0.2,0.3], // Top horizontal
            [0.2,0.5, 0.8,0.5, 0.8,0.7, 0.2,0.7, 0.2,0.5], // Middle horizontal
            [0.2,0.7, 0.8,0.7, 0.8,0.9, 0.2,0.9, 0.2,0.7], // Bottom horizontal
            [0.2,0.3, 0.2,0.9] // Vertical line
        ]
    };
    
    const word = 'PhonePe';
    const brickSize = 8;
    const letterSpacing = 20;
    let currentBrickIndex = 0;
    let allBricks = [];
    
    function createBricks() {
        let xOffset = 50;
        
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const letterBricks = letters[letter] || letters['P']; // Default to P if letter not found
            
            for (let j = 0; j < letterBricks.length; j++) {
                const path = letterBricks[j];
                
                // Create bricks along the path
                for (let k = 0; k < path.length - 2; k += 2) {
                    const x1 = path[k] * brickSize + xOffset;
                    const y1 = path[k + 1] * brickSize + 100;
                    const x2 = path[k + 2] * brickSize + xOffset;
                    const y2 = path[k + 3] * brickSize + 100;
                    
                    // Create multiple bricks along the line
                    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const numBricks = Math.max(1, Math.floor(distance / brickSize));
                    
                    for (let b = 0; b < numBricks; b++) {
                        const t = b / numBricks;
                        const x = x1 + (x2 - x1) * t;
                        const y = y1 + (y2 - y1) * t;
                        
                        const brick = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        brick.setAttribute('x', x - brickSize/2);
                        brick.setAttribute('y', y - brickSize/2);
                        brick.setAttribute('width', brickSize);
                        brick.setAttribute('height', brickSize);
                        brick.setAttribute('class', 'brick');
                        brick.style.animationDelay = `${currentBrickIndex * 0.1}s`;
                        
                        svg.appendChild(brick);
                        allBricks.push(brick);
                        currentBrickIndex++;
                    }
                }
            }
            
            xOffset += letterSpacing + (letter === 'P' ? 30 : 25);
        }
    }
    
    function startBrickAnimation() {
        // Hide original PhonePe text
        phonepeLink.classList.add('animating');
        
        // Create bricks
        createBricks();
        
        // Start brick appearance animation
        allBricks.forEach((brick, index) => {
            setTimeout(() => {
                brick.style.animation = 'brickAppear 0.6s ease-out forwards';
            }, index * 100);
        });
        
        // Show original text after animation completes
        setTimeout(() => {
            phonepeLink.classList.remove('animating');
        }, allBricks.length * 100 + 1000);
    }
    
    // Start animation after page load
    setTimeout(() => {
        startBrickAnimation();
    }, 2000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 