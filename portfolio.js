// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Project data with specified titles
    const projects = [
        {
            id: 1,
            title: "Dunzo",
            description: "Revolutionizing last-mile delivery with intuitive interface design and seamless user journeys.",
            image: "dunzo",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["UI Design", "Logistics", "Mobile"],
            year: "2024"
        },
        {
            id: 2,
            title: "Eureka Forbes",
            description: "Modernizing a legacy brand with contemporary visual identity and digital presence.",
            image: "eurekaforbes",
            discipline: "brand-identity",
            sector: "consumer-brands",
            tags: ["Brand Identity", "Digital", "Consumer"],
            year: "2023"
        },
        {
            id: 3,
            title: "Google Pay",
            description: "Redesigning the future of digital payments with a focus on accessibility and user experience.",
            image: "googlepay",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["UX Design", "Mobile App", "Fintech"],
            year: "2024"
        },
        {
            id: 4,
            title: "Porter",
            description: "Creating seamless logistics solutions with innovative design and user-centric experiences.",
            image: "porter",
            discipline: "digital-experiences",
            sector: "technology",
            tags: ["Logistics", "Platform Design", "B2B"],
            year: "2023"
        },
        {
            id: 5,
            title: "PhonePe",
            description: "Designing India's leading digital payment platform with intuitive user interfaces.",
            image: "phonepe",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["Payment", "Mobile App", "Fintech"],
            year: "2024"
        },
        {
            id: 6,
            title: "Ekana Club",
            description: "Building a premium lifestyle platform with sophisticated design and curated experiences.",
            image: "ekanaclub",
            discipline: "brand-identity",
            sector: "fashion-beauty",
            tags: ["Luxury", "Brand Identity", "Lifestyle"],
            year: "2023"
        },
        {
            id: 7,
            title: "Financial Dashboard",
            description: "Designing intuitive data visualization for complex financial information.",
            image: "finance",
            discipline: "digital-experiences",
            sector: "finance",
            tags: ["Data Viz", "Dashboard", "Fintech"],
            year: "2024"
        },
        {
            id: 8,
            title: "Food Delivery App",
            description: "Streamlining the food ordering experience with elegant interface design.",
            image: "food",
            discipline: "digital-experiences",
            sector: "food-drink",
            tags: ["Mobile App", "UX Design", "Food Tech"],
            year: "2023"
        },
        {
            id: 9,
            title: "Luxury Brand Identity",
            description: "Crafting sophisticated visual identity for premium lifestyle brands.",
            image: "luxury",
            discipline: "brand-identity",
            sector: "fashion-beauty",
            tags: ["Brand Identity", "Luxury", "Typography"],
            year: "2024"
        },
        {
            id: 10,
            title: "Tech Conference",
            description: "Designing immersive event experiences for technology conferences.",
            image: "conference",
            discipline: "campaigns",
            sector: "entertainment",
            tags: ["Event Design", "Digital", "Experience"],
            year: "2023"
        }
    ];

    let displayedProjects = 8;
    const projectsPerLoad = 4;

    // Initialize the page
    function init() {
        renderProjects();
        setupLoadMore();
        setupCustomCursor();
    }

    // Render projects
    function renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const projectsToShow = projects.slice(0, displayedProjects);
        
        grid.innerHTML = projectsToShow.map(project => createProjectCard(project)).join('');
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (projects.length > displayedProjects) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
        // Setup project cards after rendering
        setTimeout(setupProjectCards, 100);
    }

    // Create project card HTML
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

    // Setup load more functionality
    function setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        loadMoreBtn.addEventListener('click', function() {
            displayedProjects += projectsPerLoad;
            renderProjects();
        });
    }

    // Setup custom cursor
    function setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.project-card, .load-more-btn, .nav-link, .see-all-news');
        
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

    // Add project card click handlers
    function setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');
                const project = projects.find(p => p.id == projectId);
                
                if (project) {
                    // Navigate to project detail page or show modal
                    const projectUrl = `${project.title.toLowerCase().replace(/\s+/g, '')}.html`;
                    window.location.href = projectUrl;
                }
            });
        });
    }

    // Initialize the page
    init();
}); 