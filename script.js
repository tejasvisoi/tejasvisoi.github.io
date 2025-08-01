// Minimal retro effects for the portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Add glitch effect data attribute to main heading
    const mainHeading = document.querySelector('.main-heading');
    if (mainHeading) {
        const text = mainHeading.textContent;
        mainHeading.setAttribute('data-text', text);
    }

    // Simple hover effects for links
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });

    // Subtle CRT flicker effect
    let flickerInterval = setInterval(() => {
        const flicker = Math.random() * 0.1;
        document.body.style.opacity = 1 - flicker;
    }, 100);

    // Stop flicker after 5 seconds
    setTimeout(() => {
        clearInterval(flickerInterval);
        document.body.style.opacity = 1;
    }, 5000);

    // Add retro cursor effect
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 2px;
        height: 20px;
        background: #FF6B35;
        pointer-events: none;
        z-index: 9999;
        animation: blink 1s infinite;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add CSS for cursor blink animation
    const cursorCSS = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = cursorCSS;
    document.head.appendChild(style);
}); 