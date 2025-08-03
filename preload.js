const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Data fetching
  fetchPortfolioData: () => ipcRenderer.invoke('fetch-portfolio-data'),
  fetchAdminData: () => ipcRenderer.invoke('fetch-admin-data'),
  getStoredData: () => ipcRenderer.invoke('get-stored-data'),
  
  // Settings
  setGithubToken: (token) => ipcRenderer.invoke('set-github-token', token),
  
  // External actions
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Dialogs
  showErrorDialog: (title, content) => ipcRenderer.invoke('show-error-dialog', title, content),
  showInfoDialog: (title, content) => ipcRenderer.invoke('show-info-dialog', title, content),
  
  // App info
  getAppVersion: () => process.versions.electron,
  getNodeVersion: () => process.versions.node,
  getChromeVersion: () => process.versions.chrome,
  
          // Content Management API
        saveWebsiteData: (data) => ipcRenderer.invoke('save-website-data', data),
        previewWebsite: (data) => ipcRenderer.invoke('preview-website', data),
        deployToGitHub: (data) => ipcRenderer.invoke('deploy-to-github', data),
        
        // Git Operations API
        commitChanges: (commitMessage) => ipcRenderer.invoke('commit-changes', commitMessage),
        getGitStatus: () => ipcRenderer.invoke('get-git-status')
}); 