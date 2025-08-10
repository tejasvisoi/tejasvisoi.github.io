// Main JavaScript for Homepage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize visit tracker with fun time tracking
    initTimeTracker();
    
    // Initialize bottom sheet navigation
    initBottomSheetNavigation();
    
    // Initialize custom cursor
    setupCustomCursor();
    
    // Initialize GSAP animations
    initAnimations();
});

// Fun Time Tracker
function initTimeTracker() {
    const lastVisitText = document.getElementById('last-visit-text');
    const catContainer = document.querySelector('.cat-container');
    const visitTracker = document.querySelector('.visit-tracker');
    
    // State variables
    let startTime = Date.now();
    let totalTimeSpent = parseInt(localStorage.getItem('totalTimeSpent')) || 0;
    let originalText = '';
    window.isHovering = false;
    
    // Time formatting utility
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    // Quirky message generator
    function getQuirkyMessage(totalSeconds) {
        if (totalSeconds <= 10) return "JUST GETTING STARTED? 👀";
        if (totalSeconds <= 30) return "30 SECONDS ALREADY? THAT'S COMMITMENT! ⏰";
        if (totalSeconds <= 60) return "YOU'VE OFFICIALLY SPENT MORE TIME HERE THAN ON SOME HINGE DATES 💔";
        if (totalSeconds <= 300) return "OKAY, NOW WE'RE BASICALLY FRIENDS 🤝";
        return "RENT'S DUE NEXT WEEK IF YOU STAY LONGER 🏠";
    }
    
    // Time tracker update
    function updateTimeTracker() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        
        if (!window.isHovering) {
            lastVisitText.textContent = `You have spent ${formatTime(totalTime)} here.`;
        }
        
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    }
    
    // Hover interactions for time tracker
    if (lastVisitText) {
        lastVisitText.addEventListener('mouseenter', function() {
            window.isHovering = true;
            const currentTime = Date.now();
            const sessionTime = currentTime - startTime;
            const totalTime = totalTimeSpent + sessionTime;
            const totalSeconds = Math.floor(totalTime / 1000);
            
            originalText = this.textContent;
            this.textContent = getQuirkyMessage(totalSeconds);
        });
        
        lastVisitText.addEventListener('mouseleave', function() {
            window.isHovering = false;
            this.textContent = originalText;
        });
    }
    
    // Cat animation
    function initCatAnimation() {
        if (!catContainer || !visitTracker || typeof gsap === 'undefined') return;
        
        const catSprite = catContainer.querySelector('.cat-sprite');
        if (!catSprite) return;
        
        // Position cat below visit tracker and start off-screen
        const visitTrackerRect = visitTracker.getBoundingClientRect();
        catContainer.style.top = (visitTrackerRect.bottom + 10) + 'px';
        catContainer.style.left = '0px';
        
        // Start cat completely off-screen and invisible
        gsap.set(catContainer, { 
            x: window.innerWidth, 
            opacity: 0 
        });
        
        function walkAnimation() {
            const screenWidth = window.innerWidth;
            const catWidth = 60;
            const animationDuration = screenWidth >= 1440 ? 180 : 60; // 3 min on large screens, 1 min on others
            
            // Start from right side and make visible
            gsap.set(catContainer, { 
                x: screenWidth, 
                opacity: 1 
            });
            gsap.set(catSprite, { scaleX: -1 });
            
            gsap.to(catContainer, {
                x: -(catWidth),
                duration: animationDuration,
                ease: "none",
                onComplete: () => {
                    // Hide cat and wait before next animation
                    gsap.set(catContainer, { opacity: 0 });
                    setTimeout(walkAnimation, 1000);
                }
            });
        }
        
        // Start the animation after a delay
        setTimeout(walkAnimation, 1000);
    }
    
    // Initialize functionality
    updateTimeTracker();
    setInterval(updateTimeTracker, 1000);
    
    // Initialize cat animation
    if (typeof gsap !== 'undefined') {
        initCatAnimation();
    } else {
        window.addEventListener('load', initCatAnimation);
    }
    
    // Save time on page unload
    window.addEventListener('beforeunload', function() {
        const currentTime = Date.now();
        const sessionTime = currentTime - startTime;
        const totalTime = totalTimeSpent + sessionTime;
        localStorage.setItem('totalTimeSpent', totalTime.toString());
    });
}

