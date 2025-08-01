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

    // Construction Animation
    const constructionAnimation = document.querySelector('.construction-animation');
    const constructionWorkers = document.querySelector('.construction-workers');
    const letters = document.querySelectorAll('.letter');
    
    // Create construction worker
    function createConstructionWorker() {
        const worker = document.createElement('div');
        worker.className = 'construction-worker';
        
        // Add hammer to worker
        const hammer = document.createElement('div');
        hammer.className = 'hammer';
        worker.appendChild(hammer);
        
        // Random position around PhonePe
        const phonepeRect = document.querySelector('.phonepe-text').getBoundingClientRect();
        const centerX = phonepeRect.left + phonepeRect.width / 2;
        const centerY = phonepeRect.top + phonepeRect.height / 2;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        worker.style.left = x + 'px';
        worker.style.top = y + 'px';
        
        constructionWorkers.appendChild(worker);
        
        // Create brick pieces periodically
        const brickInterval = setInterval(() => {
            createBrickPieces(x, y);
        }, 500 + Math.random() * 1000);
        
        // Remove worker after some time
        setTimeout(() => {
            if (worker.parentNode) {
                worker.parentNode.removeChild(worker);
                clearInterval(brickInterval);
            }
        }, 3000 + Math.random() * 2000);
    }
    
    // Create brick pieces falling effect
    function createBrickPieces(x, y) {
        const numPieces = 3 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numPieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'brick-piece';
            piece.style.left = (x + Math.random() * 20 - 10) + 'px';
            piece.style.top = (y + Math.random() * 20 - 10) + 'px';
            
            constructionAnimation.appendChild(piece);
            
            // Remove piece after animation
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, 1000);
        }
    }
    
    // Start continuous construction animation
    function startConstructionAnimation() {
        // Create workers periodically
        setInterval(() => {
            createConstructionWorker();
        }, 800 + Math.random() * 400);
        
        // Create additional brick pieces around letters
        setInterval(() => {
            letters.forEach((letter, index) => {
                if (Math.random() > 0.7) {
                    const letterRect = letter.getBoundingClientRect();
                    createBrickPieces(
                        letterRect.left + letterRect.width / 2,
                        letterRect.top + letterRect.height / 2
                    );
                }
            });
        }, 300);
    }
    
    // Start animation after page load
    setTimeout(() => {
        startConstructionAnimation();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 