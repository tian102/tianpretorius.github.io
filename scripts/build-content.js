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
const blogPostsDir = path.join(__dirname, '../blog/posts');
const blogPosts = [];

const blogFiles = fs.readdirSync(blogPostsDir);
console.log(`Found ${blogFiles.length} files in blog/posts`);

blogFiles.forEach(file => {
    if (file.endsWith('.md') && file !== 'template.md') {
        console.log(`  Processing blog post: ${file}`);
        const content = fs.readFileSync(path.join(blogPostsDir, file), 'utf8');
        const { metadata, content: markdown } = parseFrontmatter(content);
        const slug = file.replace('.md', '');
        
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
        
        blogPosts.push({
            slug,
            filename: file,
            title: metadata.title || 'Untitled',
            date: metadata.date || new Date().toISOString().split('T')[0],
            tags: metadata.tags || [],
            author: metadata.author || 'Tian Pretorius',
            content: markdown,
            excerpt: excerpt || markdown.substring(0, 200) + '...'
        });
    }
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
const projectsDir = path.join(__dirname, '../projects/posts');
const projects = [];

const projectFiles = fs.readdirSync(projectsDir);
console.log(`Found ${projectFiles.length} files in projects/posts`);

projectFiles.forEach(file => {
    if (file.endsWith('.md') && file !== 'template.md') {
        console.log(`  Processing project: ${file}`);
        const content = fs.readFileSync(path.join(projectsDir, file), 'utf8');
        const { metadata, content: markdown } = parseFrontmatter(content);
        const slug = file.replace('.md', '');
        
        projects.push({
            slug,
            filename: file,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            tags: metadata.tags || [],
            demo: metadata.demo || '',
            github: metadata.github || '',
            image: metadata.image || '',
            date: metadata.date || '',
            content: markdown
        });
    }
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
