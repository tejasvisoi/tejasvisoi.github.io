#!/usr/bin/env python3
"""
Tejasvi Soi Portfolio Admin Console
A secure, local web application for managing portfolio content
"""

import os
import json
import sqlite3
import hashlib
import secrets
from datetime import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import shutil

# Initialize Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///admin_console.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Content(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    page = db.Column(db.String(50), nullable=False)  # homepage, case_study, portfolio
    section = db.Column(db.String(50), nullable=False)  # hero, present, past, social
    key = db.Column(db.String(100), nullable=False)  # line1, line2, items, etc.
    value = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    url = db.Column(db.String(500), nullable=False)

class CaseStudy(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    status = db.Column(db.String(20), default='draft')  # draft, published
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create database tables
with app.app_context():
    db.create_all()
    
    # Create default admin user if none exists
    if not User.query.first():
        default_password = 'tejasvi2024'
        admin_user = User(
            username='admin',
            password_hash=generate_password_hash(default_password)
        )
        db.session.add(admin_user)
        db.session.commit()
        print(f"Default admin user created with password: {default_password}")

# Helper Functions
def get_content(page, section, key):
    """Get content from database"""
    content = Content.query.filter_by(page=page, section=section, key=key).first()
    return content.value if content else ''

def set_content(page, section, key, value):
    """Set content in database"""
    content = Content.query.filter_by(page=page, section=section, key=key).first()
    if content:
        content.value = value
    else:
        content = Content(page=page, section=section, key=key, value=value)
        db.session.add(content)
    db.session.commit()

def allowed_file(filename):
    """Check if file type is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf', 'mp4', 'webm'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Get statistics
    stats = {
        'case_studies': CaseStudy.query.count(),
        'published_case_studies': CaseStudy.query.filter_by(status='published').count(),
        'media_files': Media.query.count(),
        'total_size': sum(m.file_size for m in Media.query.all()) if Media.query.count() > 0 else 0
    }
    
    return render_template('dashboard.html', stats=stats)

@app.route('/homepage')
def homepage():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Load current content
    content = {
        'hero': {
            'line1': get_content('homepage', 'hero', 'line1'),
            'line2': get_content('homepage', 'hero', 'line2'),
            'subtitle': get_content('homepage', 'hero', 'subtitle')
        },
        'present': {
            'title': get_content('homepage', 'present', 'title'),
            'items': json.loads(get_content('homepage', 'present', 'items') or '[]')
        },
        'past': {
            'title': get_content('homepage', 'past', 'title'),
            'items': json.loads(get_content('homepage', 'past', 'items') or '[]')
        },
        'social': {
            'items': json.loads(get_content('homepage', 'social', 'items') or '[]')
        }
    }
    
    return render_template('homepage.html', content=content)

@app.route('/api/homepage', methods=['POST'])
def save_homepage():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        
        # Save hero section
        set_content('homepage', 'hero', 'line1', data['hero']['line1'])
        set_content('homepage', 'hero', 'line2', data['hero']['line2'])
        set_content('homepage', 'hero', 'subtitle', data['hero']['subtitle'])
        
        # Save present section
        set_content('homepage', 'present', 'title', data['present']['title'])
        set_content('homepage', 'present', 'items', json.dumps(data['present']['items']))
        
        # Save past section
        set_content('homepage', 'past', 'title', data['past']['title'])
        set_content('homepage', 'past', 'items', json.dumps(data['past']['items']))
        
        # Save social section
        set_content('homepage', 'social', 'items', json.dumps(data['social']['items']))
        
        return jsonify({'success': True, 'message': 'Homepage saved successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/case-studies')
def case_studies():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    case_studies = CaseStudy.query.order_by(CaseStudy.updated_at.desc()).all()
    return render_template('case_studies.html', case_studies=case_studies)

@app.route('/case-studies/new', methods=['GET', 'POST'])
def new_case_study():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        data = request.json
        case_study = CaseStudy(
            slug=data['slug'],
            title=data['title'],
            description=data['description'],
            content=data['content'],
            status=data['status']
        )
        db.session.add(case_study)
        db.session.commit()
        return jsonify({'success': True, 'id': case_study.id})
    
    return render_template('case_study_edit.html')

@app.route('/case-studies/<int:id>/edit', methods=['GET', 'POST'])
def edit_case_study(id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    case_study = CaseStudy.query.get_or_404(id)
    
    if request.method == 'POST':
        data = request.json
        case_study.slug = data['slug']
        case_study.title = data['title']
        case_study.description = data['description']
        case_study.content = data['content']
        case_study.status = data['status']
        db.session.commit()
        return jsonify({'success': True})
    
    return render_template('case_study_edit.html', case_study=case_study)

@app.route('/case-studies/<int:id>/delete', methods=['POST'])
def delete_case_study(id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    case_study = CaseStudy.query.get_or_404(id)
    db.session.delete(case_study)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/portfolio')
def portfolio():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    content = {
        'title': get_content('portfolio', 'main', 'title'),
        'description': get_content('portfolio', 'main', 'description'),
        'items': json.loads(get_content('portfolio', 'main', 'items') or '[]')
    }
    
    return render_template('portfolio.html', content=content)

@app.route('/api/portfolio', methods=['POST'])
def save_portfolio():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        set_content('portfolio', 'main', 'title', data['title'])
        set_content('portfolio', 'main', 'description', data['description'])
        set_content('portfolio', 'main', 'items', json.dumps(data['items']))
        return jsonify({'success': True, 'message': 'Portfolio saved successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/media')
def media():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    media_files = Media.query.order_by(Media.uploaded_at.desc()).all()
    return render_template('media.html', media_files=media_files)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid conflicts
        name, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{name}_{timestamp}{ext}"
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Save to database
        media = Media(
            filename=filename,
            original_name=file.filename,
            file_type=ext.lower(),
            file_size=os.path.getsize(file_path),
            url=f'/uploads/{filename}'
        )
        db.session.add(media)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'filename': filename,
            'url': media.url,
            'id': media.id
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/media/<int:id>/delete', methods=['POST'])
def delete_media(id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    media = Media.query.get_or_404(id)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], media.filename)
    
    if os.path.exists(file_path):
        os.remove(file_path)
    
    db.session.delete(media)
    db.session.commit()
    
    return jsonify({'success': True})

@app.route('/settings')
def settings():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('settings.html')

@app.route('/api/change-password', methods=['POST'])
def change_password():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    user = User.query.get(session['user_id'])
    
    if not check_password_hash(user.password_hash, data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    user.password_hash = generate_password_hash(data['new_password'])
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Password changed successfully!'})

@app.route('/api/backup', methods=['POST'])
def create_backup():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_dir = f'backups/backup_{timestamp}'
        os.makedirs(backup_dir, exist_ok=True)
        
        # Backup database
        shutil.copy('admin_console.db', f'{backup_dir}/database.db')
        
        # Backup uploads
        if os.path.exists('uploads'):
            shutil.copytree('uploads', f'{backup_dir}/uploads')
        
        # Create backup info
        backup_info = {
            'created_at': datetime.now().isoformat(),
            'user': session['username'],
            'files': len(os.listdir('uploads')) if os.path.exists('uploads') else 0,
            'database_size': os.path.getsize('admin_console.db')
        }
        
        with open(f'{backup_dir}/backup_info.json', 'w') as f:
            json.dump(backup_info, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': f'Backup created: {backup_dir}',
            'backup_path': backup_dir
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export', methods=['POST'])
def export_data():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        # Export all content
        content_data = {}
        for content in Content.query.all():
            if content.page not in content_data:
                content_data[content.page] = {}
            if content.section not in content_data[content.page]:
                content_data[content.page][content.section] = {}
            content_data[content.page][content.section][content.key] = content.value
        
        # Export case studies
        case_studies_data = []
        for case_study in CaseStudy.query.all():
            case_studies_data.append({
                'slug': case_study.slug,
                'title': case_study.title,
                'description': case_study.description,
                'content': case_study.content,
                'status': case_study.status,
                'created_at': case_study.created_at.isoformat(),
                'updated_at': case_study.updated_at.isoformat()
            })
        
        # Export media info
        media_data = []
        for media in Media.query.all():
            media_data.append({
                'filename': media.filename,
                'original_name': media.original_name,
                'file_type': media.file_type,
                'file_size': media.file_size,
                'url': media.url,
                'uploaded_at': media.uploaded_at.isoformat()
            })
        
        export_data = {
            'exported_at': datetime.now().isoformat(),
            'content': content_data,
            'case_studies': case_studies_data,
            'media': media_data
        }
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        export_file = f'exports/export_{timestamp}.json'
        os.makedirs('exports', exist_ok=True)
        
        with open(export_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': f'Data exported: {export_file}',
            'export_path': export_file
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/preview/<path:url>')
def preview(url):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # This would integrate with your main website
    # For now, return a preview page
    return render_template('preview.html', url=url)

if __name__ == '__main__':
    print("🚀 Starting Tejasvi Soi Admin Console...")
    print("📍 Local URL: http://localhost:8080")
    print("🔐 Default password: tejasvi2024")
    print("⚠️  Remember to change the default password!")
    app.run(debug=True, host='0.0.0.0', port=8080)