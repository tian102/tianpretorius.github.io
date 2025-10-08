// Blog functionality

// Global state
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = 'date-desc';

// Load all blog posts from JSON
async function loadBlogPosts() {
    console.log('Loading blog posts from JSON...');
    
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allPosts = await response.json();
        // Sort by date (newest first) by default
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredPosts = [...allPosts];
        
        console.log(`Loaded ${allPosts.length} blog posts from JSON`);
        
        // Setup filters and search
        setupFilters();
        setupPagination();
        
        // Display posts
        displayPosts();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const blogList = document.getElementById('blog-list');
        if (blogList) {
            blogList.innerHTML = '<p class="no-results">Error loading blog posts. Please try again later.</p>';
        }
    }
}

// Setup filter functionality
function setupFilters() {
    const allTags = new Set();
    allPosts.forEach(post => {
        post.tags.forEach(tag => allTags.add(tag));
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
                    filteredPosts = [...allPosts];
                    applySort();
                    currentPage = 1;
                    displayPosts();
                } else {
                    filterByTag(tag);
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filteredPosts = allPosts.filter(post => 
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
            applySort();
            currentPage = 1; // Reset to first page
            displayPosts();
        });
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('blog-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applySort();
            currentPage = 1; // Reset to first page
            displayPosts();
        });
    }
}