// Bottom Sheet Navigation System
let isSheetOpen = false;
let navigationHistory = [];
let currentHistoryIndex = -1;
let currentSheetName = null;

function initBottomSheetNavigation() {
    const overlay = document.getElementById('bottomSheetOverlay');
    const sheet = document.getElementById('bottomSheet');
    const closeBtn = document.getElementById('sheetCloseBtn');
    const backBtn = document.getElementById('sheetBackBtn');
    const content = document.getElementById('sheetContent');
    
    // Debug logging
    console.log('Initializing bottom sheet navigation');
    console.log('Overlay:', overlay);
    console.log('Sheet:', sheet);
    console.log('Close button:', closeBtn);
    console.log('Back button:', backBtn);
    console.log('Content:', content);
    
    if (!overlay || !sheet || !closeBtn || !backBtn || !content) {
        console.error('Some bottom sheet elements are missing');
        return;
    }
    
    document.querySelectorAll('[data-sheet]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openSheet(this.getAttribute('data-sheet'));
        });
    });
    
    closeBtn.addEventListener('click', closeSheet);
    backBtn.addEventListener('click', navigateBack);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSheet(); });
    
    document.addEventListener('keydown', function(e) {
        if (!isSheetOpen) return;
        if (e.key === 'Escape') closeSheet();
        if (e.key === 'ArrowLeft') navigateBack();
    });
    
    // Touch gestures for mobile
    let startY = 0;
    let startScrollTop = 0;
    
    sheet.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startScrollTop = content.scrollTop;
    });
    
    sheet.addEventListener('touchmove', function(e) {
        if (!isSheetOpen) return;
        
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        // If scrolling up (expanding), allow normal scroll
        if (deltaY > 0) {
            return;
        }
        
        // If scrolling down (collapsing) and at top of content
        if (deltaY < 0 && content.scrollTop <= 0) {
            e.preventDefault();
            
            // Calculate collapse progress
            const collapseProgress = Math.min(Math.abs(deltaY) / 100, 1);
            const scale = 1 - (collapseProgress * 0.1);
            const translateY = collapseProgress * 50;
            
            sheet.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            overlay.style.opacity = 1 - collapseProgress;
        }
    });
    
    sheet.addEventListener('touchend', function(e) {
        if (!isSheetOpen) return;
        
        const currentY = e.changedTouches[0].clientY;
        const deltaY = startY - currentY;
        
        // If significant downward swipe, close the sheet
        if (deltaY < -100) {
            closeSheet();
        } else {
            // Reset transform
            sheet.style.transform = '';
            overlay.style.opacity = '';
        }
    });
    
    // Scroll-based expansion for case studies
    content.addEventListener('scroll', function() {
        if (!isSheetOpen) return;
        
        const scrollTop = content.scrollTop;
        const isCaseStudy = currentSheetName && currentSheetName !== 'portfolio';
        
        if (isCaseStudy) {
            // Start expanding after 50px scroll
            if (scrollTop > 50) {
                sheet.classList.add('expanded');
                overlay.classList.add('expanded');
            } else {
                sheet.classList.remove('expanded');
                overlay.classList.remove('expanded');
            }
        }
    });
}

