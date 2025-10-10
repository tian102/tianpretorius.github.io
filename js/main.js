// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function() {
    // Mobile Navigation
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const spans = navToggle.querySelectorAll("span");
            if (navMenu.classList.contains("active")) {
                spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
                spans[1].style.opacity = "0";
                spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
            } else {
                spans[0].style.transform = "none";
                spans[1].style.opacity = "1";
                spans[2].style.transform = "none";
            }
        });
    }
    
    // Smooth Scrolling
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href !== "#" && href.length > 1) {
                e.preventDefault();
                const target = document.getElementById(href.substring(1));
                if (target) {
                    const navHeight = document.querySelector(".navbar").offsetHeight;
                    window.scrollTo({
                        top: target.offsetTop - navHeight,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
    
    // Typing Animation is now handled by content-loader.js
    
    // Navbar Shadow on Scroll
    const navbar = document.querySelector(".navbar");
    
    window.addEventListener("scroll", () => {
        const scrollPosition = window.pageYOffset;
        
        // Navbar shadow
        if (scrollPosition > 100) {
            navbar.style.boxShadow = "var(--shadow-md)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

    // Enhanced Scroll Indicator
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (scrollIndicator) {
        // Fade out scroll indicator when scrolling down
        let lastScrollTop = 0;
        window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Fade out after scrolling 100px down
            if (scrollTop > 100) {
                scrollIndicator.style.opacity = "0";
                scrollIndicator.style.pointerEvents = "none";
            } else {
                scrollIndicator.style.opacity = "1";
                scrollIndicator.style.pointerEvents = "auto";
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Enhanced click handler with precise positioning
        scrollIndicator.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = scrollIndicator.getAttribute("href")?.substring(1);
            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    }

    // Section Navigation
    const sectionNav = document.querySelector('.section-nav');
    const navUpBtn = document.getElementById('nav-up');
    const navDownBtn = document.getElementById('nav-down');
    
    if (sectionNav && navUpBtn && navDownBtn) {
        // Define sections in order
        const sections = ['home', 'about', 'projects', 'blog', 'contact'];
        let currentSectionIndex = 0;
        
        // Show navigation after scrolling past hero
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > window.innerHeight * 0.5) {
                sectionNav.classList.add('visible');
            } else {
                sectionNav.classList.remove('visible');
            }
            
            // Update current section based on scroll position
            sections.forEach((sectionId, index) => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const navHeight = navbar.offsetHeight;
                    if (rect.top <= navHeight + 100 && rect.bottom > navHeight) {
                        currentSectionIndex = index;
                    }
                }
            });
            
            // Update button states
            navUpBtn.disabled = currentSectionIndex === 0;
            navDownBtn.disabled = currentSectionIndex === sections.length - 1;
        });
        
        // Navigate to previous section
        navUpBtn.addEventListener('click', () => {
            if (currentSectionIndex > 0) {
                const prevSection = document.getElementById(sections[currentSectionIndex - 1]);
                if (prevSection) {
                    const navHeight = navbar.offsetHeight;
                    window.scrollTo({
                        top: prevSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
        
        // Navigate to next section
        navDownBtn.addEventListener('click', () => {
            if (currentSectionIndex < sections.length - 1) {
                const nextSection = document.getElementById(sections[currentSectionIndex + 1]);
                if (nextSection) {
                    const navHeight = navbar.offsetHeight;
                    window.scrollTo({
                        top: nextSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
});

// Function to render documents dropdown in navbar
function renderDocumentsDropdown() {
    console.log('renderDocumentsDropdown called');
    
    // Check if dropdown already exists
    if (document.querySelector('.nav-dropdown')) {
        console.log('Dropdown already exists');
        return;
    }
    
    // Load site content
    fetch('data/site-content.json')
        .then(response => response.json())
        .then(siteContent => {
            console.log('siteContent loaded:', siteContent);
            const documents = siteContent.navigation?.documents || [];
            console.log('documents:', documents);
            
            if (documents.length === 0) {
                console.log('No documents found');
                return;
            }
            
            // Find the nav-menu ul element
            const navMenu = document.querySelector('.nav-menu');
            console.log('navMenu found:', navMenu);
            if (!navMenu) {
                console.log('navMenu not found!');
                return;
            }
            
            // Create dropdown HTML
            const dropdownHTML = `
                <li class="nav-dropdown">
                    <button class="nav-dropdown-toggle">Docs</button>
                    <ul class="nav-dropdown-menu">
                        ${documents.map(doc => `
                            <li class="nav-dropdown-item">
                                <a href="${doc.file}" target="_blank" rel="noopener noreferrer">${doc.name}</a>
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `;
            
            // Insert before the closing </ul> tag
            console.log('Inserting dropdown HTML');
            navMenu.insertAdjacentHTML('beforeend', dropdownHTML);
            console.log('HTML inserted, checking if elements exist...');
            
            // Verify the elements were added
            const dropdownToggle = navMenu.querySelector('.nav-dropdown-toggle');
            const dropdownMenu = navMenu.querySelector('.nav-dropdown-menu');
            console.log('dropdownToggle after insertion:', dropdownToggle);
            console.log('dropdownMenu after insertion:', dropdownMenu);
            
            if (dropdownToggle && dropdownMenu) {
                dropdownToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('active');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.classList.remove('active');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading site content for navbar:', error);
        });
}

// Make function globally available
window.renderDocumentsDropdown = renderDocumentsDropdown;
