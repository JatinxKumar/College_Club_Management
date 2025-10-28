// events.js

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Event registration functionality
    const registerButtons = document.querySelectorAll('.register-btn');
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.getAttribute('data-event');
            registerForEvent(eventName);
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Event card hover effects enhancement
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Filter functionality for events (can be extended)
    const filterEvents = (category) => {
        const events = document.querySelectorAll('.event-card');
        
        events.forEach(event => {
            if (category === 'all') {
                event.style.display = 'block';
            } else {
                const eventCategory = event.getAttribute('data-category');
                if (eventCategory === category) {
                    event.style.display = 'block';
                } else {
                    event.style.display = 'none';
                }
            }
        });
    };

    // Add event counter
    updateEventCounter();
});

// Event registration function
function registerForEvent(eventName) {
    // Check if user is logged in (simulated)
    const isLoggedIn = checkUserLogin();
    
    if (!isLoggedIn) {
        showLoginModal(eventName);
        return;
    }
    
    // Simulate API call to register for event
    showLoadingState(eventName);
    
    setTimeout(() => {
        // Simulate successful registration
        showRegistrationSuccess(eventName);
        
        // Update button state
        const buttons = document.querySelectorAll(`.register-btn[data-event="${eventName}"]`);
        buttons.forEach(button => {
            button.textContent = 'Registered ✓';
            button.classList.add('registered');
            button.disabled = true;
        });
        
        // Update event counter
        updateEventCounter();
    }, 1500);
}

// Check if user is logged in (simulated)
function checkUserLogin() {
    // In a real app, this would check authentication status
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Show login modal
function showLoginModal(eventName) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Login Required</h3>
            <p>Please log in to register for "${eventName}"</p>
            <div class="modal-buttons">
                <button class="btn btn-outline" id="cancel-registration">Cancel</button>
                <button class="btn btn-primary" id="go-to-login">Login</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
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
        }
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            position: relative;
        }
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
        }
        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners for modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#cancel-registration').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#go-to-login').addEventListener('click', () => {
        window.location.href = 'auth.html';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Show loading state
function showLoadingState(eventName) {
    const buttons = document.querySelectorAll(`.register-btn[data-event="${eventName}"]`);
    buttons.forEach(button => {
        const originalText = button.textContent;
        button.innerHTML = '<div class="loading-spinner"></div> Registering...';
        button.disabled = true;
        
        // Store original text for later use
        button.setAttribute('data-original-text', originalText);
    });
    
    // Add spinner styles
    const style = document.createElement('style');
    if (!document.querySelector('#spinner-styles')) {
        style.id = 'spinner-styles';
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show registration success message
function showRegistrationSuccess(eventName) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <span>✓ Successfully registered for "${eventName}"!</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles
    const style = document.createElement('style');
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }
            .notification.success {
                background: #27ae60;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Update event counter
function updateEventCounter() {
    const registeredEvents = document.querySelectorAll('.register-btn.registered').length;
    const totalEvents = document.querySelectorAll('.register-btn').length;
    
    // You could display this counter somewhere in the UI
    console.log(`Registered for ${registeredEvents} out of ${totalEvents} events`);
    
    // Example: Update a counter element if it exists
    const counterElement = document.querySelector('.event-counter');
    if (counterElement) {
        counterElement.textContent = `Registered: ${registeredEvents}/${totalEvents}`;
    }
}

// Search functionality for events
function initializeEventSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search events...';
    searchInput.className = 'event-search';
    
    const eventsSection = document.querySelector('.events-section');
    if (eventsSection) {
        eventsSection.insertBefore(searchInput, eventsSection.querySelector('.events-grid'));
        
        // Add search styles
        const style = document.createElement('style');
        style.textContent = `
            .event-search {
                width: 100%;
                max-width: 400px;
                padding: 12px 16px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                margin: 0 auto 30px;
                display: block;
                transition: border-color 0.3s ease;
            }
            .event-search:focus {
                outline: none;
                border-color: #9b59b6;
            }
        `;
        document.head.appendChild(style);
        
        // Search functionality
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const eventName = card.querySelector('h3').textContent.toLowerCase();
                const eventDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (eventName.includes(searchTerm) || eventDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventSearch();
    
    // Add any additional initialization here
    console.log('Events page loaded successfully');
});

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        registerForEvent,
        checkUserLogin,
        updateEventCounter
    };
}