function openSheet(sheetName) {
    const overlay = document.getElementById('bottomSheetOverlay');
    const content = document.getElementById('sheetContent');
    const container = document.querySelector('.container');
    const sheetTitle = document.getElementById('sheetTitle');
    
    // Set current sheet name
    currentSheetName = sheetName;
    
    // Set sheet title
    sheetTitle.textContent = getSheetTitle(sheetName);
    
    // Add to navigation history
    addToHistory(sheetName);
    
    // Show loading state
    content.innerHTML = '<div class="loading-spinner"></div>';
    content.classList.add('loading');
    
    // Load content
    loadSheetContent(sheetName).then(() => {
        // Show sheet with animation
        overlay.classList.add('active');
        isSheetOpen = true;
        
        // Blur the homepage
        if (container) container.style.filter = 'blur(3px)';
        
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
    console.log('closeSheet called');
    const overlay = document.getElementById('bottomSheetOverlay');
    const container = document.querySelector('.container');
    
    if (!overlay) {
        console.error('Overlay not found in closeSheet');
        return;
    }
    
    overlay.classList.remove('active');
    isSheetOpen = false;
    
    // Clear navigation history and current sheet
    navigationHistory = [];
    currentHistoryIndex = -1;
    currentSheetName = null;
    
    // Remove blur from homepage
    if (container) container.style.filter = 'none';
    
    // Reset page title
    document.title = 'Tejasvi Soi - Portfolio';
    
    console.log('Sheet closed successfully');
}

function addToHistory(sheetName) {
    // If we're navigating to a new sheet, clear any forward history
    if (currentHistoryIndex < navigationHistory.length - 1) {
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    }
    
    // Add new sheet to history
    navigationHistory.push(sheetName);
    currentHistoryIndex = navigationHistory.length - 1;
}

function navigateBack() {
    console.log('navigateBack called, currentHistoryIndex:', currentHistoryIndex);
    
    if (currentHistoryIndex > 0) {
        // Go back to previous sheet in history
        currentHistoryIndex--;
        const previousSheet = navigationHistory[currentHistoryIndex];
        
        console.log('Navigating back to:', previousSheet);
        
        // Set current sheet name
        currentSheetName = previousSheet;
        
        // Set sheet title
        const sheetTitle = document.getElementById('sheetTitle');
        sheetTitle.textContent = getSheetTitle(previousSheet);
        
        const content = document.getElementById('sheetContent');
        content.innerHTML = '<div class="loading-spinner"></div>';
        content.classList.add('loading');
        
        loadSheetContent(previousSheet).then(() => {
            content.classList.remove('loading');
            document.title = `${getSheetTitle(previousSheet)} - Tejasvi Soi`;
        }).catch(error => {
            console.error('Error loading previous sheet:', error);
            content.innerHTML = '<p>Error loading content. Please try again.</p>';
            content.classList.remove('loading');
        });
    } else {
        // If no more history, close the sheet
        console.log('No more history, closing sheet');
        closeSheet();
    }
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
            case 'dunzo':
            case 'porter':
            case 'eurekaforbes':
            case 'phonepe':
            case 'obvious':
            case 'ekanaclub':
                htmlContent = await loadProjectContent(sheetName);
                // Add case study wrapper for proper styling
                htmlContent = `<div class="case-study-wrapper">${htmlContent}</div>`;
                break;
            default:
                htmlContent = '<h1>Page Not Found</h1><p>The requested page could not be found.</p>';
        }
        
        content.innerHTML = htmlContent;
        
        // Initialize portfolio content if needed
        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            renderPortfolioProjects();
        }
        
        // Reset scroll position for new content
        content.scrollTop = 0;
        
    } catch (error) {
        throw error;
    }
}

