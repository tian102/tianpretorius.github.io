# Content Management System Documentation

## Overview
This portfolio now features a centralized content management system that allows you to edit all site text from a single JSON file instead of editing individual HTML files.

## Architecture

### Files Structure
```
data/
├── site-content.json       # Main content configuration (ALL SITE TEXT)
├── blog-posts.json         # Generated blog posts data
└── projects.json           # Generated projects data

js/
├── content-loader.js       # Content loading utility
├── index.js                # Homepage functionality
├── blog.js                 # Blog page functionality
├── projects.js             # Projects page functionality
└── main.js                 # Site-wide navigation & effects
```

## How It Works

### 1. Content Storage (`data/site-content.json`)
All static site content is stored in a structured JSON file with the following sections:

- **personal**: Your personal information (name, email, social links, resume)
- **hero**: Homepage hero section content
- **about**: About page sections, skills, experience, and sidebar
- **projects**: Projects page header content
- **blog**: Blog page header content
- **contact**: Contact page content and methods
- **footer**: Footer content and links

### 2. Content Loader (`js/content-loader.js`)
A JavaScript utility that provides:

- `ContentLoader.load()` - Load site content from JSON
- `ContentLoader.get(path)` - Get content by dot-notation path (e.g., 'hero.greeting')
- `ContentLoader.populate(elementId, contentPath)` - Populate single element
- `ContentLoader.populateMultiple(mappings)` - Populate multiple elements at once
- `ContentLoader.renderAboutSections(containerId)` - Render about page sections
- `ContentLoader.renderHomeSkills(containerId)` - Render collapsible skills categories (homepage)
- `ContentLoader.renderSkills(containerId)` - Render skills tags (about page sidebar)
- `ContentLoader.renderExperience(containerId)` - Render experience items
- `ContentLoader.renderContactMethods(containerId)` - Render contact methods
- `ContentLoader.renderFooter(containerId)` - Render footer content
- `ContentLoader.initHeroTypedText()` - Initialize typing animation with roles

### 3. Page Integration
Each HTML page includes:
1. IDs on content elements (e.g., `id="hero-description"`)
2. Content loader script: `<script src="js/content-loader.js?v=VERSION"></script>`
3. Initialization code to load and populate content

**Note**: Cache versioning (e.g., `?v=20251009-59`) is used to ensure browsers load the latest version of CSS/JS files after updates.

## Editing Content

### Step-by-Step Guide

1. **Open** `data/site-content.json` in your editor
2. **Find** the section you want to edit (personal, hero, about, etc.)
3. **Edit** the text values
4. **Save** the file
5. **Refresh** your browser - changes appear immediately!

### Example: Changing Hero Section

```json
{
  "hero": {
    "greeting": "Hi, I'm",
    "name": "Tian Pretorius",
    "typedRoles": [
      "Software Engineer",
      "Full-Stack Developer",
      "SaaS Founder"
    ],
    "description": "Your new description here...",
    "cta": {
      "primary": "About Me",
      "secondary": "Get In Touch"
    }
  }
}
```

### Example: Adding a New Skill Category (Homepage)

In the `homepage.skills.categories` array:
```json
{
  "homepage": {
    "skills": {
      "categories": [
        {
          "name": "Frontend",
          "tags": ["React", "Vue.js", "TypeScript"]
        },
        {
          "name": "Your New Category",  // ← Add new category
          "tags": ["Tool 1", "Tool 2", "Tool 3"]
        }
      ]
    }
  }
}
```

Or add to existing category's tags array:
```json
{
  "name": "Frontend",
  "tags": ["React", "Vue.js", "TypeScript", "Your New Skill"]  // ← Add here
}
```

### Example: Updating Contact Methods

```json
{
  "contact": {
    "methods": [
      {
        "icon": "✉️",
        "title": "Email",
        "value": "newemail@example.com",
        "link": "mailto:newemail@example.com"
      }
    ]
  }
}
```

## Pages Using Content Loader

### index.html
- Hero section (greeting, name, description, CTAs)
- Hero typed text animation
- About section with collapsible skill categories
- Featured projects and blog posts
- Contact preview
- Footer

