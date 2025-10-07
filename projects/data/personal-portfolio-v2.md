---
title: "Personal Portfolio Website v2"
date: 2025-10-01
tags: [HTML, CSS, JavaScript, Web Development, PWA]
featured: true
github: https://github.com/tian102/tianpretorius.github.io
demo: https://tianpretorius.github.io
image: /assets/projects/portfolio-site.jpg
role: Solo Developer
duration: October 2025
---

## Project Overview

Complete redesign and restructuring of my personal portfolio website, transforming it from a single-page portfolio into a multi-page site with blog, projects showcase, and comprehensive resume section. Built entirely with vanilla HTML, CSS, and JavaScript - no frameworks, no build tools, just clean code.

## The Goal

Transform my GitHub Pages portfolio into a comprehensive personal website that:
1. **Showcases my work** through detailed project case studies
2. **Documents my journey** from CTO to solo SaaS founder
3. **Provides easy access** to my resume and contact information
4. **Maintains performance** with fast load times and mobile-first design
5. **Stays simple** using only vanilla HTML/CSS/JS (GitHub Pages friendly)

## Features

### 🏠 Landing Page
- Hero section with dynamic typewriter effect
- Featured projects carousel
- Recent blog posts preview
- Clear calls-to-action
- Terminal-inspired aesthetic

### 📝 Blog System
- Markdown-based blog posts
- Tag-based filtering
- Reading time calculation
- Featured post highlighting
- RSS feed generation
- Responsive design

### 💼 Projects Showcase
- Detailed case studies for each project
- Technology tag filtering
- Project status indicators
- Links to live demos and GitHub repos
- Image galleries for visual impact

### 👤 About Page
- Professional biography
- Experience timeline
- Skills breakdown
- Education history
- Interests and hobbies
- Certifications

### 📄 Resume Page
- Interactive HTML resume
- Downloadable PDF version
- Print-optimized styling
- ATS-friendly formatting
- Easy updates via simple HTML

### 🌗 Theme System
- Dark/light mode toggle
- Persists preference in localStorage
- System preference detection
- Smooth transitions
- Accessible contrast ratios

## Technical Implementation

### Architecture

```
Site Structure:
├── index.html              # Landing page
├── blog.html               # Blog index
├── blog/
│   ├── post.html          # Dynamic post template
│   └── posts/             # Markdown blog posts
├── projects.html          # Projects showcase
├── projects/
│   └── data/              # Project markdown files
├── about.html             # About page
├── resume.html            # Resume page
├── style.css              # Global styles
├── js/
│   ├── theme.js           # Theme management
│   ├── blog.js            # Blog rendering
│   ├── projects.js        # Projects loading
│   └── marked.min.js      # Markdown parser
└── assets/                # Images, PDFs, etc.
```

### Key Technologies

**Frontend**:
- Vanilla JavaScript (ES6+)
- CSS3 with Custom Properties
- HTML5 Semantic Elements
- CSS Grid & Flexbox for layouts

**Content Management**:
- Markdown files for blog posts
- YAML frontmatter for metadata
- Marked.js for markdown parsing
- JSON for structured data

**Features**:
- Service Worker for PWA functionality
- LocalStorage for theme persistence
- Intersection Observer for animations
- CSS transitions for smooth UX

**Performance**:
- No build step required
- Minimal JavaScript
- Optimized images
- Efficient CSS (no frameworks)

## Development Process

### Phase 1: Planning & Design (1 day)
- Analyzed existing site structure
- Defined new pages and navigation
- Sketched layout designs
- Planned folder structure

### Phase 2: Core Pages (2 days)
- Created HTML templates for all pages
- Built navigation system
- Implemented theme toggle
- Set up routing

### Phase 3: Blog System (2 days)
- Implemented markdown parser
- Created post template
- Built index page with filtering
- Added featured posts

### Phase 4: Projects Showcase (1 day)
- Created project template
- Built filtering system
- Added project data
- Implemented image handling

### Phase 5: Resume & About (1 day)
- Designed resume layout
- Created PDF export version
- Built about page
- Added timeline components

### Phase 6: Polish & Testing (1 day)
- Mobile responsiveness testing
- Performance optimization
- Accessibility improvements
- Cross-browser testing

**Total time**: ~7 days of focused development

## Technical Challenges & Solutions

### Challenge 1: Markdown Parsing Without Build Step
**Problem**: Need to render markdown to HTML at runtime.

**Solution**:
- Integrated Marked.js library
- Parse frontmatter manually with regex
- Cache parsed content in memory
- Pre-load post metadata on index page

### Challenge 2: URL Routing Without SPA Framework
**Problem**: Handle deep linking to blog posts and projects.

**Solution**:
```javascript
// Dynamic post loading
const params = new URLSearchParams(window.location.search);
const postSlug = params.get('post');
if (postSlug) {
    loadPost(postSlug);
}
```

