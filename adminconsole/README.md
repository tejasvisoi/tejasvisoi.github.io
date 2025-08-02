# 🎛️ Tejasvi Soi Admin Console

A secure, local web application for managing your portfolio content at [tejasvisoi.github.io](https://tejasvisoi.github.io).

![Admin Console Screenshot](https://i.imgur.com/example.png)

## 🚀 Quick Setup Guide

### 1. Download the Admin Console

```bash
# Clone the repository
git clone https://github.com/tejasvisoi/adminconsole.git

# Navigate to the directory
cd adminconsole
```

### 2. Set Up Python Environment

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Start the Application

```bash
# Run the application
python start.py
```

The application will:
- Check your Python version
- Install required dependencies
- Create necessary directories
- Start the web server on http://localhost:8080
- Open your browser automatically

### 4. Login to Admin Console

- **URL:** http://localhost:8080
- **Username:** admin
- **Password:** tejasvi2024

⚠️ **Important:** Change the default password immediately after first login!

## 📊 Features

### 🏠 Homepage Management
Edit all aspects of your portfolio homepage:
- Hero section with main heading and subtitle
- Present work section with links
- Past work case studies
- Social media links

### 📝 Case Studies
Manage case studies with a complete editor:
- Create new case studies with custom URLs
- Edit content using HTML
- Publish/unpublish case studies
- Preview before publishing

### 📁 Portfolio Management
Organize your portfolio projects:
- Update portfolio title and description
- Add/remove portfolio items
- Set links to project details

### 🖼️ Media Library
Manage all your media files:
- Drag & drop file upload
- Image preview
- Copy URLs for use in content
- Delete unused files

### ⚙️ Settings
Configure your admin console:
- Change admin password
- Create system backups
- Export data as JSON
- View system information

## 🔄 Data Management

All data is stored locally in an SQLite database (`admin_console.db`) and the `uploads` directory. This makes it easy to back up and transfer your data between systems.

### Backing Up Your Data

```bash
# Create a backup directory
mkdir -p my_backup

# Copy the database
cp admin_console.db my_backup/

# Copy uploaded files
cp -r uploads my_backup/
```

### Restoring from Backup

```bash
# Copy the database back
cp my_backup/admin_console.db .

# Copy uploaded files back
cp -r my_backup/uploads .
```

## 🔧 Troubleshooting

### Port Already in Use

If port 8080 is already in use, edit `app.py` and change the port number:

```python
# Change this line at the bottom of app.py
app.run(debug=True, host='0.0.0.0', port=8080)
# To use a different port, like:
app.run(debug=True, host='0.0.0.0', port=8081)
```

### Database Issues

If you encounter database errors, you can reset the database:

```bash
# Remove the database file
rm admin_console.db

# Restart the application (a new database will be created)
python start.py
```

## 📱 Accessing from Other Devices

To access the admin console from other devices on your network:

1. Find your computer's IP address:
   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # On Windows
   ipconfig | findstr IPv4
   ```

2. Access from other devices using:
   ```
   http://YOUR_IP_ADDRESS:8080
   ```

⚠️ **Security Note:** Only do this on trusted networks!

## 📞 Support

For help or feature requests:
- **Email:** hello@tejasvisoi.com
- **GitHub Issues:** [Create an issue](https://github.com/tejasvisoi/adminconsole/issues)

---

**Version:** 1.0.0  
**Last Updated:** August 2024