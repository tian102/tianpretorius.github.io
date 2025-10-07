/**
 * Markdown Utilities
 * Helper functions for parsing markdown files with YAML frontmatter
 */

const MarkdownUtils = {
    /**
     * Parse markdown file with YAML frontmatter
     * @param {string} content - Raw markdown content
     * @returns {object} - {metadata, content}
     */
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return {
                metadata: {},
                content: content
            };
        }
        
        const [, frontmatter, markdown] = match;
        const metadata = this.parseYAML(frontmatter);
        
        return {
            metadata,
            content: markdown
        };
    },
    
    /**
     * Simple YAML parser for frontmatter
     * @param {string} yaml - YAML string
     * @returns {object} - Parsed object
     */
    parseYAML(yaml) {
        const lines = yaml.split('\n');
        const result = {};
        
        lines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                
                // Handle arrays (tags)
                if (value.startsWith('[') && value.endsWith(']')) {
                    result[key] = value
                        .slice(1, -1)
                        .split(',')
                        .map(item => item.trim().replace(/^['"]|['"]$/g, ''));
                }
                // Handle booleans
                else if (value === 'true' || value === 'false') {
                    result[key] = value === 'true';
                }
                // Handle dates
                else if (key === 'date') {
                    result[key] = new Date(value);
                }
                // Handle strings
                else {
                    result[key] = value.replace(/^['"]|['"]$/g, '');
                }
            }
        });
        
        return result;
    },
    
    /**
     * Render markdown to HTML
     * @param {string} markdown - Markdown string
     * @returns {string} - HTML string
     */
    renderMarkdown(markdown) {
        if (typeof marked !== 'undefined') {
            // Configure marked
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });
            return marked.parse(markdown);
        }
        return markdown;
    },
    
    /**
     * Calculate reading time
     * @param {string} content - Markdown content
     * @returns {number} - Minutes to read
     */
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    },
    
    /**
     * Format date
     * @param {Date} date - Date object
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },
    
    /**
     * Create slug from filename
     * @param {string} filename - Filename with .md extension
     * @returns {string} - Slug
     */
    createSlug(filename) {
        return filename.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownUtils;
}
