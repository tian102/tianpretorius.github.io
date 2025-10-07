/**
 * Projects Module
 * Handles loading and rendering project case studies
 */

const ProjectsManager = {
    projects: [],
    projectsCache: new Map(),
    
    /**
     * List of project files
     */
    projectFiles: [
        'opencv-vitamin-recognition.md',
        'industrial-automation-framework.md',
        'rfid-tracking-research.md',
        'personal-portfolio-v2.md'
    ],
    
    /**
     * Load all projects metadata
     * @returns {Promise<Array>} - Array of project metadata
     */
    async loadAllProjects() {
        if (this.projects.length > 0) {
            return this.projects;
        }
        
        const projectsPromises = this.projectFiles.map(async (filename) => {
            try {
                const response = await fetch(`/projects/data/${filename}`);
                
                if (!response.ok) {
                    console.warn(`Failed to load project: ${filename} (${response.status})`);
                    return null;
                }
                
                const content = await response.text();
                const { metadata } = MarkdownUtils.parseFrontmatter(content);
                
                return {
                    filename,
                    slug: filename.replace('.md', ''),
                    ...metadata
                };
            } catch (error) {
                console.error(`Error loading project ${filename}:`, error);
                return null;
            }
        });
        
        const projects = await Promise.all(projectsPromises);
        this.projects = projects.filter(project => project !== null)
            .sort((a, b) => b.date - a.date);
        
        return this.projects;
    },
    
    /**
     * Load single project
     * @param {string} slug - Project slug
     * @returns {Promise<object>} - Project data
     */
    async loadProject(slug) {
        // Check cache first
        if (this.projectsCache.has(slug)) {
            return this.projectsCache.get(slug);
        }
        
        const filename = `${slug}.md`;
        
        try {
            const response = await fetch(`/projects/data/${filename}`);
            const content = await response.text();
            const { metadata, content: markdown } = MarkdownUtils.parseFrontmatter(content);
            
            const project = {
                filename,
                slug,
                ...metadata,
                content: markdown,
                html: MarkdownUtils.renderMarkdown(markdown)
            };
            
            // Cache the project
            this.projectsCache.set(slug, project);
            
            return project;
        } catch (error) {
            console.error(`Error loading project ${slug}:`, error);
            throw error;
        }
    },
    
    /**
     * Get featured projects
     * @returns {Promise<Array>} - Array of featured projects
     */
    async getFeaturedProjects() {
        const projects = await this.loadAllProjects();
        return projects.filter(project => project.featured).slice(0, 3);
    },
    
    /**
     * Get projects by tag
     * @param {string} tag - Tag to filter by
     * @returns {Promise<Array>} - Filtered projects
     */
    async getProjectsByTag(tag) {
        const projects = await this.loadAllProjects();
        return projects.filter(project => project.tags && project.tags.includes(tag));
    },
    
    /**
     * Get all unique tags
     * @returns {Promise<Array>} - Array of tags
     */
    async getAllTags() {
        const projects = await this.loadAllProjects();
        const tagsSet = new Set();
        
        projects.forEach(project => {
            if (project.tags) {
                project.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        
        return Array.from(tagsSet).sort();
    },
    
    /**
     * Render project card HTML
     * @param {object} project - Project object
     * @returns {string} - HTML string
     */
    renderProjectCard(project) {
        const tags = project.tags ? project.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('') : '';
        
        const imageHtml = project.image ? 
            `<div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.parentElement.style.display='none'">
            </div>` : '';
        
        const githubLink = project.github ? 
            `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                GitHub →
            </a>` : '';
        
        const demoLink = project.demo ? 
            `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                Live Demo →
            </a>` : '';
        
        return `
            <article class="card card-hover project-card" data-tags="${project.tags ? project.tags.join(',') : ''}">
                ${imageHtml}
                <h2 class="project-title">
                    <a href="/projects/project.html?project=${project.slug}">${project.title}</a>
                </h2>
                <p class="project-description">${project.excerpt || ''}</p>
                <div class="project-tags">
                    ${tags}
                </div>
                <div class="project-actions">
                    ${demoLink}
                    ${githubLink}
                    <a href="/projects/project.html?project=${project.slug}" class="btn btn-outline btn-sm">
                        Learn More →
                    </a>
                </div>
            </article>
        `;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsManager;
}
