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
        
        // Position cat below visit tracker
        const visitTrackerRect = visitTracker.getBoundingClientRect();
        catContainer.style.top = (visitTrackerRect.bottom + 10) + 'px';
        
        function walkAnimation() {
            const screenWidth = window.innerWidth;
            const catWidth = 60;
            const animationDuration = screenWidth >= 1440 ? 180 : 60; // 3 min on large screens, 1 min on others
            
            // Always start from the right side
            gsap.set(catContainer, { 
                x: screenWidth, 
                opacity: 1,
                clearProps: "x" // Clear any previous transforms
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
let navigationHistory = [];
let currentHistoryIndex = -1;
let isSheetOpen = false;

function initBottomSheetNavigation() {
    const overlay = document.getElementById('bottomSheetOverlay');
    const sheet = document.getElementById('bottomSheet');
    const closeBtn = document.getElementById('sheetCloseBtn');
    const backBtn = document.getElementById('sheetBackBtn');
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
    
    // Back button
    backBtn.addEventListener('click', function() {
        if (navigationHistory.length > 1) {
            navigateBack();
        } else {
            closeSheet();
        }
    });
    
    // Overlay click to close
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeSheet();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (!isSheetOpen) return;
        
        if (e.key === 'Escape') {
            closeSheet();
        } else if (e.key === 'ArrowLeft') {
            if (navigationHistory.length > 1) {
                navigateBack();
            } else {
                closeSheet();
            }
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
    const container = document.querySelector('.container');
    
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
        
        // Blur the homepage (but not the cursor)
        if (container) container.style.filter = 'blur(3px)';
        
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
    const container = document.querySelector('.container');
    
    overlay.classList.remove('active');
    isSheetOpen = false;
    
    // Remove blur from homepage
    if (container) container.style.filter = 'none';
    
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
        document.title = `${getSheetTitle(sheetName)} - Tejasvi Soi`;
    }
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('sheetBackBtn');
    
    // Show/hide back button based on history
    if (navigationHistory.length > 1) {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'none';
    }
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
    
    // If portfolio content is loaded, populate the projects grid
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        renderPortfolioProjects();
    }
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
            year: "2024"
        },
        {
            id: 2,
            title: "Google Pay",
            description: "Redesigning the future of digital payments with a focus on accessibility and user experience.",
            image: "googlepay",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["UX Design", "Mobile App", "Fintech"],
            year: "2024"
        },
        {
            id: 3,
            title: "Dunzo",
            description: "Revolutionizing last-mile delivery with intuitive interface design and seamless user journeys.",
            image: "dunzo",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["UI Design", "Logistics", "Mobile"],
            year: "2024"
        },
        {
            id: 4,
            title: "Eureka Forbes",
            description: "Modernizing a legacy brand with contemporary visual identity and digital presence.",
            image: "eurekaforbes",
            discipline: "brand-identity",
            sector: "consumer-brands",
            tags: ["Brand Identity", "Digital", "Consumer"],
            year: "2023"
        },
        {
            id: 5,
            title: "Porter",
            description: "Creating seamless logistics solutions with innovative design and user-centric experiences.",
            image: "porter",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["Logistics", "Platform Design", "B2B"],
            year: "2023"
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
            year: "2024"
        },
        {
            id: 7,
            title: "Ekana Club",
            description: "Building a premium lifestyle platform with sophisticated design and curated experiences.",
            image: "ekanaclub",
            discipline: "brand-identity",
            sector: "fashion-beauty",
            tags: ["Luxury", "Brand Identity", "Lifestyle"],
            year: "2023"
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
    
    // Setup project cards after rendering
    setTimeout(() => {
        setupPortfolioProjectCards(projects, visualProjects);
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

function setupPortfolioProjectCards(projects, visualProjects) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            const allProjects = [...projects, ...visualProjects];
            const project = allProjects.find(p => p.id == projectId);
            
            if (project) {
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