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
        renderFooter: renderFooter,
        initHeroTypedText: initHeroTypedText
    };

})(window);
