const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return { metadata: {}, content: content };
    
    const frontmatterText = match[1];
    const mainContent = match[2];
    const metadata = {};
    
    frontmatterText.split(/\r?\n/).forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        if (key === 'tags') {
            // Handle both array format [tag1, tag2] and comma-separated
            if (value.startsWith('[') && value.endsWith(']')) {
                metadata[key] = value
                    .slice(1, -1)
                    .split(',')
                    .map(tag => tag.trim().replace(/['"]/g, ''));
            } else {
                metadata[key] = value.split(',').map(tag => tag.trim());
            }
        } else {
            metadata[key] = value;
        }
    });
    
    return { metadata, content: mainContent };
}

// Build blog posts
console.log('Building blog posts...');
const blogPostsDir = path.join(__dirname, '../content/blog/posts');
const blogPosts = [];

const blogDirs = fs.readdirSync(blogPostsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
console.log(`Found ${blogDirs.length} blog post directories in content/blog/posts`);

blogDirs.forEach(slug => {
    const postIndexPath = path.join(blogPostsDir, slug, 'index.md');
    
    // Skip if index.md doesn't exist
    if (!fs.existsSync(postIndexPath)) {
        console.log(`  ⚠️  Warning: ${slug}/index.md not found, skipping...`);
        return;
    }
    
    console.log(`  Processing blog post: ${slug}`);
    const content = fs.readFileSync(postIndexPath, 'utf8');
    const { metadata, content: markdown } = parseFrontmatter(content);
    
    // Extract excerpt from content (skip title, get first paragraph)
    const lines = markdown.trim().split('\n');
    let excerpt = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
            excerpt = line.substring(0, 200);
            if (excerpt.length === 200) excerpt += '...';
            break;
        }
    }
    
    // Check for assets directory
    const assetsDir = path.join(blogPostsDir, slug, 'assets');
    const hasAssets = fs.existsSync(assetsDir);
    
    // Helper function to handle image paths
    const getImagePath = (imagePath) => {
        if (!imagePath) return '';
        // If it's an external URL (starts with http:// or https://), return as-is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        // Otherwise, prepend the blog post path
        return `content/blog/posts/${slug}/${imagePath}`;
    };
    
    blogPosts.push({
        slug,
        title: metadata.title || 'Untitled',
        date: metadata.date || new Date().toISOString().split('T')[0],
        tags: metadata.tags || [],
        author: metadata.author || 'Tian Pretorius',
        image: getImagePath(metadata.image || metadata.coverImage),
        coverImage: getImagePath(metadata.coverImage),
        tldr: metadata.tldr || '',
        content: markdown,
        excerpt: excerpt || markdown.substring(0, 200) + '...',
        assetsPath: hasAssets ? `content/blog/posts/${slug}/assets/` : '',
        postPath: `content/blog/posts/${slug}/`
    });
});

// Sort blog posts by date (newest first)
blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
    path.join(dataDir, 'blog-posts.json'),
    JSON.stringify(blogPosts, null, 2)
);
console.log(`✓ Built ${blogPosts.length} blog posts`);

// Build projects
console.log('\nBuilding projects...');
const projectsDir = path.join(__dirname, '../content/projects/posts');
const projects = [];

const projectDirs = fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
console.log(`Found ${projectDirs.length} project directories in content/projects/posts`);

projectDirs.forEach(slug => {
    const projectIndexPath = path.join(projectsDir, slug, 'index.md');
    
    // Skip if index.md doesn't exist
    if (!fs.existsSync(projectIndexPath)) {
        console.log(`  ⚠️  Warning: ${slug}/index.md not found, skipping...`);
        return;
    }
    
    console.log(`  Processing project: ${slug}`);
    const content = fs.readFileSync(projectIndexPath, 'utf8');
    const { metadata, content: markdown } = parseFrontmatter(content);
    
    // Check for assets directory
    const assetsDir = path.join(projectsDir, slug, 'assets');
    const hasAssets = fs.existsSync(assetsDir);
    
    // Helper function to handle image paths
    const getImagePath = (imagePath) => {
        if (!imagePath) return '';
        // If it's an external URL (starts with http:// or https://), return as-is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        // Otherwise, prepend the project path
        return `content/projects/posts/${slug}/${imagePath}`;
    };
    
    projects.push({
        slug,
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        tags: metadata.tags || [],
        demo: metadata.demo || '',
        github: metadata.github || '',
        image: getImagePath(metadata.image || metadata.coverImage),
        coverImage: getImagePath(metadata.coverImage),
        date: metadata.date || '',
        content: markdown,
        assetsPath: hasAssets ? `content/projects/posts/${slug}/assets/` : '',
        projectPath: `content/projects/posts/${slug}/`
    });
});

// Sort projects by date (newest first)
projects.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
});

fs.writeFileSync(
    path.join(dataDir, 'projects.json'),
    JSON.stringify(projects, null, 2)
);
console.log(`✓ Built ${projects.length} projects`);

console.log('\n✅ Build complete!');
console.log(`   - data/blog-posts.json (${blogPosts.length} posts)`);
console.log(`   - data/projects.json (${projects.length} projects)`);
