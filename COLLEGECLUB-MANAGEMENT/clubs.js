// clubs.js - Corrected version

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // Mobile menu functionality
    if (mobileMenuBtn && navMenu) {
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
    }

    // Club card animations
    const clubCards = document.querySelectorAll('.club-card');
    
    const clubObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
                clubObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    clubCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';
        clubObserver.observe(card);
    });

    // Join club button functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        if (button.textContent.includes('Join Club')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const clubCard = this.closest('.club-card');
                const clubName = clubCard.querySelector('h3').textContent;
                const clubDescription = clubCard.querySelector('p').textContent;
                
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                
                if (!isLoggedIn) {
                    // Redirect to login page with return URL
                    window.location.href = 'auth.html?redirect=clubs.html&club=' + encodeURIComponent(clubName);
                    return;
                }

                // Show join confirmation
                showJoinConfirmation(clubName, clubDescription);
            });
        }
    });

    // Club card hover effects
    clubCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(108, 92, 231, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });

        // Add click to show more info
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-primary')) {
                const clubName = this.querySelector('h3').textContent;
                const clubDescription = this.querySelector('p').textContent;
                const clubImage = this.querySelector('img').src;
                showClubModal(clubName, clubDescription, clubImage);
            }
        });
    });

    // Search functionality
    function initSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            max-width: 500px;
            margin: 0 auto 40px;
            position: relative;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search clubs by name or description...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 20px;
            border: 2px solid var(--primary);
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
        `;

        const searchIcon = document.createElement('span');
        searchIcon.innerHTML = '🔍';
        searchIcon.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        `;

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        
        // Insert search after section title - FIXED SELECTOR
        const clubsSection = document.querySelector('.clubs');
        if (clubsSection) {
            const clubGrid = clubsSection.querySelector('.club-grid');
            if (clubGrid) {
                clubsSection.insertBefore(searchContainer, clubGrid);
            }
        }

        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterClubs(searchTerm);
        });

        searchIcon.addEventListener('click', function() {
            searchInput.focus();
        });
    }

    function filterClubs(searchTerm) {
        const clubCards = document.querySelectorAll('.club-card');
        let visibleCount = 0;

        clubCards.forEach(card => {
            const clubName = card.querySelector('h3').textContent.toLowerCase();
            const clubDescription = card.querySelector('p').textContent.toLowerCase();
            
            if (clubName.includes(searchTerm) || clubDescription.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                visibleCount++;
                
                // Re-animate visible cards
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Show no results message
        const existingMessage = document.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (visibleCount === 0 && searchTerm !== '') {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <h3>No clubs found</h3>
                <p>Try searching with different keywords</p>
            `;
            noResults.style.cssText = `
                text-align: center;
                padding: 40px;
                color: #666;
            `;
            const clubGrid = document.querySelector('.club-grid');
            if (clubGrid) {
                clubGrid.appendChild(noResults);
            }
        }
    }

    // Initialize search
    initSearch();

    // Category filtering
    function initCategoryFilter() {
        const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Literary'];
        const filterContainer = document.createElement('div');
        filterContainer.className = 'category-filter';
        filterContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        `;

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.className = 'filter-btn';
            if (category === 'All') {
                button.classList.add('active');
            }
            button.style.cssText = `
                padding: 8px 16px;
                border: 2px solid var(--primary);
                background: ${category === 'All' ? 'var(--primary)' : 'transparent'};
                color: ${category === 'All' ? 'white' : 'var(--primary)'};
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
            `;

            button.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--primary)';
                    btn.classList.remove('active');
                });

                // Add active class to clicked button
                this.style.background = 'var(--primary)';
                this.style.color = 'white';
                this.classList.add('active');

                filterByCategory(category);
            });

            filterContainer.appendChild(button);
        });

        // Insert filter after search - FIXED SELECTOR
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentElement('afterend', filterContainer);
        }
    }

    function filterByCategory(category) {
        const clubCards = document.querySelectorAll('.club-card');
        
        clubCards.forEach(card => {
            const clubName = card.querySelector('h3').textContent.toLowerCase();
            
            if (category === 'All' || clubName.includes(category.toLowerCase())) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Initialize category filter
    initCategoryFilter();

    // Utility functions
    function showJoinConfirmation(clubName, clubDescription) {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
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
                <h3 style="color: var(--primary); margin-bottom: 10px;">Join ${clubName}</h3>
                <p style="color: #666; margin-bottom: 20px;">${clubDescription}</p>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 20px;">
                    Are you sure you want to join this club? You'll receive updates about meetings and events.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-primary confirm-join">Yes, Join Club</button>
                    <button class="btn btn-outline cancel-join">Cancel</button>
                </div>
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
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        };

        modal.querySelector('.confirm-join').addEventListener('click', () => {
            // Store joined clubs in localStorage
            const joinedClubs = JSON.parse(localStorage.getItem('joinedClubs') || '[]');
            if (!joinedClubs.includes(clubName)) {
                joinedClubs.push(clubName);
                localStorage.setItem('joinedClubs', JSON.stringify(joinedClubs));
            }
            
            // Show success message
            showSuccessMessage(`Successfully joined ${clubName}!`);
            closeModal();
        });

        modal.querySelector('.cancel-join').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        const closeOnEscape = function(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    function showClubModal(clubName, clubDescription, clubImage) {
        const modal = document.createElement('div');
        modal.className = 'club-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
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
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <h3 style="color: var(--primary); margin: 0;">${clubName}</h3>
                    <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
                </div>
                <img src="${clubImage}" alt="${clubName}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
                <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">${clubDescription}</p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="color: var(--primary); margin-bottom: 10px;">Club Details</h4>
                    <p style="margin: 5px 0; color: #666;"><strong>Meeting Schedule:</strong> Weekly sessions</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Members:</strong> 50+ active students</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Activities:</strong> Workshops, competitions, social events</p>
                </div>
                <button class="btn btn-primary join-from-modal" style="width: 100%;">Join Club</button>
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
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.join-from-modal').addEventListener('click', () => {
            closeModal();
            showJoinConfirmation(clubName, clubDescription);
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on escape key
        const closeOnEscape = function(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    function showSuccessMessage(message) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (successMessage.parentNode) {
                    document.body.removeChild(successMessage);
                }
            }, 300);
        }, 3000);
    }

    // Loading state
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const modals = document.querySelectorAll('.confirmation-modal, .club-modal');
            modals.forEach(modal => {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
            });
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.textContent = '☰';
            }
        }
    });

    // Check URL parameters for auto-join
    function checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const autoJoinClub = urlParams.get('club');
        const fromLogin = urlParams.get('fromLogin');
        
        if (autoJoinClub && fromLogin === 'true') {
            // Find and auto-join the club
            const clubCards = document.querySelectorAll('.club-card');
            clubCards.forEach(card => {
                const clubName = card.querySelector('h3').textContent;
                if (clubName === autoJoinClub) {
                    const clubDescription = card.querySelector('p').textContent;
                    showJoinConfirmation(clubName, clubDescription);
                    
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            });
        }
    }

    // Run URL parameter check
    checkURLParameters();
});

