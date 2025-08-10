// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize the page
    function init() {
        renderProjects();
        setupCustomCursor();
    }

    // Render projects
    function renderProjects() {
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

    // Setup custom cursor
    function setupCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.project-card, .nav-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(245, 245, 245, 1)';
                cursor.style.borderColor = 'rgba(245, 245, 245, 1)';
                cursor.style.boxShadow = '0 0 15px rgba(245, 245, 245, 0.5)';
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(245, 245, 245, 0.9)';
                cursor.style.borderColor = 'rgba(245, 245, 245, 0.6)';
                cursor.style.boxShadow = '0 0 10px rgba(245, 245, 245, 0.3)';
            });
        });
    }

    // Add project card click handlers
    function setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                const projectId = this.getAttribute('data-project-id');
                const allProjects = [...projects, ...visualProjects];
                const project = allProjects.find(p => p.id == projectId);
                
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