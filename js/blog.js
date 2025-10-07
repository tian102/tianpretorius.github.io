/**
 * Blog Module
 * Handles loading and rendering blog posts
 */

const BlogManager = {
    posts: [],
    postsCache: new Map(),
    
    /**
     * List of blog post files
     */
    postFiles: [
        '2025-03-15-day-1-solo-founder.md',
        '2025-03-22-tech-stack-decision.md',
        '2025-04-15-month-2-mvp-live.md'
    ],
    
    /**
     * Load all blog posts metadata
     * @returns {Promise<Array>} - Array of post metadata
     */
    async loadAllPosts() {
        if (this.posts.length > 0) {
            return this.posts;
        }
        
        const postsPromises = this.postFiles.map(async (filename) => {
            try {
                const response = await fetch(`/blog/posts/${filename}`);
                
                if (!response.ok) {
                    console.warn(`Failed to load post: ${filename} (${response.status})`);
                    return null;
                }
                
                const content = await response.text();
                const { metadata } = MarkdownUtils.parseFrontmatter(content);
                
                return {
                    filename,
                    slug: MarkdownUtils.createSlug(filename),
                    ...metadata,
                    readingTime: MarkdownUtils.calculateReadingTime(content)
                };
            } catch (error) {
                console.error(`Error loading post ${filename}:`, error);
                return null;
            }
        });
        
        const posts = await Promise.all(postsPromises);
        this.posts = posts.filter(post => post !== null)
            .sort((a, b) => b.date - a.date);
        
        return this.posts;
    },
    
    /**
     * Load single blog post
     * @param {string} slug - Post slug
     * @returns {Promise<object>} - Post data
     */
    async loadPost(slug) {
        // Check cache first
        if (this.postsCache.has(slug)) {
            return this.postsCache.get(slug);
        }
        
        // Find filename from slug
        const filename = this.postFiles.find(f => MarkdownUtils.createSlug(f) === slug);
        
        if (!filename) {
            throw new Error(`Post not found: ${slug}`);
        }
        
        try {
            const response = await fetch(`/blog/posts/${filename}`);
            const content = await response.text();
            const { metadata, content: markdown } = MarkdownUtils.parseFrontmatter(content);
            
            const post = {
                filename,
                slug,
                ...metadata,
                content: markdown,
                html: MarkdownUtils.renderMarkdown(markdown),
                readingTime: MarkdownUtils.calculateReadingTime(markdown)
            };
            
            // Cache the post
            this.postsCache.set(slug, post);
            
            return post;
        } catch (error) {
            console.error(`Error loading post ${slug}:`, error);
            throw error;
        }
    },
    
    /**
     * Get featured posts
     * @returns {Promise<Array>} - Array of featured posts
     */
    async getFeaturedPosts() {
        const posts = await this.loadAllPosts();
        return posts.filter(post => post.featured).slice(0, 3);
    },
    
    /**
     * Get posts by tag
     * @param {string} tag - Tag to filter by
     * @returns {Promise<Array>} - Filtered posts
     */
    async getPostsByTag(tag) {
        const posts = await this.loadAllPosts();
        return posts.filter(post => post.tags && post.tags.includes(tag));
    },
    
    /**
     * Get all unique tags
     * @returns {Promise<Array>} - Array of tags
     */
    async getAllTags() {
        const posts = await this.loadAllPosts();
        const tagsSet = new Set();
        
        posts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        
        return Array.from(tagsSet).sort();
    },
    
    /**
     * Render post card HTML
     * @param {object} post - Post object
     * @returns {string} - HTML string
     */
    renderPostCard(post) {
        const dateStr = MarkdownUtils.formatDate(post.date);
        const tags = post.tags ? post.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('') : '';
        
        // Handle date for datetime attribute
        let datetimeAttr = '';
        if (post.date) {
            try {
                const dateObj = typeof post.date === 'string' ? new Date(post.date) : post.date;
                if (!isNaN(dateObj.getTime())) {
                    datetimeAttr = dateObj.toISOString();
                }
            } catch (e) {
                console.warn('Invalid date for post:', post.title);
            }
        }
        
        return `
            <article class="card card-hover post-card" data-tags="${post.tags ? post.tags.join(',') : ''}">
                <div class="post-meta">
                    <time ${datetimeAttr ? `datetime="${datetimeAttr}"` : ''}>${dateStr}</time>
                    <span class="post-reading-time">${post.readingTime || '5'} min read</span>
                </div>
                <h2 class="post-title">
                    <a href="/blog/post.html?post=${post.slug}">${post.title}</a>
                </h2>
                <p class="post-excerpt">${post.excerpt || ''}</p>
                <div class="post-tags">
                    ${tags}
                </div>
                <a href="/blog/post.html?post=${post.slug}" class="btn btn-outline btn-sm">
                    Read More →
                </a>
            </article>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}
