// User Session Management - Common across all pages
(function() {
    'use strict';
    
    // Check user login status on page load
    function checkAndDisplayUserStatus() {
        const currentUser = localStorage.getItem('campusConnectCurrentUser');
        const loginBtn = document.querySelector('.login-btn');
        const authButtons = document.querySelector('.auth-buttons');
        
        if (currentUser) {
            const user = JSON.parse(currentUser);
            const userName = user.name.split(' ')[0]; // Get first name
            
            // Update login button
            if (loginBtn) {
                loginBtn.outerHTML = `
                    <div class="user-menu">
                        <span class="user-name">👤 ${userName}</span>
                        <div class="user-dropdown">
                            <a href="#" onclick="event.preventDefault(); viewProfile()">Profile</a>
                            <a href="#" onclick="event.preventDefault(); logoutUser()">Logout</a>
                        </div>
                    </div>
                `;
            }
            
            // Update auth buttons section if present
            if (authButtons) {
                authButtons.innerHTML = `
                    <div class="user-menu">
                        <span class="user-name">👤 ${userName}</span>
                        <div class="user-dropdown">
                            <a href="#" onclick="event.preventDefault(); viewProfile()">Profile</a>
                            <a href="#" onclick="event.preventDefault(); logoutUser()">Logout</a>
                        </div>
                    </div>
                `;
            }
            
            // Add user menu styles if not already added
            addUserMenuStyles();
        }
    }
    
    // Add user menu styles
    function addUserMenuStyles() {
        if (document.querySelector('#user-menu-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'user-menu-styles';
        style.textContent = `
            .user-menu {
                position: relative;
                display: inline-block;
            }
            .user-name {
                padding: 0.75rem 1.5rem;
                background: var(--primary, #6c5ce7);
                color: white;
                border-radius: 25px;
                font-weight: 500;
                cursor: pointer;
                display: inline-block;
                transition: all 0.3s ease;
            }
            .user-name:hover {
                background: var(--primary-dark, #5b4cdb);
                transform: translateY(-2px);
            }
            .user-dropdown {
                display: none;
                position: absolute;
                top: calc(100% + 5px);
                right: 0;
                background: white;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                border-radius: 10px;
                min-width: 150px;
                z-index: 1000;
                overflow: hidden;
            }
            .user-menu:hover .user-dropdown,
            .user-dropdown:hover {
                display: block;
                animation: dropdownFade 0.2s ease;
            }
            .user-menu::before {
                content: '';
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                height: 15px;
                z-index: 999;
            }
            @keyframes dropdownFade {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .user-dropdown a {
                display: block;
                padding: 0.75rem 1rem;
                color: var(--text-dark, #2d3436);
                text-decoration: none;
                transition: background 0.3s ease;
                font-size: 0.95rem;
            }
            .user-dropdown a:hover {
                background: var(--bg-light, #f8f9fa);
            }
            .user-dropdown a:not(:last-child) {
                border-bottom: 1px solid var(--border, #e5e5e9);
            }
        `;
        document.head.appendChild(style);
    }
    
    // View profile function
    window.viewProfile = function() {
        const currentUser = localStorage.getItem('campusConnectCurrentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            alert(`Profile Information:\n\nName: ${user.name}\nEmail: ${user.email}\n\nNote: Full profile page coming soon!`);
        }
    };
    
    // Logout function
    window.logoutUser = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('campusConnectCurrentUser');
            window.location.href = 'index.html';
        }
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndDisplayUserStatus);
    } else {
        checkAndDisplayUserStatus();
    }
})();
