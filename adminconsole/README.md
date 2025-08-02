# 🎛️ Tejasvi Soi Admin Console

A secure, local web application for managing your portfolio content at [tejasvisoi.github.io](https://tejasvisoi.github.io).

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

- **Homepage Management:** Edit content on your portfolio homepage
- **Case Studies:** Create and manage case studies
- **Portfolio:** Update your portfolio items
- **Media Library:** Upload and manage images and files
- **Settings:** Change password, create backups, export data

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