// contact.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Form handling
    const contactForm = document.querySelector('.contact-form');
    const formNote = document.querySelector('.form-note');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }

    // FAQ accordion enhancement
    enhanceFAQAccordion();

    // Smooth scrolling for anchor links
    initSmoothScrolling();

    // Form auto-save functionality
    initFormAutoSave();

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
});

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage
        const submissionData = {
            ...Object.fromEntries(formData),
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        let contactSubmissions = JSON.parse(localStorage.getItem('campusConnectContacts') || '[]');
        contactSubmissions.push(submissionData);
        localStorage.setItem('campusConnectContacts', JSON.stringify(contactSubmissions));
        
        console.log('Form data saved:', submissionData);
        
        // Show success message
        showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'ok');
        
        // Reset form
        form.reset();
        clearFormAutoSave();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            clearFormMessage();
        }, 5000);
        
    }, 2000);
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Individual field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (if provided)
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Message should be at least 10 characters long';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        markFieldValid(field);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#d24a4a';
    field.style.boxShadow = '0 0 0 4px rgba(210, 74, 74, 0.12)';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'field-error';
        errorElement.style.color = '#d24a4a';
        errorElement.style.fontSize = '0.85rem';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '#e5e5e9';
    field.style.boxShadow = 'none';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Mark field as valid
function markFieldValid(field) {
    field.style.borderColor = '#1ea971';
    field.style.boxShadow = '0 0 0 4px rgba(30, 169, 113, 0.12)';
}

// Show form message
function showFormMessage(message, type = 'ok') {
    const formNote = document.querySelector('.form-note');
    if (formNote) {
        formNote.textContent = message;
        formNote.className = `form-note ${type}`;
        formNote.style.display = 'block';
    }
}

// Clear form message
function clearFormMessage() {
    const formNote = document.querySelector('.form-note');
    if (formNote) {
        formNote.textContent = '';
        formNote.style.display = 'none';
    }
}

// FAQ accordion enhancement
function enhanceFAQAccordion() {
    const faqDetails = document.querySelectorAll('.faq details');
    
    faqDetails.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                // Close other open details
                faqDetails.forEach(otherDetail => {
                    if (otherDetail !== this && otherDetail.open) {
                        otherDetail.open = false;
                    }
                });
                
                // Smooth scroll to opened FAQ
                this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}

// Smooth scrolling initialization
function initSmoothScrolling() {
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
}

// Form auto-save functionality
function initFormAutoSave() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    const storageKey = 'contactFormDraft';
    
    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input && input.type !== 'checkbox') {
                    input.value = data[key];
                } else if (input && input.type === 'checkbox') {
                    input.checked = data[key];
                }
            });
            
            // Show restore notification
            showFormMessage('Previous draft restored', 'ok');
            setTimeout(clearFormMessage, 3000);
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }
    
    // Auto-save on input
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveFormData, 1000));
        if (input.type === 'checkbox') {
            input.addEventListener('change', debounce(saveFormData, 1000));
        }
    });
    
    function saveFormData() {
        const formData = {};
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(formData));
    }
}

// Clear auto-saved form data
function clearFormAutoSave() {
    localStorage.removeItem('contactFormDraft');
}

// Phone number formatting
function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 5) {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        } else if (value.length <= 10) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5);
        } else {
            value = value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5, 10);
        }
    }
    
    input.value = value;
}

// Utility function: Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Social media link tracking
function initSocialMediaTracking() {
    const socialLinks = document.querySelectorAll('.info-list.social a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.textContent.trim();
            console.log(`Social media click: ${platform}`);
            // In real implementation, you might send this to analytics
        });
    });
}

// Map interaction tracking
function initMapTracking() {
    const mapIframe = document.querySelector('.map-embed iframe');
    if (mapIframe) {
        mapIframe.addEventListener('load', function() {
            console.log('Map loaded successfully');
        });
    }
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSocialMediaTracking();
    initMapTracking();
    
    // Add loading spinner styles
    if (!document.querySelector('#contact-spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'contact-spinner-styles';
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
});

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        handleFormSubmit,
        formatPhoneNumber
    };
}