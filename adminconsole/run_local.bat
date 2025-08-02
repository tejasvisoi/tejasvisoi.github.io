@echo off
echo 🚀 Setting up Admin Console...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH. Please install Python 3.7 or higher.
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%a in ('python --version 2^>^&1') do set python_version=%%a
echo ✅ Python version: %python_version%

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo 🔄 Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Failed to create virtual environment.
        echo Make sure Python is installed with the 'Add Python to PATH' option
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate
if %errorlevel% neq 0 (
    echo ❌ Failed to activate virtual environment.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist uploads mkdir uploads
if not exist backups mkdir backups
if not exist exports mkdir exports

REM Run the application
echo 🚀 Starting Admin Console...
echo 📍 Local URL: http://localhost:8080
echo 🔐 Default password: tejasvi2024
echo ⚠️  Remember to change the default password!
python start.py

pause