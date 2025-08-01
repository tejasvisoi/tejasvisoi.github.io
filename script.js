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

    // Walking Minecraft Character Animation
    const phonepeLink = document.querySelector('.phonepe-link');
    let constructionWorker = null;
    let isWalking = true;
    let currentTarget = 'e'; // Start with 'e', then go to 'P'
    let walkStep = 0;
    
    // Create SVG construction worker (Minecraft-style) with walking animation
    function createSVGWorker() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 30');
        svg.setAttribute('width', '30'); // Increased size by 1.5x
        svg.setAttribute('height', '45'); // Increased size by 1.5x
        
        // Head (brown block with face)
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        head.setAttribute('x', '6');
        head.setAttribute('y', '0');
        head.setAttribute('width', '8');
        head.setAttribute('height', '8');
        head.setAttribute('fill', '#8B4513');
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '0.5');
        svg.appendChild(head);
        
        // Face (lighter brown)
        const face = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        face.setAttribute('x', '6.5');
        face.setAttribute('y', '0.5');
        face.setAttribute('width', '7');
        face.setAttribute('height', '7');
        face.setAttribute('fill', '#D2B48C');
        svg.appendChild(face);
        
        // Eyes
        const eye1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        eye1.setAttribute('x', '7.5');
        eye1.setAttribute('y', '2');
        eye1.setAttribute('width', '1');
        eye1.setAttribute('height', '1');
        eye1.setAttribute('fill', '#000000');
        svg.appendChild(eye1);
        
        const eye2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        eye2.setAttribute('x', '11.5');
        eye2.setAttribute('y', '2');
        eye2.setAttribute('width', '1');
        eye2.setAttribute('height', '1');
        eye2.setAttribute('fill', '#000000');
        svg.appendChild(eye2);
        
        // Mouth
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mouth.setAttribute('x', '8.5');
        mouth.setAttribute('y', '5');
        mouth.setAttribute('width', '3');
        mouth.setAttribute('height', '1');
        mouth.setAttribute('fill', '#000000');
        svg.appendChild(mouth);
        
        // Torso (light blue shirt)
        const torso = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        torso.setAttribute('x', '5');
        torso.setAttribute('y', '8');
        torso.setAttribute('width', '10');
        torso.setAttribute('height', '8');
        torso.setAttribute('fill', '#87CEEB');
        torso.setAttribute('stroke', '#000000');
        torso.setAttribute('stroke-width', '0.5');
        svg.appendChild(torso);
        
        // Arms (skin tone with blue sleeves) - will animate for walking
        const arm1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        arm1.setAttribute('x', '3');
        arm1.setAttribute('y', '9');
        arm1.setAttribute('width', '2');
        arm1.setAttribute('height', '6');
        arm1.setAttribute('fill', '#D2B48C');
        arm1.setAttribute('stroke', '#000000');
        arm1.setAttribute('stroke-width', '0.5');
        arm1.setAttribute('class', 'arm-left');
        svg.appendChild(arm1);
        
        const arm2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        arm2.setAttribute('x', '15');
        arm2.setAttribute('y', '9');
        arm2.setAttribute('width', '2');
        arm2.setAttribute('height', '6');
        arm2.setAttribute('fill', '#D2B48C');
        arm2.setAttribute('stroke', '#000000');
        arm2.setAttribute('stroke-width', '0.5');
        arm2.setAttribute('class', 'arm-right');
        svg.appendChild(arm2);
        
        // Hammer in right hand
        const hammerHandle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hammerHandle.setAttribute('x', '17');
        hammerHandle.setAttribute('y', '10');
        hammerHandle.setAttribute('width', '4');
        hammerHandle.setAttribute('height', '1');
        hammerHandle.setAttribute('fill', '#8B4513');
        hammerHandle.setAttribute('stroke', '#000000');
        hammerHandle.setAttribute('stroke-width', '0.5');
        svg.appendChild(hammerHandle);
        
        const hammerHead = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hammerHead.setAttribute('x', '20');
        hammerHead.setAttribute('y', '9');
        hammerHead.setAttribute('width', '2');
        hammerHead.setAttribute('height', '3');
        hammerHead.setAttribute('fill', '#696969');
        hammerHead.setAttribute('stroke', '#000000');
        hammerHead.setAttribute('stroke-width', '0.5');
        svg.appendChild(hammerHead);
        
        // Legs (dark blue pants) - will animate for walking
        const leg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        leg1.setAttribute('x', '6');
        leg1.setAttribute('y', '16');
        leg1.setAttribute('width', '3');
        leg1.setAttribute('height', '8');
        leg1.setAttribute('fill', '#000080');
        leg1.setAttribute('stroke', '#000000');
        leg1.setAttribute('stroke-width', '0.5');
        leg1.setAttribute('class', 'leg-left');
        svg.appendChild(leg1);
        
        const leg2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        leg2.setAttribute('x', '11');
        leg2.setAttribute('y', '16');
        leg2.setAttribute('width', '3');
        leg2.setAttribute('height', '8');
        leg2.setAttribute('fill', '#000080');
        leg2.setAttribute('stroke', '#000000');
        leg2.setAttribute('stroke-width', '0.5');
        leg2.setAttribute('class', 'leg-right');
        svg.appendChild(leg2);
        
        // Feet
        const foot1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        foot1.setAttribute('x', '5');
        foot1.setAttribute('y', '24');
        foot1.setAttribute('width', '4');
        foot1.setAttribute('height', '2');
        foot1.setAttribute('fill', '#8B4513');
        foot1.setAttribute('stroke', '#000000');
        foot1.setAttribute('stroke-width', '0.5');
        foot1.setAttribute('class', 'foot-left');
        svg.appendChild(foot1);
        
        const foot2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        foot2.setAttribute('x', '11');
        foot2.setAttribute('y', '24');
        foot2.setAttribute('width', '4');
        foot2.setAttribute('height', '2');
        foot2.setAttribute('fill', '#8B4513');
        foot2.setAttribute('stroke', '#000000');
        foot2.setAttribute('stroke-width', '0.5');
        foot2.setAttribute('class', 'foot-right');
        svg.appendChild(foot2);
        
        return svg;
    }
    
    // Animate walking motion
    function animateWalking() {
        if (!constructionWorker || !isWalking) return;
        
        const armLeft = constructionWorker.querySelector('.arm-left');
        const armRight = constructionWorker.querySelector('.arm-right');
        const legLeft = constructionWorker.querySelector('.leg-left');
        const legRight = constructionWorker.querySelector('.leg-right');
        const footLeft = constructionWorker.querySelector('.foot-left');
        const footRight = constructionWorker.querySelector('.foot-right');
        
        if (armLeft && armRight && legLeft && legRight && footLeft && footRight) {
            const step = Math.sin(walkStep) * 2;
            
            // Animate arms (opposite to legs)
            armLeft.setAttribute('y', (9 + step) + '');
            armRight.setAttribute('y', (9 - step) + '');
            
            // Animate legs
            legLeft.setAttribute('y', (16 - step) + '');
            legRight.setAttribute('y', (16 + step) + '');
            
            // Animate feet
            footLeft.setAttribute('y', (24 - step) + '');
            footRight.setAttribute('y', (24 + step) + '');
            
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
        
        // Walk to 'e' position
        walkToTarget('e', () => {
            // Start hammering 'e'
            startHammering('e', () => {
                // Walk to 'P' position
                walkToTarget('P', () => {
                    // Start hammering 'P'
                    startHammering('P', () => {
                        // Reset and start over
                        setTimeout(() => {
                            startWalkingAnimation();
                        }, 2000);
                    });
                });
            });
        });
    }
    
    // Walk to a specific target
    function walkToTarget(target, callback) {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / 7;
        let targetX, targetY;
        
        if (target === 'e') {
            targetX = phonepeRect.left + (6 * letterWidth) + (letterWidth / 2) - 15; // Last 'e'
        } else {
            targetX = phonepeRect.left + (letterWidth / 2) - 15; // First 'P'
        }
        
        targetY = phonepeRect.top + (phonepeRect.height / 2) - 22.5;
        
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
                callback();
            }
        }, 50);
    }
    
    // Start hammering at a position
    function startHammering(target, callback) {
        let hammerCount = 0;
        const maxHammers = 8;
        
        const hammerInterval = setInterval(() => {
            // Create brick pieces
            const phonepeRect = phonepeLink.getBoundingClientRect();
            const letterWidth = phonepeRect.width / 7;
            let x, y;
            
            if (target === 'e') {
                x = phonepeRect.left + (6 * letterWidth) + (letterWidth / 2);
            } else {
                x = phonepeRect.left + (letterWidth / 2);
            }
            y = phonepeRect.top + (phonepeRect.height / 2);
            
            createBrickPieces(x, y);
            
            // Animate hammer swing
            const hammer = constructionWorker.querySelector('rect[fill="#8B4513"]');
            if (hammer) {
                hammer.style.transform = 'rotate(-20deg)';
                setTimeout(() => {
                    hammer.style.transform = 'rotate(0deg)';
                }, 150);
            }
            
            hammerCount++;
            
            if (hammerCount >= maxHammers) {
                clearInterval(hammerInterval);
                setTimeout(callback, 500);
            }
        }, 300);
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