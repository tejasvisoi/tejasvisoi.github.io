// Main JavaScript for Homepage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize visit tracker
    updateVisitTracker();
    
    // Initialize bottom sheet navigation
    initBottomSheetNavigation();
    
    // Initialize custom cursor
    setupCustomCursor();
    
    // Initialize GSAP animations
    initAnimations();
});

// Visit Tracker
function updateVisitTracker() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date();
    const lastVisitText = document.getElementById('last-visit-text');
    
    if (lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const timeDiff = currentTime - lastVisitDate;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            lastVisitText.textContent = "Welcome back! You visited today.";
        } else if (daysDiff === 1) {
            lastVisitText.textContent = "Welcome back! You visited yesterday.";
        } else {
            lastVisitText.textContent = `Welcome back! You visited ${daysDiff} days ago.`;
        }
    } else {
        lastVisitText.textContent = "Welcome! This is your first visit.";
    }
    
    localStorage.setItem('lastVisit', currentTime.toISOString());
}

// Bottom Sheet Navigation System
let navigationHistory = [];
let currentHistoryIndex = -1;
let isSheetOpen = false;

function initBottomSheetNavigation() {
    const overlay = document.getElementById('bottomSheetOverlay');
    const sheet = document.getElementById('bottomSheet');
    const closeBtn = document.getElementById('sheetCloseBtn');
    const backBtn = document.getElementById('navBackBtn');
    const forwardBtn = document.getElementById('navForwardBtn');
    const content = document.getElementById('sheetContent');
    
    // Sheet links
    const sheetLinks = document.querySelectorAll('[data-sheet]');
    sheetLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sheetName = this.getAttribute('data-sheet');
            openSheet(sheetName);
        });
    });
    
    // Close button
    closeBtn.addEventListener('click', closeSheet);
    
    // Overlay click to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeSheet();
        }
    });
    
    // Navigation buttons
    backBtn.addEventListener('click', navigateBack);
    forwardBtn.addEventListener('click', navigateForward);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (!isSheetOpen) return;
        
        if (e.key === 'Escape') {
            closeSheet();
        } else if (e.key === 'ArrowLeft' && !backBtn.disabled) {
            navigateBack();
        } else if (e.key === 'ArrowRight' && !forwardBtn.disabled) {
            navigateForward();
        }
    });
    
    // Touch gestures for mobile
    let startY = 0;
    let currentY = 0;
    
    sheet.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    sheet.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        if (deltaY > 0) {
            sheet.style.transform = `translateY(${deltaY * 0.5}px)`;
        }
    });
    
    sheet.addEventListener('touchend', function(e) {
        const deltaY = currentY - startY;
        
        if (deltaY > 100) {
            closeSheet();
        } else {
            sheet.style.transform = 'translateY(0)';
        }
    });
}

function openSheet(sheetName) {
    const overlay = document.getElementById('bottomSheetOverlay');
    const content = document.getElementById('sheetContent');
    
    // Show loading state
    content.innerHTML = '<div class="loading-spinner"></div>';
    content.classList.add('loading');
    
    // Add to navigation history
    addToHistory(sheetName);
    
    // Load content
    loadSheetContent(sheetName).then(() => {
        // Show sheet with animation
        overlay.classList.add('active');
        isSheetOpen = true;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Remove loading state
        content.classList.remove('loading');
        
        // Update page title
        document.title = `${getSheetTitle(sheetName)} - Tejasvi Soi`;
    }).catch(error => {
        console.error('Error loading sheet content:', error);
        content.innerHTML = '<p>Error loading content. Please try again.</p>';
        content.classList.remove('loading');
    });
}

function closeSheet() {
    const overlay = document.getElementById('bottomSheetOverlay');
    
    overlay.classList.remove('active');
    isSheetOpen = false;
    
    // Reset page title
    document.title = 'Tejasvi Soi - Portfolio';
    
    // Clear navigation history when closing
    setTimeout(() => {
        navigationHistory = [];
        currentHistoryIndex = -1;
        updateNavigationButtons();
    }, 400);
}

