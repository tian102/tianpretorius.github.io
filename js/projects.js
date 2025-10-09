// Projects functionality - Load and display projects from JSON
const projectsData = [];
let allProjects = [];
let currentPage = 1;
let itemsPerPage = 10;
let filteredProjects = [];
let currentSort = 'date-desc';

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

function parseMarkdownWithImages(markdown, projectPath) {
    // Use marked.js library for proper markdown parsing
    if (typeof marked === 'undefined') {
        console.error('Marked.js library not loaded');
        return markdown;
    }
    
    // Remove first H1 (title is already in header)
    let content = markdown.replace(/^#\s+.+$/m, '');
    
    // Parse markdown to HTML using marked.js
    let html = marked.parse(content);
    
    // Process image paths - convert relative paths to absolute
    // Match: <img src="./..." or <img src="assets/..." but not external URLs
    html = html.replace(/<img([^>]*?)src="(\.\/[^"]+|(?!https?:\/\/)[^"\/][^"]*)"([^>]*?)>/gi, (match, before, src, after) => {
        let newSrc = src;
        
        // Handle ./file.jpg or ./assets/file.jpg
        if (src.startsWith('./')) {
            newSrc = projectPath + src.substring(2);
        }
        // Handle relative paths without ./ prefix (e.g., assets/file.jpg or cover.jpg)
        else if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
            newSrc = projectPath + src;
        }
        
        return `<img${before}src="${newSrc}"${after}>`;
    });
    
    return html;
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return 'No date';
    
    try {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// Calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
}

// Load all projects from JSON
async function loadProjects() {
    console.log('Loading projects from JSON...');
    
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log(`Loaded ${projects.length} projects from JSON`);
        
        // Calculate read time for each project
        projects.forEach(project => {
            const wordsPerMinute = 200;
            const wordCount = project.content.split(/\s+/).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);
            project.readTime = `${readTime} min read`;
        });
        
        projectsData.push(...projects);
        allProjects = [...projectsData];
        filteredProjects = [...allProjects];
        applySort(); // Apply default sort
        displayProjects();
        setupFilters();
        setupPagination();
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsList = document.getElementById('projects-list');
        if (projectsList) {
            projectsList.innerHTML = '<p class="no-results">Error loading projects. Please try again later.</p>';
        }
    }
}

