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

    // Pixelated Cat Animation
    const phonepeLink = document.querySelector('.phonepe-link');
    let cat = null;
    let isJumping = false;
    let currentLetterIndex = 0;
    let jumpStep = 0;
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    
    // Create SVG pixelated cat (sideways view)
    function createSVGCat() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 20 16');
        svg.setAttribute('width', '30');
        svg.setAttribute('height', '24');
        
        // Cat body (orange/brown)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        body.setAttribute('x', '4');
        body.setAttribute('y', '6');
        body.setAttribute('width', '8');
        body.setAttribute('height', '6');
        body.setAttribute('fill', '#FFA500');
        body.setAttribute('stroke', '#000000');
        body.setAttribute('stroke-width', '0.5');
        body.setAttribute('class', 'cat-body');
        svg.appendChild(body);
        
        // Cat head (orange/brown)
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        head.setAttribute('x', '12');
        head.setAttribute('y', '4');
        head.setAttribute('width', '6');
        head.setAttribute('height', '6');
        head.setAttribute('fill', '#FFA500');
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '0.5');
        head.setAttribute('class', 'cat-head');
        svg.appendChild(head);
        
        // Cat ear (triangle shape)
        const ear = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        ear.setAttribute('points', '12,4 14,2 16,4');
        ear.setAttribute('fill', '#FFA500');
        ear.setAttribute('stroke', '#000000');
        ear.setAttribute('stroke-width', '0.5');
        ear.setAttribute('class', 'cat-ear');
        svg.appendChild(ear);
        
        // Cat eye (green)
        const eye = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        eye.setAttribute('x', '14');
        eye.setAttribute('y', '5');
        eye.setAttribute('width', '1');
        eye.setAttribute('height', '1');
        eye.setAttribute('fill', '#00FF00');
        eye.setAttribute('class', 'cat-eye');
        svg.appendChild(eye);
        
        // Cat nose (pink)
        const nose = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nose.setAttribute('x', '17');
        nose.setAttribute('y', '6');
        nose.setAttribute('width', '1');
        nose.setAttribute('height', '1');
        nose.setAttribute('fill', '#FF69B4');
        nose.setAttribute('class', 'cat-nose');
        svg.appendChild(nose);
        
        // Cat whiskers (white lines)
        const whisker1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        whisker1.setAttribute('x1', '18');
        whisker1.setAttribute('y1', '6');
        whisker1.setAttribute('x2', '20');
        whisker1.setAttribute('y2', '5');
        whisker1.setAttribute('stroke', '#FFFFFF');
        whisker1.setAttribute('stroke-width', '0.5');
        whisker1.setAttribute('class', 'cat-whisker');
        svg.appendChild(whisker1);
        
        const whisker2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        whisker2.setAttribute('x1', '18');
        whisker2.setAttribute('y1', '7');
        whisker2.setAttribute('x2', '20');
        whisker2.setAttribute('y2', '7');
        whisker2.setAttribute('stroke', '#FFFFFF');
        whisker2.setAttribute('stroke-width', '0.5');
        whisker2.setAttribute('class', 'cat-whisker');
        svg.appendChild(whisker2);
        
        const whisker3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        whisker3.setAttribute('x1', '18');
        whisker3.setAttribute('y1', '8');
        whisker3.setAttribute('x2', '20');
        whisker3.setAttribute('y2', '9');
        whisker3.setAttribute('stroke', '#FFFFFF');
        whisker3.setAttribute('stroke-width', '0.5');
        whisker3.setAttribute('class', 'cat-whisker');
        svg.appendChild(whisker3);
        
        // Cat tail (curved)
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tail.setAttribute('d', 'M 4 9 Q 2 7 0 9');
        tail.setAttribute('fill', 'none');
        tail.setAttribute('stroke', '#FFA500');
        tail.setAttribute('stroke-width', '1');
        tail.setAttribute('class', 'cat-tail');
        svg.appendChild(tail);
        
        // Cat front leg
        const frontLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontLeg.setAttribute('x', '10');
        frontLeg.setAttribute('y', '12');
        frontLeg.setAttribute('width', '2');
        frontLeg.setAttribute('height', '4');
        frontLeg.setAttribute('fill', '#FFA500');
        frontLeg.setAttribute('stroke', '#000000');
        frontLeg.setAttribute('stroke-width', '0.5');
        frontLeg.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg);
        
        // Cat back leg
        const backLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backLeg.setAttribute('x', '6');
        backLeg.setAttribute('y', '12');
        backLeg.setAttribute('width', '2');
        backLeg.setAttribute('height', '4');
        backLeg.setAttribute('fill', '#FFA500');
        backLeg.setAttribute('stroke', '#000000');
        backLeg.setAttribute('stroke-width', '0.5');
        backLeg.setAttribute('class', 'cat-back-leg');
        svg.appendChild(backLeg);
        
        return svg;
    }
    
    // Animate cat jumping motion
    function animateJumping() {
        if (!cat || !isJumping) return;
        
        const catBody = cat.querySelector('.cat-body');
        const catHead = cat.querySelector('.cat-head');
        const catTail = cat.querySelector('.cat-tail');
        const frontLeg = cat.querySelector('.cat-front-leg');
        const backLeg = cat.querySelector('.cat-back-leg');
        
        if (catBody && catHead && catTail && frontLeg && backLeg) {
            const jumpHeight = Math.sin(jumpStep) * 8;
            const legBend = Math.sin(jumpStep * 2) * 2;
            
            // Move cat up and down
            catBody.setAttribute('y', (6 - jumpHeight) + '');
            catHead.setAttribute('y', (4 - jumpHeight) + '');
            
            // Animate legs for jumping
            frontLeg.setAttribute('y', (12 - jumpHeight + legBend) + '');
            backLeg.setAttribute('y', (12 - jumpHeight - legBend) + '');
            
            // Animate tail
            if (jumpHeight > 0) {
                catTail.setAttribute('d', `M 4 ${9 - jumpHeight} Q 2 ${7 - jumpHeight} 0 ${9 - jumpHeight}`);
            } else {
                catTail.setAttribute('d', 'M 4 9 Q 2 7 0 9');
            }
            
            jumpStep += 0.4;
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
        // Start hidden behind the last 'e'
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const lastEX = phonepeRect.left + (6 * letterWidth) + (letterWidth / 2) - 15;
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 12;
        
        cat.style.left = lastEX + 'px';
        cat.style.top = catY + 'px';
        cat.style.opacity = '0.3'; // Partially hidden
        
        // Wait a moment, then start jumping sequence
        setTimeout(() => {
            cat.style.opacity = '1';
            currentLetterIndex = 6; // Start from last 'e'
            jumpToNextLetter();
        }, 1000);
    }
    
    // Jump to the next letter in sequence
    function jumpToNextLetter() {
        if (currentLetterIndex < 0) {
            // All letters done, hide behind first 'P'
            hideBehindFirstP();
            return;
        }
        
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const targetX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2) - 15;
        const targetY = phonepeRect.top + (phonepeRect.height / 2) - 12;
        
        const currentX = parseFloat(cat.style.left);
        const currentY = parseFloat(cat.style.top);
        const distanceX = targetX - currentX;
        const distanceY = targetY - currentY;
        const steps = Math.abs(distanceX) / 3;
        let currentStep = 0;
        
        isJumping = true;
        
        const jumpInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const newX = currentX + (distanceX * progress);
            const newY = currentY + (distanceY * progress);
            
            cat.style.left = newX + 'px';
            cat.style.top = newY + 'px';
            
            // Animate jumping
            animateJumping();
            
            if (currentStep >= steps) {
                clearInterval(jumpInterval);
                isJumping = false;
                
                // Pause briefly at each letter
                setTimeout(() => {
                    currentLetterIndex--;
                    jumpToNextLetter();
                }, 500);
            }
        }, 50);
    }
    
    // Hide behind first 'P' and restart
    function hideBehindFirstP() {
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const firstPX = phonepeRect.left + (letterWidth / 2) - 15;
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 12;
        
        cat.style.left = firstPX + 'px';
        cat.style.top = catY + 'px';
        cat.style.opacity = '0.3';
        
        // Restart after a delay
        setTimeout(() => {
            startCatAnimation();
        }, 2000);
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