### about.html
- Page title and tagline
- About sections (Who I Am, What I Do, My Journey)
- Skills tags
- Experience items
- Current focus
- Footer

### contact.html
- Page title and tagline
- Intro paragraph
- Contact methods (Email, LinkedIn, GitHub)
- Footer

### blog.html
- Page title and tagline
- Blog post listings with filtering and search
- Individual post pages with TOC sidebar
- Footer

### projects.html
- Page title and tagline
- Project listings with filtering
- Individual project pages with TOC sidebar
- Footer

## Benefits

### ✅ Centralized Content
- All text in one file
- Easy to find and edit
- Single source of truth

### ✅ No HTML Editing Required
- Edit JSON instead of HTML
- Less prone to breaking layout
- Cleaner separation of content and structure

### ✅ Consistent Across Pages
- Reuse content (e.g., footer on all pages)
- Update once, changes everywhere
- Maintains consistency

### ✅ Easy Maintenance
- Quick content updates
- No need to understand HTML structure
- Version control friendly

### ✅ Enhanced User Experience
- Collapsible skill categories keep content organized
- TOC sidebar for easy navigation on long posts
- Smooth animations and transitions
- Responsive design across all devices

## Build & Deploy Process

### Development Workflow
1. Edit content in `data/site-content.json`
2. Refresh browser to see changes immediately
3. No build step required for content changes

### Blog & Projects Workflow
1. Edit markdown files in `blog/posts/*.md` or `projects/posts/*.md`
2. Run `npm run build` to generate JSON
3. Or let GitHub Actions auto-build on push

### Deployment
1. Commit changes to git
2. Push to GitHub
3. GitHub Actions automatically:
   - Builds blog/projects JSON
   - Deploys to GitHub Pages

## Content Structure Reference

### Personal Information
```json
"personal": {
  "name": "Your Name",
  "title": "Your Title",
  "email": "your@email.com",
  "social": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username"
  },
  "resume": "assets/Your-Resume.pdf"
}
```

### Hero Section
```json
"hero": {
  "greeting": "Hi, I'm",
  "name": "Your Name",
  "typedRoles": ["Role 1", "Role 2", "Role 3"],
  "description": "Your description...",
  "cta": {
    "primary": "Button 1 Text",
    "secondary": "Button 2 Text"
  }
}
```

### About Sections
```json
"about": {
  "pageTitle": "About Me",
  "pageTagline": "Your tagline",
  "sections": [
    {
      "title": "Section Title",
      "content": ["Paragraph 1", "Paragraph 2"]
    },
    {
      "title": "What I Do",
      "intro": "Intro paragraph",
      "list": ["Item 1", "Item 2", "Item 3"]
    }
  ]
}
```

### Homepage Skills (Collapsible Categories)
```json
"homepage": {
  "skills": {
    "title": "Skills & Technologies",
    "categories": [
      {
        "name": "Frontend",
        "tags": ["React", "Vue.js", "TypeScript"]
      },
      {
        "name": "Backend",
        "tags": ["Node.js", "Python", "PostgreSQL"]
      }
    ]
  }
}
```

### Sidebar Content (About Page)
```json
"sidebar": {
  "skills": {
    "title": "Skills & Technologies",
    "tags": ["Skill 1", "Skill 2"]
  },
  "experience": {
    "title": "Experience",
    "items": [
      {
        "title": "Job Title",
        "duration": "Years",
        "description": "Description"
      }
    ]
  },
  "currentFocus": {
    "title": "Current Focus",
    "intro": "Brief intro text",
    "list": ["Focus Area 1", "Focus Area 2"]
  }
}
```

### Contact Methods
```json
"contact": {
  "pageTitle": "Get In Touch",
  "pageTagline": "Tagline",
  "intro": "Intro paragraph",
  "methods": [
    {
      "icon": "✉️",
      "title": "Email",
      "value": "your@email.com",
      "link": "mailto:your@email.com"
    }
  ]
}
```