### Challenge 3: Theme Persistence
**Problem**: Theme preference should persist across pages.

**Solution**:
```javascript
// Apply theme before page render to prevent flash
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
```

### Challenge 4: Mobile Navigation
**Problem**: Complex navigation on small screens.

**Solution**:
- Hamburger menu with smooth animations
- Touch-friendly tap targets
- Accessible keyboard navigation
- Close menu on link click

## Design Decisions

### Terminal Aesthetic
- Monospace font (JetBrains Mono) for headers
- `$` prompt symbol in section titles
- Code block styling throughout
- Syntax highlighting for code examples

### Color Scheme
- Professional blue accent color
- High contrast for readability
- Consistent across light/dark themes
- WCAG AA compliant

### Typography
- Inter for body text (excellent readability)
- JetBrains Mono for code and headers
- Responsive font sizing
- Optimized line height

### Animations
- Fade-in on scroll for sections
- Smooth theme transitions
- Hover effects on interactive elements
- Performance-conscious (CSS only where possible)

## Performance Metrics

### Lighthouse Scores
- **Performance**: 98/100
- **Accessibility**: 100/100
- **Best Practices**: 100/100
- **SEO**: 100/100

### Load Times
- **First Contentful Paint**: <1s
- **Time to Interactive**: <1.5s
- **Total Page Size**: <500KB
- **JavaScript**: <50KB (including Marked.js)

### Optimizations
- Lazy loading for images
- Minimal JavaScript execution
- CSS is optimized and minified
- Service worker caches assets
- Preconnect to font sources

## Features for Creators

### Easy Content Updates
```markdown
---
title: "My New Blog Post"
date: 2025-10-15
tags: [javascript, webdev]
excerpt: "A short description..."
---

# Your Content Here

Write markdown normally. No build step required!
```

### Simple Project Addition
1. Create new `.md` file in `/projects/data/`
2. Add frontmatter with metadata
3. Write project description in markdown
4. Save and deploy - that's it!

### Theme Customization
All colors defined as CSS custom properties:
```css
:root {
  --accent: #3182ce;
  --bg-primary: #ffffff;
  /* Easy to customize */
}
```

## What I Learned

### Technical
1. **Vanilla JS is powerful** - Don't always need frameworks
2. **CSS Variables are amazing** - Makes theming trivial
3. **Markdown is great** - Easy content management without CMS
4. **Performance matters** - Simple sites can be blazing fast

### Design
1. **Consistency is key** - Maintain visual language throughout
2. **Mobile-first works** - Easier to scale up than down
3. **Accessibility isn't hard** - Semantic HTML goes a long way
4. **Less is more** - Simple designs age better

### Process
1. **Plan before coding** - Saves time in the long run
2. **Test early, test often** - Catch issues before they compound
3. **Document as you go** - Future you will thank you
4. **Ship and iterate** - Don't wait for perfect

## Future Enhancements

### Planned Features
- [ ] Search functionality for blog posts
- [ ] Comments system (maybe utterances.es)
- [ ] Analytics integration
- [ ] Newsletter signup form
- [ ] Dark/light/auto theme modes
- [ ] Reading progress indicator
- [ ] Related posts suggestions
- [ ] Tags page for browsing by topic

### Potential Additions
- [ ] Projects timeline view
- [ ] Interactive skills visualization
- [ ] Blog post series grouping
- [ ] Now page (what I'm currently doing)
- [ ] Uses page (tools and setup)

## Open Source

This entire portfolio is open source! Feel free to:
- Fork it for your own portfolio
- Learn from the code
- Suggest improvements
- Report bugs

### Using This Template

```bash
# Clone the repo
git clone https://github.com/tian102/tianpretorius.github.io

# Customize content
# - Edit index.html with your info
# - Add your blog posts to blog/posts/
# - Add your projects to projects/data/
# - Update assets folder with your images
# - Modify style.css for your colors

# Deploy to GitHub Pages
# - Push to your username.github.io repo
# - Enable GitHub Pages in settings
# - Done!
```

## Lessons for Aspiring Developers

### On Simplicity
You don't need React/Vue/Angular for a personal site. Sometimes vanilla JS is the right choice.

### On Content
Great content > fancy animations. Focus on what you're saying, not just how it looks.

### On Shipping
Done and deployed beats perfect and unfinished. Ship it, then improve it.

### On Learning
Build projects you need. This portfolio solves my actual problem (showcasing my work).

---

**Status**: Live and actively maintained

**View Live**: [tianpretorius.github.io](https://tianpretorius.github.io)

**View Source**: [GitHub](https://github.com/tian102/tianpretorius.github.io)

**Tech Stack**: HTML, CSS, JavaScript, Markdown, GitHub Pages

**License**: MIT - Use it for your own portfolio!
