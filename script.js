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

    // Walking Minecraft Character Animation (Sideways View)
    const phonepeLink = document.querySelector('.phonepe-link');
    let constructionWorker = null;
    let isWalking = true;
    let currentLetterIndex = 0;
    let walkStep = 0;
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    
    // Create SVG construction worker (Minecraft-style) with sideways walking animation
    function createSVGWorker() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 30');
        svg.setAttribute('width', '30'); // Increased size by 1.5x
        svg.setAttribute('height', '45'); // Increased size by 1.5x
        
        // Head (brown block with face - sideways view)
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        head.setAttribute('x', '6');
        head.setAttribute('y', '0');
        head.setAttribute('width', '8');
        head.setAttribute('height', '8');
        head.setAttribute('fill', '#8B4513');
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '0.5');
        svg.appendChild(head);
        
        // Face (lighter brown - sideways view)
        const face = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        face.setAttribute('x', '6.5');
        face.setAttribute('y', '0.5');
        face.setAttribute('width', '7');
        face.setAttribute('height', '7');
        face.setAttribute('fill', '#D2B48C');
        svg.appendChild(face);
        
        // Eye (sideways view - only one visible)
        const eye = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        eye.setAttribute('x', '11.5');
        eye.setAttribute('y', '2');
        eye.setAttribute('width', '1');
        eye.setAttribute('height', '1');
        eye.setAttribute('fill', '#000000');
        svg.appendChild(eye);
        
        // Mouth (sideways view)
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mouth.setAttribute('x', '11.5');
        mouth.setAttribute('y', '5');
        mouth.setAttribute('width', '1');
        mouth.setAttribute('height', '1');
        mouth.setAttribute('fill', '#000000');
        svg.appendChild(mouth);
        
        // Torso (light blue shirt - sideways view)
        const torso = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        torso.setAttribute('x', '5');
        torso.setAttribute('y', '8');
        torso.setAttribute('width', '10');
        torso.setAttribute('height', '8');
        torso.setAttribute('fill', '#87CEEB');
        torso.setAttribute('stroke', '#000000');
        torso.setAttribute('stroke-width', '0.5');
        svg.appendChild(torso);
        
        // Front arm (skin tone with blue sleeve) - will animate for walking
        const frontArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontArm.setAttribute('x', '15');
        frontArm.setAttribute('y', '9');
        frontArm.setAttribute('width', '2');
        frontArm.setAttribute('height', '6');
        frontArm.setAttribute('fill', '#D2B48C');
        frontArm.setAttribute('stroke', '#000000');
        frontArm.setAttribute('stroke-width', '0.5');
        frontArm.setAttribute('class', 'front-arm');
        svg.appendChild(frontArm);
        
        // Back arm (skin tone with blue sleeve) - will animate for walking
        const backArm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backArm.setAttribute('x', '3');
        backArm.setAttribute('y', '9');
        backArm.setAttribute('width', '2');
        backArm.setAttribute('height', '6');
        backArm.setAttribute('fill', '#D2B48C');
        backArm.setAttribute('stroke', '#000000');
        backArm.setAttribute('stroke-width', '0.5');
        backArm.setAttribute('class', 'back-arm');
        svg.appendChild(backArm);
        
        // Hammer in front hand
        const hammerHandle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hammerHandle.setAttribute('x', '17');
        hammerHandle.setAttribute('y', '10');
        hammerHandle.setAttribute('width', '4');
        hammerHandle.setAttribute('height', '1');
        hammerHandle.setAttribute('fill', '#8B4513');
        hammerHandle.setAttribute('stroke', '#000000');
        hammerHandle.setAttribute('stroke-width', '0.5');
        hammerHandle.setAttribute('class', 'hammer-handle');
        svg.appendChild(hammerHandle);
        
        const hammerHead = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hammerHead.setAttribute('x', '20');
        hammerHead.setAttribute('y', '9');
        hammerHead.setAttribute('width', '2');
        hammerHead.setAttribute('height', '3');
        hammerHead.setAttribute('fill', '#696969');
        hammerHead.setAttribute('stroke', '#000000');
        hammerHead.setAttribute('stroke-width', '0.5');
        hammerHead.setAttribute('class', 'hammer-head');
        svg.appendChild(hammerHead);
        
        // Front leg (dark blue pants) - will animate for walking
        const frontLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontLeg.setAttribute('x', '11');
        frontLeg.setAttribute('y', '16');
        frontLeg.setAttribute('width', '3');
        frontLeg.setAttribute('height', '8');
        frontLeg.setAttribute('fill', '#000080');
        frontLeg.setAttribute('stroke', '#000000');
        frontLeg.setAttribute('stroke-width', '0.5');
        frontLeg.setAttribute('class', 'front-leg');
        svg.appendChild(frontLeg);
        
        // Back leg (dark blue pants) - will animate for walking
        const backLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backLeg.setAttribute('x', '6');
        backLeg.setAttribute('y', '16');
        backLeg.setAttribute('width', '3');
        backLeg.setAttribute('height', '8');
        backLeg.setAttribute('fill', '#000080');
        backLeg.setAttribute('stroke', '#000000');
        backLeg.setAttribute('stroke-width', '0.5');
        backLeg.setAttribute('class', 'back-leg');
        svg.appendChild(backLeg);
        
        // Front foot
        const frontFoot = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontFoot.setAttribute('x', '11');
        frontFoot.setAttribute('y', '24');
        frontFoot.setAttribute('width', '4');
        frontFoot.setAttribute('height', '2');
        frontFoot.setAttribute('fill', '#8B4513');
        frontFoot.setAttribute('stroke', '#000000');
        frontFoot.setAttribute('stroke-width', '0.5');
        frontFoot.setAttribute('class', 'front-foot');
        svg.appendChild(frontFoot);
        
        // Back foot
        const backFoot = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backFoot.setAttribute('x', '5');
        backFoot.setAttribute('y', '24');
        backFoot.setAttribute('width', '4');
        backFoot.setAttribute('height', '2');
        backFoot.setAttribute('fill', '#8B4513');
        backFoot.setAttribute('stroke', '#000000');
        backFoot.setAttribute('stroke-width', '0.5');
        backFoot.setAttribute('class', 'back-foot');
        svg.appendChild(backFoot);
        
        return svg;
    }
    
    // Animate sideways walking motion
    function animateWalking() {
        if (!constructionWorker || !isWalking) return;
        
        const frontArm = constructionWorker.querySelector('.front-arm');
        const backArm = constructionWorker.querySelector('.back-arm');
        const frontLeg = constructionWorker.querySelector('.front-leg');
        const backLeg = constructionWorker.querySelector('.back-leg');
        const frontFoot = constructionWorker.querySelector('.front-foot');
        const backFoot = constructionWorker.querySelector('.back-foot');
        
        if (frontArm && backArm && frontLeg && backLeg && frontFoot && backFoot) {
            const step = Math.sin(walkStep) * 2;
            
            // Animate arms (opposite to legs)
            frontArm.setAttribute('y', (9 + step) + '');
            backArm.setAttribute('y', (9 - step) + '');
            
            // Animate legs
            frontLeg.setAttribute('y', (16 - step) + '');
            backLeg.setAttribute('y', (16 + step) + '');
            
            // Animate feet
            frontFoot.setAttribute('y', (24 - step) + '');
            backFoot.setAttribute('y', (24 + step) + '');
            
            walkStep += 0.3;
        }
    }
    
    // Create the walking construction worker
    function createConstructionWorker() {
        if (constructionWorker) return; // Only create once
        
        constructionWorker = document.createElement('div');
        constructionWorker.className = 'construction-worker';
        constructionWorker.appendChild(createSVGWorker());
        
        document.body.appendChild(constructionWorker);
        
        // Start walking animation
        startWalkingAnimation();
    }
    
    // Start walking animation sequence
    function startWalkingAnimation() {
        // Start position: off-screen to the right
        const startX = window.innerWidth + 50;
        const startY = phonepeLink.getBoundingClientRect().top + (phonepeLink.getBoundingClientRect().height / 2) - 22.5; // Center vertically
        
        constructionWorker.style.left = startX + 'px';
        constructionWorker.style.top = startY + 'px';
        
        // Start the letter-by-letter sequence
        currentLetterIndex = 0;
        walkToNextLetter();
    }
    
    // Walk to the next letter in sequence
    function walkToNextLetter() {
        if (currentLetterIndex >= letters.length) {
            // All letters done, exit to the left
            exitToLeft();
            return;
        }
        
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const targetX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2) - 15;
        const targetY = phonepeRect.top + (phonepeRect.height / 2) - 22.5;
        
        const currentX = parseFloat(constructionWorker.style.left);
        const distance = targetX - currentX;
        const steps = Math.abs(distance) / 2;
        let currentStep = 0;
        
        const walkInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const newX = currentX + (distance * progress);
            
            constructionWorker.style.left = newX + 'px';
            
            // Animate walking
            animateWalking();
            
            if (currentStep >= steps) {
                clearInterval(walkInterval);
                isWalking = false;
                
                // Start hammering current letter
                startHammering(currentLetterIndex, () => {
                    currentLetterIndex++;
                    isWalking = true;
                    walkToNextLetter();
                });
            }
        }, 50);
    }
    
    // Exit to the left
    function exitToLeft() {
        const exitX = -100; // Off-screen to the left
        const currentX = parseFloat(constructionWorker.style.left);
        const distance = exitX - currentX;
        const steps = Math.abs(distance) / 2;
        let currentStep = 0;
        
        isWalking = true;
        
        const walkInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const newX = currentX + (distance * progress);
            
            constructionWorker.style.left = newX + 'px';
            
            // Animate walking
            animateWalking();
            
            if (currentStep >= steps) {
                clearInterval(walkInterval);
                // Reset and start over after a delay
                setTimeout(() => {
                    startWalkingAnimation();
                }, 2000);
            }
        }, 50);
    }
    
    // Start hammering at a specific letter position
    function startHammering(letterIndex, callback) {
        let hammerCount = 0;
        const maxHammers = 6; // Fewer hammers per letter for faster progression
        
        const hammerInterval = setInterval(() => {
            // Create brick pieces
            const phonepeRect = phonepeLink.getBoundingClientRect();
            const letterWidth = phonepeRect.width / letters.length;
            const x = phonepeRect.left + (letterIndex * letterWidth) + (letterWidth / 2);
            const y = phonepeRect.top + (phonepeRect.height / 2);
            
            createBrickPieces(x, y);
            
            // Animate hammer swing
            const hammerHandle = constructionWorker.querySelector('.hammer-handle');
            const hammerHead = constructionWorker.querySelector('.hammer-head');
            if (hammerHandle && hammerHead) {
                hammerHandle.style.transform = 'rotate(-20deg)';
                hammerHead.style.transform = 'rotate(-20deg)';
                setTimeout(() => {
                    hammerHandle.style.transform = 'rotate(0deg)';
                    hammerHead.style.transform = 'rotate(0deg)';
                }, 150);
            }
            
            hammerCount++;
            
            if (hammerCount >= maxHammers) {
                clearInterval(hammerInterval);
                setTimeout(callback, 300);
            }
        }, 250);
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