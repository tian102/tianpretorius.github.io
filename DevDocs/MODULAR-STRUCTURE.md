# Modular Blog and Project Structure

## Overview

Your blog posts and projects now use a **modular directory structure** where each post/project has its own folder containing all related assets (images, files, etc.).

## Directory Structure

### Blog Posts

```
content/blog/
├── posts/
│   ├── your-post-slug/
│   │   ├── index.md          # Post content with frontmatter
│   │   ├── cover.jpg         # Optional cover image
│   │   └── assets/           # Additional images/files
│   │       ├── screenshot.jpg
│   │       └── diagram.png
│   ├── another-post/
│   │   ├── index.md
│   │   └── assets/
│   └── ...
└── template/
    ├── index.md              # Template for new posts
    └── assets/
```

### Projects

```
content/projects/
├── posts/
│   ├── your-project-slug/
│   │   ├── index.md          # Project description
│   │   ├── cover.jpg         # Main project image
│   │   └── assets/           # Screenshots, diagrams, etc.
│   │       ├── screenshot1.jpg
│   │       ├── demo.gif
│   │       └── architecture.svg
│   ├── another-project/
│   │   ├── index.md
│   │   └── assets/
│   └── ...
└── template/
    ├── index.md              # Template for new projects
    └── assets/
```

## Creating New Content

### Creating a New Blog Post

1. **Create a new directory** in `content/blog/posts/`:
   ```bash
   mkdir content/blog/posts/my-new-post
   mkdir content/blog/posts/my-new-post/assets
   ```

2. **Copy the template**:
   ```bash
   cp content/blog/template/index.md content/blog/posts/my-new-post/index.md
   ```

3. **Add your content** to `index.md`:
   - Update the frontmatter (title, date, tags, tldr, etc.)
   - Write your post content
   - Add a cover image if desired (coverImage: cover.jpg)

4. **Add images**:
   - Place your cover image in the post directory: `my-new-post/cover.jpg`
   - Place additional images in: `my-new-post/assets/`

5. **Reference images** using relative paths:
   ```markdown
   ![Cover](./cover.jpg)
   ![Screenshot](./assets/screenshot.jpg)
   ```

6. **Build and test**:
   ```bash
   node scripts/build-content.js
   ```

### Creating a New Project

1. **Create a new directory** in `content/projects/posts/`:
   ```bash
   mkdir content/projects/posts/my-new-project
   mkdir content/projects/posts/my-new-project/assets
   ```

2. **Copy the template**:
   ```bash
   cp content/projects/template/index.md content/projects/posts/my-new-project/index.md
   ```

3. **Add your content** to `index.md`:
   - Update the frontmatter (title, description, tags, demo, github, etc.)
   - Write your project description
   - Add a cover image (coverImage: cover.jpg)

4. **Add images and assets**:
   - Main image: `my-new-project/cover.jpg`
   - Screenshots, demos: `my-new-project/assets/`

5. **Reference images** using relative paths:
   ```markdown
   ![Project Screenshot](./cover.jpg)
   ![Feature Demo](./assets/demo.gif)
   ```

6. **Build and test**:
   ```bash
   node scripts/build-content.js
   ```

## Frontmatter Reference

### Blog Post Frontmatter

```yaml
---
title: Your Post Title
date: 2024-01-01
tags: tag1, tag2, tag3
author: Tian Pretorius
tldr: A brief 1-2 sentence summary
coverImage: cover.jpg          # Optional, relative to post directory
---
```

### Project Frontmatter

```yaml
---
title: Your Project Name
description: One-sentence description
tags: [tech1, tech2, tech3]
demo: https://demo-url.com
github: https://github.com/user/repo
coverImage: cover.jpg          # Optional, relative to project directory
image: cover.jpg               # Fallback for older code
date: 2024-01-01
---
```

## Image Best Practices

1. **Naming**:
   - Use descriptive names: `dashboard-screenshot.jpg` not `img1.jpg`
   - Use lowercase with hyphens: `feature-demo.gif`

2. **Optimization**:
   - Compress images before adding them
   - Resize to appropriate dimensions (max 1920px wide)
   - Use appropriate formats (JPG for photos, PNG for screenshots, SVG for diagrams)

3. **Organization**:
   - Cover images go in the post/project root
   - Additional images go in the `assets/` subdirectory
   - Keep related images together

4. **References**:
   - Always use relative paths: `./cover.jpg` or `./assets/image.jpg`
   - Never use absolute paths or external URLs for local images

## Build Process

The build script (`scripts/build-content.js`) automatically:
- Scans for directories in `content/blog/posts/` and `content/projects/posts/`
- Reads `index.md` from each directory
- Parses frontmatter and extracts metadata
- Generates `data/blog-posts.json` and `data/projects.json`
- Includes asset paths in the generated JSON
- Preserves markdown content for rendering on detail pages

**Run the build**:
```bash
npm run build
# or
node scripts/build-content.js
```

**What happens after build**:
1. JSON files created in `data/` directory
2. Blog and project pages read from JSON
3. Individual post/project pages render markdown as HTML
4. Table of contents automatically generated from H2/H3 headings

## Migration

If you need to migrate old posts/projects:

1. **Blog posts**:
   ```bash
   node scripts/migrate-blog-to-modular.js
   ```