// Add CSS styles for the JavaScript functionality
const clubsStyles = `
/* Add to your existing clubs.css */

/* Search and filter styles */
.search-input:focus {
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.filter-btn:hover {
    background: var(--primary) !important;
    color: white !important;
}

/* Modal animations */
.confirmation-modal, .club-modal {
    backdrop-filter: blur(5px);
}

/* Success message animations */
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

/* Loading state */
body:not(.loaded) * {
    transition: none !important;
}

/* Mobile menu styles */
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
    background: white;
    padding: 2rem;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.nav-menu.active li {
    margin: 1rem 0;
}

/* Accessibility */
.btn:focus, 
.filter-btn:focus,
.search-input:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .category-filter {
        gap: 5px !important;
    }
    
    .filter-btn {
        padding: 6px 12px !important;
        font-size: 0.9rem !important;
    }
    
    .search-input {
        padding: 10px 15px !important;
    }
}

/* Club card enhancements */
.club-card {
    cursor: pointer;
    transition: all 0.3s ease !important;
}

.club-card:hover {
    transform: translateY(-5px) scale(1.02) !important;
}

/* No results styling */
.no-results h3 {
    color: var(--primary);
    margin-bottom: 10px;
}

.no-results p {
    color: #666;
}
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', `<style>${clubsStyles}</style>`);