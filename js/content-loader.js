/**
 * Content Loader - Manages site content from JSON
 * 
 * Usage:
 * - ContentLoader.load() - Load content JSON
 * - ContentLoader.get('path.to.content') - Get content by path
 * - ContentLoader.populate('elementId', 'content.path') - Populate single element
 * - ContentLoader.renderSection('sectionName') - Render complex sections
 */

(function(window) {
    'use strict';

    let siteContent = null;

    /**
     * Load site content from JSON file
     * @returns {Promise<Object>} The site content object
     */
    async function loadSiteContent() {
        if (siteContent) return siteContent;
        
        try {
            const response = await fetch('data/site-content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            siteContent = await response.json();
            console.log('Site content loaded successfully');
            return siteContent;
        } catch (error) {
            console.error('Error loading site content:', error);
            return null;
        }
    }

    /**
     * Get content by dot-notation path (e.g., 'hero.greeting' or 'about.sections')
     * @param {string} path - The dot-notation path to the content
     * @returns {*} The content at the specified path, or null if not found
     */
    function getContent(path) {
        if (!siteContent) {
            console.warn('Content not loaded yet. Call ContentLoader.load() first.');
            return null;
        }
        
        const keys = path.split('.');
        let value = siteContent;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Content path not found: ${path}`);
                return null;
            }
        }
        
        return value;
    }

    /**
     * Populate a single element with content
     * @param {string} elementId - The ID of the element to populate
     * @param {string} contentPath - The path to the content
     * @param {Object} options - Options for rendering {html: boolean, attribute: string}
     */
    function populateContent(elementId, contentPath, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element not found: ${elementId}`);
            return;
        }
        
        const content = getContent(contentPath);
        if (content === null || content === undefined) return;
        
        if (options.attribute) {
            element.setAttribute(options.attribute, content);
        } else if (options.html) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }
    }

    /**
     * Populate multiple elements from a mapping object
     * @param {Object} mappings - Object with elementId: contentPath pairs
     */
    function populateMultiple(mappings) {
        for (const [elementId, config] of Object.entries(mappings)) {
            if (typeof config === 'string') {
                populateContent(elementId, config);
            } else {
                populateContent(elementId, config.path, config.options || {});
            }
        }
    }

    /**
     * Render About page sections
     * @param {string} containerId - The ID of the container element
     */
    function renderAboutSections(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const sections = getContent('about.sections');
        if (!sections) return;
        
        const html = sections.map(section => {
            let content = '';
            
            if (section.content) {
                // Array of paragraphs
                if (Array.isArray(section.content)) {
                    content = section.content.map(p => `<p>${p}</p>`).join('');
                } else {
                    content = `<p>${section.content}</p>`;
                }
            }
            
            if (section.intro) {
                content += `<p>${section.intro}</p>`;
            }
            
            if (section.list) {
                content += `
                    <ul class="about-list">
                        ${section.list.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                `;
            }
            
            return `
                <div class="about-section">
                    <h2>${section.title}</h2>
                    ${content}
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
    }

    /**
     * Render skills tags
     * @param {string} containerId - The ID of the container element
     */
    function renderSkills(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const skills = getContent('about.sidebar.skills.tags');
        if (!skills) return;
        
        const html = skills.map(skill => 
            `<span class="tech-tag">${skill}</span>`
        ).join('');
        
        container.innerHTML = html;
    }

    /**
     * Render experience items
     * @param {string} containerId - The ID of the container element
     */
    function renderExperience(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const experience = getContent('about.sidebar.experience.items');
        if (!experience) return;
        
        const html = experience.map(exp => `
            <div class="experience-item">
                <h4>${exp.title}</h4>
                <p class="experience-duration">${exp.duration}</p>
                <p class="experience-desc">${exp.description}</p>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    /**
     * Render contact methods
     * @param {string} containerId - The ID of the container element
     */
    function renderContactMethods(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const methods = getContent('contact.methods');
        if (!methods) return;
        
        const html = methods.map(method => `
            <a href="${method.link}" class="contact-method" target="_blank" rel="noopener noreferrer">
                <div class="contact-icon">${method.icon}</div>
                <div class="contact-info">
                    <h4>${method.title}</h4>
                    <p>${method.value}</p>
                </div>
            </a>
        `).join('');
        
        container.innerHTML = html;
    }

    /**
     * Render contact info cards
     * @param {string} containerId - The ID of the container element
     */
    function renderContactInfoCards(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const infoCards = getContent('contact.infoCards');
        if (!infoCards) return;
        
        const iconMap = {
            location: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>`,
            clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>`,
            briefcase: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>`
        };
        
        const html = infoCards.map(card => `
            <div class="contact-info-card">
                <div class="info-card-icon">
                    ${iconMap[card.icon] || ''}
                </div>
                <h3>${card.title}</h3>
                <p>${card.value}</p>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    /**
     * Render footer content
     * @param {string} containerId - The ID of the container element
     */
    function renderFooter(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const footer = getContent('footer');
        if (!footer) return;
        
        const html = `
            <div class="footer-content">
                <div class="footer-left">
                    <p>${footer.copyright}</p>
                </div>
                <div class="footer-right">
                    ${footer.links.map(link => 
                        `<a href="${link.url}" ${link.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${link.text}</a>`
                    ).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Initialize hero section with typed text animation
     */
    function initHeroTypedText() {
        const typedTextEl = document.querySelector('.typed-text');
        if (!typedTextEl) return;
        
        const roles = getContent('hero.typedRoles');
        if (!roles || roles.length === 0) return;
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const current = roles[textIndex];
            if (isDeleting) {
                typedTextEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedTextEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let delay = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % roles.length;
                delay = 500;
            }
            
            setTimeout(type, delay);
        }
        
        setTimeout(type, 1000);
    }

    /**
     * Render homepage about preview section
     * @param {string} containerId - The ID of the container element
     */
    function renderHomeAboutPreview(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const aboutPreview = getContent('homepage.aboutPreview');
        if (!aboutPreview) return;
        
        const html = `
            <p class="about-intro">${aboutPreview.intro}</p>
            ${aboutPreview.paragraphs.map(p => `<p>${p}</p>`).join('')}
            <div class="about-cta">
                <a href="${aboutPreview.ctaLink}" class="btn-secondary">${aboutPreview.ctaText}</a>
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Render homepage skills grid
     * @param {string} containerId - The ID of the container element
     */
    function renderHomeSkills(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const skills = getContent('homepage.skills');
        if (!skills) return;
        
        const html = `
            <h3>${skills.title}</h3>
            <div class="skills-grid">
                ${skills.categories.map(category => `
                    <div class="skill-category">
                        <h4>${category.name}</h4>
                        <div class="tech-tags">
                            ${category.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = html;
    }

    /**
     * Populate section headers with numbers and titles
     * @param {Object} mappings - Object with {containerId: sectionKey} pairs
     */
    function populateSectionHeaders(mappings) {
        for (const [containerId, sectionKey] of Object.entries(mappings)) {
            const container = document.getElementById(containerId);
            if (!container) continue;
            
            const section = getContent(`homepage.sections.${sectionKey}`);
            if (!section) continue;
            
            // Find section-number and section-title elements within container
            const numberEl = container.querySelector('.section-number');
            const titleEl = container.querySelector('.section-title');
            
            if (numberEl) numberEl.textContent = section.number;
            if (titleEl) titleEl.textContent = section.title;
        }
    }

    /**
     * Render navigation menu
     * @param {string} currentPage - The current page filename (e.g., 'index.html')
     */
    function renderNavigation(currentPage = '') {
        const nav = getContent('navigation');
        if (!nav) return;
        
        // Update brand name
        const brandNameEl = document.querySelector('.brand-name');
        if (brandNameEl) {
            brandNameEl.textContent = nav.brandName;
        }
        
        // Update navigation links
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const linksHtml = nav.links.map(link => {
                const isActive = currentPage === link.url || 
                                 (currentPage === '' && link.url === 'index.html');
                return `<li><a href="${link.url}" class="nav-link${isActive ? ' active' : ''}">${link.text}</a></li>`;
            }).join('');
            
            const resumeHtml = `<li><a href="${nav.resumeLink}" class="nav-link resume-link" download>${nav.resumeText}</a></li>`;
            
            navMenu.innerHTML = linksHtml + resumeHtml;
        }
    }

    /**
     * Show content by removing loading class
     */
    function showContent() {
        document.body.classList.remove('content-loading');
    }

    /**
     * Hide content by adding loading class
     */
    function hideContent() {
        document.body.classList.add('content-loading');
    }

    // Export public API
    window.ContentLoader = {
        load: loadSiteContent,
        get: getContent,
        populate: populateContent,
        populateMultiple: populateMultiple,
        renderAboutSections: renderAboutSections,
        renderSkills: renderSkills,
        renderExperience: renderExperience,
        renderContactMethods: renderContactMethods,
        renderContactInfoCards: renderContactInfoCards,
        renderFooter: renderFooter,
        initHeroTypedText: initHeroTypedText,
        renderHomeAboutPreview: renderHomeAboutPreview,
        renderHomeSkills: renderHomeSkills,
        populateSectionHeaders: populateSectionHeaders,
        renderNavigation: renderNavigation,
        showContent: showContent,
        hideContent: hideContent
    };

})(window);
