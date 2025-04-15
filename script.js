// Sample experiments data - replace with your actual experiments
const experiments = [
    {
        title: "Web Development",
        description: "Exploring modern web technologies and creating interactive experiences.",
        image: "images/experiments/web-dev.jpg",
        link: "#"
    },
    {
        title: "Photography",
        description: "Capturing moments and telling stories through the lens.",
        image: "images/experiments/photography.jpg",
        link: "#"
    },
    {
        title: "Home Cafe",
        description: "Experimenting with coffee brewing techniques and recipes.",
        image: "images/experiments/cafe.jpg",
        link: "#"
    }
];

// Sample photos data
const photos = [
    {
        image: "images/photos/photo1.jpg",
        caption: "Beautiful Sunset"
    },
    {
        image: "images/photos/photo2.jpg",
        caption: "City Life"
    },
    {
        image: "images/photos/photo3.jpg",
        caption: "Nature's Beauty"
    },
    {
        image: "images/photos/photo4.jpg",
        caption: "Urban Exploration"
    }
];

// Function to create experiment cards
function createExperimentCard(experiment) {
    return `
        <div class="experiment-card">
            <div class="experiment-image">
                <img src="${experiment.image}" alt="${experiment.title}" onerror="this.src='https://via.placeholder.com/400x300?text=${experiment.title}'">
            </div>
            <h3>${experiment.title}</h3>
            <p>${experiment.description}</p>
            <a href="${experiment.link}" class="btn">View Project</a>
        </div>
    `;
}

// Function to create photo cards
function createPhotoCard(photo) {
    return `
        <div class="photo-card">
            <div class="photo-image">
                <img src="${photo.image}" alt="${photo.caption}" onerror="this.src='https://via.placeholder.com/400x300?text=${photo.caption}'">
            </div>
            <p class="photo-caption">${photo.caption}</p>
        </div>
    `;
}

// Function to load experiments
function loadExperiments() {
    const container = document.getElementById('experiments-container');
    if (container) {
        container.innerHTML = experiments.map(createExperimentCard).join('');
    }
}

// Function to load photos
function loadPhotos() {
    const container = document.querySelector('.photo-gallery');
    if (container) {
        container.innerHTML = photos.map(createPhotoCard).join('');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadExperiments();
    loadPhotos();
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}); 