// Apply current sort to filtered posts
function applySort() {
    filteredPosts.sort((a, b) => {
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

// Filter posts by tag
function filterByTag(tag) {
    filteredPosts = allPosts.filter(post => post.tags.includes(tag));
    applySort();
    currentPage = 1; // Reset to first page
    displayPosts();
    
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
    
// Display blog posts as cards
function displayPosts() {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;
    
    const totalPosts = filteredPosts.length;
    
    if (totalPosts === 0) {
        blogList.innerHTML = '<p class="no-results">No posts found matching your criteria.</p>';
        updatePagination(0, 0, 0);
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalPosts);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    console.log(`Displaying ${paginatedPosts.length} posts (${startIndex + 1}-${endIndex} of ${totalPosts})`);
    
    blogList.innerHTML = paginatedPosts.map(post => `
        <article class="blog-card" data-slug="${post.slug}">
            ${post.image ? `<div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>` : ''}
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span>•</span>
                    <span class="blog-read-time">${calculateReadTime(post.content)} min read</span>
                </div>
                <h2 class="blog-title">${post.title}</h2>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag" data-tag="${tag}">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');
    
    // Add click handlers to cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on a tag
            if (e.target.classList.contains('blog-tag')) {
                return;
            }
            const slug = card.getAttribute('data-slug');
            showBlogPost(slug);
        });
    });
    
    // Add click handlers to tags
    document.querySelectorAll('.blog-tag').forEach(tagEl => {
        tagEl.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const tag = tagEl.getAttribute('data-tag');
            filterByTag(tag);
            
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
        });
    });
    
    // Update pagination
    updatePagination(totalPosts, startIndex, endIndex);
}
    
    // Update pagination controls
    function updatePagination(totalPosts, startIndex, endIndex) {
        const paginationSection = document.getElementById('pagination-section');
        const paginationButtons = document.getElementById('pagination-buttons');
        const paginationInfoText = document.getElementById('pagination-info-text');
        
        if (!paginationSection || totalPosts === 0) return;
        
        // Show pagination section
        paginationSection.style.display = 'block';
        
        // Update info text
        const actualEndIndex = Math.min(endIndex, totalPosts);
        paginationInfoText.textContent = `Showing ${startIndex + 1}-${actualEndIndex} of ${totalPosts} posts`;
        
        // Calculate total pages
        const totalPages = Math.ceil(totalPosts / itemsPerPage);
        
        // Generate pagination buttons
        let buttonsHTML = '';
        
        // Previous button
        buttonsHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
            </button>
        `;
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page
        if (startPage > 1) {
            buttonsHTML += `<button class="pagination-btn page-number" data-page="1">1</button>`;
            if (startPage > 2) {
                buttonsHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttonsHTML += `
                <button class="pagination-btn page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttonsHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            buttonsHTML += `<button class="pagination-btn page-number" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // Next button
        buttonsHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        `;
        
        paginationButtons.innerHTML = buttonsHTML;
        
        // Add click handlers
        document.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                if (page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    displayPosts();
                    // Scroll to top of blog list
                    document.getElementById('blog-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    // Hide pagination
    function hidePagination() {
        const paginationSection = document.getElementById('pagination-section');
        if (paginationSection) {
            paginationSection.style.display = 'none';
        }
    }
    
    // Update active filters display
    function updateActiveFilters() {
        const activeFiltersEl = document.getElementById('active-filters');
        
        if (currentFilter === 'all') {
            activeFiltersEl.innerHTML = '';
            return;
        }
        
        activeFiltersEl.innerHTML = `
            <div class="filter-tag">
                <span>${currentFilter}</span>
                <button class="filter-tag-remove" aria-label="Remove filter">×</button>
            </div>
        `;
        
        activeFiltersEl.querySelector('.filter-tag-remove').addEventListener('click', () => {
            currentFilter = 'all';
            document.getElementById('tag-filter').value = 'all';
            displayPosts();
            updateActiveFilters();
        });
    }
    
// Show individual blog post
function showBlogPost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    if (!post) return;
    
    const blogPost = document.getElementById('blog-post');
    const blogList = document.getElementById('blog-list');
    const blogHeader = document.getElementById('blog-header');
    const blogFilters = document.getElementById('blog-filters');
    
    // Hide list and filters, show post
    blogList?.classList.add('hidden');
    blogHeader?.classList.add('hidden');
    blogFilters?.classList.add('hidden');
    blogPost?.classList.remove('hidden');
    
    // Hide pagination when viewing individual post
    hidePagination();
    
    // Render blog post detail
    const htmlContent = parseMarkdown(post.content);
    blogPost.innerHTML = `
        <div class="blog-post-detail">
            <button class="back-button" onclick="hideBlogPost()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Blog
            </button>
            <article class="blog-post">
                <header class="blog-post-header">
                    <h1>${post.title}</h1>
                    <div class="blog-post-meta">
                        <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <span class="blog-read-time">${calculateReadTime(post.content)} min read</span>
                    </div>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </header>
                <div class="blog-post-content">
                    ${htmlContent}
                </div>
            </article>
        </div>
    `;
    
    // Update URL
    window.history.pushState({ post: slug }, '', `?post=${slug}`);
    window.scrollTo(0, 0);
}

// Hide blog post and show list
function hideBlogPost() {
    const blogPost = document.getElementById('blog-post');
    const blogList = document.getElementById('blog-list');
    const blogHeader = document.getElementById('blog-header');
    const blogFilters = document.getElementById('blog-filters');
    
    blogPost?.classList.add('hidden');
    blogList?.classList.remove('hidden');
    blogHeader?.classList.remove('hidden');
    blogFilters?.classList.remove('hidden');
    
    // Show pagination when viewing blog list
    const paginationSection = document.getElementById('pagination-section');
    if (paginationSection) {
        paginationSection.style.display = 'block';
    }
    
    // Update URL
    window.history.pushState({}, '', 'blog.html');
    window.scrollTo(0, 0);
}
    
    // Calculate read time
    function calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }
    
    function parseMarkdown(md) {
        // Use marked.js library for proper markdown parsing
        if (typeof marked === 'undefined') {
            console.error('Marked.js library not loaded');
            return md;
        }
        
        // Remove the first H1 heading (title is already shown in the header)
        let content = md.replace(/^#\s+.+$/m, '');
        
        // Parse markdown to HTML using marked.js
        const html = marked.parse(content);
        
        return html;
    }
    
// Calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

function parseMarkdown(md) {
    // Use marked.js library for proper markdown parsing
    if (typeof marked === 'undefined') {
        console.error('Marked.js library not loaded');
        return md;
    }
    
    // Remove the first H1 heading (title is already shown in the header)
    let content = md.replace(/^#\s+.+$/m, '');
    
    // Parse markdown to HTML using marked.js
    const html = marked.parse(content);
    
    return html;
}

// Setup pagination controls
function setupPagination() {
    const itemsPerPageSelect = document.getElementById('items-per-page');
    
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1; // Reset to first page when changing items per page
            displayPosts();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    
    loadBlogPosts().then(() => {
        if (postSlug) {
            showBlogPost(postSlug);
        }
    });
});
