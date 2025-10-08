# Portfolio Website

Personal portfolio website showcasing my work, skills, and blog posts. Built with vanilla HTML, CSS, and JavaScript, featuring a markdown-based content management system.

🌐 **Live Site**: [tianpretorius.github.io](https://tianpretorius.github.io)

## 🚀 Features

- **Responsive Design** - Works seamlessly across all devices
- **Blog System** - Markdown-based blog with tags, filtering, and search
- **Projects Showcase** - Filterable project portfolio with detailed pages
- **No Framework Bloat** - Pure vanilla JavaScript for optimal performance
- **GitHub Pages Compatible** - Pre-built JSON for static hosting

## 📁 Project Structure

```
├── assets/              # Images and documents
│   ├── profile.png
│   └── Tian-Pretorius-CV.pdf
├── blog/
│   └── posts/          # Blog posts in markdown
├── projects/
│   └── posts/          # Project details in markdown
├── css/                # Stylesheets
│   ├── style.css
│   └── blog.css
├── js/                 # JavaScript functionality
│   ├── main.js         # Navigation and common features
│   ├── blog.js         # Blog functionality
│   ├── projects.js     # Projects page
│   └── index.js        # Homepage featured content
├── data/               # Generated JSON (auto-built)
│   ├── blog-posts.json
│   └── projects.json
├── scripts/
│   └── build-content.js # Build script for JSON generation
├── .github/workflows/  # GitHub Actions
│   └── build-content.yml
└── *.html             # Page templates
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/tian102/tianpretorius.github.io.git
   cd tianpretorius.github.io
   ```

2. **Build content from markdown**
   ```bash
   npm run build
   ```
   This generates `data/blog-posts.json` and `data/projects.json` from your markdown files.

3. **Open locally**
   - Open `index.html` in your browser, or
   - Use a local server: `npx serve .` or `python -m http.server`

### Adding Content

#### Add a Blog Post

1. Create a new markdown file in `blog/posts/`:
   ```markdown
   ---
   title: Your Post Title
   date: 2025-10-08
   tags: tag1, tag2, tag3
   author: Tian Pretorius
   ---

   # Your Post Title

   Your content here...
   ```

2. Run the build script:
   ```bash
   npm run build
   ```

3. Commit and push (GitHub Actions will auto-rebuild on push):
   ```bash
   git add blog/posts/your-post.md data/blog-posts.json
   git commit -m "Add new blog post"
   git push
   ```

#### Add a Project

1. Create a new markdown file in `projects/posts/`:
   ```markdown
   ---
   title: Project Name
   description: Brief project description
   tags: [react, node, typescript]
   demo: https://demo-url.com
   github: https://github.com/username/repo
   image: https://example.com/image.jpg
   date: 2025-10-08
   ---

   # Project Name

   Detailed project description...
   ```

2. Run the build script and commit as above.

## 🤖 GitHub Actions

The repository includes a GitHub Actions workflow that automatically:
- Builds JSON files when markdown content changes
- Commits the updated JSON files back to the repo
- Triggers on pushes to `main` branch

To manually trigger the build:
1. Go to "Actions" tab on GitHub
2. Select "Build Content" workflow
3. Click "Run workflow"

## 🔧 Development Workflow

### Before Deploying to GitHub Pages
```bash
# Always build before pushing
npm run build

# Check what files changed
git status

# Commit everything
git add .
git commit -m "Update content"
git push
```

### Why JSON Pre-generation?

GitHub Pages doesn't allow fetching `.md` files directly via JavaScript due to CORS and MIME type restrictions. By pre-generating JSON files, we:
- ✅ Bypass CORS restrictions
- ✅ Improve load performance (no markdown parsing in browser)
- ✅ Keep markdown files as source of truth
- ✅ Enable automatic builds via GitHub Actions

## 📝 Content Guidelines

### Blog Post Frontmatter
- `title` (required): Post title
- `date` (required): YYYY-MM-DD format
- `tags` (optional): Comma-separated or array format
- `author` (optional): Author name (defaults to "Tian Pretorius")

### Project Frontmatter
- `title` (required): Project title
- `description` (required): Short description for cards
- `tags` (optional): Technology tags
- `demo` (optional): Live demo URL
- `github` (optional): Repository URL
- `image` (optional): Project thumbnail URL
- `date` (optional): Project date

## 🚨 Troubleshooting

**Blog/Projects not showing on GitHub Pages?**
- Ensure you've run `npm run build` before pushing
- Check that `data/blog-posts.json` and `data/projects.json` exist
- Verify JSON files are committed to the repo

**Build script failing?**
- Check Node.js version: `node --version` (should be v18+)
- Verify markdown frontmatter syntax is correct
- Look for unmatched `---` delimiters in markdown files

**GitHub Actions not running?**
- Check `.github/workflows/build-content.yml` is committed
- Verify workflow has necessary permissions in repo settings
- Check Actions tab for error logs

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 🤝 Contact

- **Email**: tianpretorius@gmail.com
- **GitHub**: [@tianpretorius](https://github.com/tianpretorius)
- **LinkedIn**: [Tian Pretorius](https://www.linkedin.com/in/tian-pretorius-817a2189/)

---

Built with ❤️ using vanilla HTML, CSS, and JavaScript