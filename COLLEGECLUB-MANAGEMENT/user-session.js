// User Session Management - Common across all pages
(function() {
    'use strict';

    // Check user login status on page load
    async function checkAndDisplayUserStatus() {
        // Try to read current user from server first, fall back to localStorage if server unavailable
        let currentUser = null;
        try {
            const response = await fetch('http://localhost:3000/currentUser');
            if (response && response.ok) {
                currentUser = await response.json();
            }
        } catch (error) {
            // server not available, will try localStorage below
        }

        // Fallback: read from localStorage if server didn't provide user
        if (!currentUser || !currentUser.name) {
            try {
                const stored = localStorage.getItem('user') || localStorage.getItem('currentUser');
                if (stored) {
                    currentUser = JSON.parse(stored);
                }
            } catch (e) {
                currentUser = null;
            }
        }

        // If we have a user, render the user menu in the same way as before
        if (currentUser && currentUser.name) {
            const userName = currentUser.name.split(' ')[0]; // Get first name
            const loginBtn = document.querySelector('.login-btn');
            const authButtons = document.querySelector('.auth-buttons');

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
    window.viewProfile = async function() {
        try {
            const response = await fetch('http://localhost:3000/currentUser');
            const currentUser = await response.json();
            if (currentUser && currentUser.name) {
                alert(`Profile Information:\n\nName: ${currentUser.name}\nEmail: ${currentUser.email}\n\nNote: Full profile page coming soon!`);
            }
        } catch (error) {
            alert('Unable to load profile information.');
        }
    };

    // Logout function
    window.logoutUser = async function() {
        if (!confirm('Are you sure you want to logout?')) return;

        // Clear server-side current user
        try {
            await fetch('http://localhost:3000/currentUser', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
        } catch (err) {
            // ignore errors
        }

        // Clear any client-side stored session
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('currentUser');
        } catch (e) {
            // ignore
        }

        // Reload the page to reset the UI
        window.location.reload();
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndDisplayUserStatus);
    } else {
        checkAndDisplayUserStatus();
    }
})();
