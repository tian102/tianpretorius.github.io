# Tian Pretorius - Portfolio Website

A modern, responsive portfolio website built with clean HTML, CSS, and JavaScript. Features a minimalist developer-focused design with dark mode support, smooth animations, and mobile-first responsive design.

## 🚀 Features

- **Modern Design**: Clean, minimalist interface with code-inspired aesthetics
- **Dark/Light Mode**: Toggle between themes with persistent preference storage
- **Responsive**: Mobile-first design that works perfectly on all devices
- **Smooth Animations**: Fade-ins, typewriter effects, and scroll-based animations
- **Interactive Elements**: Animated skill bars, hover effects, and smooth scrolling
- **SEO Optimized**: Proper meta tags, semantic HTML, and accessibility features
- **PWA Ready**: Service worker for offline functionality and app-like experience
- **Performance**: Optimized loading, lazy animations, and efficient CSS

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+ with modern features
- **Web Fonts**: JetBrains Mono for code aesthetics, Inter for readability
- **PWA**: Service Worker for caching and offline support

## 📁 Project Structure

```
📦 tianpretorius.github.io
├── 📜 index.html          # Main HTML file
├── 🎨 style.css           # All styles with CSS custom properties
├── ⚡ script.js           # Interactive functionality
├── 🔧 sw.js              # Service Worker for PWA
├── 📱 manifest.json      # PWA manifest
├── 📁 assets/
│   ├── 🖼️ profile.png    # Profile picture (add your image)
│   ├── 📄 CV.pdf         # Your CV file (add your CV)
│   └── 📖 README.md      # Asset instructions
└── 📖 README.md          # This file
```

## 🚀 Getting Started

### 1. Clone or Download
```bash
git clone https://github.com/yourusername/tianpretorius.github.io.git
cd tianpretorius.github.io
```

### 2. Add Your Assets
- Replace `assets/profile.png` with your profile picture (300x300px recommended)
- Add `assets/Tian-Pretorius-CV.pdf` with your CV/resume
- Optionally add PWA icons: `assets/icon-192.png` and `assets/icon-512.png`

### 3. Customize Content
Edit `index.html` to update:
- Personal information
- Experience details
- Skills and technologies
- Education background
- Contact information

### 4. Deploy to GitHub Pages
1. Push to your GitHub repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch
5. Your site will be live at `https://yourusername.github.io`

## 🎨 Customization

### Colors and Theme
Edit CSS custom properties in `style.css`:
```css
:root {
  --accent: #3182ce;        /* Primary accent color */
  --bg-primary: #ffffff;    /* Background color */
  --text-primary: #1a202c;  /* Text color */
  /* ... more variables */
}
```

### Typography
Change fonts by updating the Google Fonts link in `index.html` and the CSS variables:
```css
--font-mono: 'YourMonoFont', monospace;
--font-sans: 'YourSansFont', sans-serif;
```

### Content Sections
- Add/remove sections in `index.html`
- Update navigation links
- Modify animations and effects in `script.js`

## ⚡ Performance Features

- **Lazy Loading**: Animations trigger only when elements are in view
- **Efficient CSS**: Uses custom properties for consistent theming
- **Optimized Images**: Recommendations for proper image formats and sizes
- **Minimal JavaScript**: Pure vanilla JS with modern efficient patterns
- **Caching**: Service Worker caches resources for fast loading

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **App-like Experience**: Can be installed on mobile devices
- **Fast Loading**: Cached resources load instantly
- **Responsive**: Adapts to any screen size

## 🔧 Development

### Local Development
Simply open `index.html` in your browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# VS Code Live Server extension (recommended)
```

### Testing
- Test on different devices and browsers
- Validate HTML, CSS, and accessibility
- Check performance with Lighthouse
- Test PWA features

## 🚀 Deployment Options

### GitHub Pages (Recommended)
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Site deploys automatically on push

### Other Options
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **Surge.sh**: Command line deployment
- **Firebase Hosting**: Google's hosting platform

## 📈 SEO & Analytics

The site includes:
- Proper meta tags for SEO
- Open Graph tags for social sharing
- Structured data markup
- Sitemap-ready structure

To add analytics, insert tracking code in `index.html` before closing `</head>` tag.

## 🎯 Features in Detail

### Dark Mode
- Automatic system preference detection
- Manual toggle with persistent storage
- Smooth transitions between themes
- Properly styled for both modes

### Animations
- Intersection Observer for performance
- CSS transforms and transitions
- Typewriter effect for tagline
- Scroll-based parallax effects
- Smooth scrolling navigation

### Mobile Experience
- Mobile-first responsive design
- Touch-friendly navigation
- Optimized typography scaling
- Proper viewport handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Support

If you need help customizing the site or have questions:
- Check the code comments for guidance
- Review the CSS custom properties for easy theming
- Look at the JavaScript classes for functionality
- Create an issue for bugs or feature requests

---

**Built with ❤️ and lots of ☕**

*Ready to deploy to GitHub Pages and showcase your professional portfolio!*
