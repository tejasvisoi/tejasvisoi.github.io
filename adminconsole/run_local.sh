#!/bin/bash

# Run Admin Console Locally
# This script helps you run the admin console on your local machine

echo "🚀 Setting up Admin Console..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
python_major=$(echo $python_version | cut -d. -f1)
python_minor=$(echo $python_version | cut -d. -f2)

if [ "$python_major" -lt 3 ] || ([ "$python_major" -eq 3 ] && [ "$python_minor" -lt 7 ]); then
    echo "❌ Python 3.7 or higher is required. You have Python $python_version."
    exit 1
fi

echo "✅ Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔄 Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment."
        echo "Try installing the venv package:"
        echo "  - Ubuntu/Debian: sudo apt install python3-venv"
        echo "  - macOS: brew install python"
        echo "  - Windows: Make sure Python is installed with the 'Add Python to PATH' option"
        exit 1
    fi
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "❌ Failed to activate virtual environment."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads backups exports

# Run the application
echo "🚀 Starting Admin Console..."
echo "📍 Local URL: http://localhost:8080"
echo "🔐 Default password: tejasvi2024"
echo "⚠️  Remember to change the default password!"
python start.py