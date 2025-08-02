// Admin Console JavaScript
class AdminConsole {
    constructor() {
        this.isAuthenticated = false;
        this.adminPassword = 'tejasvi2024'; // Change this to your secure password
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
        this.loadContent();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.authenticate();
            });
        }

        // Navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Section items in homepage editor
        const sectionItems = document.querySelectorAll('.section-item');
        sectionItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchEditorPanel(section);
            });
        });

        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#667eea';
                uploadArea.style.background = '#f1f5f9';
            });
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = '#cbd5e1';
                uploadArea.style.background = '#f8fafc';
            });
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#cbd5e1';
                uploadArea.style.background = '#f8fafc';
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                e.target.closest('.item-row').remove();
            }
        });
    }

    checkAuthentication() {
        const isAuth = sessionStorage.getItem('adminAuthenticated');
        if (isAuth === 'true') {
            this.isAuthenticated = true;
            this.showAdminInterface();
        } else {
            this.showLoginScreen();
        }
    }

    authenticate() {
        const password = document.getElementById('password').value;
        if (password === this.adminPassword) {
            this.isAuthenticated = true;
            sessionStorage.setItem('adminAuthenticated', 'true');
            this.showAdminInterface();
            this.showNotification('Successfully logged in!', 'success');
        } else {
            this.showNotification('Incorrect password!', 'error');
        }
    }

    logout() {
        this.isAuthenticated = false;
        sessionStorage.removeItem('adminAuthenticated');
        this.showLoginScreen();
        this.showNotification('Logged out successfully!', 'success');
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminInterface').style.display = 'none';
    }

    showAdminInterface() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminInterface').style.display = 'flex';
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
    }

    switchEditorPanel(panel) {
        // Update section items
        document.querySelectorAll('.section-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${panel}"]`).classList.add('active');

        // Update editor panels
        document.querySelectorAll('.editor-panel').forEach(panelEl => {
            panelEl.classList.remove('active');
        });
        document.getElementById(`${panel}Editor`).classList.add('active');
    }

    loadContent() {
        // Load homepage content
        this.loadHomepageContent();
        
        // Load case studies
        this.loadCaseStudies();
        
        // Load portfolio
        this.loadPortfolio();
        
        // Load media
        this.loadMedia();
    }

    loadHomepageContent() {
        // This would typically load from a database or API
        // For now, we'll use the current content from the main site
        console.log('Loading homepage content...');
    }

    loadCaseStudies() {
        // Load case studies data
        console.log('Loading case studies...');
    }

    loadPortfolio() {
        // Load portfolio data
        console.log('Loading portfolio...');
    }

    loadMedia() {
        // Load media files
        console.log('Loading media...');
    }

    // Homepage Management
    addPresentItem() {
        const container = document.getElementById('presentItems');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-text" placeholder="Work item">
            <input type="text" class="item-link" placeholder="Link URL">
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(newItem);
    }

    addPastItem() {
        const container = document.getElementById('pastItems');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-text" placeholder="Work item">
            <input type="text" class="item-link" placeholder="Link URL">
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(newItem);
    }

    addSocialItem() {
        const container = document.getElementById('socialItems');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-text" placeholder="Social platform">
            <input type="text" class="item-link" placeholder="Profile URL">
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(newItem);
    }

    saveHomepage() {
        // Collect all form data
        const homepageData = {
            hero: {
                line1: document.getElementById('heroLine1').value,
                line2: document.getElementById('heroLine2').value,
                subtitle: document.getElementById('heroSubtitle').value
            },
            present: {
                title: document.getElementById('presentTitle').value,
                items: this.collectItems('presentItems')
            },
            past: {
                title: document.getElementById('pastTitle').value,
                items: this.collectItems('pastItems')
            },
            social: {
                items: this.collectItems('socialItems')
            }
        };

        // Save to localStorage for demo (in real app, save to server)
        localStorage.setItem('homepageData', JSON.stringify(homepageData));
        this.showNotification('Homepage saved successfully!', 'success');
    }

    collectItems(containerId) {
        const container = document.getElementById(containerId);
        const items = [];
        container.querySelectorAll('.item-row').forEach(row => {
            const text = row.querySelector('.item-text').value;
            const link = row.querySelector('.item-link').value;
            if (text.trim()) {
                items.push({ text, link });
            }
        });
        return items;
    }

    previewHomepage() {
        // Open homepage in new tab for preview
        window.open('../index.html', '_blank');
    }

    // Case Studies Management
    editCaseStudy(slug) {
        this.showNotification(`Editing case study: ${slug}`, 'info');
        // In a real app, this would open a case study editor
    }

    viewCaseStudy(slug) {
        window.open(`../${slug}.html`, '_blank');
    }

    publishCaseStudy(slug) {
        this.showNotification(`Case study ${slug} published!`, 'success');
        // Update status in UI
        const card = document.querySelector(`[onclick="editCaseStudy('${slug}')"]`).closest('.case-study-card');
        const status = card.querySelector('.status');
        status.textContent = 'Published';
        status.className = 'status published';
    }

    createNewCaseStudy() {
        this.showNotification('Creating new case study...', 'info');
        // In a real app, this would open a case study creation form
    }

    // Portfolio Management
    addPortfolioItem() {
        const container = document.getElementById('portfolioItems');
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-text" placeholder="Portfolio item">
            <input type="text" class="item-link" placeholder="Link URL">
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(newItem);
    }

    savePortfolio() {
        const portfolioData = {
            title: document.getElementById('portfolioTitle').value,
            description: document.getElementById('portfolioDescription').value,
            items: this.collectItems('portfolioItems')
        };

        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        this.showNotification('Portfolio saved successfully!', 'success');
    }

    previewPortfolio() {
        window.open('../portfolio.html', '_blank');
    }

    // Media Management
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.uploadFile(file);
            }
        });
    }

    validateFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            this.showNotification(`File type not supported: ${file.name}`, 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification(`File too large: ${file.name}`, 'error');
            return false;
        }

        return true;
    }

    uploadFile(file) {
        // In a real app, this would upload to a server
        // For demo, we'll simulate upload
        this.showNotification(`Uploading ${file.name}...`, 'info');
        
        setTimeout(() => {
            this.showNotification(`${file.name} uploaded successfully!`, 'success');
            this.addMediaItem(file);
        }, 2000);
    }

    addMediaItem(file) {
        const container = document.getElementById('mediaGrid');
        const mediaItem = document.createElement('div');
        mediaItem.className = 'media-item';
        mediaItem.innerHTML = `
            <div class="media-preview">
                <img src="${URL.createObjectURL(file)}" alt="${file.name}">
            </div>
            <div class="media-info">
                <p>${file.name}</p>
                <p>${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        `;
        container.appendChild(mediaItem);
    }

    // Settings
    changePassword() {
        const newPassword = document.getElementById('newPassword').value;
        if (newPassword.length >= 6) {
            this.adminPassword = newPassword;
            this.showNotification('Password updated successfully!', 'success');
            document.getElementById('newPassword').value = '';
        } else {
            this.showNotification('Password must be at least 6 characters!', 'error');
        }
    }

    createBackup() {
        this.showNotification('Creating backup...', 'info');
        // In a real app, this would create a backup of all content
        setTimeout(() => {
            this.showNotification('Backup created successfully!', 'success');
        }, 2000);
    }

    viewAnalytics() {
        this.showNotification('Opening analytics...', 'info');
        // In a real app, this would open analytics dashboard
    }

    // Utility Functions
    previewSite() {
        window.open('../index.html', '_blank');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#667eea',
            warning: '#f59e0b'
        };
        notification.style.background = colors[type] || colors.info;

        // Add close button styles
        notification.querySelector('button').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions for onclick handlers
