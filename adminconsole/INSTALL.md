# 🎛️ Tejasvi Soi Admin Console - Installation Guide

A complete local web application for managing your portfolio content with database storage and file management.

## 📋 Prerequisites

- **Python 3.7 or higher** (included with most operating systems)
- **pip** (Python package installer)
- **Git** (for version control)

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)

1. **Navigate to the admin console directory:**
   ```bash
   cd /path/to/adminconsole
   ```

2. **Run the startup script:**
   ```bash
   python3 start.py
   ```

3. **The application will:**
   - ✅ Check Python version
   - ✅ Install dependencies automatically
   - ✅ Create necessary directories
   - ✅ Start the web server
   - ✅ Open your browser automatically

4. **Access the admin console:**
   - **URL:** http://localhost:8080
   - **Username:** admin
   - **Password:** tejasvi2024

### Option 2: Manual Installation

1. **Install Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Create necessary directories:**
   ```bash
   mkdir -p uploads backups exports
   ```

3. **Start the application:**
   ```bash
   python3 app.py
   ```

## 🔧 System Requirements

### Minimum Requirements
- **OS:** macOS 10.14+, Windows 10+, or Linux
- **Python:** 3.7 or higher
- **RAM:** 512MB
- **Storage:** 100MB free space

### Recommended Requirements
- **OS:** macOS 12+ or Windows 11+
- **Python:** 3.9 or higher
- **RAM:** 2GB
- **Storage:** 1GB free space

## 📁 Directory Structure

```
adminconsole/
├── app.py                 # Main Flask application
├── start.py              # Startup script
├── requirements.txt      # Python dependencies
├── admin_console.db      # SQLite database (created automatically)
├── templates/            # HTML templates
│   ├── base.html
│   ├── login.html
│   ├── dashboard.html
│   └── ...
├── uploads/              # Media file uploads
├── backups/              # Database and file backups
├── exports/              # Data exports
└── README.md
```

## 🔐 Security Setup

### Change Default Password

1. **Start the application**
2. **Login with default credentials:**
   - Username: `admin`
   - Password: `tejasvi2024`
3. **Go to Settings → Change Password**
4. **Enter a strong password**

### Recommended Security Practices

- ✅ Use a strong, unique password
- ✅ Keep the application local (not exposed to internet)
- ✅ Regularly backup your data
- ✅ Update Python packages periodically
- ✅ Use HTTPS if deploying to a server

## 📊 Features Overview

### 🏠 Homepage Management
- Edit hero section (main heading, subtitle)
- Manage present work items
- Update past work case studies
- Configure social media links

### 📝 Case Studies
- Create new case study pages
- Edit existing case studies
- Publish/unpublish case studies
- Preview case study pages

### 📁 Portfolio Management
- Edit portfolio page content
- Manage portfolio items
- Update portfolio description

### 🖼️ Media Library
- Upload images, documents, videos
- Drag & drop file upload
- File type validation
- Media file management

### ⚙️ Settings
- Change admin password
- Create system backups
- Export data
- System information

## 🔄 Data Management

### Automatic Backups
- Database backups on content changes
- File uploads stored locally
- Backup timestamps for version control

### Data Export
- Export all content as JSON
- Export case studies
- Export media file information
- Portable data format

### Data Import (Future)
- Import content from JSON files
- Bulk case study import
- Media file import

## 🛠️ Troubleshooting

### Common Issues

#### 1. Python Not Found
```bash
# Check Python installation
python3 --version

# If not installed, install via Homebrew (macOS)
brew install python3
```

#### 2. Port Already in Use
```bash
# Check what's using port 8080
lsof -i :8080

# Kill the process or change port in app.py
```

#### 3. Permission Errors
```bash
# Make startup script executable
chmod +x start.py

# Run with sudo if needed (not recommended)
sudo python3 start.py
```

#### 4. Database Errors
```bash
# Remove corrupted database
rm admin_console.db

# Restart application (new database will be created)
python3 start.py
```

### Error Messages

| Error | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip3 install -r requirements.txt` |
| `Permission denied` | Check file permissions or run with sudo |
| `Address already in use` | Change port or kill existing process |
| `Database locked` | Restart application |

## 🔄 Updates and Maintenance

### Updating the Application

1. **Backup your data:**
   ```bash
   cp admin_console.db admin_console.db.backup
   cp -r uploads uploads.backup
   ```

2. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

3. **Update dependencies:**
   ```bash
   pip3 install -r requirements.txt --upgrade
   ```

4. **Restart the application:**
   ```bash
   python3 start.py
   ```

### Regular Maintenance

- **Weekly:** Check for Python package updates
- **Monthly:** Create full system backup
- **Quarterly:** Review and clean up old media files
- **Annually:** Update application dependencies

## 📱 Mobile Access

### Local Network Access
To access from other devices on your network:

1. **Find your IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Access from other devices:**
   ```
   http://YOUR_IP_ADDRESS:8080
   ```

### Security Note
⚠️ **Only enable network access on trusted networks!**

## 🚀 Deployment Options

### Local Development (Current)
- ✅ Fastest setup
- ✅ No internet required
- ✅ Full control
- ❌ Single device access

### Local Network
- ✅ Multi-device access
- ✅ Shared resources
- ⚠️ Network security required

### Cloud Deployment (Future)
- ✅ Anywhere access
- ✅ Automatic backups
- ⚠️ Requires server setup
- ⚠️ Monthly costs

## 📞 Support

### Getting Help

1. **Check this documentation**
2. **Review error messages**
3. **Check Python version compatibility**
4. **Verify file permissions**

### Contact Information
- **Email:** hello@tejasvisoi.com
- **GitHub Issues:** [Create an issue](https://github.com/tejasvisoi/adminconsole/issues)

## 📄 License

This admin console is part of your personal portfolio management system.
Customize and use as needed for your projects.

---

**Last Updated:** August 2024  
**Version:** 1.0.0