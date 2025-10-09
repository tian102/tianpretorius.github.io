// Dev docs functionality - Load and display dev documentation from JSON
const devDocsData = [];
let allDevDocs = [];
let currentDevPage = 1;
let devItemsPerPage = 10;
let filteredDevDocs = [];
let currentDevSort = 'title-asc';

// Function to convert markdown to HTML using marked.js
function parseDevMarkdown(markdown) {
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

// Load all dev docs from JSON
async function loadDevDocs() {
    console.log('Loading dev docs from JSON...');

    try {
        const response = await fetch('data/dev-docs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const devDocs = await response.json();
        console.log(`Loaded ${devDocs.length} dev docs from JSON`);

        devDocsData.push(...devDocs);
        allDevDocs = [...devDocsData];
        filteredDevDocs = [...allDevDocs];
        applyDevSort(); // Apply default sort
        displayDevDocs();
        setupDevFilters();
        setupDevPagination();
    } catch (error) {
        console.error('Error loading dev docs:', error);
        const devList = document.getElementById('dev-list');
        if (devList) {
            devList.innerHTML = '<p class="no-results">Error loading documentation. Please try again later.</p>';
        }
    }
}

// Display dev docs as cards
function displayDevDocs() {
    const devList = document.getElementById('dev-list');
    if (!devList) return;

    const totalDocs = filteredDevDocs.length;

    if (totalDocs === 0) {
        devList.innerHTML = '<p class="no-results">No documentation found matching your criteria.</p>';
        updateDevPagination(0, 0, 0);
        return;
    }

    // Calculate pagination
    const startIndex = (currentDevPage - 1) * devItemsPerPage;
    const endIndex = Math.min(startIndex + devItemsPerPage, totalDocs);
    const paginatedDocs = filteredDevDocs.slice(startIndex, endIndex);

    devList.innerHTML = paginatedDocs.map(doc => `
        <article class="project-card" data-slug="${doc.slug}">
            <div class="project-content">
                <h3 class="project-title">${doc.title}</h3>
                <p class="project-description">${doc.excerpt}</p>
                <div class="project-tags">
                    <span class="project-tag">documentation</span>
                </div>
            </div>
        </article>
    `).join('');

    // Add click handlers to cards
    document.querySelectorAll('.project-card').forEach(card => {
        const slug = card.getAttribute('data-slug');
        card.addEventListener('click', (e) => {
            showDevDocDetail(slug);
        });
    });

    // Update pagination
    updateDevPagination(totalDocs, startIndex, endIndex);
}

// Show individual dev doc detail
function showDevDocDetail(slug) {
    const doc = devDocsData.find(d => d.slug === slug);
    if (!doc) return;

    const devDetail = document.getElementById('dev-detail');
    const devList = document.getElementById('dev-list');
    const devHeader = document.getElementById('dev-header');
    const devFilters = document.getElementById('dev-filters');

    // Hide list and filters, show detail
    devList?.classList.add('hidden');
    devHeader?.classList.add('hidden');
    devFilters?.classList.add('hidden');
    devDetail?.classList.remove('hidden');

    // Hide pagination when viewing individual doc
    hideDevPagination();

    // Render dev doc detail with processed markdown
    const html = parseDevMarkdown(doc.content);

    // Generate TOC from content
    const toc = generateTableOfContents(html);

    devDetail.innerHTML = `
        <div class="project-detail-wrapper">
            <div class="project-detail-main">
                <div class="project-detail-header">
                    <button class="back-button" onclick="hideDevDocDetail()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Documentation
                    </button>
                    <h1>${doc.title}</h1>
                    <p class="project-detail-description">Technical documentation and implementation details.</p>
                </div>
                <div class="project-detail-content" id="dev-content">
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
        addDevHeadingIds();
        setupDevScrollSpy();
        // Align TOC with dev-content
        alignDevTOCWithContent();
    }

    // Update URL
    window.history.pushState({ doc: slug }, '', `?doc=${slug}`);
    window.scrollTo(0, 0);
}

// Hide dev doc detail and show list
function hideDevDocDetail() {
    const devDetail = document.getElementById('dev-detail');
    const devList = document.getElementById('dev-list');
    const devHeader = document.getElementById('dev-header');
    const devFilters = document.getElementById('dev-filters');

    devDetail?.classList.add('hidden');
    devList?.classList.remove('hidden');
    devHeader?.classList.remove('hidden');
    devFilters?.classList.remove('hidden');

    // Show pagination when viewing doc list
    const paginationSection = document.getElementById('dev-pagination-section');
    if (paginationSection) {
        paginationSection.style.display = 'block';
    }

    // Update URL
    window.history.pushState({}, '', 'dev.html');
    window.scrollTo(0, 0);
}

// Setup filter functionality
function setupDevFilters() {
    // Search functionality
    const searchInput = document.getElementById('dev-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filteredDevDocs = allDevDocs.filter(doc =>
                doc.title.toLowerCase().includes(query) ||
                doc.excerpt.toLowerCase().includes(query) ||
                doc.content.toLowerCase().includes(query)
            );
            applyDevSort();
            currentDevPage = 1; // Reset to first page
            displayDevDocs();
        });
    }

    // Sort functionality
    const sortSelect = document.getElementById('dev-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentDevSort = e.target.value;
            applyDevSort();
            currentDevPage = 1; // Reset to first page
            displayDevDocs();
        });
    }
}

// Apply current sort to filtered dev docs
function applyDevSort() {
    filteredDevDocs.sort((a, b) => {
        switch (currentDevSort) {
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });
}

// Setup pagination
function setupDevPagination() {
    const itemsPerPageSelect = document.getElementById('dev-items-per-page');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            devItemsPerPage = parseInt(e.target.value);
            currentDevPage = 1;
            displayDevDocs();
        });
    }
}

// Update pagination controls
function updateDevPagination(totalDocs, startIndex, endIndex) {
    const paginationSection = document.getElementById('dev-pagination-section');
    const paginationButtons = document.getElementById('dev-pagination-buttons');
    const paginationInfoText = document.getElementById('dev-pagination-info-text');

    if (!paginationSection || totalDocs === 0) {
        if (paginationSection) paginationSection.style.display = 'none';
        return;
    }

    // Show pagination section
    paginationSection.style.display = 'block';

    // Update info text
    const actualEndIndex = Math.min(endIndex, totalDocs);
    paginationInfoText.textContent = `Showing ${startIndex + 1}-${actualEndIndex} of ${totalDocs} docs`;

    // Calculate total pages
    const totalPages = Math.ceil(totalDocs / devItemsPerPage);

    // Generate pagination buttons
    let buttonsHTML = '';

    // Previous button
    buttonsHTML += `
        <button class="pagination-btn ${currentDevPage === 1 ? 'disabled' : ''}"
                ${currentDevPage === 1 ? 'disabled' : ''}
                onclick="changeDevPage(${currentDevPage - 1})">
            Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentDevPage - 1 && i <= currentDevPage + 1)
        ) {
            buttonsHTML += `
                <button class="pagination-btn ${i === currentDevPage ? 'active' : ''}"
                        onclick="changeDevPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentDevPage - 2 || i === currentDevPage + 2) {
            buttonsHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }

    // Next button
    buttonsHTML += `
        <button class="pagination-btn ${currentDevPage === totalPages ? 'disabled' : ''}"
                ${currentDevPage === totalPages ? 'disabled' : ''}
                onclick="changeDevPage(${currentDevPage + 1})">
            Next
        </button>
    `;

    paginationButtons.innerHTML = buttonsHTML;
}

// Change page
function changeDevPage(page) {
    currentDevPage = page;
    displayDevDocs();
    // Scroll to top of dev docs list
    document.getElementById('dev-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide pagination
function hideDevPagination() {
    const paginationSection = document.getElementById('dev-pagination-section');
    if (paginationSection) {
        paginationSection.style.display = 'none';
    }
}

// Check URL for doc parameter
function checkDevUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const docSlug = urlParams.get('doc');

    if (docSlug) {
        showDevDocDetail(docSlug);
    }
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.doc) {
        showDevDocDetail(event.state.doc);
    } else {
        hideDevDocDetail();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDevDocs().then(() => {
        checkDevUrlParams();
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
function addDevHeadingIds() {
    const content = document.getElementById('dev-content');
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
function setupDevScrollSpy() {
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
                updateDevActiveHeading(tocLinks);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Update active TOC link based on scroll position
function updateDevActiveHeading(tocLinks) {
    const scrollPosition = window.scrollY + 100;
    const headings = document.querySelectorAll('#dev-content h2, #dev-content h3');

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

// Align TOC sidebar with bottom of dev-detail-header
function alignDevTOCWithContent() {
    // Wait for next frame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
        const devHeader = document.querySelector('.project-detail-header');
        const tocSidebar = document.querySelector('.toc-sidebar');

        if (devHeader && tocSidebar) {
            // Calculate sticky top position (navbar height + spacing)
            const navbarHeight = 70; // Height of fixed navbar
            const spacing = 16; // Additional spacing below navbar
            const stickyTop = navbarHeight + spacing;

            // Set sticky top position to appear below navbar
            tocSidebar.style.top = `${stickyTop}px`;

            // Set initial margin to align with header bottom
            const wrapperTop = document.querySelector('.project-detail-wrapper').offsetTop;
            const offsetFromWrapper = devHeader.offsetTop + devHeader.offsetHeight - wrapperTop;
            tocSidebar.style.marginTop = `${offsetFromWrapper}px`;
        }
    });
}