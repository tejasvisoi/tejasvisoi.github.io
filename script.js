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

    // Line Art Cat Animation with SVG PhonePe
    const phonepeLink = document.querySelector('.phonepe-link');
    let cat = null;
    let isWalking = true;
    let walkStep = 0;
    let direction = 1; // 1 for right, -1 for left
    let currentX = 0;
    let currentY = 0;
    let isClimbing = false;
    let climbStep = 0;
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    let letterPaths = [];
    
    // Convert PhonePe text to SVG
    function convertTextToSVG() {
        const phonepeLink = document.querySelector('.phonepe-link');
        const text = phonepeLink.textContent;
        const computedStyle = window.getComputedStyle(phonepeLink);
        
        // Create SVG container
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 200');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        
        // Create text element
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '50%');
        textElement.setAttribute('y', '50%');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('font-family', computedStyle.fontFamily);
        textElement.setAttribute('font-size', computedStyle.fontSize);
        textElement.setAttribute('font-weight', computedStyle.fontWeight);
        textElement.setAttribute('fill', '#f5f5f5');
        textElement.textContent = text;
        
        svg.appendChild(textElement);
        
        // Replace the text content with SVG
        phonepeLink.innerHTML = '';
        phonepeLink.appendChild(svg);
        
        // Get letter paths for climbing
        setTimeout(() => {
            generateLetterPaths();
        }, 100);
    }
    
    // Generate paths for each letter
    function generateLetterPaths() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        
        letterPaths = letters.map((letter, index) => {
            const x = phonepeRect.left + (index * letterWidth) + (letterWidth / 2);
            const y = phonepeRect.top + (phonepeRect.height / 2);
            const width = letterWidth;
            const height = phonepeRect.height;
            
            return {
                letter,
                x,
                y,
                width,
                height,
                path: generateLetterPath(letter, x, y, width, height)
            };
        });
    }
    
    // Generate climbing path for each letter
    function generateLetterPath(letter, x, y, width, height) {
        // Create a simple path that follows the letter shape
        const points = [];
        
        switch(letter) {
            case 'P':
                // P shape: vertical line, then curve
                points.push([x - width/3, y - height/2]); // Top left
                points.push([x - width/3, y + height/2]); // Bottom left
                points.push([x - width/3, y - height/4]); // Back to middle
                points.push([x + width/3, y - height/4]); // Top right
                points.push([x + width/3, y + height/4]); // Bottom right
                points.push([x - width/3, y + height/4]); // Back to middle
                break;
            case 'h':
                // h shape: vertical line, then curve
                points.push([x - width/3, y - height/2]); // Top left
                points.push([x - width/3, y + height/2]); // Bottom left
                points.push([x - width/3, y]); // Middle
                points.push([x + width/3, y]); // Middle right
                points.push([x + width/3, y + height/2]); // Bottom right
                break;
            case 'o':
                // o shape: circle
                for(let i = 0; i <= 360; i += 30) {
                    const angle = (i * Math.PI) / 180;
                    const px = x + (width/3) * Math.cos(angle);
                    const py = y + (height/3) * Math.sin(angle);
                    points.push([px, py]);
                }
                break;
            case 'n':
                // n shape: vertical line, then curve
                points.push([x - width/3, y - height/2]); // Top left
                points.push([x - width/3, y + height/2]); // Bottom left
                points.push([x - width/3, y]); // Middle
                points.push([x + width/3, y]); // Middle right
                points.push([x + width/3, y + height/2]); // Bottom right
                break;
            case 'e':
                // e shape: horizontal line with curve
                points.push([x - width/3, y]); // Left
                points.push([x + width/3, y]); // Right
                points.push([x + width/3, y - height/3]); // Top right
                points.push([x - width/3, y - height/3]); // Top left
                points.push([x - width/3, y + height/3]); // Bottom left
                points.push([x + width/3, y + height/3]); // Bottom right
                break;
            default:
                // Default rectangle path
                points.push([x - width/3, y - height/2]);
                points.push([x + width/3, y - height/2]);
                points.push([x + width/3, y + height/2]);
                points.push([x - width/3, y + height/2]);
        }
        
        return points;
    }
    
    // Create SVG line art cat (based on the reference)
    function createSVGCat() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 60 40');
        svg.setAttribute('width', '60');
        svg.setAttribute('height', '40');
        
        // Cat body (seated position)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        body.setAttribute('d', 'M 20 25 Q 25 20 30 25 Q 35 30 30 35 L 20 35 Q 15 30 20 25 Z');
        body.setAttribute('fill', 'none');
        body.setAttribute('stroke', '#000000');
        body.setAttribute('stroke-width', '2');
        body.setAttribute('class', 'cat-body');
        svg.appendChild(body);
        
        // Cat head
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '35');
        head.setAttribute('cy', '20');
        head.setAttribute('r', '8');
        head.setAttribute('fill', 'none');
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '2');
        head.setAttribute('class', 'cat-head');
        svg.appendChild(head);
        
        // Cat ears
        const ear1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ear1.setAttribute('d', 'M 30 15 L 32 10 L 34 15');
        ear1.setAttribute('fill', 'none');
        ear1.setAttribute('stroke', '#000000');
        ear1.setAttribute('stroke-width', '2');
        ear1.setAttribute('class', 'cat-ear');
        svg.appendChild(ear1);
        
        const ear2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ear2.setAttribute('d', 'M 36 15 L 38 10 L 40 15');
        ear2.setAttribute('fill', 'none');
        ear2.setAttribute('stroke', '#000000');
        ear2.setAttribute('stroke-width', '2');
        ear2.setAttribute('class', 'cat-ear');
        svg.appendChild(ear2);
        
        // Cat eye
        const eye = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        eye.setAttribute('cx', '37');
        eye.setAttribute('cy', '18');
        eye.setAttribute('rx', '2');
        eye.setAttribute('ry', '3');
        eye.setAttribute('fill', 'none');
        eye.setAttribute('stroke', '#000000');
        eye.setAttribute('stroke-width', '2');
        eye.setAttribute('class', 'cat-eye');
        svg.appendChild(eye);
        
        // Cat pupil
        const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pupil.setAttribute('cx', '37');
        pupil.setAttribute('cy', '18');
        pupil.setAttribute('r', '1');
        pupil.setAttribute('fill', '#000000');
        pupil.setAttribute('class', 'cat-pupil');
        svg.appendChild(pupil);
        
        // Cat muzzle
        const muzzle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        muzzle.setAttribute('d', 'M 40 20 Q 42 22 40 24');
        muzzle.setAttribute('fill', 'none');
        muzzle.setAttribute('stroke', '#000000');
        muzzle.setAttribute('stroke-width', '1');
        muzzle.setAttribute('class', 'cat-muzzle');
        svg.appendChild(muzzle);
        
        // Cat front legs
        const frontLeg1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        frontLeg1.setAttribute('d', 'M 22 25 L 20 35');
        frontLeg1.setAttribute('fill', 'none');
        frontLeg1.setAttribute('stroke', '#000000');
        frontLeg1.setAttribute('stroke-width', '2');
        frontLeg1.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg1);
        
        const frontLeg2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        frontLeg2.setAttribute('d', 'M 28 25 L 26 35');
        frontLeg2.setAttribute('fill', 'none');
        frontLeg2.setAttribute('stroke', '#000000');
        frontLeg2.setAttribute('stroke-width', '2');
        frontLeg2.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg2);
        
        // Cat tail (curved like question mark)
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tail.setAttribute('d', 'M 20 30 Q 15 25 10 30 Q 5 35 10 40');
        tail.setAttribute('fill', 'none');
        tail.setAttribute('stroke', '#000000');
        tail.setAttribute('stroke-width', '2');
        tail.setAttribute('class', 'cat-tail');
        svg.appendChild(tail);
        
        return svg;
    }
    
    // Animate cat walking motion
    function animateWalking() {
        if (!cat || !isWalking) return;
        
        const frontLeg1 = cat.querySelector('.cat-front-leg:nth-child(1)');
        const frontLeg2 = cat.querySelector('.cat-front-leg:nth-child(2)');
        const tail = cat.querySelector('.cat-tail');
        
        if (frontLeg1 && frontLeg2 && tail) {
            const step = Math.sin(walkStep) * 2;
            
            // Animate legs for walking
            frontLeg1.setAttribute('d', `M 22 ${25 - step} L 20 ${35 - step}`);
            frontLeg2.setAttribute('d', `M 28 ${25 + step} L 26 ${35 + step}`);
            
            // Animate tail
            const tailCurve = Math.sin(walkStep * 0.5) * 3;
            tail.setAttribute('d', `M 20 30 Q ${15 - tailCurve} 25 ${10 - tailCurve} 30 Q ${5 - tailCurve} 35 ${10 - tailCurve} 40`);
            
            walkStep += 0.3;
        }
    }
    
    // Animate cat climbing motion
    function animateClimbing() {
        if (!cat || !isClimbing) return;
        
        const body = cat.querySelector('.cat-body');
        const head = cat.querySelector('.cat-head');
        const frontLeg1 = cat.querySelector('.cat-front-leg:nth-child(1)');
        const frontLeg2 = cat.querySelector('.cat-front-leg:nth-child(2)');
        
        if (body && head && frontLeg1 && frontLeg2) {
            const climbHeight = Math.sin(climbStep) * 5;
            
            // Move cat up and down while climbing
            body.setAttribute('d', `M 20 ${25 - climbHeight} Q 25 ${20 - climbHeight} 30 ${25 - climbHeight} Q 35 ${30 - climbHeight} 30 ${35 - climbHeight} L 20 ${35 - climbHeight} Q 15 ${30 - climbHeight} 20 ${25 - climbHeight} Z`);
            head.setAttribute('cy', (20 - climbHeight) + '');
            
            // Animate legs for climbing
            const legStep = Math.sin(climbStep * 2) * 3;
            frontLeg1.setAttribute('d', `M 22 ${25 - climbHeight} L 20 ${35 - climbHeight + legStep}`);
            frontLeg2.setAttribute('d', `M 28 ${25 - climbHeight} L 26 ${35 - climbHeight - legStep}`);
            
            climbStep += 0.4;
        }
    }
    
    // Create the cat
    function createCat() {
        if (cat) return; // Only create once
        
        cat = document.createElement('div');
        cat.className = 'cat';
        cat.appendChild(createSVGCat());
        
        document.body.appendChild(cat);
        
        // Start cat animation
        startCatAnimation();
    }
    
    // Start cat animation sequence
    function startCatAnimation() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 20;
        
        cat.style.top = catY + 'px';
        currentX = phonepeRect.left - 60; // Start off-screen left
        currentY = catY;
        cat.style.left = currentX + 'px';
        
        // Start continuous walking animation
        animateCatMovement();
    }
    
    // Continuous cat movement with climbing
    function animateCatMovement() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const speed = 0.8; // Pixels per frame
        
        function moveCat() {
            if (!cat) return;
            
            // Move cat horizontally
            currentX += speed * direction;
            cat.style.left = currentX + 'px';
            
            // Check if cat should climb on letters
            const currentLetterIndex = Math.floor((currentX - phonepeRect.left) / (phonepeRect.width / letters.length));
            
            if (currentLetterIndex >= 0 && currentLetterIndex < letters.length) {
                // Cat is over a letter, start climbing
                if (!isClimbing) {
                    isClimbing = true;
                    isWalking = false;
                    climbStep = 0;
                }
                
                // Move cat up slightly while on letter
                const letterY = phonepeRect.top + (phonepeRect.height / 2) - 25;
                cat.style.top = letterY + 'px';
                currentY = letterY;
                
                // Animate climbing
                animateClimbing();
                
                // Make letter move down slightly
                moveLetterDown(currentLetterIndex);
            } else {
                // Cat is not on a letter, walk normally
                if (isClimbing) {
                    isClimbing = false;
                    isWalking = true;
                }
                
                const groundY = phonepeRect.top + (phonepeRect.height / 2) - 20;
                cat.style.top = groundY + 'px';
                currentY = groundY;
                
                // Animate walking
                animateWalking();
            }
            
            // Check if cat needs to turn around
            if (direction === 1 && currentX > phonepeRect.right + 60) {
                // Reached right edge, turn around
                direction = -1;
                // Flip cat horizontally
                cat.style.transform = 'scaleX(-1)';
            } else if (direction === -1 && currentX < phonepeRect.left - 60) {
                // Reached left edge, turn around
                direction = 1;
                // Flip cat back to normal
                cat.style.transform = 'scaleX(1)';
            }
            
            // Continue animation
            requestAnimationFrame(moveCat);
        }
        
        moveCat();
    }
    
    // Make letter move down when cat is on it
    function moveLetterDown(letterIndex) {
        const phonepeLink = document.querySelector('.phonepe-link');
        const svg = phonepeLink.querySelector('svg');
        const textElement = svg.querySelector('text');
        
        if (textElement) {
            // Add a subtle bounce effect to the text
            textElement.style.transform = 'translateY(1px)';
            setTimeout(() => {
                textElement.style.transform = 'translateY(0px)';
            }, 100);
        }
    }
    
    // Convert text to SVG and start animation
    setTimeout(() => {
        convertTextToSVG();
        setTimeout(() => {
            createCat();
        }, 200);
    }, 500);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 