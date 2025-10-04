 // ============================================
// VERIDIAN PRIVATE CONCIERGE - UNIFIED SCRIPT
// Premium AI-Powered Lifestyle Management
// ============================================

'use strict';

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeModal();
    initializeForms();
    initializeChatWidget();
    animateStats();
});

// ============================================
// NAVIGATION
// ============================================
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ============================================
// SCROLL EFFECTS
// ============================================
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and cards
    document.querySelectorAll('section, .service-card, .ai-feature-card, .membership-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// ANIMATIONS
// ============================================
function initializeAnimations() {
    // Animate stat numbers
    animateStats();

    // Add hover effects to cards
    document.querySelectorAll('.service-card, .ai-feature-card, .membership-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    const animateValue = (element, start, end, duration) => {
        const startTime = performance.now();
        const endValue = parseFloat(end);

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (endValue - start) * easeOutQuart;

            // Format the number
            if (end.includes('+')) {
                element.textContent = Math.floor(current) + '+';
            } else if (end.includes('%')) {
                element.textContent = current.toFixed(1) + '%';
            } else if (end.includes('/')) {
                element.textContent = end; // Keep as is for 24/7
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        };

        requestAnimationFrame(animate);
    };

    // Trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const finalValue = entry.target.textContent;
                entry.target.dataset.animated = 'true';
                animateValue(entry.target, 0, finalValue, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// ============================================
// MODAL
// ============================================
function initializeModal() {
    const modal = document.getElementById('modal');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const modalClose = modal?.querySelector('.modal-close');
    const requestAccessForm = document.getElementById('requestAccessForm');
    const signInForm = document.getElementById('signInForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');

    if (!modal) return;

    // Close modal handlers
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalOverlay?.addEventListener('click', closeModal);
    modalClose?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Handle form submission
    if (requestAccessForm) {
        requestAccessForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(requestAccessForm);
            const data = Object.fromEntries(formData);
            const submitBtn = requestAccessForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting...';

            try {
                const response = await fetch('/api/membership', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Submission failed.');
                showNotification(result.message, 'success');
                requestAccessForm.reset();
                setTimeout(closeModal, 2000);
            } catch (error) {
                showNotification(error.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Request';
            }
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signInForm);
            const data = Object.fromEntries(formData);
            const submitBtn = signInForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Signing In...';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Login failed.');

                showNotification('Login successful! Redirecting...', 'success');
                // On successful login, redirect to the user's profile/dashboard
                window.location.href = '/profile';
            } catch (error) {
                showNotification(error.message, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In';
            }
        });
    }

    // Make functions global
    window.openModal = (type) => {
        const modalTitle = document.getElementById('modalTitle');
        if (type === 'login') {
            modalTitle.textContent = 'Member Sign In';
            signInForm.style.display = 'block';
            requestAccessForm.style.display = 'none';
        } else {
            modalTitle.textContent = type === 'login' ? 'Sign In' : 'Request Exclusive Access';
            signInForm.style.display = 'none';
            requestAccessForm.style.display = 'block';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = closeModal;
}

// ============================================
// FORMS
// ============================================
function initializeForms() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                serviceInterest: formData.get('serviceInterest'),
                message: formData.get('message'),
                phone: formData.get('phone') || ''
            };

            // Validate form data
            if (!data.fullName || !data.email || !data.serviceInterest || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                // Determine API endpoint (try multiple options)
                const apiEndpoints = [
                    '/api/contact-form.php',  // PHP backend
                    'http://localhost:3001/api/contact',  // Node.js backend (development)
                    '/api/contact'  // Node.js backend (production)
                ];

                let response = null;
                let lastError = null;

                // Try each endpoint until one works
                for (const endpoint of apiEndpoints) {
                    try {
                        response = await fetch(endpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data)
                        });

                        if (response.ok) {
                            break; // Success, exit loop
                        }
                    } catch (error) {
                        lastError = error;
                        continue; // Try next endpoint
                    }
                }

                if (!response || !response.ok) {
                    throw new Error(lastError?.message || 'Failed to send message');
                }

                const result = await response.json();

                if (result.success) {
                    // Show success
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                    // Show success notification
                    showNotification(
                        result.message || 'Thank you for your inquiry! Our concierge team will contact you within 24 hours.',
                        'success'
                    );

                    // Log submission ID
                    if (result.submissionId) {
                        console.log('Submission ID:', result.submissionId);
                    }

                    // Reset form
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';

                // Show error notification
                showNotification(
                    'We apologize, but there was an error sending your message. Please try again or contact us directly at concierge@veridianprivate.com or call +1 (888) VERIDIAN.',
                    'error'
                );

                // Reset button
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 16px 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .notification-success {
                border-left: 4px solid #10b981;
            }

            .notification-error {
                border-left: 4px solid #ef4444;
            }

            .notification-info {
                border-left: 4px solid #3b82f6;
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .notification-content i {
                font-size: 20px;
            }

            .notification-success i {
                color: #10b981;
            }

            .notification-error i {
                color: #ef4444;
            }

            .notification-info i {
                color: #3b82f6;
            }

            .notification-content span {
                color: #333;
                font-size: 14px;
                line-height: 1.5;
            }

            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }

            .notification-close:hover {
                color: #333;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 8 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 8000);
}

// ============================================
// CHAT WIDGET
// ============================================
function initializeChatWidget() {
    const chatToggle = document.getElementById('chatToggle');

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            alert('Live chat feature coming soon! For immediate assistance, please call +1 (888) VERIDIAN or email concierge@veridianprivate.com');
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function selectMembership(tier) {
    console.log('Membership selected:', tier);
    localStorage.setItem('selectedMembership', tier);

    // Open modal with pre-selected tier
    const modal = document.getElementById('modal');
    const membershipSelect = document.getElementById('modal-membership');

    if (membershipSelect) {
        membershipSelect.value = tier;
    }

    if (typeof openModal === 'function') {
        openModal('request');
    }
}

// Make functions globally available
window.scrollToSection = scrollToSection;
window.selectMembership = selectMembership;

// ============================================
// PERFORMANCE MONITORING
// ============================================
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('Performance Metrics:');
            console.log('Page Load Time:', pageLoadTime + 'ms');
            console.log('Connect Time:', connectTime + 'ms');
            console.log('Render Time:', renderTime + 'ms');
        }, 0);
    });
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('✨ Veridian Private Concierge - Unified Script Loaded');
