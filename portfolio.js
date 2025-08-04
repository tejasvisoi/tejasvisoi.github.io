// Portfolio Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let projects = [];
    let currentFilter = 'all';
    let currentSector = 'all';
    let displayedProjects = 8;
    const projectsPerLoad = 4;

    // Load project data from data.json
    async function loadProjectData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            projects = data.portfolio.projects || [];
            init();
        } catch (error) {
            console.error('Error loading project data:', error);
            // Fallback to sample data if loading fails
            projects = getSampleProjects();
            init();
        }
    }

    // Sample project data as fallback
    function getSampleProjects() {
        return [
            {
                id: 1,
                title: "Google Pay",
                description: "Redesigning the future of digital payments with a focus on accessibility and user experience.",
                image: "googlepay",
                discipline: "digital",
                sector: "technology",
                tags: ["UX Design", "Mobile App", "Fintech"],
                year: "2024"
            },
            {
                id: 2,
                title: "Dunzo",
                description: "Revolutionizing last-mile delivery with intuitive interface design and seamless user journeys.",
                image: "dunzo",
                discipline: "digital",
                sector: "technology",
                tags: ["UI Design", "Logistics", "Mobile"],
                year: "2023"
            },
            {
                id: 3,
                title: "Eureka Forbes",
                description: "Modernizing a legacy brand with contemporary visual identity and digital presence.",
                image: "eurekaforbes",
                discipline: "branding",
                sector: "fashion",
                tags: ["Brand Identity", "Digital", "Consumer"],
                year: "2023"
            },
            {
                id: 4,
                title: "Explore",
                description: "Creating immersive digital experiences that connect people with new possibilities.",
                image: "explore",
                discipline: "digital",
                sector: "technology",
                tags: ["Digital Experience", "Innovation", "Platform"],
                year: "2024"
            }
        ];
    }

    // Initialize the page
    function init() {
        renderProjects();
        setupFilters();
        setupLoadMore();
        setupCustomCursor();
    }

    // Render projects based on current filters
    function renderProjects() {
        const grid = document.getElementById('projectsGrid');
        const filteredProjects = filterProjects();
        const projectsToShow = filteredProjects.slice(0, displayedProjects);
        
        grid.innerHTML = projectsToShow.map(project => createProjectCard(project)).join('');
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (filteredProjects.length > displayedProjects) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
        
        // Setup project cards after rendering
        setTimeout(setupProjectCards, 100);
    }

    // Filter projects based on current selections
    function filterProjects() {
        return projects.filter(project => {
            const disciplineMatch = currentFilter === 'all' || project.discipline === currentFilter;
            const sectorMatch = currentSector === 'all' || project.sector === currentSector;
            return disciplineMatch && sectorMatch;
        });
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
                    <span>${project.discipline}</span>
                    <span>${project.year}</span>
                </div>
            </div>
        `;
    }

    // Setup filter functionality
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                const filterGroup = this.closest('.filter-group');
                
                // Remove active class from all buttons in this group
                filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update current filter
                if (filterGroup.querySelector('.filter-title').textContent === 'Discipline') {
                    currentFilter = filterValue;
                } else {
                    currentSector = filterValue;
                }
                
                // Reset displayed projects count and re-render
                displayedProjects = 8;
                renderProjects();
            });
        });
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
        const interactiveElements = document.querySelectorAll('.project-card, .filter-btn, .load-more-btn, .nav-back');
        
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
                
                if (project && project.url && project.url !== '#') {
                    // Navigate to project detail page
                    window.location.href = project.url;
                }
            });
        });
    }

    // Load project data and initialize
    loadProjectData();
}); 