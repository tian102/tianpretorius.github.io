---
title: 3. Portfolio Website with Markdown Content System
description: A vanilla JavaScript portfolio with custom markdown-based content management, built the hard way because I refused to learn Jekyll.
tags: [css, js, html, markdown, github, node]
demo: https://tianpretorius.github.io
github: https://github.com/tian102/tianpretorius.github.io
coverImage: https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1200&h=630&fit=crop
date: 2025-10-10
---

# Portfolio Website with Markdown Content System

## Reinventing the Wheel

I built this portfolio the hard way—no frameworks, no backend, no Jekyll—just Node.js, vanilla JavaScript, and a stubborn streak. Every markdown file, asset, and route is handled by a custom system I wrote myself. Sure, it took a bunch of hours to do what a few commands in Jekyll could’ve done, but along the way I learned everything about build automation, client-side routing, and modular site design—and now I have a portfolio that’s annoyingly mine.

![Cover Image](https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1200&h=630&fit=crop)

## Project Overview

This portfolio was born from necessity (needing a place to showcase my work) and fueled by stubbornness (refusing to do things the easy way).

GitHub Pages offers a fantastic tool called Jekyll that makes working with markdown files incredibly straightforward. It's mature, well-documented, and used by thousands of developers.

I chose not to use it.

Why? Because learning "just another tool" felt like an investment of time I wasn't willing to make. Instead, I decided to reinvent the wheel—spending 10+ hours building a custom system to automate what I could have done with Jekyll in an afternoon.

Classic developer move, right?

But in the process, I learned a lot, built something that's truly mine, and ended up with a portfolio system that works exactly the way I want it to.

## Key Features

- **Markdown-Based Content Management**: Write blog posts and project descriptions in markdown, complete with frontmatter for metadata
- **Automated Build System**: Node.js script that parses markdown files and generates JSON data at build time
- **Modular Directory Structure**: Each post lives in its own directory with dedicated assets folder for images and resources
- **Client-Side Routing**: Dynamic navigation using the History API, no page reloads needed
- **Zero Backend Dependencies**: Everything is statically generated and served, keeping hosting costs at exactly $0
- **Responsive Design**: Mobile-first approach with smooth animations and transitions

## Technology Stack

### Frontend
- **Vanilla JavaScript**: No frameworks—just pure JS for maximum control and minimal bundle size
- **HTML5 & CSS3**: Semantic markup with modern CSS features (custom properties, grid, flexbox)
- **marked.js**: Markdown parsing library for converting content to HTML

### Content Management
- **Markdown with Frontmatter**: Write content in markdown files with YAML metadata
- **Modular Structure**: Each post in its own directory (`content/blog/posts/post-name/index.md`)
- **Asset Organization**: Images and resources stored alongside their content in `assets/` subdirectories

### Build System
- **Node.js Script**: Custom build pipeline that:
  - Scans content directories for markdown files
  - Parses frontmatter and content
  - Generates structured JSON data files
  - Processes image paths and metadata
- **GitHub Actions**: Automated builds on push that regenerate content JSON

### Hosting & Deployment
- **GitHub Pages**: Free static hosting with custom domain support
- **Git-Based Workflow**: Push to main branch triggers automatic deployment

## Architecture & Design Decisions

### Why Vanilla JavaScript Over Frameworks?

For a portfolio site, frameworks felt like overkill. The performance overhead, build complexity, and learning curve didn't justify the benefits. With vanilla JS, I got:
- ~50KB total JavaScript (unminified)
- Sub-100ms page transitions
- Complete control over every interaction
- No build step for the frontend (just for content)

### The Jekyll Stubbornness Story

GitHub Pages has built-in Jekyll support. It's designed for exactly this use case—turning markdown files into websites. It handles frontmatter, templating, and asset management automatically.

But I didn't want to learn Ruby. I didn't want to configure another tool. I didn't want to deal with Liquid templates.

So instead, I built my own system in Node.js that:
1. Recursively scans content directories
2. Reads markdown files and parses frontmatter
3. Extracts metadata (title, date, tags, etc.)
4. Generates clean JSON data structures
5. Handles asset paths and images

