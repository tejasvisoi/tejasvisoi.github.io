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

    // Line Art Cat Animation (Simplified)
    const phonepeLink = document.querySelector('.phonepe-link');
    let cat = null;
    let isWalking = true;
    let walkStep = 0;
    let direction = 1; // 1 for right, -1 for left
    let currentX = 0;
    let currentY = 0;
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    
    // Create SVG line art cat (white with black outlines)
    function createSVGCat() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 60 40');
        svg.setAttribute('width', '60');
        svg.setAttribute('height', '40');
        
        // Cat body (seated position) - WHITE FILL
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        body.setAttribute('d', 'M 20 25 Q 25 20 30 25 Q 35 30 30 35 L 20 35 Q 15 30 20 25 Z');
        body.setAttribute('fill', '#FFFFFF'); // WHITE FILL
        body.setAttribute('stroke', '#000000');
        body.setAttribute('stroke-width', '2');
        body.setAttribute('class', 'cat-body');
        svg.appendChild(body);
        
        // Cat head - WHITE FILL
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '35');
        head.setAttribute('cy', '20');
        head.setAttribute('r', '8');
        head.setAttribute('fill', '#FFFFFF'); // WHITE FILL
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '2');
        head.setAttribute('class', 'cat-head');
        svg.appendChild(head);
        
        // Cat ears - WHITE FILL
        const ear1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ear1.setAttribute('d', 'M 30 15 L 32 10 L 34 15 Z');
        ear1.setAttribute('fill', '#FFFFFF'); // WHITE FILL
        ear1.setAttribute('stroke', '#000000');
        ear1.setAttribute('stroke-width', '2');
        ear1.setAttribute('class', 'cat-ear');
        svg.appendChild(ear1);
        
        const ear2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ear2.setAttribute('d', 'M 36 15 L 38 10 L 40 15 Z');
        ear2.setAttribute('fill', '#FFFFFF'); // WHITE FILL
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
        
        // Cat front legs - WHITE FILL
        const frontLeg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontLeg1.setAttribute('x', '19');
        frontLeg1.setAttribute('y', '25');
        frontLeg1.setAttribute('width', '4');
        frontLeg1.setAttribute('height', '10');
        frontLeg1.setAttribute('fill', '#FFFFFF'); // WHITE FILL
        frontLeg1.setAttribute('stroke', '#000000');
        frontLeg1.setAttribute('stroke-width', '2');
        frontLeg1.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg1);
        
        const frontLeg2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontLeg2.setAttribute('x', '25');
        frontLeg2.setAttribute('y', '25');
        frontLeg2.setAttribute('width', '4');
        frontLeg2.setAttribute('height', '10');
        frontLeg2.setAttribute('fill', '#FFFFFF'); // WHITE FILL
        frontLeg2.setAttribute('stroke', '#000000');
        frontLeg2.setAttribute('stroke-width', '2');
        frontLeg2.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg2);
        
        // Cat tail (curved like question mark) - WHITE FILL
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tail.setAttribute('d', 'M 20 30 Q 15 25 10 30 Q 5 35 10 40 Z');
        tail.setAttribute('fill', '#FFFFFF'); // WHITE FILL
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
            frontLeg1.setAttribute('y', (25 - step) + '');
            frontLeg2.setAttribute('y', (25 + step) + '');
            
            // Animate tail
            const tailCurve = Math.sin(walkStep * 0.5) * 3;
            tail.setAttribute('d', `M 20 30 Q ${15 - tailCurve} 25 ${10 - tailCurve} 30 Q ${5 - tailCurve} 35 ${10 - tailCurve} 40 Z`);
            
            walkStep += 0.3;
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
    
    // Continuous cat movement (simplified)
    function animateCatMovement() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const speed = 0.8; // Pixels per frame
        
        function moveCat() {
            if (!cat) return;
            
            // Move cat horizontally
            currentX += speed * direction;
            cat.style.left = currentX + 'px';
            
            // Animate walking
            animateWalking();
            
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
    
    // Start animation after page load
    setTimeout(() => {
        createCat();
    }, 1000);
    
    // Add hover effects for links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}); 