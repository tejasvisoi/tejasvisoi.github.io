#!/usr/bin/env python3
"""
Tejasvi Soi Admin Console - Startup Script
This script helps you start the admin console application
"""

import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Error: Python 3.7 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'flask',
        'flask_sqlalchemy',
        'werkzeug'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - Missing")
    
    if missing_packages:
        print(f"\n📦 Installing missing packages...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
            print("✅ Dependencies installed successfully!")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            print("Please run: pip install -r requirements.txt")
            return False
    
    return True

def create_directories():
    """Create necessary directories"""
    directories = ['uploads', 'backups', 'exports']
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")

def start_application():
    """Start the Flask application"""
    print("\n🚀 Starting Tejasvi Soi Admin Console...")
    print("=" * 50)
    
    # Set environment variables
    os.environ['FLASK_ENV'] = 'development'
    os.environ['FLASK_DEBUG'] = '1'
    
    try:
        # Import and run the app
        from app import app
        
        print("📍 Local URL: http://localhost:8080")
        print("🔐 Default password: tejasvi2024")
        print("⚠️  Remember to change the default password!")
        print("\n" + "=" * 50)
        
        # Open browser after a short delay
        def open_browser():
            time.sleep(2)
            webbrowser.open('http://localhost:8080')
        
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Run the application
        app.run(debug=True, host='0.0.0.0', port=8080)
        
    except KeyboardInterrupt:
        print("\n\n👋 Admin console stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting application: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🎛️  Tejasvi Soi Admin Console")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return
    
    print("\n📋 Checking dependencies...")
    if not check_dependencies():
        return
    
    print("\n📁 Creating directories...")
    create_directories()
    
    # Start the application
    start_application()

if __name__ == '__main__':
    main()