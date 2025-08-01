// Simple hover effects for links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth transitions to all links
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.style.transition = 'color 0.2s ease';
    });

    // Optional: Add a subtle fade-in effect on page load
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        mainContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
}); 