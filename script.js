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

    // Single Construction Worker Animation
    const phonepeLink = document.querySelector('.phonepe-link');
    let constructionWorker = null;
    let currentLetterIndex = 0;
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    
    // Create the single construction worker
    function createConstructionWorker() {
        if (constructionWorker) return; // Only create one worker
        
        constructionWorker = document.createElement('div');
        constructionWorker.className = 'construction-worker';
        
        // Add hammer to worker
        const hammer = document.createElement('div');
        hammer.className = 'hammer';
        constructionWorker.appendChild(hammer);
        
        document.body.appendChild(constructionWorker);
        
        // Start the building sequence
        startBuildingSequence();
    }
    
    // Start building sequence
    function startBuildingSequence() {
        if (currentLetterIndex >= letters.length) {
            // Reset and start over
            currentLetterIndex = 0;
            // Remove all building classes
            phonepeLink.className = phonepeLink.className.replace(/building-letter-\d+/g, '');
            setTimeout(() => {
                startBuildingSequence();
            }, 2000);
            return;
        }
        
        const letter = letters[currentLetterIndex];
        const phonepeRect = phonepeLink.getBoundingClientRect();
        
        // Calculate position for current letter
        const letterWidth = phonepeRect.width / letters.length;
        const letterX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2);
        const letterY = phonepeRect.top + (phonepeRect.height / 2);
        
        // Position worker near the letter
        constructionWorker.style.left = (letterX - 30) + 'px';
        constructionWorker.style.top = (letterY - 15) + 'px';
        
        // Build the current letter
        buildCurrentLetter();
    }
    
    // Build the current letter
    function buildCurrentLetter() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const letterX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2);
        const letterY = phonepeRect.top + (phonepeRect.height / 2);
        
        // Remove previous building class
        phonepeLink.className = phonepeLink.className.replace(/building-letter-\d+/g, '');
        
        // Add current building class
        phonepeLink.classList.add(`building-letter-${currentLetterIndex}`);
        
        // Create brick pieces while building
        let hammerCount = 0;
        const maxHammers = 6; // Fewer hammers per letter for faster progression
        
        const hammerInterval = setInterval(() => {
            createBrickPieces(letterX, letterY);
            hammerCount++;
            
            if (hammerCount >= maxHammers) {
                clearInterval(hammerInterval);
                // Letter is now built, move to next letter
                currentLetterIndex++;
                setTimeout(() => {
                    startBuildingSequence();
                }, 300);
            }
        }, 200);
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
        createConstructionWorker();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 