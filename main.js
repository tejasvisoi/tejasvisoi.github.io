const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');
const Store = require('electron-store');

// Initialize persistent storage
const store = new Store();

let mainWindow;
let git;

// GitHub configuration
const GITHUB_CONFIG = {
  username: 'tejasvisoi',
  portfolioRepo: 'tejasvisoi.github.io',
  adminRepo: 'adminconsole',
  token: store.get('github_token') || null
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'hiddenInset',
    show: false
  });

  const htmlPath = path.join(__dirname, 'cms-dashboard.html');
  console.log('Loading HTML file:', htmlPath);
  
  mainWindow.loadFile(htmlPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Add error handling for page load
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// GitHub API functions
async function fetchGitHubData(endpoint) {
  try {
    const headers = {};
    if (GITHUB_CONFIG.token) {
      headers.Authorization = `token ${GITHUB_CONFIG.token}`;
    }
    
    const response = await axios.get(`https://api.github.com${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error('GitHub API error:', error.message);
    
    // Handle rate limiting specifically
    if (error.response && error.response.status === 403) {
      const rateLimitError = new Error('GitHub API rate limit exceeded. Please add a GitHub token in settings for higher limits.');
      rateLimitError.isRateLimit = true;
      throw rateLimitError;
    }
    
    throw error;
  }
}

async function fetchPortfolioData() {
  try {
    // Fetch portfolio repository data
    const repoData = await fetchGitHubData(`/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.portfolioRepo}`);
    
    // Fetch recent commits
    const commits = await fetchGitHubData(`/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.portfolioRepo}/commits?per_page=10`);
    
    // Fetch repository contents
    const contents = await fetchGitHubData(`/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.portfolioRepo}/contents`);
    
    return {
      repository: repoData,
      commits: commits,
      contents: contents,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    throw error;
  }
}

async function fetchAdminData() {
  try {
    // Fetch admin console repository data
    const repoData = await fetchGitHubData(`/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.adminRepo}`);
    
    // Fetch repository contents
    const contents = await fetchGitHubData(`/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.adminRepo}/contents`);
    
    return {
      repository: repoData,
      contents: contents,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
}

// IPC handlers
ipcMain.handle('fetch-portfolio-data', async () => {
  try {
    const data = await fetchPortfolioData();
    store.set('portfolio_data', data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('fetch-admin-data', async () => {
  try {
    const data = await fetchAdminData();
    store.set('admin_data', data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('get-stored-data', async () => {
  try {
    // Try to load existing data from the current website
    const existingData = await loadExistingWebsiteData();
    
    return {
      portfolio: store.get('portfolio_data') || existingData,
      admin: store.get('admin_data'),
      githubToken: store.get('github_token')
    };
  } catch (error) {
    console.error('Error loading existing data:', error);
    return {
      portfolio: store.get('portfolio_data'),
      admin: store.get('admin_data'),
      githubToken: store.get('github_token')
    };
  }
});

ipcMain.handle('set-github-token', async (event, token) => {
  store.set('github_token', token);
  GITHUB_CONFIG.token = token;
  return { success: true };
});

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('show-error-dialog', async (event, title, content) => {
  await dialog.showErrorBox(title, content);
});

ipcMain.handle('show-info-dialog', async (event, title, content) => {
  await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: title,
    message: content
  });
});

        // Content Management IPC handlers
        ipcMain.handle('save-website-data', async (event, data) => {
          try {
            store.set('website_data', data);
            store.set('last_update', new Date().toISOString());
            return { success: true };
          } catch (error) {
            console.error('Error saving website data:', error);
            throw error;
          }
        });

ipcMain.handle('preview-website', async (event, data) => {
  try {
    // Generate a preview of the website with the new data
    const previewPath = path.join(__dirname, 'preview.html');
    const previewHTML = generateWebsiteHTML(data);
    fs.writeFileSync(previewPath, previewHTML);
    
    // Open the preview in default browser
    await shell.openExternal(`file://${previewPath}`);
    return { success: true };
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
});

        ipcMain.handle('deploy-to-github', async (event, data) => {
          try {
            // Generate the updated website files
            const websiteFiles = generateWebsiteFiles(data);
            
            // Write all generated files directly to the current directory
            for (const [filename, content] of Object.entries(websiteFiles)) {
              const filePath = path.join(__dirname, filename);
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, content);
            }
            
            // Copy existing assets (styles.css, script.js, cat.gif, etc.)
            const assetsToCopy = ['styles.css', 'script.js', 'cat.gif'];
            for (const asset of assetsToCopy) {
              const sourcePath = path.join(__dirname, asset);
              if (fs.existsSync(sourcePath)) {
                // Asset already exists, no need to copy
                continue;
              }
            }
            
            return { success: true, message: 'Files updated successfully! Ready to commit.' };
          } catch (error) {
            console.error('Error deploying to GitHub:', error);
            throw error;
          }
        });

        // New IPC handler for Git operations
        ipcMain.handle('commit-changes', async (event, commitMessage) => {
          try {
            const { exec } = require('child_process');
            const util = require('util');
            const execAsync = util.promisify(exec);
            
            // Check if we're in a git repository
            try {
              await execAsync('git status');
            } catch (error) {
              throw new Error('Not in a git repository. Please make sure you\'re in your website directory.');
            }
            
            // Add all changes
            await execAsync('git add .');
            
            // Commit changes
            await execAsync(`git commit -m "${commitMessage}"`);
            
            // Push to remote
            await execAsync('git push origin main');
            
            return { success: true, message: 'Changes committed and pushed successfully!' };
          } catch (error) {
            console.error('Error committing changes:', error);
            throw error;
          }
        });

        // Check git status
        ipcMain.handle('get-git-status', async (event) => {
          try {
            const { exec } = require('child_process');
            const util = require('util');
            const execAsync = util.promisify(exec);
            
            // Check if we're in a git repository
            try {
              const { stdout: status } = await execAsync('git status --porcelain');
              const { stdout: branch } = await execAsync('git branch --show-current');
              const { stdout: remote } = await execAsync('git remote get-url origin');
              
              return {
                success: true,
                hasChanges: status.trim().length > 0,
                changes: status.trim().split('\n').filter(line => line.length > 0),
                currentBranch: branch.trim(),
                remoteUrl: remote.trim()
              };
            } catch (error) {
              return {
                success: false,
                error: 'Not in a git repository'
              };
            }
          } catch (error) {
            console.error('Error getting git status:', error);
            throw error;
          }
        });

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error', 'An unexpected error occurred. Please restart the application.');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Helper functions for website generation
function generateWebsiteHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.profile?.name || 'Portfolio'} - Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-bottom: 20px;
            object-fit: cover;
        }
        .name {
            font-size: 2.5em;
            margin-bottom: 10px;
            color: #333;
        }
        .title {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 20px;
        }
        .bio {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section-title {
            font-size: 1.5em;
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .project {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .project-title {
            font-size: 1.2em;
            color: #333;
            margin-bottom: 10px;
        }
        .skill {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            margin: 5px;
            font-size: 0.9em;
        }
        .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${data.profile?.image ? `<img src="${data.profile.image}" alt="Profile" class="profile-image">` : ''}
            <h1 class="name">${data.profile?.name || 'Your Name'}</h1>
            <p class="title">${data.profile?.title || 'Your Title'}</p>
            <p class="bio">${data.profile?.bio || 'Your bio goes here...'}</p>
        </div>

        ${data.about?.content ? `
        <div class="section">
            <h2 class="section-title">About</h2>
            <p>${data.about.content}</p>
        </div>
        ` : ''}

        ${data.skills && data.skills.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Skills</h2>
            ${data.skills.map(skill => `<span class="skill">${skill.name}</span>`).join('')}
        </div>
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Projects</h2>
            ${data.projects.map(project => `
                <div class="project">
                    <h3 class="project-title">${project.title}</h3>
                    <p>${project.description}</p>
                    ${project.technologies && project.technologies.length > 0 ? 
                        `<p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>` : ''}
                    ${project.url ? `<p><a href="${project.url}" target="_blank">View Project</a></p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Experience</h2>
            ${data.experience.map(exp => `
                <div class="project">
                    <h3 class="project-title">${exp.title}</h3>
                    <p><strong>${exp.company}</strong> - ${exp.duration}</p>
                    <p>${exp.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2 class="section-title">Contact</h2>
            <div class="contact-info">
                ${data.contact?.email ? `<p><strong>Email:</strong> ${data.contact.email}</p>` : ''}
                ${data.contact?.phone ? `<p><strong>Phone:</strong> ${data.contact.phone}</p>` : ''}
                ${data.contact?.socialLinks && data.contact.socialLinks.length > 0 ? 
                    `<p><strong>Social:</strong> ${data.contact.socialLinks.map(link => 
                        `<a href="${link.url}" target="_blank">${link.platform}</a>`
                    ).join(' | ')}</p>` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Generate files that match your existing website structure
function generateWebsiteFiles(data) {
  const files = {};
  
  // Generate updated index.html based on your existing structure
  files['index.html'] = generateIndexHTML(data);
  
  // Generate updated portfolio.html
  files['portfolio.html'] = generatePortfolioHTML(data);
  
  // Generate individual project HTML files
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(project => {
      const filename = `${project.title.toLowerCase().replace(/\s+/g, '')}.html`;
      files[filename] = generateProjectHTML(project, data);
    });
  }
  
  // Generate data.json for the CMS
  files['data.json'] = JSON.stringify(data, null, 2);
  
  return files;
}

function generateIndexHTML(data) {
  const presentWork = data.experience?.filter(exp => exp.current) || [];
  const socialLinks = data.contact?.socialLinks || [];
  const pastWork = data.projects || [];
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.profile?.name || 'Tejasvi Soi'} - Portfolio</title>
    <link rel="stylesheet" href="styles.css?v=1.3">
    <!-- Consolidated font loading -->
    <link rel="preconnect" href="https://fonts.indiantypefoundry.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://api.fontshare.com">
    <link rel="stylesheet" href="https://fonts.indiantypefoundry.com/technor.css">
    <link rel="stylesheet" href="https://fonts.indiantypefoundry.com/rajdhani.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://api.fontshare.com/v2/css?f[]=hoover@400,700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Custom Cursor -->
    <div class="custom-cursor"></div>
    
    <div class="container">
        <div class="main-content">
            <h1 class="main-heading">
                <span class="line-1">${data.profile?.name || 'Building, breaking,'}</span>
                <span class="line-2">${data.profile?.title || 'making things'}</span>
            </h1>
            
            <div class="visit-tracker">
                <p id="last-visit-text">Loading...</p>
            </div>
            
            <!-- Cat Animation -->
            <div class="cat-container">
                <img src="cat.gif" alt="Walking Cat" class="cat-sprite">
            </div>
            
            <div class="content-grid">
                <div class="grid-row">
                    <div class="section">
                        <div class="main-links">
                            <h3 class="main-links-title">Present</h3>
                            ${presentWork.map(work => 
                                `<a href="#" class="main-link" target="_blank">${work.title} at ${work.company}</a>`
                            ).join('')}
                            ${presentWork.length === 0 ? '<a href="#" class="main-link" target="_blank">Available for opportunities</a>' : ''}
                        </div>
                        <div class="social-links">
                            ${socialLinks.map(link => {
                                const icon = getSocialIcon(link.platform);
                                return `<a href="${link.url}" class="social-link" target="_blank">
                                    <span class="social-icon">${icon}</span>
                                    <span>${link.platform.toUpperCase()}</span>
                                </a>`;
                            }).join('')}
                            ${data.contact?.email ? `
                            <a href="mailto:${data.contact.email}" class="social-link" target="_blank">
                                <span class="social-icon">✉️</span>
                                <span>EMAIL</span>
                            </a>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="past-work">
                            <h3 class="past-work-title">Past</h3>
                            <div class="past-work-links">
                                ${pastWork.map(project => 
                                    `<a href="${project.title.toLowerCase().replace(/\s+/g, '')}.html" class="past-work-link" target="_blank">${project.title}</a>`
                                ).join('')}
                                <a href="portfolio.html" class="past-work-link portfolio-link" target="_blank">Full Portfolio</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="script.js"></script>
</body>
</html>`;
}

function generatePortfolioHTML(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${data.profile?.name || 'Tejasvi Soi'}</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="main-content">
            <h1 class="main-heading">
                <span class="line-1">Portfolio</span>
                <span class="line-2">${data.profile?.name || 'Tejasvi Soi'}</span>
            </h1>
            
            ${data.about?.content ? `
            <div class="about-section">
                <h2>About</h2>
                <p>${data.about.content}</p>
            </div>
            ` : ''}
            
            ${data.skills && data.skills.length > 0 ? `
            <div class="skills-section">
                <h2>Skills</h2>
                <div class="skills-grid">
                    ${data.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.projects && data.projects.length > 0 ? `
            <div class="projects-section">
                <h2>Projects</h2>
                <div class="projects-grid">
                    ${data.projects.map(project => `
                        <div class="project-card">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            ${project.technologies && project.technologies.length > 0 ? 
                                `<div class="tech-tags">${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}</div>` : ''}
                            ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">View Project</a>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.experience && data.experience.length > 0 ? `
            <div class="experience-section">
                <h2>Experience</h2>
                <div class="experience-list">
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <h3>${exp.title}</h3>
                            <p class="company">${exp.company}</p>
                            <p class="duration">${exp.duration}</p>
                            <p class="description">${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="main-links">
                <a href="index.html" class="main-link">← Back to Home</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function generateProjectHTML(project, data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} - ${data.profile?.name || 'Tejasvi Soi'}</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <div class="main-content">
            <h1 class="main-heading">
                <span class="line-1">${project.title}</span>
                <span class="line-2">Project</span>
            </h1>
            
            <div class="project-content">
                <div class="project-description">
                    <p>${project.description}</p>
                </div>
                
                ${project.technologies && project.technologies.length > 0 ? `
                <div class="project-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${project.url ? `
                <div class="project-links">
                    <a href="${project.url}" target="_blank" class="project-link">View Project</a>
                </div>
                ` : ''}
            </div>
            
            <div class="main-links">
                <a href="index.html" class="main-link">← Back to Home</a>
                <a href="portfolio.html" class="main-link">← Back to Portfolio</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function getSocialIcon(platform) {
  const icons = {
    'github': '🐙',
    'linkedin': '💼',
    'twitter': '🐦',
    'instagram': '📷',
    'facebook': '📘',
    'youtube': '📺',
    'medium': '📝',
    'behance': '🎨',
    'dribbble': '🏀'
  };
  return icons[platform.toLowerCase()] || '🔗';
}

        // Load existing data from current website files
        async function loadExistingWebsiteData() {
          try {
            const data = {
              website: {
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
              }
            };
        
            // Try to load from data.json if it exists
            const dataJsonPath = path.join(__dirname, 'data.json');
            if (fs.existsSync(dataJsonPath)) {
              const jsonData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
              return jsonData;
            }
        
            // Parse existing index.html to extract basic info
            const indexPath = path.join(__dirname, 'index.html');
            if (fs.existsSync(indexPath)) {
              const indexContent = fs.readFileSync(indexPath, 'utf8');
              
              // Extract main headings
              const headingMatch1 = indexContent.match(/<span class="line-1">([^<]+)<\/span>/);
              const headingMatch2 = indexContent.match(/<span class="line-2">([^<]+)<\/span>/);
              if (headingMatch1) data.website.homepage.mainHeading1 = headingMatch1[1];
              if (headingMatch2) data.website.homepage.mainHeading2 = headingMatch2[1];
              
              // Extract social links
              const socialLinks = [];
              const socialLinkMatches = indexContent.matchAll(/href="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]+)<\/span>/g);
              for (const match of socialLinkMatches) {
                const url = match[1];
                const platform = match[2];
                if (url.includes('instagram.com') || url.includes('twitter.com') || url.includes('mailto:')) {
                  socialLinks.push({
                    platform: platform.toLowerCase(),
                    url: url,
                    icon: getSocialIcon(platform.toLowerCase())
                  });
                }
              }
              data.website.homepage.socialLinks = socialLinks;
            }
        
            // Parse existing project files
            const projectFiles = ['googlepay.html', 'dunzo.html', 'eurekaforbes.html', 'explore.html'];
            
            for (const projectFile of projectFiles) {
              const projectPath = path.join(__dirname, projectFile);
              if (fs.existsSync(projectPath)) {
                const projectContent = fs.readFileSync(projectPath, 'utf8');
                const titleMatch = projectContent.match(/<title>([^<]+)<\/title>/);
                if (titleMatch) {
                  const title = titleMatch[1].replace(' - Tejasvi Soi', '').trim();
                  const projectKey = projectFile.replace('.html', '');
                  
                  if (data.website[projectKey]) {
                    data.website[projectKey].heading1 = title;
                    data.website[projectKey].heading2 = 'Work';
                  }
                }
              }
            }
        
            return data;
          } catch (error) {
            console.error('Error loading existing website data:', error);
            return null;
          }
        }

function generateWebsiteFiles(data) {
  return {
    'index.html': generateWebsiteHTML(data),
    'data.json': JSON.stringify(data, null, 2)
  };
} 