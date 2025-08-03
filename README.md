# Tejasvi Soi - Portfolio Website & Dashboard

A modern, responsive portfolio website with a desktop dashboard for easy management.

## 🚀 Features

- **Modern Design**: Clean, minimalist design with custom animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Custom cursor, time tracking, animations
- **Fast Loading**: Optimized for performance
- **Desktop Dashboard**: Native macOS app for portfolio management

## 📁 Project Structure

```
tejasvisoi.github.io/
├── index.html              # Main landing page
├── portfolio.html          # Full portfolio showcase
├── googlepay.html          # Google Pay project page
├── dunzo.html             # Dunzo project page
├── eurekaforbes.html      # Eureka Forbes project page
├── styles.css             # All styling and responsive design
├── script.js              # Interactive features and animations
├── images/                # Image assets
├── projects/              # Project assets
├── templates/             # Template files
├── package.json           # Desktop app dependencies
├── main.js               # Electron main process
├── preload.js            # Electron preload script
├── dashboard.html        # Dashboard UI
├── dashboard.css         # Dashboard styling
├── dashboard.js          # Dashboard functionality
├── assets/               # App assets
├── BUILD-INSTRUCTIONS.md # Build guide for desktop app
└── README.md             # This file
```

## 🌐 Website Usage

### 1. Clone the Repository
```bash
git clone https://github.com/tejasvisoi/tejasvisoi.github.io.git
cd tejasvisoi.github.io
```

### 2. Open in Browser
Simply open `index.html` in your web browser, or serve it locally:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve .

# Using PHP (if installed)
php -S localhost:8000
```

## 💻 Desktop Dashboard

The project includes a native macOS desktop application that provides:

### **Dashboard Features:**
- **Real-time GitHub Data**: Fetches data from your repositories
- **Portfolio Overview**: Shows stars, forks, commits from your portfolio repo
- **Admin Console**: Displays data from your adminconsole repository
- **Quick Actions**: Direct links to GitHub repos, website, and email
- **System Info**: Shows app version, Node.js version, platform info
- **Auto-refresh**: Automatically updates data every 5 minutes
- **Settings**: Configure GitHub token and refresh intervals

### **Build the Desktop App:**
```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for macOS
npm run build:mac

# Create DMG installer
npm run build:dmg

# Build everything at once
npm run dist
```

For detailed build instructions, see [BUILD-INSTRUCTIONS.md](BUILD-INSTRUCTIONS.md).

## 🎨 Customization

### Website Content Updates
- Edit `index.html` to update main page content
- Modify project pages (googlepay.html, dunzo.html, etc.)
- Update `styles.css` for design changes
- Edit `script.js` for interactive features

### Adding New Projects
1. Create a new HTML file for your project (e.g., `newproject.html`)
2. Add a link to it in the "Past" section of `index.html`
3. Style it consistently with existing pages

### Dashboard Customization
- Edit `main.js` to change GitHub repository URLs
- Modify `dashboard.css` for visual design changes
- Update `package.json` for app information

## 🚀 Deployment

### GitHub Pages
This repository is configured for GitHub Pages deployment:
1. Push changes to main branch
2. Site automatically deploys to `https://tejasvisoi.github.io`

### Custom Domain
To use a custom domain:
1. Add CNAME file with your domain
2. Configure DNS settings
3. Update GitHub Pages settings

### Desktop App Distribution
- Build the .dmg installer using `npm run build:dmg`
- Share the .dmg file for easy installation
- Upload to your website for download

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1440px+
- **Tablet**: 768px - 1439px
- **Mobile**: 320px - 767px

## 🔧 Development

### File Structure
- **HTML**: Static pages with semantic markup
- **CSS**: Modular styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS with modern ES6+ features
- **Electron**: Desktop app framework for cross-platform development

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📈 Performance

- **Optimized Images**: Compressed and optimized
- **Minified CSS**: Optimized stylesheets
- **CDN**: Fonts and libraries served via CDN
- **Fast Loading**: Minimal dependencies
- **Caching**: Desktop app caches data for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Website**: [tejasvisoi.github.io](https://tejasvisoi.github.io)
- **Email**: hello@tejasvisoi.com
- **Instagram**: [@tejasvisoi](https://instagram.com/tejasvisoi)
- **Twitter**: [@tejasvisoi](https://twitter.com/tejasvisoi)

---

Built with ❤️ by Tejasvi Soi 