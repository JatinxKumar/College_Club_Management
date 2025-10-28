// about.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // Mobile menu functionality
    mobileMenuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Change menu icon
        this.textContent = isExpanded ? '☰' : '✕';
    });

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.textContent = '☰';
            body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Team card animations
    const teamCards = document.querySelectorAll('.team-card');
    
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                teamObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    teamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(card);
    });

    // About section animations
    const aboutSections = document.querySelectorAll('.about-section, .team-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    aboutSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(section);
    });

    // Hero section typing effect
    const heroTitle = document.querySelector('.about-hero h1');
    const heroText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < heroText.length) {
            heroTitle.textContent += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect when hero section is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                heroObserver.unobserve(entry.target);
            }
        });
    });
    
    heroObserver.observe(document.querySelector('.about-hero'));

    // Team member hover effects with additional info
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0 8px 25px rgba(155, 89, 182, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });

        // Add click to show more info
        card.addEventListener('click', function() {
            const memberName = this.querySelector('h3').textContent;
            const memberRole = this.querySelector('p').textContent;
            showMemberModal(memberName, memberRole);
        });
    });

    // Mission statement highlight animation
    const missionText = document.querySelector('.about-text p');
    const words = missionText.textContent.split(' ');
    missionText.textContent = '';
    
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.opacity = '0';
        span.style.transition = `opacity 0.3s ease ${index * 0.1}s`;
        missionText.appendChild(span);
        
        setTimeout(() => {
            span.style.opacity = '1';
        }, 500 + (index * 100));
    });

    // Feature list animation
    const featureItems = document.querySelectorAll('.about-text ul li');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 1000 + (index * 200));
    });

    // Image hover effect
    const aboutImage = document.querySelector('.about-image img');
    aboutImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    aboutImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #9b59b6;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Footer year update
    const footerYear = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} College Club Management. All rights reserved.`;

    // Utility function to show team member modal
    function showMemberModal(name, role) {
        const modal = document.createElement('div');
        modal.className = 'team-member-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white; 
                padding: 2rem; 
                border-radius: 12px; 
                text-align: center;
                max-width: 400px;
                width: 90%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <h3 style="color: #9b59b6; margin-bottom: 10px;">${name}</h3>
                <p style="color: #666; margin-bottom: 20px;">${role}</p>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">
                    More information about ${name} would go here...
                </p>
                <button class="btn btn-primary close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 10);

        // Close modal functionality
        const closeModal = () => {
            modal.style.opacity = '0';
            modal.querySelector('div').style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals or menus
            const modals = document.querySelectorAll('.team-member-modal');
            modals.forEach(modal => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            });
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.textContent = '☰';
        }
    });

    // Add some interactive stats
    const statsSection = document.createElement('section');
    statsSection.className = 'stats-section';
    statsSection.style.cssText = `
        background: #f8f9fa;
        padding: 60px 0;
        text-align: center;
    `;
    
    statsSection.innerHTML = `
        <div class="container">
            <h2 style="margin-bottom: 40px; color: #9b59b6;">Our Impact</h2>
            <div class="stats-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 30px;
                max-width: 800px;
                margin: 0 auto;
            ">
                <div class="stat-item">
                    <div class="stat-number" style="
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: #9b59b6;
                        margin-bottom: 10px;
                    ">50+</div>
                    <div class="stat-label" style="color: #666;">Clubs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: #9b59b6;
                        margin-bottom: 10px;
                    ">3000+</div>
                    <div class="stat-label" style="color: #666;">Students</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: #9b59b6;
                        margin-bottom: 10px;
                    ">200+</div>
                    <div class="stat-label" style="color: #666;">Events</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" style="
                        font-size: 2.5rem;
                        font-weight: bold;
                        color: #9b59b6;
                        margin-bottom: 10px;
                    ">5+</div>
                    <div class="stat-label" style="color: #666;">Years</div>
                </div>
            </div>
        </div>
    `;

    // Insert stats section before footer
    document.querySelector('footer').parentNode.insertBefore(statsSection, document.querySelector('footer'));

    // Animate stats numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
        }, 30);
    });
});

// Add these styles to your CSS or create a new CSS file
const additionalStyles = `
/* Add to your existing CSS */
body.menu-open {
    overflow: hidden;
}

.nav-menu.active {
    display: flex !important;
    flex-direction: column;
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    height: calc(100vh - 80px);
    background: var(--white);
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.nav-menu.active li {
    margin: 1rem 0;
}

.scroll-to-top:hover {
    background: #8e44ad !important;
    transform: translateY(-2px);
}

.team-member-modal {
    backdrop-filter: blur(5px);
}

/* Loading state */
body:not(.loaded) * {
    transition: none !important;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus styles for keyboard navigation */
a:focus, button:focus {
    outline: 2px solid #9b59b6;
    outline-offset: 2px;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .scroll-to-top {
        bottom: 20px !important;
        right: 20px !important;
        width: 45px !important;
        height: 45px !important;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 20px !important;
    }
}
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', `<style>${additionalStyles}</style>`);