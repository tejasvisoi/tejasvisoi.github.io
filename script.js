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

    // Pixelated Cat Animation (Based on Reference)
    const phonepeLink = document.querySelector('.phonepe-link');
    let cat = null;
    let isWalking = false;
    let isJumping = false;
    let currentLetterIndex = 0;
    let walkStep = 0;
    let jumpStep = 0;
    let direction = 1; // 1 for right, -1 for left
    const letters = ['P', 'h', 'o', 'n', 'e', 'P', 'e'];
    
    // Create SVG pixelated cat (white with black outlines, side profile)
    function createSVGCat() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 16');
        svg.setAttribute('width', '36');
        svg.setAttribute('height', '24');
        
        // Cat head (white with black outline)
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        head.setAttribute('x', '12');
        head.setAttribute('y', '4');
        head.setAttribute('width', '8');
        head.setAttribute('height', '8');
        head.setAttribute('fill', '#FFFFFF');
        head.setAttribute('stroke', '#000000');
        head.setAttribute('stroke-width', '0.5');
        head.setAttribute('class', 'cat-head');
        svg.appendChild(head);
        
        // Cat ear (triangle)
        const ear = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        ear.setAttribute('points', '12,4 14,2 16,4');
        ear.setAttribute('fill', '#FFFFFF');
        ear.setAttribute('stroke', '#000000');
        ear.setAttribute('stroke-width', '0.5');
        ear.setAttribute('class', 'cat-ear');
        svg.appendChild(ear);
        
        // Cat eye (black)
        const eye = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        eye.setAttribute('x', '14');
        eye.setAttribute('y', '6');
        eye.setAttribute('width', '1');
        eye.setAttribute('height', '1');
        eye.setAttribute('fill', '#000000');
        eye.setAttribute('class', 'cat-eye');
        svg.appendChild(eye);
        
        // Cat nose (black)
        const nose = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        nose.setAttribute('x', '18');
        nose.setAttribute('y', '7');
        nose.setAttribute('width', '1');
        nose.setAttribute('height', '1');
        nose.setAttribute('fill', '#000000');
        nose.setAttribute('class', 'cat-nose');
        svg.appendChild(nose);
        
        // Cat cheek (pink)
        const cheek = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        cheek.setAttribute('x', '19');
        cheek.setAttribute('y', '8');
        cheek.setAttribute('width', '1');
        cheek.setAttribute('height', '1');
        cheek.setAttribute('fill', '#FF69B4');
        cheek.setAttribute('class', 'cat-cheek');
        svg.appendChild(cheek);
        
        // Cat body (white with black outline)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        body.setAttribute('x', '6');
        body.setAttribute('y', '8');
        body.setAttribute('width', '8');
        body.setAttribute('height', '6');
        body.setAttribute('fill', '#FFFFFF');
        body.setAttribute('stroke', '#000000');
        body.setAttribute('stroke-width', '0.5');
        body.setAttribute('class', 'cat-body');
        svg.appendChild(body);
        
        // Cat front leg
        const frontLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        frontLeg.setAttribute('x', '10');
        frontLeg.setAttribute('y', '14');
        frontLeg.setAttribute('width', '2');
        frontLeg.setAttribute('height', '2');
        frontLeg.setAttribute('fill', '#FFFFFF');
        frontLeg.setAttribute('stroke', '#000000');
        frontLeg.setAttribute('stroke-width', '0.5');
        frontLeg.setAttribute('class', 'cat-front-leg');
        svg.appendChild(frontLeg);
        
        // Cat back leg
        const backLeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backLeg.setAttribute('x', '6');
        backLeg.setAttribute('y', '14');
        backLeg.setAttribute('width', '2');
        backLeg.setAttribute('height', '2');
        backLeg.setAttribute('fill', '#FFFFFF');
        backLeg.setAttribute('stroke', '#000000');
        backLeg.setAttribute('stroke-width', '0.5');
        backLeg.setAttribute('class', 'cat-back-leg');
        svg.appendChild(backLeg);
        
        // Cat tail (checkered pattern)
        const tail1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tail1.setAttribute('x', '4');
        tail1.setAttribute('y', '10');
        tail1.setAttribute('width', '2');
        tail1.setAttribute('height', '2');
        tail1.setAttribute('fill', '#FFFFFF');
        tail1.setAttribute('stroke', '#000000');
        tail1.setAttribute('stroke-width', '0.5');
        tail1.setAttribute('class', 'cat-tail-segment');
        svg.appendChild(tail1);
        
        const tail2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tail2.setAttribute('x', '2');
        tail2.setAttribute('y', '10');
        tail2.setAttribute('width', '2');
        tail2.setAttribute('height', '2');
        tail2.setAttribute('fill', '#000000');
        tail2.setAttribute('stroke', '#000000');
        tail2.setAttribute('stroke-width', '0.5');
        tail2.setAttribute('class', 'cat-tail-segment');
        svg.appendChild(tail2);
        
        const tail3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        tail3.setAttribute('x', '0');
        tail3.setAttribute('y', '10');
        tail3.setAttribute('width', '2');
        tail3.setAttribute('height', '2');
        tail3.setAttribute('fill', '#FFFFFF');
        tail3.setAttribute('stroke', '#000000');
        tail3.setAttribute('stroke-width', '0.5');
        tail3.setAttribute('class', 'cat-tail-segment');
        svg.appendChild(tail3);
        
        return svg;
    }
    
    // Animate cat walking motion
    function animateWalking() {
        if (!cat || !isWalking) return;
        
        const frontLeg = cat.querySelector('.cat-front-leg');
        const backLeg = cat.querySelector('.cat-back-leg');
        
        if (frontLeg && backLeg) {
            const step = Math.sin(walkStep) * 1;
            
            // Animate legs for walking
            frontLeg.setAttribute('y', (14 - step) + '');
            backLeg.setAttribute('y', (14 + step) + '');
            
            walkStep += 0.4;
        }
    }
    
    // Animate cat jumping motion
    function animateJumping() {
        if (!cat || !isJumping) return;
        
        const catBody = cat.querySelector('.cat-body');
        const catHead = cat.querySelector('.cat-head');
        const catEar = cat.querySelector('.cat-ear');
        const frontLeg = cat.querySelector('.cat-front-leg');
        const backLeg = cat.querySelector('.cat-back-leg');
        
        if (catBody && catHead && catEar && frontLeg && backLeg) {
            const jumpHeight = Math.sin(jumpStep) * 6;
            
            // Move cat up and down
            catBody.setAttribute('y', (8 - jumpHeight) + '');
            catHead.setAttribute('y', (4 - jumpHeight) + '');
            catEar.setAttribute('points', `12,${4 - jumpHeight} 14,${2 - jumpHeight} 16,${4 - jumpHeight}`);
            
            // Animate legs for jumping
            frontLeg.setAttribute('y', (14 - jumpHeight) + '');
            backLeg.setAttribute('y', (14 - jumpHeight) + '');
            
            jumpStep += 0.5;
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
        // Start at the first 'P' position
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const startX = phonepeRect.left + (letterWidth / 2) - 18;
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 12; // At word level
        
        cat.style.left = startX + 'px';
        cat.style.top = catY + 'px';
        
        currentLetterIndex = 0;
        direction = 1;
        
        // Start walking
        setTimeout(() => {
            isWalking = true;
            walkToNextLetter();
        }, 500);
    }
    
    // Walk to the next letter
    function walkToNextLetter() {
        if (currentLetterIndex >= letters.length) {
            // Reached the end, turn around
            direction = -1;
            currentLetterIndex = letters.length - 1;
            setTimeout(() => {
                walkToNextLetter();
            }, 500);
            return;
        }
        
        if (currentLetterIndex < 0) {
            // Reached the beginning, turn around
            direction = 1;
            currentLetterIndex = 0;
            setTimeout(() => {
                walkToNextLetter();
            }, 500);
            return;
        }
        
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const targetX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2) - 18;
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 12;
        
        const currentX = parseFloat(cat.style.left);
        const distance = targetX - currentX;
        const steps = Math.abs(distance) / 2;
        let currentStep = 0;
        
        isWalking = true;
        
        const walkInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const newX = currentX + (distance * progress);
            
            cat.style.left = newX + 'px';
            
            // Animate walking
            animateWalking();
            
            if (currentStep >= steps) {
                clearInterval(walkInterval);
                isWalking = false;
                
                // Step on the letter (make it move down)
                stepOnLetter(currentLetterIndex);
                
                // Jump to next letter
                setTimeout(() => {
                    currentLetterIndex += direction;
                    jumpToNextLetter();
                }, 300);
            }
        }, 50);
    }
    
    // Jump to the next letter
    function jumpToNextLetter() {
        if (currentLetterIndex >= letters.length || currentLetterIndex < 0) {
            walkToNextLetter();
            return;
        }
        
        const phonepeRect = phonepeLink.getBoundingClientRect();
        const letterWidth = phonepeRect.width / letters.length;
        const targetX = phonepeRect.left + (currentLetterIndex * letterWidth) + (letterWidth / 2) - 18;
        const catY = phonepeRect.top + (phonepeRect.height / 2) - 12;
        
        const currentX = parseFloat(cat.style.left);
        const distance = targetX - currentX;
        const steps = Math.abs(distance) / 3;
        let currentStep = 0;
        
        isJumping = true;
        jumpStep = 0;
        
        const jumpInterval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const newX = currentX + (distance * progress);
            
            cat.style.left = newX + 'px';
            
            // Animate jumping
            animateJumping();
            
            if (currentStep >= steps) {
                clearInterval(jumpInterval);
                isJumping = false;
                
                // Land on the letter (make it move down)
                stepOnLetter(currentLetterIndex);
                
                // Continue to next letter
                setTimeout(() => {
                    currentLetterIndex += direction;
                    walkToNextLetter();
                }, 200);
            }
        }, 50);
    }
    
    // Make letter move down when stepped on
    function stepOnLetter(letterIndex) {
        const phonepeLink = document.querySelector('.phonepe-link');
        const text = phonepeLink.textContent;
        
        // Create a temporary span to measure letter positions
        const tempSpan = document.createElement('span');
        tempSpan.style.font = window.getComputedStyle(phonepeLink).font;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempSpan);
        
        // Find the letter position
        let letterStart = 0;
        for (let i = 0; i < letterIndex; i++) {
            letterStart += letters[i].length;
        }
        
        // Create a span for the specific letter
        const letterSpan = document.createElement('span');
        letterSpan.textContent = letters[letterIndex];
        letterSpan.style.transition = 'transform 0.2s ease';
        letterSpan.style.display = 'inline-block';
        
        // Replace the letter in the text
        const newText = text.substring(0, letterStart) + 
                       `<span class="stepped-letter" style="transition: transform 0.2s ease; display: inline-block;">${letters[letterIndex]}</span>` + 
                       text.substring(letterStart + letters[letterIndex].length);
        
        phonepeLink.innerHTML = newText;
        
        // Move the letter down
        const steppedLetter = phonepeLink.querySelector('.stepped-letter');
        if (steppedLetter) {
            steppedLetter.style.transform = 'translateY(2px)';
            
            // Move it back up after a short delay
            setTimeout(() => {
                steppedLetter.style.transform = 'translateY(0px)';
            }, 200);
        }
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