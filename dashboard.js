// Dashboard JavaScript
class PortfolioDashboard {
    constructor() {
        this.autoRefreshInterval = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.loadSystemInfo();
        this.loadStoredData();
        await this.refreshData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshData();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeSettings();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSettings();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
        });
    }

    loadSystemInfo() {
        // Load system information
        document.getElementById('appVersion').textContent = window.electronAPI.getAppVersion();
        document.getElementById('nodeVersion').textContent = window.electronAPI.getNodeVersion();
        document.getElementById('chromeVersion').textContent = window.electronAPI.getChromeVersion();
        document.getElementById('platform').textContent = navigator.platform;
    }

    async loadStoredData() {
        try {
            const data = await window.electronAPI.getStoredData();
            if (data.portfolio) {
                this.updatePortfolioData(data.portfolio);
            }
            if (data.admin) {
                this.updateAdminData(data.admin);
            }
            if (data.githubToken) {
                document.getElementById('githubToken').value = data.githubToken;
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    async refreshData() {
        this.setConnectionStatus('connecting');
        
        try {
            // Fetch portfolio data
            const portfolioData = await window.electronAPI.fetchPortfolioData();
            if (portfolioData.error) {
                throw new Error(portfolioData.error);
            }
            this.updatePortfolioData(portfolioData);

            // Fetch admin data
            const adminData = await window.electronAPI.fetchAdminData();
            if (adminData.error) {
                throw new Error(adminData.error);
            }
            this.updateAdminData(adminData);

            this.setConnectionStatus('connected');
            this.updateLastUpdate();
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.setConnectionStatus('disconnected');
            
            // Show different messages based on error type
            if (error.message && error.message.includes('rate limit')) {
                await window.electronAPI.showErrorDialog('Rate Limit Exceeded', 
                    'GitHub API rate limit exceeded. Please add a GitHub Personal Access Token in settings for higher limits.');
            } else {
                await window.electronAPI.showErrorDialog('Connection Error', 
                    `Failed to fetch data: ${error.message}`);
            }
        }
    }

    updatePortfolioData(data) {
        if (data.repository) {
            document.getElementById('portfolioStars').textContent = data.repository.stargazers_count || 0;
            document.getElementById('portfolioForks').textContent = data.repository.forks_count || 0;
        } else {
            // Show sample data when API is unavailable
            document.getElementById('portfolioStars').textContent = '⭐';
            document.getElementById('portfolioForks').textContent = '🍴';
        }

        if (data.commits) {
            document.getElementById('portfolioCommits').textContent = data.commits.length || 0;
            this.updatePortfolioActivity(data.commits);
        } else {
            // Show sample activity when API is unavailable
            this.updatePortfolioActivity([
                { commit: { message: 'Sample commit - API unavailable', author: { date: new Date().toISOString() } } }
            ]);
        }
    }

    updateAdminData(data) {
        if (data.repository) {
            document.getElementById('adminStars').textContent = data.repository.stargazers_count || 0;
            document.getElementById('adminForks').textContent = data.repository.forks_count || 0;
        } else {
            // Show sample data when API is unavailable
            document.getElementById('adminStars').textContent = '⭐';
            document.getElementById('adminForks').textContent = '🍴';
        }

        if (data.contents) {
            document.getElementById('adminFiles').textContent = data.contents.length || 0;
            this.updateAdminFiles(data.contents);
        } else {
            // Show sample files when API is unavailable
            document.getElementById('adminFiles').textContent = '📁';
            this.updateAdminFiles([
                { name: 'Sample file - API unavailable', size: 1024 }
            ]);
        }
    }

    updatePortfolioActivity(commits) {
        const container = document.getElementById('portfolioActivity');
        container.innerHTML = '';

        commits.slice(0, 5).forEach(commit => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const title = document.createElement('div');
            title.className = 'activity-title';
            title.textContent = commit.commit.message.split('\n')[0].substring(0, 50) + '...';
            
            const date = document.createElement('div');
            date.className = 'activity-date';
            date.textContent = new Date(commit.commit.author.date).toLocaleDateString();
            
            item.appendChild(title);
            item.appendChild(date);
            container.appendChild(item);
        });
    }

    updateAdminFiles(files) {
        const container = document.getElementById('adminFiles');
        container.innerHTML = '';

        files.slice(0, 5).forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item';
            
            const name = document.createElement('div');
            name.className = 'file-name';
            name.textContent = file.name;
            
            const size = document.createElement('div');
            size.className = 'file-size';
            size.textContent = this.formatFileSize(file.size);
            
            item.appendChild(name);
            item.appendChild(size);
            container.appendChild(item);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    setConnectionStatus(status) {
        const indicator = document.getElementById('connectionStatus');
        const text = document.getElementById('connectionText');
        
        indicator.className = `fas fa-circle status-indicator ${status}`;
        
        switch (status) {
            case 'connected':
                text.textContent = 'Connected';
                break;
            case 'disconnected':
                text.textContent = 'Disconnected';
                break;
            case 'connecting':
                text.textContent = 'Connecting...';
                break;
        }
    }

    updateLastUpdate() {
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();
    }

    openSettings() {
        document.getElementById('settingsModal').style.display = 'block';
    }

    closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    async saveSettings() {
        const token = document.getElementById('githubToken').value;
        const autoRefresh = document.getElementById('autoRefresh').value;

        try {
            if (token) {
                await window.electronAPI.setGithubToken(token);
            }
            
            // Update auto refresh interval
            this.stopAutoRefresh();
            this.startAutoRefresh(parseInt(autoRefresh) * 60 * 1000);
            
            this.closeSettings();
            await window.electronAPI.showInfoDialog('Settings Saved', 'Your settings have been saved successfully.');
            
            // Refresh data with new token
            await this.refreshData();
        } catch (error) {
            console.error('Error saving settings:', error);
            await window.electronAPI.showErrorDialog('Settings Error', 
                `Failed to save settings: ${error.message}`);
        }
    }

    startAutoRefresh(interval = 5 * 60 * 1000) { // Default 5 minutes
        this.stopAutoRefresh();
        this.autoRefreshInterval = setInterval(() => {
            this.refreshData();
        }, interval);
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }
}

// Global functions for HTML onclick handlers
function openExternal(url) {
    window.electronAPI.openExternal(url);
}

function closeSettings() {
    dashboard.closeSettings();
}

function saveSettings() {
    dashboard.saveSettings();
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new PortfolioDashboard();
});

// Handle window focus to refresh data
window.addEventListener('focus', () => {
    if (dashboard) {
        dashboard.refreshData();
    }
}); 