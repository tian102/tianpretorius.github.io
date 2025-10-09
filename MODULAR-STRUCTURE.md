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

**Run the build**:
```bash
node scripts/build-content.js
```

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

## Benefits of Modular Structure

✅ **Self-contained**: Each post/project has all its assets in one place  
✅ **Easy to manage**: Delete a post = delete one folder  
✅ **Better organization**: No searching through global asset folders  
✅ **Portable**: Easy to move posts between projects  
✅ **Scalable**: Clean structure even with hundreds of posts  
✅ **Version control**: See all changes to a post in one place  

## Troubleshooting

### Images not loading?
- Check that paths use `./` prefix: `![Image](./assets/image.jpg)`
- Verify image files exist in the correct location
- Run the build script: `node scripts/build-content.js`
- Clear browser cache (Ctrl+Shift+R)

### Post not appearing?
- Ensure `index.md` exists in the post directory
- Check frontmatter syntax (YAML format)
- Run build script and check for errors
- Verify the post directory is in `posts/` not `posts-backup/`

### Build errors?
- Check that all directories have `index.md`
- Verify frontmatter has closing `---`
- Ensure no special characters in directory names (use lowercase with hyphens)

## Quick Reference

```bash
# Create new blog post
mkdir content/blog/posts/my-new-post && mkdir content/blog/posts/my-new-post/assets
cp content/blog/template/index.md content/blog/posts/my-new-post/index.md

# Create new project
mkdir content/projects/posts/my-new-project && mkdir content/projects/posts/my-new-project/assets
cp content/projects/template/index.md content/projects/posts/my-new-project/index.md

# Build content
node scripts/build-content.js

# View structure
tree blog/posts       # On Windows (PowerShell: tree /F)
tree projects/posts
```

## Questions?

If you encounter any issues or have questions about the new structure, refer to:
- Template files: `content/blog/template/index.md` and `content/projects/template/index.md`
- Migration scripts: `scripts/migrate-blog-to-modular.js` and `scripts/migrate-projects-to-modular.js`
- Build script: `scripts/build-content.js`