### Footer
```json
"footer": {
  "copyright": "© 2025 Your Name. Built with...",
  "links": [
    {
      "text": "GitHub",
      "url": "https://github.com/username"
    }
  ]
}
```

## Troubleshooting

### Content Not Updating
1. Check browser console for errors (F12)
2. Verify JSON syntax is valid (use JSONLint.com)
3. Clear browser cache (Ctrl+F5)
4. Check element IDs match between HTML and loader code

### Footer Not Showing
- Ensure container has `id="footer-container"`
- Check `ContentLoader.renderFooter('footer-container')` is called
- Verify footer data exists in `site-content.json`

### Skills/Experience Not Rendering
- Check array structure in JSON
- Verify container IDs are correct
- Check browser console for errors

### Typed Text Not Working
- Ensure `typedRoles` array is not empty
- Check element has class `typed-text`
- Verify `ContentLoader.initHeroTypedText()` is called

### Collapsible Elements Not Working
- Check that details/summary structure is correct in HTML
- Verify CSS includes transitions and chevron rotation
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors

## Technical Details

### Content Loading Flow
1. Page loads → `DOMContentLoaded` event fires
2. `ContentLoader.load()` fetches `data/site-content.json`
3. Content is cached in memory
4. `ContentLoader.populate()` or render functions update DOM
5. Page displays with dynamic content

### Path Resolution
The content loader uses dot-notation paths:
- `"hero.greeting"` → `siteContent.hero.greeting`
- `"about.sections"` → `siteContent.about.sections`
- `"footer.links"` → `siteContent.footer.links`

### Caching
Content is loaded once and cached. Subsequent calls to `ContentLoader.get()` use the cached data.

## Best Practices

### ✅ DO
- Use consistent formatting in JSON
- Test changes locally before deploying
- Keep backups of `site-content.json`
- Use descriptive content values
- Commit changes to git regularly

### ❌ DON'T
- Don't include HTML in JSON content (use plain text)
- Don't delete keys from JSON (set to empty string if needed)
- Don't edit generated JSON files (`blog-posts.json`, `projects.json`)
- Don't remove element IDs from HTML pages

## UI Features

### Table of Contents (TOC)
Blog and project detail pages automatically generate a navigable table of contents:

- **Auto-generation**: Parses H2 and H3 headings from markdown content
- **Nested Structure**: H3 headings grouped under parent H2s
- **Collapsible**: TOC and H2 sections can be expanded/collapsed
- **Sticky Positioning**: Follows scroll, stays below navbar
- **Active Highlighting**: Current section highlighted during scroll
- **Smooth Navigation**: Clicking TOC links scrolls smoothly to sections

### Collapsible Skills Categories (Homepage)
The About section on the homepage displays skills in collapsible categories:

- **Card Design**: Each category is a styled card with border and hover effects
- **Collapsed by Default**: Categories start collapsed for clean appearance
- **Chevron Icons**: Visual indicator of expand/collapse state (rotates 180°)
- **Smooth Animations**: CSS transitions for opening/closing
- **Category Organization**: Skills grouped logically (Frontend, Backend, etc.)

## Future Enhancements

Potential improvements to the content management system:

1. **Visual Editor**: Web-based interface for editing content
2. **Content Validation**: JSON schema validation
3. **Preview Mode**: See changes before saving
4. **Multi-language Support**: Internationalization
5. **Content Versioning**: Track content changes over time
6. **Media Management**: Images and assets in JSON
7. **Content Search**: Find content across all sections
8. **Import/Export**: Backup and restore content
9. **TOC Enhancements**: Search functionality, bookmark support
10. **Dark Mode Improvements**: Enhanced theme consistency

## Summary

The content management system provides a clean, maintainable way to manage all site text from a single JSON file. This architecture:

- **Separates content from structure** (JSON vs HTML)
- **Simplifies updates** (edit one file instead of many)
- **Maintains consistency** (reusable content components)
- **Improves workflow** (no HTML knowledge required for content changes)

Simply edit `data/site-content.json`, save, and refresh your browser to see changes!
