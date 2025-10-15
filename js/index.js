// Homepage functionality - Load featured projects and latest blog posts
document.addEventListener("DOMContentLoaded", async function() {
    // Load site content first
    await ContentLoader.load();
    
    // Render navigation
    ContentLoader.renderNavigation('index.html');
    
    // Populate hero section
    ContentLoader.populateMultiple({
        'hero-greeting': 'hero.greeting',
        'hero-name': 'hero.name',
        'hero-cta-primary': { path: 'hero.cta.primary', options: { html: false } },
        'hero-cta-secondary': { path: 'hero.cta.secondary', options: { html: false } }
    });
    
    // Special handling for hero description (can be string or array)
    const heroDescElement = document.getElementById('hero-description');
    const heroDescription = ContentLoader.get('hero.description');
    if (heroDescElement && heroDescription) {
        if (Array.isArray(heroDescription)) {
            // If array, create paragraph for each item
            heroDescElement.innerHTML = heroDescription
                .map(paragraph => `<p>${paragraph}</p>`)
                .join('');
        } else {
            // If string, set as text content
            heroDescElement.textContent = heroDescription;
        }
    }
    
    // Initialize hero typed text animation
    ContentLoader.initHeroTypedText();
    
    // Populate section headers
    ContentLoader.populateSectionHeaders({
        'about-section-header': 'about',
        'projects-section-header': 'projects',
        'blog-section-header': 'blog',
        'contact-section-header': 'contact'
    });
    
    // Render about preview section
    ContentLoader.renderHomeAboutPreview('about-preview-text');
    
    // Render skills section
    ContentLoader.renderHomeSkills('about-skills');
    
    // Populate contact preview intro
    ContentLoader.populate('contact-preview-intro', 'contact.pageTagline');
    
    // Render contact methods preview
    ContentLoader.renderContactMethods('contact-methods-preview');
    
    // Populate CTAs
    const projectsCta = ContentLoader.get('homepage.sections.projects.cta');
    if (projectsCta) document.getElementById('projects-cta').textContent = projectsCta;
    
    const blogCta = ContentLoader.get('homepage.sections.blog.cta');
    if (blogCta) document.getElementById('blog-cta').textContent = blogCta;
    
    const contactCta = ContentLoader.get('homepage.sections.contact.cta');
    if (contactCta) document.getElementById('contact-cta').textContent = contactCta;
    
    // Render footer
    ContentLoader.renderFooter('footer-container');
    
    // Load dynamic content
    loadFeaturedProjects();
    loadLatestBlogPosts();
    
    // Show content (remove loading class)
    ContentLoader.showContent();
});

// Load featured projects from JSON
async function loadFeaturedProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log(`Loaded ${projects.length} projects for homepage`);
        
        // Calculate read time for each project
        projects.forEach(project => {
            const wordsPerMinute = 200;
            const wordCount = project.content.split(/\s+/).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);
            project.readTime = `${readTime} min read`;
        });
        
        // Display up to 3 projects
        const featuredProjects = projects.slice(0, 3);
        
        if (featuredProjects.length === 0) {
            projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No projects found.</p>';
            return;
        }
        
        projectsGrid.innerHTML = featuredProjects.map(project => `
            <div class="project-card" data-slug="${project.slug}" style="cursor: pointer;">
                <div class="project-image">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.demo ? `<a href="${project.demo}" class="project-link-home" target="_blank" rel="noopener noreferrer" aria-label="View project">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>` : ''}
                            ${project.github ? `<a href="${project.github}" class="project-link-home" target="_blank" rel="noopener noreferrer" aria-label="View code">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>` : ''}
                        </div>
                    </div>
                    <img src="${project.image || 'https://via.placeholder.com/400x250/1a1a1a/00ff88?text=' + encodeURIComponent(project.title)}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <div class="blog-meta">
                        <span class="blog-date">${formatDate(project.date)}</span>
                        <span>•</span>
                        <span class="blog-read-time">${project.readTime}</span>
                    </div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.tags.slice(0, 4).map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to overlay links first (to prevent card navigation)
        document.querySelectorAll('.project-link-home').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
            });
        });
        
        // Add click handlers to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            const slug = card.getAttribute('data-slug');
            card.addEventListener('click', () => {
                window.location.href = `projects.html?project=${slug}`;
            });
        });
        
        // Initialize projects carousel after content is loaded
        setupCarousel('projects-grid', 'projects-nav-left', 'projects-nav-right');
        
    } catch (error) {
        console.error('Error loading featured projects:', error);
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Error loading projects.</p>';
    }
}

// Load latest blog posts from JSON
async function loadLatestBlogPosts() {
    const blogGrid = document.getElementById('blog-preview-grid');
    if (!blogGrid) return;
    
    try {
        const response = await fetch('data/blog-posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log(`Loaded ${posts.length} blog posts for homepage`);
        
        // Calculate read time for each post
        posts.forEach(post => {
            const wordsPerMinute = 200;
            const wordCount = post.content.split(/\s+/).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);
            post.readTime = `${readTime} min read`;
        });
        
        // Take top 3 most recent posts (already sorted by build script)
        const latestPosts = posts.slice(0, 3);
        
        if (latestPosts.length === 0) {
            blogGrid.innerHTML = '<p class="blog-loading">No blog posts found.</p>';
            return;
        }
        
        blogGrid.innerHTML = latestPosts.map(post => `
            <article class="blog-card" onclick="window.location.href='blog.html?post=${post.slug}'">
                <div class="blog-image">
                    <img src="${post.image || 'https://via.placeholder.com/400x250/1a1a1a/00ff88?text=' + encodeURIComponent(post.title)}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${formatDate(post.date)}</span>
                        <span>•</span>
                        <span class="blog-read-time">${post.readTime}</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.tldr || post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.slice(0, 4).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
        
        // Initialize blog carousel after content is loaded
        setupCarousel('blog-preview-grid', 'blog-nav-left', 'blog-nav-right');
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogGrid.innerHTML = '<p class="blog-loading">Error loading blog posts.</p>';
    }
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

