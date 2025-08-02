#!/bin/bash

# Push Admin Console to GitHub
# This script helps you push the admin console to your GitHub repository

echo "🚀 Pushing Admin Console to GitHub..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if the repository exists
if [ ! -d ".git" ]; then
    echo "🔄 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit of Admin Console"
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote repository..."
    echo "Enter your GitHub username:"
    read username
    
    if [ -z "$username" ]; then
        username="tejasvisoi"
    fi
    
    git remote add origin "https://github.com/$username/adminconsole.git"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your Admin Console is now on GitHub."
echo "📍 Repository URL: https://github.com/tejasvisoi/adminconsole"