async function loadPortfolioContent() {
    // Load the portfolio page content
    const response = await fetch('portfolio.html');
    const html = await response.text();
    
    // Extract only the hero and main content from portfolio.html (excluding navigation)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Get only the hero and main content (skip navigation)
    const hero = doc.querySelector('.pentagram-hero');
    const main = doc.querySelector('.pentagram-main');
    
    let htmlContent = '';
    
    if (hero) {
        htmlContent += hero.outerHTML;
    }
    
    if (main) {
        htmlContent += main.outerHTML;
    }
    
    if (htmlContent) {
        return htmlContent;
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
    
    // Get the body content without head/script tags
    const bodyContent = doc.querySelector('body');
    if (bodyContent) {
        // Remove any script tags and return clean HTML
        const scripts = bodyContent.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        return bodyContent.innerHTML;
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
        'eurekaforbes': 'Eureka Forbes',
        'phonepe': 'PhonePe',
        'obvious': 'Obvious New Website',
        'ekanaclub': 'Ekana Club'
    };
    
    return titles[sheetName] || 'Project';
}

// Portfolio functionality for bottom sheet
function renderPortfolioProjects() {
    // Project data with specified titles and order
    const projects = [
        {
            id: 1,
            title: "PhonePe",
            description: "Designing India's leading digital payment platform with intuitive user interfaces.",
            image: "phonepe",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["Payment", "Mobile App", "Fintech"],
            year: "2024",
            sheetName: "phonepe"
        },
        {
            id: 2,
            title: "Google Pay",
            description: "Redesigning the future of digital payments with a focus on accessibility and user experience.",
            image: "googlepay",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["UX Design", "Mobile App", "Fintech"],
            year: "2024",
            sheetName: "googlepay"
        },
        {
            id: 3,
            title: "Dunzo",
            description: "Revolutionizing last-mile delivery with intuitive interface design and seamless user journeys.",
            image: "dunzo",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["UI Design", "Logistics", "Mobile"],
            year: "2024",
            sheetName: "dunzo"
        },
        {
            id: 4,
            title: "Eureka Forbes",
            description: "Modernizing a legacy brand with contemporary visual identity and digital presence.",
            image: "eurekaforbes",
            discipline: "brand-identity",
            sector: "consumer-brands",
            tags: ["Brand Identity", "Digital", "Consumer"],
            year: "2023",
            sheetName: "eurekaforbes"
        },
        {
            id: 5,
            title: "Porter",
            description: "Creating seamless logistics solutions with innovative design and user-centric experiences.",
            image: "porter",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["Logistics", "Platform Design", "B2B"],
            year: "2023",
            sheetName: "porter"
        }
    ];

    const visualProjects = [
        {
            id: 6,
            title: "Obvious New Website",
            description: "Redesigning the digital presence with modern aesthetics and improved user experience.",
            image: "obvious",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["Web Design", "Brand Identity", "Digital"],
            year: "2024",
            sheetName: "obvious"
        },
        {
            id: 7,
            title: "Ekana Club",
            description: "Building a premium lifestyle platform with sophisticated design and curated experiences.",
            image: "ekanaclub",
            discipline: "brand-identity",
            sector: "fashion-beauty",
            tags: ["Luxury", "Brand Identity", "Lifestyle"],
            year: "2023",
            sheetName: "ekanaclub"
        }
    ];

    const grid = document.getElementById('projectsGrid');
    
    // Render main projects
    const mainProjectsHTML = projects.map(project => createProjectCard(project)).join('');
    
    // Create divider section
    const dividerHTML = `
        <div class="projects-divider">
            <h2 class="divider-title">Some Visual Projects</h2>
        </div>
    `;
    
    // Render visual projects
    const visualProjectsHTML = visualProjects.map(project => createProjectCard(project)).join('');
    
    // Combine all HTML
    grid.innerHTML = mainProjectsHTML + dividerHTML + visualProjectsHTML;
    
    // Add click handlers to project cards
    setTimeout(() => {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');
                const allProjects = [...projects, ...visualProjects];
                const project = allProjects.find(p => p.id == projectId);
                
                if (project && project.sheetName) {
                    // Open the same project sheet as homepage links
                    openSheet(project.sheetName);
                }
            });
        });
    }, 100);
}

function createProjectCard(project) {
    return `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-image">
                ${project.image ? `<img src="images/projects/${project.image}.jpg" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='${project.title.toUpperCase()}';">` : project.title.toUpperCase()}
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-meta">
                <span>${project.discipline.replace('-', ' ')}</span>
                <span>${project.year}</span>
            </div>
        </div>
    `;
}

// Custom Cursor
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    if (!cursor) {
        console.error('Custom cursor element not found');
        return;
    }
    
    console.log('Custom cursor initialized');
    
    // Set initial position
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(245, 245, 245, 1)';
            cursor.style.borderColor = 'rgba(245, 245, 245, 1)';
            cursor.style.boxShadow = '0 0 15px rgba(245, 245, 245, 0.8)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(245, 245, 245, 1)';
            cursor.style.borderColor = 'rgba(245, 245, 245, 1)';
            cursor.style.boxShadow = '0 0 15px rgba(245, 245, 245, 0.8)';
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