// Display projects as cards
function displayProjects() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    const totalProjects = filteredProjects.length;
    
    if (totalProjects === 0) {
        projectsList.innerHTML = '<p class="no-results">No projects found matching your criteria.</p>';
        updatePagination(0, 0, 0);
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalProjects);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    projectsList.innerHTML = paginatedProjects.map(project => `
        <article class="project-card" data-slug="${project.slug}">
            ${project.image ? `<div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <div class="project-links">
                        ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View project">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </a>` : ''}
                        ${project.github ? `<a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View code">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>` : ''}
                    </div>
                </div>
            </div>` : ''}
            <div class="project-content">
                <div class="blog-meta">
                    <span class="blog-date">${formatDate(project.date)}</span>
                    <span>•</span>
                    <span class="blog-read-time">${project.readTime}</span>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag" data-tag="${tag}">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
    
    // Add click handlers to overlay links first (to prevent card navigation)
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
        });
    });
    
    // Add click handlers to cards
    document.querySelectorAll('.project-card').forEach(card => {
        const slug = card.getAttribute('data-slug');
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on tags
            if (!e.target.classList.contains('project-tag')) {
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
    
    // Update pagination
    updatePagination(totalProjects, startIndex, endIndex);
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
    
    // Hide pagination when viewing individual project
    hidePagination();
    
    // Render project detail with processed image paths
    const html = parseMarkdownWithImages(project.content, project.projectPath || `content/projects/posts/${slug}/`);
    
    // Generate TOC from content
    const toc = generateTableOfContents(html);
    
    projectDetail.innerHTML = `
        <div class="project-detail-wrapper">
            <div class="project-detail-main">
                <div class="project-detail-header">
                    <button class="back-button" onclick="hideProjectDetail()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Projects
                    </button>
                    <h1>${project.title}</h1>
                    <div class="blog-post-meta">
                        <span class="blog-date">${new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <span class="blog-read-time">${project.readTime || calculateReadTime(project.content)}</span>
                    </div>
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
                <div class="project-detail-content" id="project-content">
                    ${html}
                </div>
            </div>
            ${toc.items.length > 0 ? `
            <aside class="toc-sidebar">
                <nav class="toc-container">
                    <details class="toc-details">
                        <summary class="toc-summary">
                            <span class="toc-title">Contents</span>
                            <svg class="toc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </summary>
                        <ul class="toc-list">
                            ${toc.html}
                        </ul>
                    </details>
                </nav>
            </aside>
            ` : ''}
        </div>
    `;
    
    // Add IDs to headings and setup scroll spy
    if (toc.items.length > 0) {
        addHeadingIds();
        setupScrollSpy();
        // Align TOC with project-detail-content
        alignTOCWithContent();
    }
    
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
    
    // Show pagination when viewing project list
    const paginationSection = document.getElementById('pagination-section');
    if (paginationSection) {
        paginationSection.style.display = 'block';
    }
    
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
                    filteredProjects = [...allProjects];
                    applySort();
                    currentPage = 1;
                    displayProjects();
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
            filteredProjects = allProjects.filter(project => 
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.tags.some(tag => tag.toLowerCase().includes(query))
            );
            applySort();
            currentPage = 1; // Reset to first page
            displayProjects();
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('project-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applySort();
            currentPage = 1; // Reset to first page
            displayProjects();
        });
    }
}

// Apply current sort to filtered projects
function applySort() {
    filteredProjects.sort((a, b) => {
        switch (currentSort) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
}

// Filter projects by tag
function filterByTag(tag) {
    filteredProjects = allProjects.filter(project => project.tags.includes(tag));
    applySort();
    currentPage = 1; // Reset to first page
    displayProjects();
    
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

// Setup pagination
function setupPagination() {
    const itemsPerPageSelect = document.getElementById('items-per-page');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            displayProjects();
        });
    }
}

// Update pagination controls
function updatePagination(totalProjects, startIndex, endIndex) {
    const paginationSection = document.getElementById('pagination-section');
    const paginationButtons = document.getElementById('pagination-buttons');
    const paginationInfoText = document.getElementById('pagination-info-text');
    
    if (!paginationSection || totalProjects === 0) {
        if (paginationSection) paginationSection.style.display = 'none';
        return;
    }
    
    // Show pagination section
    paginationSection.style.display = 'block';
    
    // Update info text
    const actualEndIndex = Math.min(endIndex, totalProjects);
    paginationInfoText.textContent = `Showing ${startIndex + 1}-${actualEndIndex} of ${totalProjects} projects`;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalProjects / itemsPerPage);
    
    // Generate pagination buttons
    let buttonsHTML = '';
    
    // Previous button
    buttonsHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            buttonsHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            buttonsHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    // Next button
    buttonsHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            Next
        </button>
    `;
    
    paginationButtons.innerHTML = buttonsHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    displayProjects();
    // Scroll to top of projects list
    document.getElementById('projects-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide pagination
function hidePagination() {
    const paginationSection = document.getElementById('pagination-section');
    if (paginationSection) {
        paginationSection.style.display = 'none';
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

// Generate table of contents from HTML content with nested h3s
function generateTableOfContents(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const headings = tempDiv.querySelectorAll('h2, h3');
    const items = [];
    let html = '';
    let currentH2 = null;
    let h3Children = [];
    
    headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        const level = heading.tagName.toLowerCase();
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        items.push({ id, text, level });
        
        if (level === 'h2') {
            // Close previous h2 if it had children
            if (currentH2 && h3Children.length > 0) {
                html += `<ul class="toc-h3-list">${h3Children.join('')}</ul>`;
            }
            html += `</li>`;
            
            // Start new h2
            const hasNextH3 = headings[index + 1] && headings[index + 1].tagName.toLowerCase() === 'h3';
            currentH2 = { id, text, hasChildren: false };
            h3Children = [];
            
            html += `
                <li class="toc-item toc-h2${hasNextH3 ? ' has-children' : ''}" data-h2-id="${id}">
                    <a href="#${id}" class="toc-link" data-heading-id="${id}">
                        ${hasNextH3 ? `<svg class="toc-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>` : ''}
                        <span>${text}</span>
                    </a>
            `;
        } else if (level === 'h3' && currentH2) {
            // Add h3 as child of current h2
            currentH2.hasChildren = true;
            h3Children.push(`
                <li class="toc-item toc-h3">
                    <a href="#${id}" class="toc-link" data-heading-id="${id}">
                        <span>${text}</span>
                    </a>
                </li>
            `);
        }
    });
    
    // Close last h2 if it had children
    if (currentH2 && h3Children.length > 0) {
        html += `<ul class="toc-h3-list">${h3Children.join('')}</ul>`;
    }
    html += `</li>`;
    
    return { items, html };
}

// Add IDs to actual headings in the rendered content
function addHeadingIds() {
    const content = document.getElementById('project-content');
    if (!content) return;
    
    const headings = content.querySelectorAll('h2, h3');
    headings.forEach(heading => {
        const text = heading.textContent.trim();
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        heading.id = id;
    });
}

// Setup scroll spy for TOC
function setupScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;
    
    // Handle expand/collapse for h2s with children
    document.querySelectorAll('.toc-item.toc-h2.has-children').forEach(h2Item => {
        const link = h2Item.querySelector('.toc-link');
        const icon = link.querySelector('.toc-expand-icon');
        
        if (icon) {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                h2Item.classList.toggle('expanded');
            });
        }
    });
    
    // Smooth scroll to heading when clicking TOC link
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't scroll if clicking the expand icon
            if (e.target.closest('.toc-expand-icon')) {
                return;
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('data-heading-id');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 80; // Account for fixed header if any
                const targetPosition = targetElement.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                tocLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active state on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveHeading(tocLinks);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Update active TOC link based on scroll position
function updateActiveHeading(tocLinks) {
    const scrollPosition = window.scrollY + 100;
    const headings = document.querySelectorAll('#project-content h2, #project-content h3');
    
    let activeHeading = null;
    
    headings.forEach(heading => {
        if (heading.offsetTop <= scrollPosition) {
            activeHeading = heading;
        }
    });
    
    if (activeHeading) {
        const activeId = activeHeading.id;
        tocLinks.forEach(link => {
            const linkId = link.getAttribute('data-heading-id');
            if (linkId === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Align TOC sidebar with bottom of project-detail-header
function alignTOCWithContent() {
    // Wait for next frame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
        const projectHeader = document.querySelector('.project-detail-header');
        const tocSidebar = document.querySelector('.toc-sidebar');
        
        if (projectHeader && tocSidebar) {
            // Calculate sticky top position (navbar height + spacing)
            const navbarHeight = 70; // Height of fixed navbar
            const spacing = 16; // Additional spacing below navbar
            const stickyTop = navbarHeight + spacing;
            
            // Set sticky top position to appear below navbar
            tocSidebar.style.top = `${stickyTop}px`;
            
            // Set initial margin to align with header bottom
            const wrapperTop = document.querySelector('.project-detail-wrapper').offsetTop;
            const offsetFromWrapper = projectHeader.offsetTop + projectHeader.offsetHeight - wrapperTop;
            tocSidebar.style.marginTop = `${offsetFromWrapper}px`;
        }
    });
}
