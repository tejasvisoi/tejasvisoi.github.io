# 🚀 Portfolio Dashboard - Build Instructions

This guide will help you build a .dmg installer for the Portfolio Dashboard desktop application.

## 📋 Prerequisites

### 1. Install Node.js and npm
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, install using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18
```

### 2. Install Dependencies
```bash
# Install project dependencies
npm install

# Install electron-builder globally (optional)
npm install -g electron-builder
```

## 🛠️ Building the Application

### Step 1: Development Mode
Test the application in development mode first:
```bash
npm start
```

This will open the Electron app in development mode.

### Step 2: Build for macOS
```bash
# Build the application
npm run build:mac
```

This creates a macOS app in the `dist` folder.

### Step 3: Create DMG Installer
```bash
# Create DMG installer
npm run build:dmg
```

This creates a `.dmg` file in the `dist` folder.

### Step 4: One-Command Build
```bash
# Build everything at once
npm run dist
```

## 📁 Output Files

After building, you'll find these files in the `dist` folder:

- `Tejasvi Soi Portfolio Dashboard.app` - The macOS application
- `Tejasvi Soi Portfolio Dashboard-1.0.0.dmg` - The installer
- `Tejasvi Soi Portfolio Dashboard-1.0.0-mac.zip` - Compressed app

## 🎯 What the Dashboard Does

The Portfolio Dashboard is a desktop application that:

### **Features:**
- **Real-time Data**: Fetches data from your GitHub repositories
- **Portfolio Overview**: Shows stars, forks, commits from your portfolio repo
- **Admin Console**: Displays data from your adminconsole repository
- **Quick Actions**: Direct links to GitHub repos, website, and email
- **System Info**: Shows app version, Node.js version, platform info
- **Auto-refresh**: Automatically updates data every 5 minutes
- **Settings**: Configure GitHub token and refresh intervals

### **Data Sources:**
- **Portfolio Repo**: `https://github.com/tejasvisoi/tejasvisoi.github.io`
- **Admin Repo**: `https://github.com/tejasvisoi/adminconsole`

### **GitHub Integration:**
- Fetches repository statistics (stars, forks)
- Shows recent commits and activity
- Lists repository files and contents
- Optional GitHub token for enhanced access

## 🔧 Customization

### Update Repository URLs
Edit `main.js` to change the GitHub repositories:
```javascript
const GITHUB_CONFIG = {
  username: 'tejasvisoi',
  portfolioRepo: 'tejasvisoi.github.io',
  adminRepo: 'adminconsole', // Change this to your admin repo
  token: store.get('github_token') || null
};
```

### Update App Information
Edit `package.json` to change app details:
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "appId": "com.yourname.app-name"
}
```

### Customize Styling
Edit `dashboard.css` to change the visual design and colors.

## 🚀 Distribution

### Install on Your Mac
1. Double-click the `.dmg` file
2. Drag the app to your Applications folder
3. Launch from Applications or Spotlight

### Share with Others
- Send the `.dmg` file directly
- Upload to a file sharing service
- Host on your website for download

## 🔍 Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build:dmg
```

### Permission Issues
```bash
# If you get permission errors
sudo npm install -g electron-builder
```

### Code Signing (Optional)
For distribution outside your Mac:
```bash
# Add to package.json build configuration
"mac": {
  "identity": "Your Developer ID"
}
```

## 📱 App Features

### **Dashboard Cards:**
1. **Portfolio Website**: Shows your portfolio repo stats and recent commits
2. **Admin Console**: Displays your admin repo data and files
3. **Quick Actions**: Direct links to GitHub, website, and email
4. **System Info**: Technical information about the app

### **Settings:**
- GitHub Personal Access Token (optional)
- Auto-refresh interval configuration
- Persistent storage of settings

### **Keyboard Shortcuts:**
- `Ctrl+R`: Refresh data
- `Escape`: Close modals

## 🎉 Success!

Once built, you'll have a professional desktop dashboard that:
- ✅ Runs natively on macOS
- ✅ Fetches real-time data from GitHub
- ✅ Provides quick access to your repositories
- ✅ Looks and feels like a native app
- ✅ Can be easily distributed as a .dmg installer

The dashboard will automatically fetch data from your GitHub repositories and provide you with a beautiful, real-time overview of your portfolio and admin console activity! 