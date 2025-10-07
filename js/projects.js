// Projects functionality - Load and display projects from markdown files
const projectsData = [];
let allProjects = [];

// Function to parse frontmatter from markdown
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) return { frontmatter: {}, content: markdown };
    
    const frontmatterText = match[1];
    const content = match[2];
    const frontmatter = {};
    
    frontmatterText.split(/\r?\n/).forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            
            // Parse arrays like tags: [tag1, tag2]
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim());
            }
            
            frontmatter[key.trim()] = value;
        }
    });
    
    return { frontmatter, content };
}

// Function to convert markdown to HTML using marked.js
function parseMarkdown(markdown) {
    // Use marked.js library for proper markdown parsing
    if (typeof marked === 'undefined') {
        console.error('Marked.js library not loaded');
        return markdown;
    }
    
    // Remove first H1 (title is already in header)
    let content = markdown.replace(/^#\s+.+$/m, '');
    
    // Parse markdown to HTML using marked.js
    const html = marked.parse(content);
    
    return html;
}

// Load all project markdown files
async function loadProjects() {
    const projectFiles = [
        'saas-platform.md',
        'real-time-dashboard.md',
        'mobile-fitness-app.md',
        'api-gateway.md'
    ];
    
    for (const file of projectFiles) {
        try {
            const response = await fetch(`projects/posts/${file}`);
            const markdown = await response.text();
            const { frontmatter, content } = parseFrontmatter(markdown);
            
            const slug = file.replace('.md', '');
            projectsData.push({
                slug,
                title: frontmatter.title || 'Untitled',
                description: frontmatter.description || '',
                tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
                demo: frontmatter.demo || '',
                github: frontmatter.github || '',
                image: frontmatter.image || '',
                date: frontmatter.date || '',
                content: content
            });
        } catch (error) {
            console.error(`Error loading project ${file}:`, error);
        }
    }
    
    allProjects = [...projectsData];
    displayProjects(allProjects);
    setupFilters();
}

// Display projects as cards
function displayProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p class="no-results">No projects found matching your criteria.</p>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => `
        <article class="project-card" data-slug="${project.slug}">
            ${project.image ? `<div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="View project" onclick="event.stopPropagation()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </a>` : ''}
                        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="View code" onclick="event.stopPropagation()">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>` : ''}
                    </div>
                </div>
            </div>` : ''}
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag" data-tag="${tag}">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
    
    // Add click handlers to cards
    document.querySelectorAll('.project-card').forEach(card => {
        const slug = card.getAttribute('data-slug');
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on overlay links or tags
            if (!e.target.closest('.project-overlay a') && !e.target.classList.contains('project-tag')) {
                showProjectDetail(slug);
            }
        });
    });
    
    // Add click handlers to tags
    document.querySelectorAll('.project-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const tagName = tag.getAttribute('data-tag');
            filterByTag(tagName);
        });
    });
}

// Show individual project detail
function showProjectDetail(slug) {
    const project = projectsData.find(p => p.slug === slug);
    if (!project) return;
    
    const projectDetail = document.getElementById('project-detail');
    const projectsList = document.getElementById('projects-list');
    const projectsHeader = document.getElementById('projects-header');
    const projectsFilters = document.getElementById('projects-filters');
    
    // Hide list and filters, show detail
    projectsList?.classList.add('hidden');
    projectsHeader?.classList.add('hidden');
    projectsFilters?.classList.add('hidden');
    projectDetail?.classList.remove('hidden');
    
    // Render project detail
    const html = parseMarkdown(project.content);
    projectDetail.innerHTML = `
        <div class="project-detail-header">
            <button class="back-button" onclick="hideProjectDetail()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Projects
            </button>
            <h1>${project.title}</h1>
            <p class="project-detail-description">${project.description}</p>
            <div class="project-detail-meta">
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.demo ? `<a href="${project.demo}" class="project-link-btn" target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live Demo
                    </a>` : ''}
                    ${project.github ? `<a href="${project.github}" class="project-link-btn" target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </a>` : ''}
                </div>
            </div>
        </div>
        <div class="project-detail-content">
            ${html}
        </div>
    `;
    
    // Update URL
    window.history.pushState({ project: slug }, '', `?project=${slug}`);
    window.scrollTo(0, 0);
}

// Hide project detail and show list
function hideProjectDetail() {
    const projectDetail = document.getElementById('project-detail');
    const projectsList = document.getElementById('projects-list');
    const projectsHeader = document.getElementById('projects-header');
    const projectsFilters = document.getElementById('projects-filters');
    
    projectDetail?.classList.add('hidden');
    projectsList?.classList.remove('hidden');
    projectsHeader?.classList.remove('hidden');
    projectsFilters?.classList.remove('hidden');
    
    // Update URL
    window.history.pushState({}, '', 'projects.html');
    window.scrollTo(0, 0);
}

// Setup filter functionality
function setupFilters() {
    const allTags = new Set();
    projectsData.forEach(project => {
        project.tags.forEach(tag => allTags.add(tag));
    });
    
    const filterTags = document.getElementById('filter-tags');
    if (filterTags) {
        filterTags.innerHTML = `
            <button class="filter-tag active" data-tag="all">All</button>
            ${Array.from(allTags).sort().map(tag => 
                `<button class="filter-tag" data-tag="${tag}">${tag}</button>`
            ).join('')}
        `;
        
        filterTags.querySelectorAll('.filter-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                filterTags.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tag = btn.getAttribute('data-tag');
                if (tag === 'all') {
                    displayProjects(allProjects);
                } else {
                    filterByTag(tag);
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allProjects.filter(project => 
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.tags.some(tag => tag.toLowerCase().includes(query))
            );
            displayProjects(filtered);
        });
    }
}

// Filter projects by tag
function filterByTag(tag) {
    const filtered = allProjects.filter(project => project.tags.includes(tag));
    displayProjects(filtered);
    
    // Update active filter button
    const filterTags = document.getElementById('filter-tags');
    if (filterTags) {
        filterTags.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tag') === tag) {
                btn.classList.add('active');
            }
        });
    }
}

// Check URL for project parameter
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectSlug = urlParams.get('project');
    
    if (projectSlug) {
        showProjectDetail(projectSlug);
    }
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.project) {
        showProjectDetail(event.state.project);
    } else {
        hideProjectDetail();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects().then(() => {
        checkUrlParams();
    });
});
