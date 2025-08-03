class WebsiteContentManager {
    constructor() {
        this.currentSection = 'homepage';
        this.websiteData = {
            homepage: {
                mainHeading1: 'Building, breaking,',
                mainHeading2: 'making things',
                presentWork: [],
                socialLinks: [],
                pastWork: []
            },
            portfolio: {
                heading1: 'Portfolio',
                heading2: 'Coming Soon',
                content: ''
            },
            googlepay: {
                heading1: 'Google Pay',
                heading2: 'Work',
                description: '',
                url: ''
            },
            dunzo: {
                heading1: 'Dunzo',
                heading2: 'Work',
                description: '',
                url: ''
            },
            eurekaforbes: {
                heading1: 'Eureka Forbes',
                heading2: 'Work',
                description: '',
                url: ''
            },
            explore: {
                heading1: 'Explore',
                heading2: 'Work',
                description: '',
                url: ''
            }
        };
        this.autoSaveInterval = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadStoredData();
        this.loadSystemInfo();
        this.startAutoSave();
        this.updateLastSave();
        this.checkGitStatus();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Header buttons
        document.getElementById('previewBtn').addEventListener('click', () => this.previewWebsite());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveChanges());
        document.getElementById('deployBtn').addEventListener('click', () => this.deployToGitHub());
        document.getElementById('commitBtn').addEventListener('click', () => this.openCommitModal());

        // Form inputs - auto-save on change
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => this.autoSave());
        });
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
    }

    async loadStoredData() {
        try {
            const storedData = await window.electronAPI.getStoredData();
            if (storedData && storedData.website) {
                this.websiteData = { ...this.websiteData, ...storedData.website };
                this.populateForms();
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    populateForms() {
        // Homepage
        if (this.websiteData.homepage) {
            document.getElementById('mainHeading1').value = this.websiteData.homepage.mainHeading1 || '';
            document.getElementById('mainHeading2').value = this.websiteData.homepage.mainHeading2 || '';
            this.renderPresentWork();
            this.renderSocialLinks();
            this.renderPastWork();
        }

        // Portfolio
        if (this.websiteData.portfolio) {
            document.getElementById('portfolioHeading1').value = this.websiteData.portfolio.heading1 || '';
            document.getElementById('portfolioHeading2').value = this.websiteData.portfolio.heading2 || '';
            document.getElementById('portfolioContent').value = this.websiteData.portfolio.content || '';
        }

        // Google Pay
        if (this.websiteData.googlepay) {
            document.getElementById('googlepayHeading1').value = this.websiteData.googlepay.heading1 || '';
            document.getElementById('googlepayHeading2').value = this.websiteData.googlepay.heading2 || '';
            document.getElementById('googlepayDescription').value = this.websiteData.googlepay.description || '';
            document.getElementById('googlepayUrl').value = this.websiteData.googlepay.url || '';
        }

        // Dunzo
        if (this.websiteData.dunzo) {
            document.getElementById('dunzoHeading1').value = this.websiteData.dunzo.heading1 || '';
            document.getElementById('dunzoHeading2').value = this.websiteData.dunzo.heading2 || '';
            document.getElementById('dunzoDescription').value = this.websiteData.dunzo.description || '';
            document.getElementById('dunzoUrl').value = this.websiteData.dunzo.url || '';
        }

        // Eureka Forbes
        if (this.websiteData.eurekaforbes) {
            document.getElementById('eurekaforbesHeading1').value = this.websiteData.eurekaforbes.heading1 || '';
            document.getElementById('eurekaforbesHeading2').value = this.websiteData.eurekaforbes.heading2 || '';
            document.getElementById('eurekaforbesDescription').value = this.websiteData.eurekaforbes.description || '';
            document.getElementById('eurekaforbesUrl').value = this.websiteData.eurekaforbes.url || '';
        }

        // Explore
        if (this.websiteData.explore) {
            document.getElementById('exploreHeading1').value = this.websiteData.explore.heading1 || '';
            document.getElementById('exploreHeading2').value = this.websiteData.explore.heading2 || '';
            document.getElementById('exploreDescription').value = this.websiteData.explore.description || '';
            document.getElementById('exploreUrl').value = this.websiteData.explore.url || '';
        }
    }

    collectFormData() {
        const data = {
            homepage: {
                mainHeading1: document.getElementById('mainHeading1').value,
                mainHeading2: document.getElementById('mainHeading2').value,
                presentWork: this.websiteData.homepage.presentWork || [],
                socialLinks: this.websiteData.homepage.socialLinks || [],
                pastWork: this.websiteData.homepage.pastWork || []
            },
            portfolio: {
                heading1: document.getElementById('portfolioHeading1').value,
                heading2: document.getElementById('portfolioHeading2').value,
                content: document.getElementById('portfolioContent').value
            },
            googlepay: {
                heading1: document.getElementById('googlepayHeading1').value,
                heading2: document.getElementById('googlepayHeading2').value,
                description: document.getElementById('googlepayDescription').value,
                url: document.getElementById('googlepayUrl').value
            },
            dunzo: {
                heading1: document.getElementById('dunzoHeading1').value,
                heading2: document.getElementById('dunzoHeading2').value,
                description: document.getElementById('dunzoDescription').value,
                url: document.getElementById('dunzoUrl').value
            },
            eurekaforbes: {
                heading1: document.getElementById('eurekaforbesHeading1').value,
                heading2: document.getElementById('eurekaforbesHeading2').value,
                description: document.getElementById('eurekaforbesDescription').value,
                url: document.getElementById('eurekaforbesUrl').value
            },
            explore: {
                heading1: document.getElementById('exploreHeading1').value,
                heading2: document.getElementById('exploreHeading2').value,
                description: document.getElementById('exploreDescription').value,
                url: document.getElementById('exploreUrl').value
            }
        };

        return data;
    }

    async saveChanges() {
        try {
            const data = this.collectFormData();
            this.websiteData = data;
            
            await window.electronAPI.saveWebsiteData(data);
            this.updateLastSave();
            this.showSuccessMessage('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showErrorMessage('Failed to save changes. Please try again.');
        }
    }

    autoSave() {
        // Debounce auto-save
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveChanges();
        }, 2000);
    }

    startAutoSave() {
        const interval = parseInt(document.getElementById('autoSaveInterval')?.value || 5) * 60 * 1000;
        this.autoSaveInterval = setInterval(() => {
            this.saveChanges();
        }, interval);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }

    updateLastSave() {
        const now = new Date().toLocaleTimeString();
        document.getElementById('lastSave').textContent = `Last saved: ${now}`;
    }

    async previewWebsite() {
        try {
            const data = this.collectFormData();
            await window.electronAPI.previewWebsite(data);
        } catch (error) {
            console.error('Error previewing website:', error);
            this.showErrorMessage('Failed to generate preview.');
        }
    }

    async deployToGitHub() {
        try {
            const data = this.collectFormData();
            await window.electronAPI.deployToGitHub(data);
            this.showSuccessMessage('Successfully deployed to GitHub!');
        } catch (error) {
            console.error('Error deploying to GitHub:', error);
            this.showErrorMessage('Failed to deploy to GitHub. Please check your settings.');
        }
    }

    // Present Work Management
    addPresentWork() {
        const work = {
            id: Date.now(),
            title: '',
            company: '',
            url: ''
        };
        
        this.websiteData.homepage.presentWork.push(work);
        this.renderPresentWork();
    }

    renderPresentWork() {
        const container = document.getElementById('presentWorkContainer');
        container.innerHTML = '';

        this.websiteData.homepage.presentWork.forEach((work, index) => {
            const workElement = document.createElement('div');
            workElement.className = 'link-item';
            workElement.innerHTML = `
                <div class="link-header">
                    <div class="link-title">${work.title || 'New Work'}</div>
                    <div class="project-actions">
                        <button class="btn btn-danger btn-small" onclick="contentManager.deletePresentWork(${index})">🗑️ Delete</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" value="${work.title}" onchange="contentManager.updatePresentWork(${index}, 'title', this.value)" placeholder="e.g., Designing at PhonePe">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Company</label>
                        <input type="text" class="form-input" value="${work.company}" onchange="contentManager.updatePresentWork(${index}, 'company', this.value)" placeholder="e.g., PhonePe">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">URL (optional)</label>
                    <input type="url" class="form-input" value="${work.url}" onchange="contentManager.updatePresentWork(${index}, 'url', this.value)" placeholder="https://...">
                </div>
            `;
            container.appendChild(workElement);
        });
    }

    updatePresentWork(index, field, value) {
        if (this.websiteData.homepage.presentWork[index]) {
            this.websiteData.homepage.presentWork[index][field] = value;
            this.autoSave();
        }
    }

    deletePresentWork(index) {
        if (confirm('Are you sure you want to delete this work item?')) {
            this.websiteData.homepage.presentWork.splice(index, 1);
            this.renderPresentWork();
            this.autoSave();
        }
    }

    // Social Links Management
    addSocialLink() {
        const socialLink = {
            id: Date.now(),
            platform: '',
            url: '',
            icon: ''
        };
        
        this.websiteData.homepage.socialLinks.push(socialLink);
        this.renderSocialLinks();
    }

    renderSocialLinks() {
        const container = document.getElementById('socialLinksContainer');
        container.innerHTML = '';

        this.websiteData.homepage.socialLinks.forEach((link, index) => {
            const linkElement = document.createElement('div');
            linkElement.className = 'link-item';
            linkElement.innerHTML = `
                <div class="link-header">
                    <div class="link-title">${link.platform || 'New Social Link'}</div>
                    <div class="project-actions">
                        <button class="btn btn-danger btn-small" onclick="contentManager.deleteSocialLink(${index})">🗑️ Delete</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Platform</label>
                        <input type="text" class="form-input" value="${link.platform}" onchange="contentManager.updateSocialLink(${index}, 'platform', this.value)" placeholder="e.g., Instagram, Twitter, Email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Icon</label>
                        <input type="text" class="form-input" value="${link.icon}" onchange="contentManager.updateSocialLink(${index}, 'icon', this.value)" placeholder="e.g., 📷, 🐦, ✉️">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">URL</label>
                    <input type="url" class="form-input" value="${link.url}" onchange="contentManager.updateSocialLink(${index}, 'url', this.value)" placeholder="https://... or mailto:...">
                </div>
            `;
            container.appendChild(linkElement);
        });
    }

    updateSocialLink(index, field, value) {
        if (this.websiteData.homepage.socialLinks[index]) {
            this.websiteData.homepage.socialLinks[index][field] = value;
            this.autoSave();
        }
    }

    deleteSocialLink(index) {
        if (confirm('Are you sure you want to delete this social link?')) {
            this.websiteData.homepage.socialLinks.splice(index, 1);
            this.renderSocialLinks();
            this.autoSave();
        }
    }

    // Past Work Management
    addPastWork() {
        const work = {
            id: Date.now(),
            title: '',
            url: '',
            filename: ''
        };
        
        this.websiteData.homepage.pastWork.push(work);
        this.renderPastWork();
    }

    renderPastWork() {
        const container = document.getElementById('pastWorkContainer');
        container.innerHTML = '';

        this.websiteData.homepage.pastWork.forEach((work, index) => {
            const workElement = document.createElement('div');
            workElement.className = 'link-item';
            workElement.innerHTML = `
                <div class="link-header">
                    <div class="link-title">${work.title || 'New Past Work'}</div>
                    <div class="project-actions">
                        <button class="btn btn-danger btn-small" onclick="contentManager.deletePastWork(${index})">🗑️ Delete</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" value="${work.title}" onchange="contentManager.updatePastWork(${index}, 'title', this.value)" placeholder="e.g., Google Pay">
                    </div>
                    <div class="form-group">
                        <label class="form-label">HTML Filename</label>
                        <input type="text" class="form-input" value="${work.filename}" onchange="contentManager.updatePastWork(${index}, 'filename', this.value)" placeholder="e.g., googlepay.html">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">URL (optional)</label>
                    <input type="url" class="form-input" value="${work.url}" onchange="contentManager.updatePastWork(${index}, 'url', this.value)" placeholder="https://...">
                </div>
            `;
            container.appendChild(workElement);
        });
    }

    updatePastWork(index, field, value) {
        if (this.websiteData.homepage.pastWork[index]) {
            this.websiteData.homepage.pastWork[index][field] = value;
            this.autoSave();
        }
    }

    deletePastWork(index) {
        if (confirm('Are you sure you want to delete this past work item?')) {
            this.websiteData.homepage.pastWork.splice(index, 1);
            this.renderPastWork();
            this.autoSave();
        }
    }

    // Utility Functions
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = type === 'success' ? 'success-message' : 'error-message';
        messageElement.textContent = message;
        
        const contentArea = document.querySelector('.content-area');
        contentArea.insertBefore(messageElement, contentArea.firstChild);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    loadSystemInfo() {
        // Load system information
        document.getElementById('connectionStatus').style.background = '#4ade80';
        document.getElementById('connectionText').textContent = 'Connected to GitHub';
    }

    async checkGitStatus() {
        try {
            const status = await window.electronAPI.getGitStatus();
            if (status.success) {
                if (status.hasChanges) {
                    document.getElementById('gitStatus').textContent = `${status.changes.length} changes ready to commit`;
                    document.getElementById('gitStatus').style.color = '#f59e0b';
                } else {
                    document.getElementById('gitStatus').textContent = 'No changes to commit';
                    document.getElementById('gitStatus').style.color = '#10b981';
                }
            } else {
                document.getElementById('gitStatus').textContent = 'Not a git repository';
                document.getElementById('gitStatus').style.color = '#ef4444';
            }
        } catch (error) {
            console.error('Error checking git status:', error);
            document.getElementById('gitStatus').textContent = 'Error checking git status';
            document.getElementById('gitStatus').style.color = '#ef4444';
        }
    }

    async openCommitModal() {
        try {
            // First deploy the changes to generate files
            const data = this.collectFormData();
            await this.deployToGitHub();
            
            // Check git status
            const status = await window.electronAPI.getGitStatus();
            if (!status.success) {
                this.showErrorMessage('Not in a git repository. Please make sure you\'re in your website directory.');
                return;
            }

            if (!status.hasChanges) {
                this.showErrorMessage('No changes to commit.');
                return;
            }

            // Show changes in modal
            const changesList = document.getElementById('changesList');
            changesList.innerHTML = '';
            
            status.changes.forEach(change => {
                const changeElement = document.createElement('div');
                changeElement.className = 'change-item';
                
                const status = change.substring(0, 2).trim();
                const filename = change.substring(3);
                
                let statusClass = 'modified';
                let statusText = 'Modified';
                
                if (status === 'A') {
                    statusClass = 'added';
                    statusText = 'Added';
                } else if (status === 'D') {
                    statusClass = 'deleted';
                    statusText = 'Deleted';
                }
                
                changeElement.innerHTML = `
                    <span class="change-status ${statusClass}">${statusText}</span>
                    <span>${filename}</span>
                `;
                changesList.appendChild(changeElement);
            });

            // Show modal
            document.getElementById('commitModal').style.display = 'block';
        } catch (error) {
            console.error('Error opening commit modal:', error);
            this.showErrorMessage('Error preparing commit. Please try again.');
        }
    }

    async commitChanges() {
        try {
            const commitMessage = document.getElementById('commitMessage').value.trim();
            if (!commitMessage) {
                this.showErrorMessage('Please enter a commit message.');
                return;
            }

            // Show loading state
            const commitBtn = document.querySelector('#commitModal .btn-success');
            const originalText = commitBtn.textContent;
            commitBtn.textContent = 'Committing...';
            commitBtn.disabled = true;

            // Commit changes
            await window.electronAPI.commitChanges(commitMessage);
            
            // Close modal
            this.closeCommitModal();
            
            // Update git status
            await this.checkGitStatus();
            
            this.showSuccessMessage('Changes committed and pushed successfully!');
        } catch (error) {
            console.error('Error committing changes:', error);
            this.showErrorMessage(`Failed to commit changes: ${error.message}`);
            
            // Reset button
            const commitBtn = document.querySelector('#commitModal .btn-success');
            commitBtn.textContent = '📝 Commit & Push';
            commitBtn.disabled = false;
        }
    }

    closeCommitModal() {
        document.getElementById('commitModal').style.display = 'none';
    }
}

// Global functions for HTML onclick handlers
function addPresentWork() {
    contentManager.addPresentWork();
}

function addSocialLink() {
    contentManager.addSocialLink();
}

function addPastWork() {
    contentManager.addPastWork();
}

function openCommitModal() {
    contentManager.openCommitModal();
}

function closeCommitModal() {
    contentManager.closeCommitModal();
}

function commitChanges() {
    contentManager.commitChanges();
}

// Initialize content manager when DOM is loaded
let contentManager;
document.addEventListener('DOMContentLoaded', () => {
    contentManager = new WebsiteContentManager();
});