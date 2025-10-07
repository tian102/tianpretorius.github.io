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
    
    // Typing Animation
    const typedText = document.querySelector(".typed-text");
    if (typedText) {
        const texts = ["Software Engineer", "Full-Stack Developer", "Problem Solver", "Tech Enthusiast", "Future Solo SaaS Founder😉"];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const current = texts[textIndex];
            if (isDeleting) {
                typedText.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedText.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let delay = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                delay = 500;
            }
            
            setTimeout(type, delay);
        }
        
        setTimeout(type, 1000);
    }
    
    // Load Blog Posts Preview
    const blogGrid = document.getElementById("blog-preview-grid");
    if (blogGrid) {
        loadBlogPreview();
    }
    
    async function loadBlogPreview() {
        const blogGrid = document.getElementById("blog-preview-grid");
        const blogPostFiles = [
            'unemployed-to-saas-founder.md',
            'building-scalable-systems.md',
            'my-saas-tech-stack.md',
            'sample-post.md'
        ];
        const posts = [];
        
        try {
            for (const filename of blogPostFiles) {
                const response = await fetch(`blog/posts/${filename}`);
                if (response.ok) {
                    const markdown = await response.text();
                    const slug = filename.replace('.md', '');
                    const post = parsePostPreview(markdown, slug);
                    posts.push(post);
                }
            }
            
            // Sort by date and take only the 3 most recent
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            const recentPosts = posts.slice(0, 3);
            
            if (recentPosts.length > 0) {
                blogGrid.innerHTML = recentPosts.map(post => `
                    <div class="blog-card" onclick="window.location.href='blog.html?post=${post.slug}'">
                        <div class="blog-meta">
                            <span>${new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                            <span>•</span>
                            <span>${post.readTime}</span>
                        </div>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt}</p>
                        <span class="blog-read-more">Read More →</span>
                    </div>
                `).join("");
            } else {
                blogGrid.innerHTML = '<p>No blog posts yet. Check back soon!</p>';
            }
        } catch (error) {
            console.error('Error loading blog preview:', error);
            blogGrid.innerHTML = '<p>Error loading blog posts.</p>';
        }
    }
    
    function parsePostPreview(markdown, slug) {
        const lines = markdown.trim().split('\n');
        let title = 'Untitled Post';
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('# ')) {
                title = lines[i].substring(2).trim();
                break;
            }
        }
        
        const excerpt = markdown
            .replace(/^#.*$/gm, '')
            .replace(/\n/g, ' ')
            .trim()
            .substring(0, 120);
        
        const wordCount = markdown.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200) + ' min read';
        const date = new Date().toISOString().split('T')[0];
        
        return { slug, title, date, readTime, excerpt };
    }
    
    // Navbar Shadow on Scroll
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 100) {
            navbar.style.boxShadow = "var(--shadow-md)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

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