// Setup carousel navigation
function setupCarousel(gridId, leftBtnId, rightBtnId) {
    const grid = document.getElementById(gridId);
    const leftBtn = document.getElementById(leftBtnId);
    const rightBtn = document.getElementById(rightBtnId);
    
    if (!grid || !leftBtn || !rightBtn) return;
    
    // Scroll left
    leftBtn.addEventListener('click', () => {
        const scrollAmount = grid.offsetWidth * 0.8;
        grid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Scroll right
    rightBtn.addEventListener('click', () => {
        const scrollAmount = grid.offsetWidth * 0.8;
        grid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Update button states based on scroll position
    function updateButtonStates() {
        const isAtStart = grid.scrollLeft <= 0;
        const isAtEnd = grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 10;
        
        leftBtn.disabled = isAtStart;
        rightBtn.disabled = isAtEnd;
    }
    
    // Listen for scroll events
    grid.addEventListener('scroll', updateButtonStates);
    
    // Initial button state
    updateButtonStates();
    
    // Update on window resize
    window.addEventListener('resize', updateButtonStates);
}

// Hero Image Flip Animation
function initHeroImageFlip() {
    const container = document.getElementById('hero-image-container');
    const frontImg = document.getElementById('hero-img-front');
    const backImg = document.getElementById('hero-img-back');
    
    if (!container || !frontImg || !backImg) return;
    
    let isFlipped = false;
    const originalGifSrc = 'assets/door.gif';
    
    // Function to flip to door.gif
    function flipToDoor() {
        if (!isFlipped) {
            container.classList.add('flipped');
            
            // Start fade out
            frontImg.classList.remove('active');
            
            // Load gif after fade transition (300ms)
            setTimeout(() => {
                // Reload the gif to play from beginning
                // Remove src first to force reload
                backImg.src = '';
                // Use a small delay to ensure browser registers the change
                setTimeout(() => {
                    backImg.src = originalGifSrc;
                    backImg.classList.add('active');
                }, 10);
            }, 300);
            
            isFlipped = true;
        }
    }
    
    // Function to flip back to profile
    function flipToProfile() {
        if (isFlipped) {
            backImg.classList.remove('active');
            frontImg.classList.add('active');
            container.classList.remove('flipped');
            isFlipped = false;
        }
    }
    
    // Click on front image to flip
    frontImg.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToDoor();
    });
    
    // Click on back image to navigate
    backImg.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'home_office/index.html';
    });
    
    // Flip back when mouse leaves the container
    container.addEventListener('mouseleave', () => {
        flipToProfile();
    });
    
    // Flip back on scroll
    window.addEventListener('scroll', () => {
        flipToProfile();
    });
    
    // Flip back on click outside
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            flipToProfile();
        }
    });
    
    // For mobile: flip back on touch move outside or scroll
    let touchStartedInside = false;
    
    container.addEventListener('touchstart', () => {
        touchStartedInside = true;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!touchStartedInside || !container.contains(e.target)) {
            flipToProfile();
        }
    });
    
    document.addEventListener('touchend', () => {
        touchStartedInside = false;
    });
}

// Initialize hero image flip when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initHeroImageFlip();
});