async function loadSheetContent(sheetName) {
    const content = document.getElementById('sheetContent');
    
    try {
        let htmlContent = '';
        
        switch(sheetName) {
            case 'portfolio':
                htmlContent = await loadPortfolioContent();
                break;
            case 'googlepay':
                htmlContent = await loadProjectContent('googlepay');
                break;
            case 'dunzo':
                htmlContent = await loadProjectContent('dunzo');
                break;
            case 'porter':
                htmlContent = await loadProjectContent('porter');
                break;
            case 'eurekaforbes':
                htmlContent = await loadProjectContent('eurekaforbes');
                break;
            default:
                htmlContent = '<h1>Page Not Found</h1><p>The requested page could not be found.</p>';
        }
        
        content.innerHTML = htmlContent;
        
        // Initialize any interactive elements in the loaded content
        initializeSheetContent();
        
    } catch (error) {
        throw error;
    }
}

async function loadPortfolioContent() {
    // Load the portfolio page content
    const response = await fetch('portfolio.html');
    const html = await response.text();
    
    // Extract the main content from portfolio.html
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mainContent = doc.querySelector('.pentagram-main');
    
    if (mainContent) {
        return mainContent.innerHTML;
    } else {
        return '<h1>Portfolio</h1><p>Portfolio content could not be loaded.</p>';
    }
}

async function loadProjectContent(projectName) {
    // Load individual project page content
    const response = await fetch(`${projectName}.html`);
    const html = await response.text();
    
    // Extract the main content from project page
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const mainContent = doc.querySelector('main') || doc.querySelector('.container');
    
    if (mainContent) {
        return mainContent.innerHTML;
    } else {
        return `<h1>${getSheetTitle(projectName)}</h1><p>Project content could not be loaded.</p>`;
    }
}

function getSheetTitle(sheetName) {
    const titles = {
        'portfolio': 'Full Portfolio',
        'googlepay': 'Google Pay',
        'dunzo': 'Dunzo',
        'porter': 'Porter',
        'eurekaforbes': 'Eureka Forbes'
    };
    
    return titles[sheetName] || 'Project';
}

function addToHistory(sheetName) {
    // Remove any future history if navigating back and then to a new page
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    }
    
    navigationHistory.push(sheetName);
    currentHistoryIndex = navigationHistory.length - 1;
}

function navigateBack() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const sheetName = navigationHistory[currentHistoryIndex];
        loadSheetContent(sheetName);
        updateNavigationButtons();
        document.title = `${getSheetTitle(sheetName)} - Tejasvi Soi`;
    }
}

function navigateForward() {
    if (currentHistoryIndex < navigationHistory.length - 1) {
        currentHistoryIndex++;
        const sheetName = navigationHistory[currentHistoryIndex];
        loadSheetContent(sheetName);
        updateNavigationButtons();
        document.title = `${getSheetTitle(sheetName)} - Tejasvi Soi`;
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('navBackBtn');
    const forwardBtn = document.getElementById('navForwardBtn');
    
    backBtn.disabled = currentHistoryIndex <= 0;
    forwardBtn.disabled = currentHistoryIndex >= navigationHistory.length - 1;
}

function initializeSheetContent() {
    // Initialize any interactive elements in the loaded content
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            if (projectId) {
                // Navigate to specific project within the sheet
                const projectName = getProjectNameById(projectId);
                if (projectName) {
                    addToHistory(projectName);
                    loadSheetContent(projectName);
                    updateNavigationButtons();
                }
            }
        });
    });
}

function getProjectNameById(projectId) {
    const projectMap = {
        '1': 'phonepe',
        '2': 'googlepay',
        '3': 'dunzo',
        '4': 'eurekaforbes',
        '5': 'porter',
        '6': 'obvious',
        '7': 'ekanaclub'
    };
    
    return projectMap[projectId];
}

// Custom Cursor
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (!cursor) return;
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(245, 245, 245, 1)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(245, 245, 245, 0.8)';
        });
    });
}

// GSAP Animations
function initAnimations() {
    // Animate main heading
    gsap.from('.main-heading', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.2
    });
    
    // Animate content sections
    gsap.from('.section', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.3,
        delay: 0.5
    });
    
    // Animate cat
    gsap.from('.cat-container', {
        duration: 1.5,
        scale: 0,
        rotation: 360,
        ease: 'back.out(1.7)',
        delay: 1
    });
    
    // Animate visit tracker
    gsap.from('.visit-tracker', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
} 