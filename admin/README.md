# 🎛️ Admin Console - Tejasvi Soi Portfolio

A private, secure admin console for managing your portfolio website content.

## 🔐 Access Information

**Admin URL:** `https://yourdomain.com/admin/`  
**Default Password:** `tejasvi2024`

⚠️ **Important:** Change the default password immediately after first login!

## 🚀 Features

### 📊 Dashboard
- Overview of website statistics
- Quick access to common actions
- Real-time status indicators

### 🏠 Homepage Management
- **Hero Section:** Edit main heading and subtitle
- **Present Work:** Manage current projects and links
- **Past Work:** Edit case study links and portfolio items
- **Social Links:** Update social media profiles

### 📝 Case Studies
- Create new case study pages
- Edit existing case studies
- Publish/unpublish case studies
- Preview case study pages

### 📁 Portfolio Management
- Manage full portfolio page content
- Add/remove portfolio items
- Edit portfolio description
- Preview portfolio page

### 🖼️ Media Library
- Upload images and files
- Drag & drop file upload
- File validation (JPG, PNG, GIF, SVG, PDF)
- Media file management

### ⚙️ Settings
- Change admin password
- Create website backups
- View analytics (future feature)

## 🛠️ Setup Instructions

### 1. File Structure
```
your-website/
├── admin/
│   ├── index.html      # Admin console interface
│   ├── admin.css       # Admin console styles
│   ├── admin.js        # Admin console functionality
│   └── README.md       # This file
├── index.html          # Main website
├── styles.css          # Main website styles
├── script.js           # Main website scripts
├── googlepay.html      # Case study pages
├── dunzo.html
├── eurekaforbes.html
├── portfolio.html
└── images/             # Media files
```

### 2. Security Setup

#### Change Default Password
1. Open `admin/admin.js`
2. Find line 4: `this.adminPassword = 'tejasvi2024';`
3. Change to your secure password
4. Save the file

#### Recommended Security Measures
- Use HTTPS for your domain
- Consider adding IP whitelisting
- Regularly backup your admin files
- Use a strong, unique password

### 3. Customization

#### Adding New Case Studies
1. Create new HTML file (e.g., `newproject.html`)
2. Use the existing case study template
3. Add to admin console case studies section
4. Update navigation links

#### Customizing Admin Interface
- Edit `admin/admin.css` for styling changes
- Modify `admin/admin.js` for functionality
- Update `admin/index.html` for layout changes

## 📱 Usage Guide

### Logging In
1. Navigate to `yourdomain.com/admin/`
2. Enter your password
3. Click "Access Console"

### Editing Homepage Content
1. Click "Homepage" in navigation
2. Select content section (Hero, Present, Past, Social)
3. Edit text and links
4. Click "Save Changes"
5. Use "Preview" to see changes

### Managing Case Studies
1. Click "Case Studies" in navigation
2. View all case studies with status
3. Click "Edit" to modify content
4. Click "View" to preview page
5. Click "Publish" to make live

### Uploading Media
1. Click "Media" in navigation
2. Drag files to upload area or click to browse
3. Supported formats: JPG, PNG, GIF, SVG, PDF
4. Maximum file size: 10MB

### Changing Password
1. Click "Settings" in navigation
2. Enter new password (minimum 6 characters)
3. Click "Update Password"

## 🔧 Technical Details

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### File Size Limits
- Images: 10MB maximum
- Documents: 10MB maximum
- Total uploads: Unlimited (subject to server limits)

### Data Storage
- Current implementation uses localStorage
- For production, integrate with database/API
- Consider cloud storage for media files

## 🚨 Troubleshooting

### Can't Access Admin Console
- Check if admin folder exists
- Verify file permissions
- Ensure HTTPS is enabled

### Password Not Working
- Check for typos
- Clear browser cache
- Reset password in admin.js file

### Upload Issues
- Check file size (max 10MB)
- Verify file format is supported
- Ensure sufficient server storage

### Changes Not Saving
- Check browser console for errors
- Verify localStorage is enabled
- Clear browser cache and try again

## 🔮 Future Enhancements

### Planned Features
- [ ] Database integration
- [ ] User management (multiple admins)
- [ ] Content versioning
- [ ] SEO optimization tools
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Backup automation
- [ ] Mobile app

### API Integration
- [ ] RESTful API for content management
- [ ] Cloud storage integration
- [ ] CDN for media files
- [ ] Real-time collaboration

## 📞 Support

For technical support or feature requests:
- Email: hello@tejasvisoi.com
- GitHub Issues: [Create an issue](https://github.com/tejasvisoi/tejasvisoi.github.io/issues)

## 📄 License

This admin console is part of your personal portfolio website.
Customize and use as needed for your projects.

---

**Last Updated:** August 2024  
**Version:** 1.0.0 