function switchSection(section) {
    adminConsole.switchSection(section);
}

function addPresentItem() {
    adminConsole.addPresentItem();
}

function addPastItem() {
    adminConsole.addPastItem();
}

function addSocialItem() {
    adminConsole.addSocialItem();
}

function saveHomepage() {
    adminConsole.saveHomepage();
}

function previewHomepage() {
    adminConsole.previewHomepage();
}

function editCaseStudy(slug) {
    adminConsole.editCaseStudy(slug);
}

function viewCaseStudy(slug) {
    adminConsole.viewCaseStudy(slug);
}

function publishCaseStudy(slug) {
    adminConsole.publishCaseStudy(slug);
}

function createNewCaseStudy() {
    adminConsole.createNewCaseStudy();
}

function addPortfolioItem() {
    adminConsole.addPortfolioItem();
}

function savePortfolio() {
    adminConsole.savePortfolio();
}

function previewPortfolio() {
    adminConsole.previewPortfolio();
}

function changePassword() {
    adminConsole.changePassword();
}

function createBackup() {
    adminConsole.createBackup();
}

function viewAnalytics() {
    adminConsole.viewAnalytics();
}

function previewSite() {
    adminConsole.previewSite();
}

// Initialize admin console when DOM is loaded
let adminConsole;
document.addEventListener('DOMContentLoaded', () => {
    adminConsole = new AdminConsole();
}); 