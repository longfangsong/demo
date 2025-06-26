# Media Gallery

A modern single-page application for displaying images and videos with automatic GitHub Pages deployment.

## Features

- 📱 **Responsive Design** - Perfect for desktop and mobile
- 🎬 **Media Support** - JPG images and MP4 videos
- 🔍 **Smart Filtering** - Filter by media type
- 🖼️ **Modal Preview** - Full-screen media viewing
- ⚡ **Performance** - Lazy loading and smooth animations
- 🚀 **Auto Deploy** - GitHub Actions workflow for automatic deployment

## Quick Start

1. **Fork or clone this repository**
2. **Push to your GitHub repository**
3. **Enable GitHub Pages** (see deployment section below)
4. **Your site will be automatically deployed!**

## 🚀 Automatic Deployment with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the main branch.

### Setup Steps:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/repository-name.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Under "Source", select "GitHub Actions"
   - Save the settings

3. **Automatic Deployment**:
   - The workflow will automatically trigger on push to main
   - Check the "Actions" tab to see deployment progress
   - Your site will be available at: `https://username.github.io/repository-name`

### Workflow Features:
- ✅ Automatic deployment on push to main branch
- ✅ Manual deployment option via Actions tab
- ✅ Proper permissions and security settings
- ✅ Concurrent deployment protection

## 🛠️ Local Development

```bash
# Start local server
python -m http.server 8000

# Or using Node.js
npx serve .

# Visit http://localhost:8000
```

## 📁 Project Structure

```
/
├── .github/workflows/
│   └── deploy.yml      # GitHub Actions workflow
├── index.html          # Main page
├── styles.css          # Styles
├── script.js           # JavaScript logic
├── README.md           # Documentation
├── .gitignore          # Git ignore rules
└── media files/        # Your media files
    ├── 269a.jpg
    ├── 269h.jpg
    ├── 269i.jpg
    ├── 269b.mp4
    ├── 269c.mp4
    ├── 269d.mp4
    ├── 269e.mp4
    ├── 269f.mp4
    ├── 269g.mp4
    └── 269j.mp4
```

## 🎯 How It Works

- **Filtering**: Click "All", "Images", or "Videos" to filter content
- **Modal View**: Click any media item for full-screen viewing
- **Responsive**: Automatically adapts to screen size
- **Performance**: Lazy loading for optimal performance

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

---

**Auto-deployed with GitHub Actions** 🚀
