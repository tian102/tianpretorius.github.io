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
     * Render current focus section
     * @param {string} containerId - The ID of the container element
     */
    function renderCurrentFocus(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const currentFocus = getContent('about.sidebar.currentFocus');
        if (!currentFocus) return;
        
        let html = '';
        
        if (currentFocus.intro) {
            html += `<p>${currentFocus.intro}</p>`;
        }
        
        if (currentFocus.list) {
            html += `
                <ul class="about-list">
                    ${currentFocus.list.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        // Fallback for old format (if description exists instead of intro/list)
        if (currentFocus.description && !currentFocus.intro) {
            html = `<p>${currentFocus.description}</p>`;
        }
        
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
        
        const iconMap = {
            email: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>`,
            whatsapp: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>`,
            linkedin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>`,
            github: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>`
        };
        
        const html = methods.map(method => `
            <a href="${method.link}" class="contact-method-card ${method.primary ? 'primary' : ''}" target="_blank" rel="noopener noreferrer">
                <div class="method-icon">
                    ${iconMap[method.icon] || method.icon}
                </div>
                <div class="method-content">
                    <h4 class="method-title">${method.title}</h4>
                    ${method.description ? `<p class="method-description">${method.description}</p>` : ''}
                </div>
                <div class="method-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                    </svg>
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
            calendar: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>`,
            briefcase: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>`
        };
        
        const html = infoCards.map(card => {
            // Location card with map
            if (card.type === 'location') {
                return `
                    <div class="contact-info-card location-card">
                        <div class="info-card-icon">
                            ${iconMap[card.icon] || ''}
                        </div>
                        <h3>${card.title}</h3>
                        <p>${card.value}</p>
                        ${card.mapEmbedUrl ? `
                            <div class="location-map">
                                <iframe
                                    src="${card.mapEmbedUrl}"
                                    width="100%"
                                    height="150"
                                    style="border:0; border-radius: 8px; margin-top: 0.75rem;"
                                    allowfullscreen=""
                                    loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
            
            // Calendar booking card
            if (card.type === 'calendar') {
                return `
                    <div class="contact-info-card calendar-card">
                        <div class="info-card-icon">
                            ${iconMap[card.icon] || ''}
                        </div>
                        <h3>${card.title}</h3>
                        <p>${card.value}</p>
                        ${card.description ? `<p class="card-description">${card.description}</p>` : ''}
                        ${card.calendarUrl ? `
                            <a href="${card.calendarUrl}" class="calendar-button" target="_blank" rel="noopener noreferrer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                Schedule Meeting
                            </a>
                        ` : ''}
                    </div>
                `;
            }
            
            // Open To card with list
            if (card.type === 'openTo') {
                return `
                    <div class="contact-info-card open-to-card">
                        <div class="info-card-icon">
                            ${iconMap[card.icon] || ''}
                        </div>
                        <h3>${card.title}</h3>
                        <p>${card.value}</p>
                        ${card.items && card.items.length > 0 ? `
                            <ul class="open-to-list">
                                ${card.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `;
            }
            
            // Default card
            return `
                <div class="contact-info-card">
                    <div class="info-card-icon">
                        ${iconMap[card.icon] || ''}
                    </div>
                    <h3>${card.title}</h3>
                    <p>${card.value}</p>
                </div>
            `;
        }).join('');
        
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
                    <div class="footer-left-flip">
                        <div class="footer-left-front">
                            <p>${footer.copyright}</p>
                        </div>
                        <div class="footer-left-back">
                            <a href="dev.html">Behind the Scenes</a>
                        </div>
                    </div>
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
                    <details class="skill-category">
                        <summary class="skill-category-summary">
                            <h4>${category.name}</h4>
                            <svg class="skill-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </summary>
                        <div class="tech-tags">
                            ${category.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                        </div>
                    </details>
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
        renderCurrentFocus: renderCurrentFocus,
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
