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
                timeString = `${days} day${days > 1 ? 's' : ''} back`;
            } else if (hours > 0) {
                timeString = `${hours} hour${hours > 1 ? 's' : ''} back`;
            } else if (minutes > 0) {
                timeString = `${minutes} minute${minutes > 1 ? 's' : ''} back`;
            } else {
                timeString = 'just now';
            }
            
            lastVisitText.textContent = `You last visited this page ${timeString}.`;
        } else {
            lastVisitText.textContent = 'Welcome! This is your first visit.';
        }
        
        localStorage.setItem('lastVisit', now.toISOString());
    }
    
    updateVisitTracker();

    // Two Stationary Construction Workers Animation
    const phonepeLink = document.querySelector('.phonepe-link');
    let constructionWorker1 = null;
    let constructionWorker2 = null;
    
    // Create the two stationary construction workers
    function createConstructionWorkers() {
        if (constructionWorker1 && constructionWorker2) return; // Only create once
        
        // Create first worker (on P)
        constructionWorker1 = document.createElement('div');
        constructionWorker1.className = 'construction-worker';
        
        // Add hammer to first worker
        const hammer1 = document.createElement('div');
        hammer1.className = 'hammer';
        constructionWorker1.appendChild(hammer1);
        
        // Create second worker (on e)
        constructionWorker2 = document.createElement('div');
        constructionWorker2.className = 'construction-worker';
        
        // Add hammer to second worker
        const hammer2 = document.createElement('div');
        hammer2.className = 'hammer';
        constructionWorker2.appendChild(hammer2);
        
        document.body.appendChild(constructionWorker1);
        document.body.appendChild(constructionWorker2);
        
        // Position workers
        positionWorkers();
        
        // Start continuous brick creation
        startContinuousBrickCreation();
    }
    
    // Position the two workers
    function positionWorkers() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / 7; // 7 letters in "PhonePe"
        
        // Position first worker on P (first letter)
        const pX = phonepeRect.left + (letterWidth / 2);
        const pY = phonepeRect.top + (phonepeRect.height / 2);
        constructionWorker1.style.left = (pX - 30) + 'px';
        constructionWorker1.style.top = (pY - 15) + 'px';
        
        // Position second worker on e (last letter)
        const eX = phonepeRect.left + (6 * letterWidth) + (letterWidth / 2);
        const eY = phonepeRect.top + (phonepeRect.height / 2);
        constructionWorker2.style.left = (eX - 30) + 'px';
        constructionWorker2.style.top = (eY - 15) + 'px';
    }
    
    // Start continuous brick creation from both workers
    function startContinuousBrickCreation() {
        // Create bricks from first worker (P)
        setInterval(() => {
            const phonepeRect = phonepeLink.getBoundingClientRect();
            const letterWidth = phonepeRect.width / 7;
            const pX = phonepeRect.left + (letterWidth / 2);
            const pY = phonepeRect.top + (phonepeRect.height / 2);
            createBrickPieces(pX, pY);
        }, 800);
        
        // Create bricks from second worker (e)
        setInterval(() => {
            const phonepeRect = phonepeLink.getBoundingClientRect();
            const letterWidth = phonepeRect.width / 7;
            const eX = phonepeRect.left + (6 * letterWidth) + (letterWidth / 2);
            const eY = phonepeRect.top + (phonepeRect.height / 2);
            createBrickPieces(eX, eY);
        }, 800);
    }
    
    // Create brick pieces falling effect
    function createBrickPieces(x, y) {
        const numPieces = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numPieces; i++) {
            const piece = document.createElement('div');
            piece.className = 'brick-piece';
            piece.style.left = (x + Math.random() * 20 - 10) + 'px';
            piece.style.top = (y + Math.random() * 20 - 10) + 'px';
            
            document.body.appendChild(piece);
            
            // Remove piece after animation
            setTimeout(() => {
                if (piece.parentNode) {
                    piece.parentNode.removeChild(piece);
                }
            }, 1000);
        }
    }
    
    // Start animation after page load
    setTimeout(() => {
        createConstructionWorkers();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 