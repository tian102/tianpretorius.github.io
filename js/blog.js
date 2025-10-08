// Blog functionality

// Global state
let allPosts = [];
let currentFilter = 'all';
let currentSort = 'date-desc';
let currentPage = 1;
let itemsPerPage = 10;

// Load all blog posts from JSON
async function loadBlogPosts() {
    const blogList = document.getElementById('blog-list');
    
    console.log('Loading blog posts from JSON...');
    
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allPosts = await response.json();
        console.log(`Loaded ${allPosts.length} blog posts from JSON`);
        
        // Populate tag filter
        populateTagFilter();
        
        // Display posts
        displayPosts();
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogList.innerHTML = '<p class="no-results">Error loading blog posts. Please try again later.</p>';
    }
}
    
    // Populate tag filter dropdown
    function populateTagFilter() {
        const tagFilter = document.getElementById('tag-filter');
        const allTags = new Set();
        
        allPosts.forEach(post => {
            post.tags.forEach(tag => allTags.add(tag));
        });
        
        const sortedTags = Array.from(allTags).sort();
        
        sortedTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagFilter.appendChild(option);
        });
    }
    
    // Filter and sort posts
    function filterAndSortPosts() {
        let filteredPosts = [...allPosts];
        
        // Filter by tag
        if (currentFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => 
                post.tags.includes(currentFilter)
            );
        }
        
        // Sort posts
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
        
        return filteredPosts;
    }
    
    // Show blog list view (and hide individual post view)
    function showBlogList() {
        const blogList = document.getElementById('blog-list');
        const blogPost = document.getElementById('blog-post');
        const blogHeader = document.getElementById('blog-header');
        const blogFilters = document.getElementById('blog-filters');
        
        // Show the list view, header, and filters
        blogList.classList.remove('hidden');
        blogPost.classList.add('hidden');
        if (blogHeader) blogHeader.classList.remove('hidden');
        if (blogFilters) blogFilters.classList.remove('hidden');
        
        // Show pagination when viewing blog list
        const paginationSection = document.getElementById('pagination-section');
        if (paginationSection) {
            paginationSection.style.display = 'block';
        }
    }

    // Display posts
    function displayPosts() {
        showBlogList(); // Ensure we're in list view
        const blogList = document.getElementById('blog-list');
        const filteredPosts = filterAndSortPosts();
        
        console.log('Displaying posts:', filteredPosts.length, 'posts');
        console.log('All posts:', allPosts);
        
        if (filteredPosts.length === 0) {
            blogList.innerHTML = '<p class="no-results">No posts found matching your filters.</p>';
            hidePagination();
            return;
        }
        
        // Calculate pagination
        const totalPosts = filteredPosts.length;
        const totalPages = Math.ceil(totalPosts / itemsPerPage);
        
        // Ensure current page is valid
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        // Get posts for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
        
        console.log(`Showing posts ${startIndex + 1}-${Math.min(endIndex, totalPosts)} of ${totalPosts}`);
        
        blogList.innerHTML = postsToDisplay.map(post => `
            <article class="blog-card" data-slug="${post.slug}">
                <div class="blog-image">
                    <img src="${post.image || 'https://via.placeholder.com/400x250/1a1a1a/00ff88?text=' + encodeURIComponent(post.title)}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <span class="blog-read-time">${calculateReadTime(post.content)} min read</span>
                    </div>
                    <h2 class="blog-title">${post.title}</h2>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `
                            <span class="blog-tag" data-tag="${tag}">${tag}</span>
                        `).join('')}
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
                window.location.href = `?post=${slug}`;
            });
        });
        
        // Add click handlers to tag chips
        document.querySelectorAll('.blog-tag').forEach(tagEl => {
            tagEl.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                const tag = tagEl.getAttribute('data-tag');
                document.getElementById('tag-filter').value = tag;
                currentFilter = tag;
                currentPage = 1; // Reset to first page when filtering
                displayPosts();
                updateActiveFilters();
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
        
        if (totalPages <= 1) {
            paginationButtons.innerHTML = '';
            return;
        }
        
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
    
    // Load individual blog post
    async function loadBlogPost(slug) {
        const blogList = document.getElementById('blog-list');
        const blogPost = document.getElementById('blog-post');
        const blogHeader = document.getElementById('blog-header');
        const blogFilters = document.getElementById('blog-filters');
        
        // Hide the list view, header, and filters
        blogList.classList.add('hidden');
        blogPost.classList.remove('hidden');
        if (blogHeader) blogHeader.classList.add('hidden');
        if (blogFilters) blogFilters.classList.add('hidden');
        
        // Hide pagination when viewing individual post
        hidePagination();
        
        try {
            const post = allPosts.find(p => p.slug === slug);
            if (!post) {
                blogPost.innerHTML = '<p>Blog post not found.</p>';
                return;
            }
            
            const htmlContent = parseMarkdown(post.content);
            
            blogPost.innerHTML = `
                <article class="blog-post">
                    <header class="blog-post-header">
                        <a href="blog.html" class="back-link">← Back to Blog</a>
                        <h1>${post.title}</h1>
                        <div class="blog-post-meta">
                            <span class="blog-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span class="blog-read-time">${calculateReadTime(post.content)} min read</span>
                        </div>
                        <div class="post-tags">
                            ${post.tags.map(tag => `
                                <a href="blog.html?tag=${tag}" class="post-tag">${tag}</a>
                            `).join('')}
                        </div>
                    </header>
                    <div class="blog-post-content">
                        ${htmlContent}
                    </div>
                </article>
            `;
            
        } catch (error) {
            console.error('Error loading blog post:', error);
            blogPost.innerHTML = '<p>Error loading blog post. Please try again later.</p>';
        }
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
    
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');
        const tagParam = urlParams.get('tag');
        
        loadBlogPosts().then(() => {
            if (tagParam) {
                currentFilter = tagParam;
                document.getElementById('tag-filter').value = tagParam;
                displayPosts();
                updateActiveFilters();
            } else if (postSlug) {
                loadBlogPost(postSlug);
            }
        });
        
        // Filter event listeners
        const tagFilter = document.getElementById('tag-filter');
        const sortFilter = document.getElementById('sort-filter');
        const itemsPerPageSelect = document.getElementById('items-per-page');
        
        if (tagFilter) {
            tagFilter.addEventListener('change', (e) => {
                currentFilter = e.target.value;
                currentPage = 1; // Reset to first page when filtering
                displayPosts();
                updateActiveFilters();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                currentSort = e.target.value;
                currentPage = 1; // Reset to first page when sorting
                displayPosts();
            });
        }
        
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1; // Reset to first page when changing items per page
                displayPosts();
            });
        }
    });
