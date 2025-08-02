# 🚀 Quick Start Guide

This guide will help you get the Admin Console up and running on your local machine in just a few minutes.

## 📋 Prerequisites

- **Python 3.7 or higher** (most systems have this pre-installed)
- **Git** (optional, for cloning the repository)

## 🔧 Installation

### Option 1: Using the Setup Scripts (Recommended)

#### On macOS/Linux:

1. **Download the Admin Console**
   - Clone the repository: `git clone https://github.com/tejasvisoi/adminconsole.git`
   - Or download and extract the ZIP file from GitHub

2. **Open Terminal and navigate to the directory**
   ```bash
   cd path/to/adminconsole
   ```

3. **Run the setup script**
   ```bash
   ./run_local.sh
   ```

4. **Access the Admin Console**
   - The script will automatically open your browser to http://localhost:8080
   - If not, manually open your browser and navigate to that URL

#### On Windows:

1. **Download the Admin Console**
   - Clone the repository: `git clone https://github.com/tejasvisoi/adminconsole.git`
   - Or download and extract the ZIP file from GitHub

2. **Double-click the `run_local.bat` file**
   - This will open a command prompt window and set up everything
   - If you prefer to use Command Prompt directly:
     ```
     cd path\to\adminconsole
     run_local.bat
     ```

3. **Access the Admin Console**
   - The script will automatically open your browser to http://localhost:8080
   - If not, manually open your browser and navigate to that URL

### Option 2: Manual Setup

1. **Create a virtual environment**
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create necessary directories**
   ```bash
   mkdir -p uploads backups exports
   ```

4. **Run the application**
   ```bash
   python start.py
   ```

## 🔑 Login Information

- **URL:** http://localhost:8080
- **Username:** admin
- **Password:** tejasvi2024

⚠️ **Important:** Change the default password immediately after first login by going to Settings → Change Password.

## 🛠️ Troubleshooting

### Port Already in Use

If you see an error about port 8080 being in use:

1. Edit `app.py`
2. Find this line at the bottom: `app.run(debug=True, host='0.0.0.0', port=8080)`
3. Change `port=8080` to another port like `port=8081`
4. Save the file and restart the application
5. Access the admin console at the new port: http://localhost:8081

### Python Not Found

If you see an error about Python not being found:

1. Make sure Python is installed:
   - On macOS: `brew install python`
   - On Windows: Download from [python.org](https://www.python.org/downloads/)
   - On Linux: `sudo apt install python3 python3-venv`

2. Make sure Python is in your PATH:
   - On Windows, reinstall Python and check "Add Python to PATH"
   - On macOS/Linux, check your PATH with `echo $PATH`

### Virtual Environment Issues

If you have problems with the virtual environment:

1. Delete the `venv` directory
2. Try creating it again:
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   
   # On Windows
   python -m venv venv
   ```

3. If that fails, install the venv package:
   ```bash
   # On Ubuntu/Debian
   sudo apt install python3-venv
   
   # On macOS
   brew install python
   ```

## 📱 Next Steps

After installation, you should:

1. **Change the default password** in Settings
2. **Explore the dashboard** to get familiar with the interface
3. **Update your homepage content** to reflect your latest work
4. **Create case studies** for your portfolio projects
5. **Upload media files** for use in your content

For more detailed information, see the full [README.md](README.md) file.