Was this necessary? Absolutely not.

Did it take longer than learning Jekyll? Probably.

Do I regret it? Not really. I learned a ton about file systems, markdown parsing, and build automation. Plus, I now have a system that works exactly how I want it to, with no magic happening behind the scenes.

### Modular Content Structure

One thing I did get right: the directory structure. Each blog post and project lives in its own folder:

```
content/
├── blog/
│   └── posts/
│       └── my-post/
│           ├── index.md
│           └── assets/
│               └── image.jpg
└── projects/
    └── posts/
        └── my-project/
            ├── index.md
            └── assets/
                └── screenshot.png
```

This keeps content organized, makes assets easy to find, and means I can move posts around without breaking image paths.

### Build Time vs Runtime

I made a key decision early on: process content at build time, not runtime.

Instead of fetching markdown files and parsing them in the browser, the build script pre-processes everything into JSON. This means:
- Faster page loads (no parsing overhead)
- Better SEO (content is available immediately)
- Simpler client-side code
- Clear separation between content and presentation

The trade-off? I have to run `npm run build` every time I add or update content. But with GitHub Actions, that's automated anyway.

## Results & Outcomes

### Performance
- **JavaScript Bundle**: ~50KB unminified (could be smaller with minification)
- **Page Load Time**: Sub-second for initial load
- **Navigation Speed**: <100ms transitions between pages
- **No Backend**: Zero server costs, no database overhead

### Developer Experience
- **Content Workflow**: Write markdown → Push to GitHub → Automatic build and deploy
- **Easy Updates**: Just edit a markdown file, no need to touch code
- **Asset Management**: Images live next to content, no path confusion
- **Version Control**: Everything in git means full history and easy rollbacks

### Learning Outcomes
- **File System Operations**: Deep dive into Node.js fs module and recursive directory scanning
- **Markdown Parsing**: Understanding frontmatter, AST parsing, and content extraction
- **Build Automation**: Creating custom build pipelines and CI/CD integration
- **History API**: Client-side routing without frameworks
- **The Value of Existing Tools**: Sometimes the wheel doesn't need reinventing (but it's fun anyway)

## Challenges & Lessons Learned

### The Jekyll Realization

About halfway through building my custom system, I realized Jekyll would have solved 90% of my problems out of the box. But by then, I was committed. And honestly? I learned more doing it the hard way.

Would I recommend this approach to others? Probably not. But if you're the stubborn type who likes to understand every piece of the puzzle, building your own system is incredibly educational.

### GitHub Pages Quirks

GitHub Pages is great, but it has its peculiarities:
- Deployment can be finicky if you don't understand the build process
- Custom domains require specific DNS configuration
- There's a learning curve to the Actions workflow
- You're limited to static content (which was actually a good constraint)

### The 10-Hour Automation Rule

There's a developer joke: "I spent 10 hours automating a task that takes 2 minutes to do manually."

That's basically what I did here. Jekyll would have been the 2-minute solution. My custom build system was the 10-hour one.

But here's the thing: I don't regret it. Those 10 hours taught me things I wouldn't have learned otherwise. And now I have a portfolio that's uniquely mine.

## Future Improvements

- **Search Functionality**: Add client-side search across blog posts and projects
- **Tag Filtering**: Filter content by technology tags
- **RSS Feed**: Generate an RSS feed for the blog
- **Dark Mode**: Add theme toggle for dark mode support
- **Performance Optimization**: Minify and bundle JavaScript
- **Progressive Web App**: Add service worker for offline support

## Key Takeaways

1. **Constraints Drive Creativity**: Having no budget forced me to find free solutions and build creatively
2. **Stubbornness Has Its Place**: Sometimes doing things the hard way teaches you more than the easy way
3. **Ownership Matters**: Building my own system means I understand every piece of it
4. **But Also**: Existing tools exist for a reason—don't always reinvent the wheel (even though I did)
5. **Build What You Need**: This portfolio isn't perfect, but it's mine and it works

---

*Built with stubbornness, vanilla JavaScript, and way more custom code than was strictly necessary.*
