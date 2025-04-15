// Sample experiments data - you can replace this with your actual experiments
const experiments = [
    {
        title: "Experiment 1",
        description: "A brief description of your first experiment",
        image: "path/to/experiment1.jpg",
        link: "#"
    },
    {
        title: "Experiment 2",
        description: "A brief description of your second experiment",
        image: "path/to/experiment2.jpg",
        link: "#"
    }
    // Add more experiments as needed
];

// Function to create experiment cards
function createExperimentCard(experiment) {
    return `
        <div class="experiment-card">
            <img src="${experiment.image}" alt="${experiment.title}">
            <h3>${experiment.title}</h3>
            <p>${experiment.description}</p>
            <a href="${experiment.link}" class="btn">Learn More</a>
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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadExperiments();
    
    // Add your introduction paragraph
    const aboutMe = document.querySelector('.about-me p');
    if (aboutMe) {
        aboutMe.textContent = "Hi! I'm Tejasvi Soi, a passionate individual who loves exploring new ideas and conducting experiments. This website showcases my journey, projects, and the various experiments I undertake in my free time.";
    }
}); 