2. **Projects**:
   ```bash
   node scripts/migrate-projects-to-modular.js
   ```

Backups are created automatically in:
- `blog/posts-backup/`
- `projects/posts-backup/`

## Enhanced Features

### Table of Contents (TOC)
When you view individual blog posts or projects, a table of contents is automatically generated:

- **Auto-generated**: Parses H2 and H3 headings from your markdown
- **Collapsible**: Main TOC and H2 sections can be expanded/collapsed
- **Nested Structure**: H3 headings appear under their parent H2s
- **Sticky Navigation**: TOC follows you as you scroll
- **Active Highlighting**: Current section is highlighted
- **Click to Navigate**: Click any heading to jump to that section

**How it works**:
1. Write markdown with H2 (`##`) and H3 (`###`) headings
2. Build script converts markdown to HTML
3. JavaScript extracts headings and generates TOC
4. TOC appears on the page automatically

**Example markdown structure**:
```markdown
## Main Section 1
Content here...

### Subsection 1.1
More content...

### Subsection 1.2
Even more content...

## Main Section 2
Different content...

### Subsection 2.1
Final content...
```

This creates a TOC like:
- Main Section 1 (collapsible)
  - Subsection 1.1
  - Subsection 1.2
- Main Section 2 (collapsible)
  - Subsection 2.1

## Benefits of Modular Structure

✅ **Self-contained**: Each post/project has all its assets in one place  
✅ **Easy to manage**: Delete a post = delete one folder  
✅ **Better organization**: No searching through global asset folders  
✅ **Portable**: Easy to move posts between projects  
✅ **Scalable**: Clean structure even with hundreds of posts  
✅ **Version control**: See all changes to a post in one place  
✅ **TOC-friendly**: H2/H3 structure automatically creates navigation  

## Troubleshooting

### Images not loading?
- Check that paths use `./` prefix: `![Image](./assets/image.jpg)`
- Verify image files exist in the correct location
- Run the build script: `npm run build`
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Post not appearing?
- Ensure `index.md` exists in the post directory
- Check frontmatter syntax (YAML format)
- Run build script and check for errors
- Verify the post directory is in `posts/` not `posts-backup/`

### Build errors?
- Check that all directories have `index.md`
- Verify frontmatter has closing `---`
- Ensure no special characters in directory names (use lowercase with hyphens)

### TOC not showing?
- Ensure your markdown has H2 (`##`) or H3 (`###`) headings
- H1 (`#`) headings are ignored (reserved for post title)
- Build script must be run after markdown changes
- Check browser console for JavaScript errors

### TOC sections not collapsible?
- H2 headings only show expand arrow if they have H3 children
- Main TOC is always collapsible
- Clear cache and hard refresh browser

### Content not updating?
- Run `npm run build` after editing markdown
- Check that JSON files were regenerated in `data/`
- Clear browser cache (Ctrl+Shift+R)

## Writing Tips for Better TOC

### Use Proper Heading Hierarchy
```markdown
# Post Title (H1 - used for page title, not in TOC)

## Introduction (H2 - appears in TOC as main section)
Content here...

## Main Topic (H2 - collapsible if it has H3 children)

### Subtopic 1 (H3 - nested under Main Topic)
Content...

### Subtopic 2 (H3 - nested under Main Topic)
Content...

## Conclusion (H2 - appears in TOC as main section)
Final thoughts...
```

### Best Practices
- ✅ Use descriptive heading text (becomes TOC labels)
- ✅ Keep headings concise (TOC has limited width)
- ✅ Use H2 for main sections, H3 for subsections
- ✅ Don't skip levels (H2 → H4 is bad structure)
- ❌ Avoid special characters in headings (affects ID generation)
- ❌ Don't use H1 in content (reserved for post title)

## Quick Reference

```bash
# Create new blog post
mkdir content/blog/posts/my-new-post && mkdir content/blog/posts/my-new-post/assets
cp content/blog/template/index.md content/blog/posts/my-new-post/index.md

# Create new project
mkdir content/projects/posts/my-new-project && mkdir content/projects/posts/my-new-project/assets
cp content/projects/template/index.md content/projects/posts/my-new-project/index.md

# Build content (generates JSON from markdown)
npm run build

# Test locally
npx serve .
# or
python -m http.server 8080

# View structure (PowerShell on Windows)
tree blog\posts /F
tree projects\posts /F
```

## Summary

The modular structure combined with automatic TOC generation provides:

1. **Organization**: Each post/project is self-contained with all assets
2. **Navigation**: Automatic table of contents for easy navigation
3. **Flexibility**: Easy to add, edit, or remove content
4. **Performance**: Pre-built JSON for fast loading
5. **Developer Experience**: Clear structure, easy to understand
6. **User Experience**: Enhanced navigation with collapsible sections

Simply create a folder, add `index.md` with proper H2/H3 headings, run `npm run build`, and you have a fully navigable post with automatic table of contents!

## Questions?

If you encounter any issues or have questions about the structure, refer to:
- **Template files**: `content/blog/template/index.md` and `content/projects/template/index.md`
- **Build script**: `scripts/build-content.js`
- **Content management**: See `CONTENT_MANAGEMENT.md` for editing site text
- **Implementation details**: See `IMPLEMENTATION_SUMMARY.md` for technical details
