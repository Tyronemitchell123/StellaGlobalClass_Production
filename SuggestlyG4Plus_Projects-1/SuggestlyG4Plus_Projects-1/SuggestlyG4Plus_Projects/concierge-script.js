// ==========================================================================
// Veridian Private Concierge - Premium JavaScript Functionality
// ==========================================================================

// Browser API declarations
/* global localStorage, requestIdleCallback, IntersectionObserver,
   requestAnimationFrame, MutationObserver, FileReader, history,
   location, performance, alert, navigator */

// Logger Module - Centralized logging with chunked output
const Logger = {
  logs: [],
  maxLogSize: 100,

  log: function (category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      category,
      message,
      data
    };

    this.logs.push(logEntry);

    // Keep logs manageable
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // Console output with formatting
    console.log(`[${timestamp}] [${category.toUpperCase()}] ${message}`, data || '');

    // Store in localStorage for persistence
    this.persistLogs();
  },

  error: function (message, error = null) {
    this.log('error', message, error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null);
  },

  debug: function (message, data = null) {
    this.log('debug', message, data);
  },

  info: function (message, data = null) {
    this.log('info', message, data);
  },

  warn: function (message, data = null) {
    this.log('warn', message, data);
  },

  persistLogs: function () {
    try {
      localStorage.setItem('veridian_logs', JSON.stringify(this.logs.slice(-50))); // Keep last 50 logs
    } catch (e) {
      console.debug('Failed to persist logs:', e);
    }
  },

  getLogs: function (category = null) {
    if (category) {
      return this.logs.filter(log => log.category === category);
    }
    return [...this.logs];
  },

  clearLogs: function () {
    this.logs = [];
    localStorage.removeItem('veridian_logs');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Logger.info('Application', 'DOM Content Loaded - Initializing Veridian Private Concierge');

  // Performance optimization: Use requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initializeNonCriticalFeatures);
  } else {
    setTimeout(initializeNonCriticalFeatures, 100);
  }

  // Critical features that should run immediately
  initializeCriticalFeatures();
});

function initializeCriticalFeatures() {
  // Hide loading screen after page load
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 1000);

  // Mobile menu toggle - optimized with event delegation
  const mobileMenu = document.getElementById('mobileMenu');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link - using event delegation
    document.addEventListener('click', handleMobileMenuClose);
  }

  // Navbar scroll effect - Optimized with throttling and RAF
  const luxuryNav = document.querySelector('.luxury-nav');
  if (luxuryNav) {
    initializeNavbarScroll(luxuryNav);
  }

  // Smooth scrolling for navigation links - optimized with event delegation
  document.addEventListener('click', handleSmoothScroll);

  // Intersection Observer for fade-in animations - optimized
  initializeIntersectionObserver();
}

function initializeNonCriticalFeatures() {
  // Initialize neural network animations
  initializeNeuralNetwork();

  // Initialize hero metrics animation
  initializeHeroMetrics();

  // Initialize pricing card effects
  initializePricingCards();

  // Initialize service animations
  initializeServiceAnimations();

  // Initialize button effects
  initializeButtonEffects();

  // Initialize parallax effect
  initializeParallax();

  // Initialize form validation
  initializeFormValidation();

  // Initialize particle effects
  initializeParticleEffects();

  // Initialize keyboard navigation
  initializeKeyboardNavigation();

  // Initialize new features
  initializeLiveChat();
  initializeAdvancedAnalytics();
  initializeAccessibilityFeatures();
  initializePerformanceMonitoring();
  initializeTodoList();
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenu && navMenu) {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Announce to screen readers
        const isOpen = navMenu.classList.contains('active');
        mobileMenu.setAttribute('aria-expanded', isOpen);
        if (typeof announceToScreenReader === 'function') {
            announceToScreenReader(isOpen ? 'Mobile menu opened' : 'Mobile menu closed');
        }
    }
}

function handleMobileMenuClose(e) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navMenu && navMenu.classList.contains('active')) {
        const isLink = e.target.closest('.nav-link');
        const isOutside = !e.target.closest('.nav-menu') && !e.target.closest('#mobileMenu');

        if (isLink || isOutside) {
            navMenu.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

// Navbar scroll optimization
function initializeNavbarScroll(luxuryNav) {
    let ticking = false;
    let lastScroll = 0;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            luxuryNav.style.background = 'rgba(10, 10, 10, 0.98)';
            luxuryNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            luxuryNav.style.background = 'rgba(10, 10, 10, 0.95)';
            luxuryNav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

// Smooth scrolling optimization
function handleSmoothScroll(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update URL without reload
            if (history.pushState) {
                history.pushState(null, null, anchor.getAttribute('href'));
            }
        }
    }
}

// Intersection Observer optimization
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('section, .intelligence-card, .service-showcase-item, .pricing-card');
    elementsToObserve.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Neural network animation - Fixed and optimized
function initializeNeuralNetwork() {
    try {
        const nodes = document.querySelectorAll('.node');
        const connectionLines = document.querySelectorAll('.connection-line');

        if (nodes.length === 0 || connectionLines.length === 0) {
            return; // Silently return if elements don't exist
        }

        // Cache original styles for better performance
        const originalLineStyles = {
            background: 'rgba(212, 175, 55, 0.3)',
            boxShadow: 'none'
        };

        const hoverLineStyles = {
            background: 'rgba(212, 175, 55, 0.8)',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
        };

        const originalNodeStyles = {
            transform: 'scale(1)',
            boxShadow: 'none'
        };

        const hoverNodeStyles = {
            transform: 'scale(1.2)',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)'
        };

        nodes.forEach((node) => {
            if (!node) return;

            const handleMouseEnter = () => {
                // Highlight connected lines
                connectionLines.forEach(line => {
                    if (line && line.style) {
                        Object.assign(line.style, hoverLineStyles);
                    }
                });

                // Pulse effect on hovered node
                Object.assign(node.style, hoverNodeStyles);
            };

            const handleMouseLeave = () => {
                // Reset lines
                connectionLines.forEach(line => {
                    if (line && line.style) {
                        Object.assign(line.style, originalLineStyles);
                    }
                });

                // Reset node
                Object.assign(node.style, originalNodeStyles);
            };

            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        });
    } catch (error) {
        // Silently handle errors to avoid console noise
        console.debug('Neural network initialization skipped:', error.message);
    }
}

// Hero metrics animation - Fixed and optimized with better error handling
function initializeHeroMetrics() {
    function animateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics.length === 0) return;

        const activeAnimations = new Set();

        metrics.forEach(metric => {
            // Skip if already animated
            if (metric.dataset.animated === 'true') return;

            const finalValue = metric.textContent;
            if (!finalValue) return;

            const isPercentage = finalValue.includes('%');
            const isDollar = finalValue.includes('$');
            const isTime = finalValue.includes('ms');
            const isPlus = finalValue.includes('+');
            const isTrillion = finalValue.includes('T');

            let numericValue;
            try {
                if (isTrillion) {
                    numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, '')) * 1000;
                } else {
                    numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                }
            } catch (error) {
                console.debug('Failed to parse metric value:', finalValue);
                return;
            }

            // Handle non-numeric values
            if (isNaN(numericValue) || numericValue === 0) {
                return;
            }

            let currentValue = 0;
            const duration = 2000; // 2 seconds animation
            const startTime = performance.now();
            const animationId = Math.random().toString(36).substr(2, 9);

            const updateMetric = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Use easing function for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                currentValue = numericValue * easeOutQuart;

                let displayValue = Math.floor(currentValue);
                let formattedValue;

                if (isDollar) {
                    if (isTrillion) {
                        formattedValue = `$${(displayValue / 1000).toFixed(1)}T${isPlus ? '+' : ''}`;
                    } else {
                        formattedValue = `$${displayValue.toLocaleString()}${isPlus ? '+' : ''}`;
                    }
                } else if (isPercentage) {
                    formattedValue = `${displayValue}%`;
                } else if (isTime) {
                    formattedValue = `${displayValue}ms`;
                } else {
                    formattedValue = `${displayValue.toLocaleString()}${isPlus ? '+' : ''}`;
                }

                metric.textContent = formattedValue;

                if (progress < 1) {
                    const animationFrameId = requestAnimationFrame(updateMetric);
                    activeAnimations.add({ id: animationId, frameId: animationFrameId });
                } else {
                    metric.textContent = finalValue;
                    metric.dataset.animated = 'true';
                    activeAnimations.delete(animationId);
                }
            };

            const animationFrameId = requestAnimationFrame(updateMetric);
            activeAnimations.add({ id: animationId, frameId: animationFrameId });
            metric.dataset.animationId = animationId;
        });

        // Store active animations for cleanup
        window.activeMetricAnimations = activeAnimations;
    }

    // Trigger metrics animation when hero section is visible
    const heroSection = document.querySelector('.hero-luxury');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetrics();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });

        heroObserver.observe(heroSection);
        window.heroObserver = heroObserver;
    }
}

// Utility function for throttling (used in analytics)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// NEW FEATURE: Advanced analytics and user behavior tracking
function initializeAdvancedAnalytics() {
    // Track user interactions
    const trackEvent = async (eventName, additionalData = {}) => {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...additionalData
        };

        // Get API URL from environment or default to localhost
        const apiUrl = window.VERIDIAN_API_URL || 'http://localhost:8000';

        try {
            // Send to Veridian API
            await fetch(`${apiUrl}/api/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });
        } catch (error) {
            console.debug('Analytics tracking failed:', error);
            // Fallback to localStorage
            const analytics = JSON.parse(localStorage.getItem('veridian_analytics') || '[]');
            analytics.push(eventData);
            if (analytics.length > 100) {
                analytics.shift();
            }
            localStorage.setItem('veridian_analytics', JSON.stringify(analytics));
        }

        console.debug('Event tracked:', eventData);
    };

    // Track page views
    trackEvent('page_view', {
        title: document.title,
        referrer: document.referrer
    });

    // Track button clicks
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const buttonText = button.textContent.trim();
            const buttonClass = button.className;

            trackEvent('button_click', {
                buttonText,
                buttonClass,
                location: button.closest('section')?.id || 'unknown'
            });
        }
    });

    // Track form interactions
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('form_submission', {
                formId: 'contact_form',
                formFields: Array.from(contactForm.querySelectorAll('input, textarea, select')).map(field => field.name)
            });
        });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            trackEvent('scroll_depth', {
                depth: maxScrollDepth
            });
        }
    }, 1000);

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track time on page
    let timeOnPageInterval;
    if (performance && performance.timing) {
        timeOnPageInterval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
            trackEvent('time_on_page', {
                seconds: timeSpent
            });
        }, 30000); // Track every 30 seconds
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (timeOnPageInterval) {
            clearInterval(timeOnPageInterval);
        }
        if (performance && performance.timing) {
            trackEvent('page_exit', {
                timeOnPage: Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
            });
        }
    });

    // Make analytics available globally
    window.veridianAnalytics = {
        trackEvent,
        getEvents: () => JSON.parse(localStorage.getItem('veridian_analytics') || '[]'),
        clearEvents: () => localStorage.removeItem('veridian_analytics')
    };
}

// NEW FEATURE: Enhanced accessibility features
function initializeAccessibilityFeatures() {
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.remove();
            }
        }, 1000);
    }

    // Add screen reader only styles
    if (!document.querySelector('#sr-styles')) {
        const srStyles = document.createElement('style');
        srStyles.id = 'sr-styles';
        srStyles.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                :root {
                    --primary-gold: #ffd700;
                    --secondary-gold: #ffed4e;
                    --text-secondary: #ffffff;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }

            /* Focus indicators for keyboard navigation */
            .keyboard-navigation *:focus {
                outline: 3px solid var(--primary-gold) !important;
                outline-offset: 2px !important;
            }

            /* Skip to main content link */
            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary-gold);
                color: var(--primary-black);
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 0;
                z-index: 100;
            }

            .skip-link:focus {
                top: 0;
            }
        `;
        document.head.appendChild(srStyles);
    }

    // Add skip to main content link if not exists
    if (!document.querySelector('.skip-link')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#intelligence';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button:not([aria-label]), a:not([aria-label]):not([aria-labelledby]), [tabindex]:not([aria-label]):not([aria-labelledby])');
    interactiveElements.forEach(element => {
        const text = element.textContent.trim() || element.getAttribute('title') || '';
        if (text && !element.getAttribute('aria-label')) {
            element.setAttribute('aria-label', text);
        }
    });

    // Add landmark roles
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }

    const main = document.querySelector('main') || document.querySelector('.hero-luxury');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }

    // Make announcement function available globally
    window.announceToScreenReader = announceToScreenReader;

    // Detect and announce page changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            announceToScreenReader('Page content updated');
        }
    }).observe(document, { subtree: true, childList: true });
}

// NEW FEATURE: Performance monitoring
function initializePerformanceMonitoring() {
    // Performance metrics
    const metrics = {
        pageLoad: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,
        domReady: performance.timing ? performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart : 0,
        firstPaint: 0,
        firstContentfulPaint: 0
    };

    // Get paint timing metrics
    if (window.performance && window.performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                metrics.firstPaint = Math.round(entry.startTime);
            }
            if (entry.name === 'first-contentful-paint') {
                metrics.firstContentfulPaint = Math.round(entry.startTime);
            }
        });
    }

    // Monitor Core Web Vitals
    const vitals = {
        LCP: 0, // Largest Contentful Paint
        FID: 0, // First Input Delay
        CLS: 0  // Cumulative Layout Shift
    };

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.LCP = Math.round(lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.debug('LCP observer not supported');
        }

        // Observe First Input Delay
        try {
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    vitals.FID = Math.round(entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.debug('FID observer not supported');
        }

        // Observe Cumulative Layout Shift
        try {
            const clsObserver = new PerformanceObserver((entryList) => {
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        vitals.CLS += entry.value;
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.debug('CLS observer not supported');
        }
    }

    // Monitor memory usage
    const monitorMemory = () => {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            const memoryInfo = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
                percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };

            // Warn if memory usage is high
            if (memoryInfo.percentage > 80) {
                console.warn('High memory usage detected:', memoryInfo);
            }

            return memoryInfo;
        }
        return null;
    };

    // Monitor FPS (Frames Per Second)
    let fps = 60;
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
        frames++;
        const currentTime = performance.now();

        if (currentTime >= lastTime + 1000) {
            fps = Math.round((frames * 1000) / (currentTime - lastTime));
            frames = 0;
            lastTime = currentTime;

            // Warn if FPS is low
            if (fps < 30) {
                console.warn('Low FPS detected:', fps);
            }
        }

        requestAnimationFrame(measureFPS);
    };

    if ('requestAnimationFrame' in window) {
        requestAnimationFrame(measureFPS);
    }

    // Create performance dashboard (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const dashboard = document.createElement('div');
        dashboard.className = 'performance-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3>Performance Monitor</h3>
                <button class="dashboard-toggle" aria-label="Toggle performance dashboard">&times;</button>
            </div>
            <div class="dashboard-content">
                <div class="metric">
                    <span class="label">Page Load:</span>
                    <span class="value">${metrics.pageLoad}ms</span>
                </div>
                <div class="metric">
                    <span class="label">DOM Ready:</span>
                    <span class="value">${metrics.domReady}ms</span>
                </div>
                <div class="metric">
                    <span class="label">FPS:</span>
                    <span class="value" id="fps-value">${fps}</span>
                </div>
                <div class="metric">
                    <span class="label">Memory:</span>
                    <span class="value" id="memory-value">-</span>
                </div>
                <div class="metric">
                    <span class="label">LCP:</span>
                    <span class="value">${vitals.LCP || 'N/A'}ms</span>
                </div>
                <div class="metric">
                    <span class="label">FID:</span>
                    <span class="value">${vitals.FID || 'N/A'}ms</span>
                </div>
            </div>
        `;

        dashboard.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 250px;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid var(--primary-gold);
            border-radius: var(--radius-lg);
            color: var(--text-primary);
            font-family: var(--font-primary);
            font-size: 0.8rem;
            z-index: 9999;
            padding: 1rem;
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Add toggle functionality
        const toggleBtn = dashboard.querySelector('.dashboard-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isVisible = dashboard.style.transform === 'translateX(0%)';
                dashboard.style.transform = isVisible ? 'translateX(100%)' : 'translateX(0%)';
            });
        }

        // Update FPS and memory values in real-time
        const updateInterval = setInterval(() => {
            const fpsValue = document.getElementById('fps-value');
            const memoryValue = document.getElementById('memory-value');
            if (fpsValue) fpsValue.textContent = fps;
            if (memoryValue) {
                const memoryInfo = monitorMemory();
                if (memoryInfo) {
                    memoryValue.textContent = `${memoryInfo.used}MB / ${memoryInfo.percentage}%`;
                }
            }
        }, 1000);

        // Add dashboard to page
        document.body.appendChild(dashboard);

        // Cleanup on unload
        window.addEventListener('beforeunload', () => {
            clearInterval(updateInterval);
        });

        // Make performance data available globally
        window.performanceMonitor = {
            getMetrics: () => ({ ...metrics, ...vitals }),
            getMemoryInfo: monitorMemory,
            getFPS: () => fps
        };
    }
}

// NEW FEATURE: Live chat widget
function initializeLiveChat() {
    // Create chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.className = 'live-chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-header">
            <div class="chat-avatar">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="chat-info">
                <div class="chat-name">Elite Concierge</div>
                <div class="chat-status">Online</div>
            </div>
            <button class="chat-close" aria-label="Close chat">&times;</button>
        </div>
        <div class="chat-messages">
                <div class="message bot-message">
                    <i class="fas fa-crown"></i>
                    Welcome to Veridian Private Concierge. How may I assist you with your luxury lifestyle needs?
                </div>
        </div>
        <div class="chat-input">
            <input type="text" placeholder="Type your message..." aria-label="Chat message input">
            <button aria-label="Send message">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    `;

    // Add chat widget styles if not already added
    if (!document.querySelector('#chat-styles')) {
        const chatStyles = document.createElement('style');
        chatStyles.id = 'chat-styles';
        chatStyles.textContent = `
            .live-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: var(--primary-black);
                border: 1px solid var(--primary-gold);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-xl);
                display: flex;
                flex-direction: column;
                z-index: 10000;
                font-family: var(--font-primary);
                transform: translateY(100%);
                transition: transform 0.3s ease;
                overflow: hidden;
            }

            .live-chat-widget.active {
                transform: translateY(0);
            }

            .live-chat-widget .chat-header {
                background: var(--gradient-gold);
                color: var(--primary-black);
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            }

            .live-chat-widget .chat-avatar {
                width: 40px;
                height: 40px;
                background: var(--primary-black);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary-gold);
            }

            .live-chat-widget .chat-info {
                flex: 1;
            }

            .live-chat-widget .chat-name {
                font-weight: 600;
                font-size: 0.9rem;
            }

            .live-chat-widget .chat-status {
                font-size: 0.8rem;
                opacity: 0.8;
            }

            .live-chat-widget .chat-close {
                background: none;
                border: none;
                color: var(--primary-black);
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s ease;
            }

            .live-chat-widget .chat-close:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            .live-chat-widget .chat-messages {
                flex: 1;
                padding: 1rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .live-chat-widget .message {
                max-width: 80%;
                padding: 0.75rem;
                border-radius: var(--radius-md);
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .live-chat-widget .bot-message {
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                color: var(--text-secondary);
                align-self: flex-start;
            }

            .live-chat-widget .user-message {
                background: var(--gradient-gold);
                color: var(--primary-black);
                align-self: flex-end;
            }

            .live-chat-widget .chat-input {
                padding: 1rem;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
                display: flex;
                gap: 0.5rem;
            }

            .live-chat-widget .chat-input input {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: var(--radius-md);
                padding: 0.75rem;
                color: var(--text-primary);
                font-family: var(--font-primary);
            }

            .live-chat-widget .chat-input input:focus {
                outline: none;
                border-color: var(--primary-gold);
            }

            .live-chat-widget .chat-input button {
                background: var(--gradient-gold);
                color: var(--primary-black);
                border: none;
                border-radius: var(--radius-md);
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: transform 0.3s ease;
            }

            .live-chat-widget .chat-input button:hover {
                transform: scale(1.05);
            }

            .chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: var(--gradient-gold);
                border: none;
                border-radius: 50%;
                color: var(--primary-black);
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: var(--shadow-lg);
                z-index: 9999;
                transition: transform 0.3s ease;
                display: none;
                align-items: center;
                justify-content: center;
            }

            .chat-toggle:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(chatStyles);
    }

    // Add chat functionality
    const chatInput = chatWidget.querySelector('input');
    const sendButton = chatWidget.querySelector('button');
    const chatMessages = chatWidget.querySelector('.chat-messages');
    const closeButton = chatWidget.querySelector('.chat-close');

    // Predefined responses - Enhanced marketing-focused AI responses
    const responses = {
        'hello': 'Greetings! Welcome to Veridian Private Concierge, where elite lifestyle management meets cutting-edge AI. How may our senior concierge assist you today?',
        'pricing': 'Our exclusive membership tiers begin at $499/month for the Premium tier, offering unparalleled access to our AI-powered lifestyle optimization platform. Would you like me to detail the premium benefits of each tier?',
        'demo': 'I\'d be delighted to arrange a private, personalized demonstration of our AI-driven lifestyle management platform. Could you please share your preferred time and contact details for our senior concierge team?',
        'contact': 'Connect with our elite concierge specialists at concierge@veridianprivate.com or call +1 (888) VERIDIAN. Our AI-enhanced support team is available 24/7 for your luxury lifestyle needs.',
        'default': 'Thank you for reaching out. Our senior lifestyle management specialists, powered by advanced AI analytics, will respond to your inquiry within moments. Is there anything specific about our premium services you\'d like to explore?'
    };

    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = isUser ? escapeHtml(text) : `<i class="fas fa-crown"></i> ${escapeHtml(text)}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (typeof announceToScreenReader === 'function') {
            announceToScreenReader(isUser ? 'Message sent' : 'Response received');
        }
    }

    function getResponse(message) {
        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        return responses.default;
    }

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

            // Track analytics
            if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
            window.veridianAnalytics.trackEvent('chat_message_sent', { messageLength: message.length });
        }

        // Simulate typing delay
        setTimeout(() => {
            const response = getResponse(message);
            addMessage(response);
        }, 1000 + Math.random() * 2000);
    }

    // Event listeners
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            chatWidget.classList.remove('active');
            chatToggle.style.display = 'flex';
            if (typeof announceToScreenReader === 'function') {
                announceToScreenReader('Live chat closed');
            }
        });
    }

    // Add chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.className = 'chat-toggle';
    chatToggle.innerHTML = '<i class="fas fa-comments"></i>';
    chatToggle.setAttribute('aria-label', 'Open live chat');

    chatToggle.addEventListener('click', () => {
        chatWidget.classList.add('active');
        chatToggle.style.display = 'none';
        if (typeof announceToScreenReader === 'function') {
            announceToScreenReader('Live chat opened');
        }
    });

    // Add elements to page
    document.body.appendChild(chatWidget);
    document.body.appendChild(chatToggle);

    // Show chat toggle after 5 seconds
    setTimeout(() => {
        chatToggle.style.display = 'flex';
    }, 5000);
}

function initializePricingCards() {
    try {
        const pricingCards = document.querySelectorAll('.pricing-card');
        if (pricingCards.length === 0) {
            return; // Silently return if no cards found
        }

        pricingCards.forEach(card => {
            if (!card) return;

            const handleMouseEnter = () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.3)';
                card.style.borderColor = 'var(--primary-gold)';
            };

            const handleMouseLeave = () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                card.style.borderColor = 'rgba(212, 175, 55, 0.2)';
            };

            card.addEventListener('mouseenter', handleMouseEnter);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    } catch (error) {
        console.debug('Pricing cards initialization skipped:', error.message);
    }
}

// Service animations
function initializeServiceAnimations() {
    try {
        const serviceItems = document.querySelectorAll('.service-showcase-item');
        if (serviceItems.length === 0) {
            return;
        }

        serviceItems.forEach((item, index) => {
            if (!item) return;

            // Stagger animation
            item.style.animationDelay = `${index * 0.2}s`;
            item.classList.add('fade-in');
        });
    } catch (error) {
        console.debug('Service animations initialization skipped:', error.message);
    }
}

// Button effects
function initializeButtonEffects() {
    try {
        const buttons = document.querySelectorAll('.btn-primary-gold, .btn-secondary');
        if (buttons.length === 0) {
            return;
        }

        buttons.forEach(button => {
            if (!button) return;

            const handleMouseDown = () => {
                button.style.transform = 'scale(0.98)';
            };

            const handleMouseUp = () => {
                button.style.transform = '';
            };

            button.addEventListener('mousedown', handleMouseDown);
            button.addEventListener('mouseup', handleMouseUp);
            button.addEventListener('mouseleave', handleMouseUp);
        });
    } catch (error) {
        console.debug('Button effects initialization skipped:', error.message);
    }
}

// Parallax effect
function initializeParallax() {
    try {
        const parallaxElements = document.querySelectorAll('.floating-particles, .gradient-overlay');
        if (parallaxElements.length === 0) {
            return;
        }

        let ticking = false;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                if (element) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    } catch (error) {
        console.debug('Parallax initialization skipped:', error.message);
    }
}

// Form validation
function initializeFormValidation() {
    try {
        const contactForm = document.querySelector('.contact-form form');
        if (!contactForm) {
            return;
        }

        const nameInput = contactForm.querySelector('#fullName');
        const emailInput = contactForm.querySelector('#email');
        const assetsSelect = contactForm.querySelector('#assets');
        const messageTextarea = contactForm.querySelector('#message');

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showError(input, message) {
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: var(--error-red);
                font-size: 0.8rem;
                margin-top: 0.25rem;
                font-family: var(--font-primary);
            `;
            input.parentNode.appendChild(errorDiv);
            input.style.borderColor = 'var(--error-red)';
        }

        function clearError(input) {
            const error = input.parentNode.querySelector('.error-message');
            if (error) {
                error.remove();
            }
            input.style.borderColor = '';
        }

        function validateField(input) {
            clearError(input);

            if (!input.value.trim()) {
                showError(input, 'This field is required');
                return false;
            }

            if (input.type === 'email' && !validateEmail(input.value)) {
                showError(input, 'Please enter a valid email address');
                return false;
            }

            return true;
        }

        // Real-time validation
        [nameInput, emailInput, assetsSelect, messageTextarea].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    if (input.style.borderColor === 'rgb(255, 68, 68)') {
                        validateField(input);
                    }
                });
            }
        });

        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isValid = [nameInput, emailInput, assetsSelect, messageTextarea]
                .every(input => input && validateField(input));

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Get API URL from environment or default to localhost
                const apiUrl = window.VERIDIAN_API_URL || 'http://localhost:8000';

                try {
                    // Send to Veridian API
                    const response = await fetch(`${apiUrl}/api/contact`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: nameInput.value,
                            email: emailInput.value,
                            assets: assetsSelect.value,
                            message: messageTextarea.value
                        })
                    });

                    if (response.ok) {
                        submitBtn.textContent = 'Request Sent!';
                        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';

                        // Show success message
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.textContent = 'Thank you! Your request has been submitted. Our elite concierge team will contact you within 24 hours.';
                        contactForm.appendChild(successMessage);

                        // Reset form after 3 seconds
                        setTimeout(() => {
                            contactForm.reset();
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                            successMessage.remove();
                        }, 3000);
                    } else {
                        throw new Error('Failed to submit form');
                    }
                } catch (error) {
                    console.error('Form submission failed:', error);
                    submitBtn.textContent = 'Error - Try Again';
                    submitBtn.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';

                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Sorry, there was an error submitting your request. Please try again or contact us directly.';
                    errorMessage.style.cssText = `
                        color: var(--error-red);
                        font-size: 0.9rem;
                        margin-top: 1rem;
                        font-family: var(--font-primary);
                    `;
                    contactForm.appendChild(errorMessage);

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        errorMessage.remove();
                    }, 3000);
                }

            // Track form submission
            if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
                    window.veridianAnalytics.trackEvent('contact_form_submitted', {
                        name: nameInput.value,
                        email: emailInput.value,
                        assets: assetsSelect.value
                    });
                }
            }
        });
    } catch (error) {
        console.debug('Form validation initialization skipped:', error.message);
    }
}

// Particle effects
function initializeParticleEffects() {
    try {
        // Add subtle particle effects to hero background
        const heroBackground = document.querySelector('.animated-bg');
        if (!heroBackground) {
            return;
        }

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-gold);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            `;
            heroBackground.appendChild(particle);
        }

        // Add particle animation styles if not exists
        if (!document.querySelector('#particle-styles')) {
            const particleStyles = document.createElement('style');
            particleStyles.id = 'particle-styles';
            particleStyles.textContent = `
                @keyframes particleFloat {
                    0% { transform: translateY(0px) rotate(0deg); }
                    100% { transform: translateY(-100vh) rotate(360deg); }
                }
            `;
            document.head.appendChild(particleStyles);
        }
    } catch (error) {
        console.debug('Particle effects initialization skipped:', error.message);
    }
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    try {
        // Add keyboard navigation class to body
        document.body.classList.add('keyboard-navigation');

        // Focus management
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip links functionality
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    } catch (error) {
        console.debug('Keyboard navigation initialization skipped:', error.message);
    }
}

// Todo list functionality
function initializeTodoList() {
    try {
        const todoForm = document.querySelector('.todo-form');
        const todoInput = document.getElementById('todoInput');
        const todoCategory = document.getElementById('todoCategory');
        const todoPriority = document.getElementById('todoPriority');
        const todoList = document.getElementById('todoList');
        const todoEmptyState = document.getElementById('todoEmptyState');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const clearCompletedBtn = document.querySelector('.clear-completed');
        const todoCount = document.getElementById('todoCount');

        if (!todoForm || !todoInput || !todoList) {
            return;
        }

            let todos = JSON.parse(localStorage.getItem('veridian_todos') || '[]');
        let currentFilter = 'all';
        let currentSortBy = 'dueDate';

        function saveTodos() {
            localStorage.setItem('veridian_todos', JSON.stringify(todos));
        }

        function updateTodoCount() {
            const activeCount = todos.filter(todo => !todo.completed).length;
            const totalCount = todos.length;
            todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;
        }

        function renderTodos(filter = 'all', sortBy = 'dueDate') {
            todoList.innerHTML = '';

            let filteredTodos = todos;
            if (filter === 'active') {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (filter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            }

            // Sort todos based on selected criteria
            filteredTodos.sort((a, b) => {
                if (sortBy === 'priority') {
                    // Priority order: urgent > high > medium > low
                    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                    const aPriority = priorityOrder[a.priority] || 0;
                    const bPriority = priorityOrder[b.priority] || 0;
                    return bPriority - aPriority;
                } else if (sortBy === 'category') {
                    // Sort by category alphabetically
                    const aCategory = a.category || '';
                    const bCategory = b.category || '';
                    return aCategory.localeCompare(bCategory);
                } else {
                    // Default: Sort by due date: overdue first, then soonest, no date last
                    const aOverdue = a.dueDate ? isOverdue(a.dueDate) : false;
                    const bOverdue = b.dueDate ? isOverdue(b.dueDate) : false;

                    if (aOverdue !== bOverdue) {
                        return aOverdue ? -1 : 1;
                    }

                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;

                    const aDate = new Date(a.dueDate);
                    const bDate = new Date(b.dueDate);
                    return aDate - bDate;
                }
            });

            if (filteredTodos.length === 0) {
                todoEmptyState.style.display = 'block';
            } else {
                todoEmptyState.style.display = 'none';

                filteredTodos.forEach((todo, index) => {
                    const dueDateBadge = todo.dueDate ? `<span class="todo-due-date ${isOverdue(todo.dueDate) ? 'overdue' : ''}"><i class="fas fa-calendar-alt"></i> ${formatDueDate(todo.dueDate)}</span>` : '';
                    const todoItem = document.createElement('div');
                    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                    todoItem.innerHTML = `
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-index="${index}">
                        <div class="todo-content">
                            <div class="todo-text">${escapeHtml(todo.text)}</div>
                            <div class="todo-meta">
                                <span class="todo-category ${todo.category}">${todo.category}</span>
                                <span class="todo-priority ${todo.priority}">${todo.priority}</span>
                                ${dueDateBadge}
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button class="todo-btn edit" onclick="editTodo(${index})" aria-label="Edit task">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="todo-btn delete" onclick="deleteTodo(${index})" aria-label="Delete task">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    todoList.appendChild(todoItem);
                });
            }

            updateTodoCount();
            updateClearCompletedButton();
        }

        function updateClearCompletedButton() {
            const hasCompleted = todos.some(todo => todo.completed);
            clearCompletedBtn.style.display = hasCompleted ? 'inline-block' : 'none';
        }

        // AI Suggestions configuration - Enhanced marketing-focused suggestions for luxury lifestyle categories
        const aiSuggestions = {
            personal: [
                "Schedule family vacation planning with luxury travel specialists",
                "Update personal wardrobe with premium shopping consultation",
                "Book exclusive dining experiences at Michelin-starred restaurants",
                "Plan for special occasions and celebrations with event coordinators",
                "Arrange private wellness retreat and spa experiences"
            ],
            work: [
                "Prepare executive presentation with AI-powered design assistance",
                "Schedule team building event with luxury experience coordinators",
                "Update professional networking with elite business introductions",
                "Review work-life balance with personal productivity optimization",
                "Arrange executive transportation and logistics management"
            ],
            health: [
                "Schedule annual health checkup with concierge medical coordination",
                "Book private fitness training with elite personal trainers",
                "Plan wellness retreat with luxury spa and recovery services",
                "Arrange nutrition consultation with premium dietitians",
                "Schedule mental wellness and stress management sessions"
            ],
            travel: [
                "Plan luxury vacation with exclusive resort accommodations",
                "Book private jet transportation for business or leisure travel",
                "Arrange curated cultural experiences and local excursions",
                "Schedule luxury yacht charter and sailing experiences",
                "Organize adventure travel with premium safety and comfort"
            ],
            events: [
                "Plan exclusive private event with luxury venue coordination",
                "Book celebrity chef for private dinner party",
                "Arrange premium entertainment and performance bookings",
                "Coordinate corporate event with luxury hospitality services",
                "Schedule milestone celebration with personalized experience design"
            ],
            lifestyle: [
                "Review luxury home management and maintenance services",
                "Plan art acquisition and gallery consultation services",
                "Arrange premium vehicle fleet management and maintenance",
                "Schedule personal shopping and wardrobe styling sessions",
                "Book exclusive club memberships and access arrangements"
            ],
            dining: [
                "Book reservations at exclusive Michelin-starred restaurants",
                "Arrange private chef services for intimate dining experiences",
                "Schedule wine tasting with premium sommelier consultation",
                "Plan gourmet food tours and culinary experiences",
                "Organize private cooking classes with renowned chefs"
            ],
            culture: [
                "Book VIP access to exclusive cultural events and performances",
                "Arrange private museum tours with curator guidance",
                "Schedule premium theater and entertainment experiences",
                "Plan luxury art gallery visits and acquisition consultations",
                "Organize exclusive music festival and concert experiences"
            ],
            shopping: [
                "Schedule personal shopping with luxury brand consultants",
                "Arrange private viewings at exclusive designer boutiques",
                "Book premium tailoring and custom clothing services",
                "Plan luxury gift shopping and wrapping services",
                "Organize exclusive product launch and preview access"
            ],
            other: [
                "General lifestyle enhancement with personalized consultation",
                "Miscellaneous luxury service requiring expert coordination",
                "Ad-hoc premium experience with bespoke planning",
                "Other lifestyle management need requiring concierge support",
                "Schedule discovery call for Veridian Private Concierge services",
                "Ad-hoc financial planning activity with personalized strategy",
                "Other wealth-related responsibility needing concierge support",
                "Schedule discovery call for Veridian Private Concierge services"
            ]
        };

        // Create suggestions dropdown element
        const suggestionsDropdown = document.createElement('div');
        suggestionsDropdown.className = 'ai-suggestions-dropdown';
        suggestionsDropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            border: 1px solid var(--primary-gold);
            border-radius: var(--radius-md);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            box-shadow: var(--shadow-md);
        `;
        todoInput.parentNode.appendChild(suggestionsDropdown);

        function showSuggestions(category) {
            suggestionsDropdown.innerHTML = '';
            if (aiSuggestions[category] && aiSuggestions[category].length > 0) {
                aiSuggestions[category].forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'suggestion-item';
                    suggestionItem.textContent = suggestion;
                    suggestionItem.style.cssText = `
                        padding: 0.75rem 1rem;
                        cursor: pointer;
                        border-bottom: 1px solid rgba(212, 175, 55, 0.1);
                        transition: background 0.2s ease;
                    `;
                    suggestionItem.addEventListener('mouseenter', () => {
                        suggestionItem.style.background = 'rgba(212, 175, 55, 0.1)';
                    });
                    suggestionItem.addEventListener('mouseleave', () => {
                        suggestionItem.style.background = '';
                    });
                    suggestionItem.addEventListener('click', () => {
                        todoInput.value = suggestion;
                        suggestionsDropdown.style.display = 'none';
                        todoInput.focus();
                        // Track AI suggestion usage
                        if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
                            window.veridianAnalytics.trackEvent('ai_suggestion_used', { category, suggestion });
                        }
                        // Placeholder for future MCP integration
                        console.log('Future MCP AI integration: Generate dynamic suggestions via AI server');
                    });
                    suggestionsDropdown.appendChild(suggestionItem);
                });
                suggestionsDropdown.style.display = 'block';
            } else {
                suggestionsDropdown.style.display = 'none';
            }
        }

        function hideSuggestions() {
            suggestionsDropdown.style.display = 'none';
        }

        // Event listener for category change
        todoCategory.addEventListener('change', (e) => {
            const category = e.target.value;
            if (category && category !== 'other') {
                showSuggestions(category);
            } else {
                hideSuggestions();
            }
        });

        // Hide suggestions when typing in todo input
        todoInput.addEventListener('input', hideSuggestions);

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!todoInput.contains(e.target) && !suggestionsDropdown.contains(e.target) && !todoCategory.contains(e.target)) {
                hideSuggestions();
            }
        });

        function addTodo() {
            const text = todoInput.value.trim();
            const category = todoCategory.value;
            const priority = todoPriority.value;
            const dueDate = document.getElementById('todoDueDate').value;

            if (!text) return;

            todos.push({
                text,
                category,
                priority,
                dueDate: dueDate || null,
                completed: false,
                createdAt: new Date().toISOString()
            });

            saveTodos();
            renderTodos(currentFilter, currentSortBy);
            todoInput.value = '';
            document.getElementById('todoDueDate').value = '';
            todoCategory.value = 'personal'; // Reset to default
            hideSuggestions();
            todoInput.focus();

            // Track analytics
            if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
                window.veridianAnalytics.trackEvent('todo_added', { category, priority, hasDueDate: !!dueDate });
            }
        }

        function toggleTodo(index) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }

        function deleteTodo(index) {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }

        function clearCompleted() {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
        }

        function filterTodos(filter, clickedBtn) {
            currentFilter = filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            clickedBtn.classList.add('active');
            renderTodos(currentFilter, currentSortBy);
        }

        // Event listeners
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addTodo();
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filterTodos(filter, btn);
            });
        });

        clearCompletedBtn.addEventListener('click', clearCompleted);

        // Delegate todo item events
        todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                toggleTodo(index);
            }
        });

        // Define todo input section container
        const todoInputSection = document.querySelector('.todo-input-section') || todoForm.parentElement;

        // Add sorting section HTML
        const sortingSection = document.createElement('div');
        sortingSection.className = 'todo-sorting';
        sortingSection.innerHTML = `
            <button class="sort-btn active" data-sort="dueDate" aria-label="Sort by due date">Sort by Due Date</button>
            <button class="sort-btn" data-sort="priority" aria-label="Sort by priority">Sort by Priority</button>
            <button class="sort-btn" data-sort="category" aria-label="Sort by category">Sort by Category</button>
        `;
        if (todoInputSection) {
            todoInputSection.insertBefore(sortingSection, todoForm);
        }

        // Update sorting functionality
        currentSortBy = 'dueDate';
        const sortButtons = document.querySelectorAll('.sort-btn');

        function sortTodos(sortBy, clickedBtn) {
            currentSortBy = sortBy;
            sortButtons.forEach(btn => btn.classList.remove('active'));
            clickedBtn.classList.add('active');
            renderTodos(currentFilter, currentSortBy);
        }

        sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sortBy = btn.getAttribute('data-sort');
                sortTodos(sortBy, btn);
            });
        });

        // Add export/import section
        const exportImportSection = document.createElement('div');
        exportImportSection.className = 'todo-export-import';
        exportImportSection.innerHTML = `
            <button id="exportTodos" class="btn-export" aria-label="Export todos to JSON and CSV">
                <i class="fas fa-download"></i> Export Todos
            </button>
            <label for="importFile" class="btn-import" aria-label="Import todos from JSON or CSV">
                <i class="fas fa-upload"></i> Import Todos
            </label>
            <input type="file" id="importFile" accept=".json,.csv" style="display: none;">
        `;
        if (todoInputSection) {
            todoInputSection.appendChild(exportImportSection);
        }

        // Export function
        function exportTodos() {
            // Export JSON
            const jsonDataStr = JSON.stringify(todos, null, 2);
            const jsonBlob = new Blob([jsonDataStr], { type: 'application/json' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.download = 'veridian-private-concierge-todos.json';
            jsonLink.click();
            URL.revokeObjectURL(jsonUrl);

            // Export CSV with wealth-specific formatting
            let csvContent = 'Task,Category,Priority,Due Date\n';
            todos.forEach(todo => {
                const escapedTask = `"${(todo.text || '').replace(/"/g, '""')}"`;
                const category = todo.category || 'other';
                const priority = todo.priority || 'medium';
                const dueDate = todo.dueDate || '';
                csvContent += `${escapedTask},${category},${priority},"${dueDate}"\n`;
            });
            const csvBlob = new Blob([csvContent], { type: 'text/csv' });
            const csvUrl = URL.createObjectURL(csvBlob);
            const csvLink = document.createElement('a');
            csvLink.href = csvUrl;
            csvLink.download = 'veridian-private-concierge-todos.csv';
            csvLink.click();
            URL.revokeObjectURL(csvUrl);

            // Track export
            if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
                window.veridianAnalytics.trackEvent('todos_exported', { count: todos.length, formats: 'json,csv' });
            }

            if (window.announceToScreenReader) {
                window.announceToScreenReader('Todos exported as JSON and CSV');
            }
        }

        // Import function
        function handleImport(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    let importedTodos = [];
                    if (file.name.endsWith('.json')) {
                        importedTodos = JSON.parse(event.target.result);
                    } else if (file.name.endsWith('.csv')) {
                        const lines = event.target.result.split('\n').filter(line => line.trim());
                        if (lines.length > 1) {
                            for (let i = 1; i < lines.length; i++) {
                                const line = lines[i];
                                // Basic CSV parsing: split by comma, handle quoted fields simply
                                let fields = [];
                                let currentField = '';
                                let inQuotes = false;
                                for (let char of line) {
                                    if (char === '"') {
                                        inQuotes = !inQuotes;
                                    } else if (char === ',' && !inQuotes) {
                                        fields.push(currentField.trim().replace(/^"|"$/g, ''));
                                        currentField = '';
                                    } else {
                                        currentField += char;
                                    }
                                }
                                fields.push(currentField.trim().replace(/^"|"$/g, ''));

                                const [task, category, priority, dueDate] = fields;
                                if (task) {
                                    importedTodos.push({
                                        text: task,
                                        category: category || 'other',
                                        priority: priority || 'medium',
                                        dueDate: dueDate || null,
                                        completed: false,
                                        createdAt: new Date().toISOString()
                                    });
                                }
                            }
                        }
                    } else {
                        throw new Error('Unsupported file type. Please use JSON or CSV.');
                    }

                    // Merge: append to existing todos
                    if (importedTodos.length > 0) {
                        todos.push(...importedTodos);
                        saveTodos();
                        renderTodos(currentFilter, currentSortBy);
                        e.target.value = ''; // Reset file input

                        if (window.announceToScreenReader) {
                            window.announceToScreenReader(`${importedTodos.length} tasks imported and merged`);
                        }

                        if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
                            window.veridianAnalytics.trackEvent('todos_imported', {
                                count: importedTodos.length,
                                format: file.name.endsWith('.json') ? 'json' : 'csv'
                            });
                        }
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    alert('Failed to import file. Please check the format and try again.');
                }
            };
            reader.readAsText(file);
        }

        // Event listeners for export/import
        const exportBtn = document.getElementById('exportTodos');
        const importFile = document.getElementById('importFile');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportTodos);
        }
        if (importFile) {
            importFile.addEventListener('change', handleImport);
        }

        // Add styles for export/import buttons
        if (!document.querySelector('#export-import-styles')) {
            const styles = document.createElement('style');
            styles.id = 'export-import-styles';
            styles.textContent = `
                .todo-export-import {
                    display: flex;
                    gap: 0.5rem;
                    margin: 1rem 0;
                    justify-content: center;
                }
                .btn-export, .btn-import {
                    background: var(--gradient-gold);
                    color: var(--primary-black);
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-family: var(--font-primary);
                    font-size: 0.9rem;
                    transition: transform 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-export:hover, .btn-import:hover {
                    transform: scale(1.05);
                }
                .btn-import {
                    cursor: pointer;
                    background: var(--primary-gold);
                }
            `;
            document.head.appendChild(styles);
        }

        // Add edit modal HTML
        const editModal = document.createElement('div');
        editModal.className = 'edit-modal';
        editModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Task</h3>
                    <button class="close-modal" aria-label="Close edit modal">&times;</button>
                </div>
                <form class="modal-form">
                    <label for="editTodoText">Task Text</label>
                    <textarea id="editTodoText" rows="3" required></textarea>

                    <label for="editTodoCategory">Category</label>
                    <select id="editTodoCategory">
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="finance">Finance</option>
                        <option value="investment">Investment</option>
                        <option value="planning">Planning</option>
                        <option value="review">Review</option>
                        <option value="meeting">Meeting</option>
                        <option value="research">Research</option>
                        <option value="other">Other</option>
                    </select>

                    <label for="editTodoPriority">Priority</label>
                    <select id="editTodoPriority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    <label for="editTodoDueDate">Due Date</label>
                    <input type="date" id="editTodoDueDate">
                </form>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary cancel-edit">Cancel</button>
                    <button type="button" class="btn-primary-gold save-edit">Save Changes</button>
                </div>
            </div>
        `;
        document.body.appendChild(editModal);

        // Modal event listeners
        const closeModal = () => {
            editModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        editModal.querySelector('.close-modal').addEventListener('click', closeModal);
        editModal.querySelector('.cancel-edit').addEventListener('click', closeModal);

        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && editModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Initial render
        renderTodos(currentFilter, currentSortBy);

        // Make functions global for onclick handlers
        window.addTodo = addTodo;
        window.deleteTodo = deleteTodo;
        window.clearCompleted = clearCompleted;
        window.filterTodos = filterTodos;
        window.editTodo = (index) => {
            const todo = todos[index];
            const editModal = document.querySelector('.edit-modal');
            const editText = document.getElementById('editTodoText');
            const editCategory = document.getElementById('editTodoCategory');
            const editPriority = document.getElementById('editTodoPriority');
            const editDueDate = document.getElementById('editTodoDueDate');
            const saveBtn = document.querySelector('.save-edit');

            // Populate modal with current values
            editText.value = todo.text;
            editCategory.value = todo.category;
            editPriority.value = todo.priority;
            editDueDate.value = todo.dueDate || '';

            // Show modal
            editModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            editText.focus();

            // Handle save
            const handleSave = () => {
                const newText = editText.value.trim();
                const newCategory = editCategory.value;
                const newPriority = editPriority.value;
                const newDueDate = editDueDate.value;

                if (newText) {
                    todos[index].text = newText;
                    todos[index].category = newCategory;
                    todos[index].priority = newPriority;
                    todos[index].dueDate = newDueDate || null;
                    saveTodos();
                    renderTodos();
                }

                // Close modal
                editModal.classList.remove('active');
                document.body.style.overflow = '';

                // Remove event listener
                saveBtn.removeEventListener('click', handleSave);
            };

            // Add save event listener
            saveBtn.addEventListener('click', handleSave);

            // Handle Enter key in textarea
            editText.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                }
            });
        };
    } catch (error) {
        console.debug('Todo list initialization skipped:', error.message);
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to check if a due date is overdue
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

// Utility function to format due date for display
function formatDueDate(dueDate) {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Reset time for date comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Today';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}

// Request exclusive access functions
function requestExclusiveAccess() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus on name input
        const nameInput = document.getElementById('fullName');
        if (nameInput) {
            nameInput.focus();
        }
    }
}

function viewDemo() {
    // Placeholder for demo functionality
    alert('Private demo request submitted. Our team will contact you shortly.');
}

function openExclusiveAccess() {
    requestExclusiveAccess();
}

function selectMembership(tier) {
    // Store selected tier in localStorage
    localStorage.setItem('selectedMembership', tier);

    // Show confirmation
    alert(`Thank you for selecting the ${tier.charAt(0).toUpperCase() + tier.slice(1)} membership. Our concierge team will contact you within 24 hours to complete your application.`);

            // Track selection
            if (window.veridianAnalytics && window.veridianAnalytics.trackEvent) {
        window.veridianAnalytics.trackEvent('membership_selected', { tier });
    }
}

// Make functions global
window.requestExclusiveAccess = requestExclusiveAccess;
window.viewDemo = viewDemo;
window.openExclusiveAccess = openExclusiveAccess;
window.selectMembership = selectMembership;

// ==========================================================================
// PREMIUM PRODUCTION SERVER INTEGRATION
// ==========================================================================

// Production Server Manager - Handles automatic startup and monitoring
const ProductionServer = {
  isRunning: false,
  restartAttempts: 0,
  maxRestartAttempts: 3,
  healthCheckInterval: null,
  serverUrl: window.VERIDIAN_PROD_URL || 'http://localhost:8000',

  async start() {
    try {
      Logger.info('ProductionServer', 'Attempting to start premium production server...');

      // Check if server is already running
      const isHealthy = await this.healthCheck();
      if (isHealthy) {
        Logger.info('ProductionServer', 'Server is already running and healthy');
        this.isRunning = true;
        this.startHealthMonitoring();
        return true;
      }

      // Start server via API call or local process
      const response = await fetch(`${this.serverUrl}/api/server/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          environment: 'production',
          premium: true,
          autoStart: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        Logger.info('ProductionServer', 'Server started successfully', result);
        this.isRunning = true;
        this.restartAttempts = 0;
        this.startHealthMonitoring();
        this.showServerNotification('Server started successfully', 'success');
        return true;
      } else {
        throw new Error(`Server start failed: ${response.status}`);
      }
    } catch (error) {
      Logger.error('Failed to start production server:', error);
      this.handleServerFailure();
      return false;
    }
  },

  async healthCheck() {
    try {
      const response = await fetch(`${this.serverUrl}/api/health`, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        const health = await response.json();
        Logger.debug('ProductionServer', 'Health check passed', health);
        return health.status === 'healthy';
      }
      return false;
    } catch (error) {
      Logger.debug('ProductionServer', 'Health check failed', error.message);
      return false;
    }
  },

  startHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      const isHealthy = await this.healthCheck();
      if (!isHealthy && this.isRunning) {
        Logger.warn('ProductionServer', 'Server health check failed, attempting restart...');
        await this.restart();
      }
    }, 30000); // Check every 30 seconds
  },

  async restart() {
    if (this.restartAttempts >= this.maxRestartAttempts) {
      Logger.error('ProductionServer', 'Max restart attempts reached, stopping automatic restart');
      this.showServerNotification('Server restart failed. Please contact support.', 'error');
      return false;
    }

    this.restartAttempts++;
    Logger.info('ProductionServer', `Restart attempt ${this.restartAttempts}/${this.maxRestartAttempts}`);

    try {
      const response = await fetch(`${this.serverUrl}/api/server/restart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        Logger.info('ProductionServer', 'Server restarted successfully');
        this.restartAttempts = 0;
        this.showServerNotification('Server restarted successfully', 'success');
        return true;
      } else {
        throw new Error('Restart failed');
      }
    } catch (error) {
      Logger.error('ProductionServer', 'Server restart failed:', error);
      this.handleServerFailure();
      return false;
    }
  },

  handleServerFailure() {
    this.isRunning = false;
    this.showServerNotification('Production server unavailable. Running in degraded mode.', 'warning');

    // Switch to offline mode
    this.enableOfflineMode();
  },

  enableOfflineMode() {
    Logger.info('ProductionServer', 'Enabling offline mode');
    document.body.classList.add('offline-mode');

    // Show offline banner
    if (!document.querySelector('.offline-banner')) {
      const banner = document.createElement('div');
      banner.className = 'offline-banner';
      banner.innerHTML = `
        <div class="banner-content">
          <i class="fas fa-wifi-slash"></i>
          <span>Running in offline mode. Some features may be limited.</span>
          <button onclick="ProductionServer.start()" class="btn-reconnect">Reconnect</button>
        </div>
      `;

      // Add banner styles
      if (!document.querySelector('#offline-banner-styles')) {
        const styles = document.createElement('style');
        styles.id = 'offline-banner-styles';
        styles.textContent = `
          .offline-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 1rem;
            z-index: 10000;
            font-family: var(--font-primary);
            box-shadow: var(--shadow-lg);
          }

          .banner-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 1rem;
            justify-content: center;
          }

          .btn-reconnect {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-reconnect:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .offline-mode {
            filter: grayscale(0.5);
            opacity: 0.8;
          }
        `;
        document.head.appendChild(styles);
      }

      document.body.insertBefore(banner, document.body.firstChild);
    }
  },

  showServerNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `server-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="notification-close">&times;</button>
      </div>
    `;

    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .server-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: var(--primary-black);
          border: 1px solid var(--primary-gold);
          border-radius: var(--radius-lg);
          padding: 1rem;
          min-width: 300px;
          z-index: 10001;
          animation: slideIn 0.3s ease;
        }

        .server-notification.success {
          border-color: #4CAF50;
          background: rgba(76, 175, 80, 0.1);
        }

        .server-notification.error {
          border-color: #f44336;
          background: rgba(244, 67, 54, 0.1);
        }

        .server-notification.warning {
          border-color: #ff9800;
          background: rgba(255, 152, 0, 0.1);
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .notification-close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          margin-left: auto;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  },

  getAuthToken() {
    return localStorage.getItem('veridian_auth_token') || 'demo-token';
  },

  stop() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.isRunning = false;
    Logger.info('ProductionServer', 'Server monitoring stopped');
  }
};

// Enhanced Premium Features
const PremiumFeatures = {
  async initialize() {
    Logger.info('PremiumFeatures', 'Initializing premium features...');

    // Start production server automatically
    await ProductionServer.start();

    // Initialize premium analytics
    this.initializePremiumAnalytics();

    // Initialize AI-powered recommendations
    this.initializeAIRecommendations();

    // Initialize exclusive content
    this.initializeExclusiveContent();

    // Initialize premium support
    this.initializePremiumSupport();

    // Initialize advanced security
    this.initializeAdvancedSecurity();
  },

  initializePremiumAnalytics() {
    // Enhanced analytics for premium users
    const premiumTrackEvent = async (eventName, data = {}) => {
      const enhancedData = {
        ...data,
        userType: 'premium',
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      try {
        const response = await fetch(`${ProductionServer.serverUrl}/api/analytics/premium`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ProductionServer.getAuthToken()}`
          },
          body: JSON.stringify(enhancedData)
        });

        if (response.ok) {
          Logger.debug('PremiumFeatures', 'Premium analytics event tracked', enhancedData);
        }
      } catch (error) {
        Logger.debug('PremiumFeatures', 'Premium analytics tracking failed:', error.message);
      }
    };

    // Track premium user behavior
    premiumTrackEvent('premium_session_start', {
      entryPoint: window.location.href,
      referrer: document.referrer
    });

    // Make premium analytics available globally
    window.premiumAnalytics = {
      trackEvent: premiumTrackEvent,
      getSessionId: () => this.getSessionId()
    };
  },

  initializeAIRecommendations() {
    // AI-powered service recommendations
    const recommendationEngine = {
      async getRecommendations() {
        try {
          const response = await fetch(`${ProductionServer.serverUrl}/api/recommendations`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ProductionServer.getAuthToken()}`
            }
          });

          if (response.ok) {
            const recommendations = await response.json();
            this.displayRecommendations(recommendations);
          }
        } catch (error) {
          Logger.debug('PremiumFeatures', 'AI recommendations failed:', error.message);
        }
      },

      displayRecommendations(recommendations) {
        // Create recommendation widget
        const widget = document.createElement('div');
        widget.className = 'ai-recommendations';
        widget.innerHTML = `
          <div class="recommendations-header">
            <i class="fas fa-magic"></i>
            <h3>AI-Powered Recommendations</h3>
          </div>
          <div class="recommendations-list">
            ${recommendations.map(rec => `
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-${rec.icon}"></i>
                </div>
                <div class="recommendation-content">
                  <h4>${rec.title}</h4>
                  <p>${rec.description}</p>
                  <button class="btn-recommendation" data-action="${rec.action}">
                    ${rec.actionText}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        // Add styles
        if (!document.querySelector('#recommendation-styles')) {
          const styles = document.createElement('style');
          styles.id = 'recommendation-styles';
          styles.textContent = `
            .ai-recommendations {
              position: fixed;
              bottom: 100px;
              right: 20px;
              width: 350px;
              background: var(--primary-black);
              border: 1px solid var(--primary-gold);
              border-radius: var(--radius-lg);
              box-shadow: var(--shadow-xl);
              z-index: 9998;
              font-family: var(--font-primary);
              max-height: 400px;
              overflow-y: auto;
            }

            .recommendations-header {
              background: var(--gradient-gold);
              color: var(--primary-black);
              padding: 1rem;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            }

            .recommendations-header h3 {
              margin: 0;
              font-size: 1rem;
            }

            .recommendations-list {
              padding: 1rem;
            }

            .recommendation-item {
              display: flex;
              gap: 0.75rem;
              margin-bottom: 1rem;
              padding: 0.75rem;
              background: rgba(212, 175, 55, 0.05);
              border-radius: var(--radius-md);
            }

            .recommendation-icon {
              width: 40px;
              height: 40px;
              background: var(--gradient-gold);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: var(--primary-black);
            }

            .recommendation-content h4 {
              margin: 0 0 0.5rem 0;
              font-size: 0.9rem;
              color: var(--text-primary);
            }

            .recommendation-content p {
              margin: 0 0 0.75rem 0;
              font-size: 0.8rem;
              color: var(--text-secondary);
            }

            .btn-recommendation {
              background: var(--gradient-gold);
              color: var(--primary-black);
              border: none;
              padding: 0.5rem 1rem;
              border-radius: var(--radius-md);
              cursor: pointer;
              font-size: 0.8rem;
              transition: transform 0.2s ease;
            }

            .btn-recommendation:hover {
              transform: scale(1.05);
            }
          `;
          document.head.appendChild(styles);
        }

        document.body.appendChild(widget);

        // Handle recommendation actions
        widget.querySelectorAll('.btn-recommendation').forEach(btn => {
          btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            this.handleRecommendationAction(action);
          });
        });
      },

      handleRecommendationAction(action) {
        Logger.info('PremiumFeatures', 'Recommendation action triggered:', action);

        // Track recommendation interaction
        if (window.premiumAnalytics) {
          window.premiumAnalytics.trackEvent('recommendation_action', { action });
        }

        // Handle different actions
        switch (action) {
          case 'schedule_consultation':
            requestExclusiveAccess();
            break;
          case 'view_demo':
            viewDemo();
            break;
          case 'upgrade_membership':
            selectMembership('premium');
            break;
          default:
            Logger.debug('PremiumFeatures', 'Unknown recommendation action:', action);
        }
      }
    };

    // Get recommendations after a delay
    setTimeout(() => {
      recommendationEngine.getRecommendations();
    }, 5000);
  },

  initializeExclusiveContent() {
    // Load exclusive content for premium users
    const loadExclusiveContent = async () => {
      try {
        const response = await fetch(`${ProductionServer.serverUrl}/api/content/exclusive`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${ProductionServer.getAuthToken()}`
          }
        });

        if (response.ok) {
          const content = await response.json();
          this.displayExclusiveContent(content);
        }
      } catch (error) {
        Logger.debug('PremiumFeatures', 'Exclusive content loading failed:', error.message);
      }
    };

    // Load exclusive content
    loadExclusiveContent();
  },

  displayExclusiveContent(content) {
    // Add exclusive content sections to the page
    const mainContent = document.querySelector('main') || document.querySelector('.hero-luxury');
    if (!mainContent) return;

    const exclusiveSection = document.createElement('section');
    exclusiveSection.className = 'exclusive-content';
    exclusiveSection.innerHTML = `
      <div class="container">
        <h2 class="section-title">Exclusive Premium Content</h2>
        <div class="exclusive-grid">
          ${content.map(item => `
            <div class="exclusive-item">
              <div class="exclusive-header">
                <i class="fas fa-${item.icon}"></i>
                <h3>${item.title}</h3>
              </div>
              <p>${item.description}</p>
              <button class="btn-primary-gold" onclick="PremiumFeatures.accessExclusiveContent('${item.id}')">
                Access Content
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add styles
    if (!document.querySelector('#exclusive-content-styles')) {
      const styles = document.createElement('style');
      styles.id = 'exclusive-content-styles';
      styles.textContent = `
        .exclusive-content {
          padding: 4rem 0;
          background: rgba(212, 175, 55, 0.05);
        }

        .exclusive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
// ==========================================================================
// Veridian Private Concierge - Premium JavaScript Functionality
// ==========================================================================

// Browser API declarations
/* global localStorage, requestIdleCallback, IntersectionObserver,
   requestAnimationFrame, MutationObserver, FileReader, history,
   location, performance, alert, navigator */

// Logger Module - Centralized logging with chunked output
const Logger = {
  logs: [],
  maxLogSize: 100,

  log: function (category, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      category,
      message,
      data
    };

    this.logs.push(logEntry);

    // Keep logs manageable
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // Console output with formatting
    console.log(`[${timestamp}] [${category.toUpperCase()}] ${message}`, data || '');

    // Store in localStorage for persistence
    this.persistLogs();
  },

  error: function (message, error = null) {
    this.log('error', message, error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : null);
  },

  debug: function (message, data = null) {
    this.log('debug', message, data);
  },

  info: function (message, data = null) {
    this.log('info', message, data);
  },

  warn: function (message, data = null) {
    this.log('warn', message, data);
  },

  persistLogs: function () {
    try {
      localStorage.setItem('veridian_logs', JSON.stringify(this.logs.slice(-50))); // Keep last 50 logs
    } catch (e) {
      console.debug('Failed to persist logs:', e);
    }
  },

  getLogs: function (category = null) {
    if (category) {
      return this.logs.filter(log => log.category === category);
    }
    return [...this.logs];
  },

  clearLogs: function () {
    this.logs = [];
    localStorage.removeItem('veridian_logs');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Logger.info('Application', 'DOM Content Loaded - Initializing Veridian Private Concierge');

  // Performance optimization: Use requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initializeNonCriticalFeatures);
  } else {
    setTimeout(initializeNonCriticalFeatures, 100);
  }

  // Critical features that should run immediately
  initializeCriticalFeatures();
});

function initializeCriticalFeatures() {
  // Hide loading screen after page load
  setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 1000);

  // Mobile menu toggle - optimized with event delegation
  const mobileMenu = document.getElementById('mobileMenu');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on a link - using event delegation
    document.addEventListener('click', handleMobileMenuClose);
  }

  // Navbar scroll effect - Optimized with throttling and RAF
  const luxuryNav = document.querySelector('.luxury-nav');
  if (luxuryNav) {
    initializeNavbarScroll(luxuryNav);
  }

  // Smooth scrolling for navigation links - optimized with event delegation
  document.addEventListener('click', handleSmoothScroll);

  // Intersection Observer for fade-in animations - optimized
  initializeIntersectionObserver();
}

function initializeNonCriticalFeatures() {
  // Initialize neural network animations
  initializeNeuralNetwork();

  // Initialize hero metrics animation
  initializeHeroMetrics();

  // Initialize pricing card effects
  initializePricingCards();

  // Initialize service animations
  initializeServiceAnimations();

  // Initialize button effects
  initializeButtonEffects();

  // Initialize parallax effect
  initializeParallax();

  // Initialize form validation
  initializeFormValidation();

  // Initialize particle effects
  initializeParticleEffects();

  // Initialize keyboard navigation
  initializeKeyboardNavigation();

  // Initialize new features
  initializeLiveChat();
  initializeAdvancedAnalytics();
  initializeAccessibilityFeatures();
  initializePerformanceMonitoring();
  initializeTodoList();
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenu && navMenu) {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');

        // Announce to screen readers
        const isOpen = navMenu.classList.contains('active');
        mobileMenu.setAttribute('aria-expanded', isOpen);
        if (typeof announceToScreenReader === 'function') {
            announceToScreenReader(isOpen ? 'Mobile menu opened' : 'Mobile menu closed');
        }
    }
}

function handleMobileMenuClose(e) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navMenu && navMenu.classList.contains('active')) {
        const isLink = e.target.closest('.nav-link');
        const isOutside = !e.target.closest('.nav-menu') && !e.target.closest('#mobileMenu');

        if (isLink || isOutside) {
            navMenu.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-expanded', 'false');
            }
        }
    }
}

// Navbar scroll optimization
function initializeNavbarScroll(luxuryNav) {
    let ticking = false;
    let lastScroll = 0;

    function updateNavbar() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            luxuryNav.style.background = 'rgba(10, 10, 10, 0.98)';
            luxuryNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            luxuryNav.style.background = 'rgba(10, 10, 10, 0.95)';
            luxuryNav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

// Smooth scrolling optimization
function handleSmoothScroll(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update URL without reload
            if (history.pushState) {
                history.pushState(null, null, anchor.getAttribute('href'));
            }
        }
    }
}

// Intersection Observer optimization
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('section, .intelligence-card, .service-showcase-item, .pricing-card');
    elementsToObserve.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Neural network animation - Fixed and optimized
function initializeNeuralNetwork() {
    try {
        const nodes = document.querySelectorAll('.node');
        const connectionLines = document.querySelectorAll('.connection-line');

        if (nodes.length === 0 || connectionLines.length === 0) {
            return; // Silently return if elements don't exist
        }

        // Cache original styles for better performance
        const originalLineStyles = {
            background: 'rgba(212, 175, 55, 0.3)',
            boxShadow: 'none'
        };

        const hoverLineStyles = {
            background: 'rgba(212, 175, 55, 0.8)',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
        };

        const originalNodeStyles = {
            transform: 'scale(1)',
            boxShadow: 'none'
        };

        const hoverNodeStyles = {
            transform: 'scale(1.2)',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)'
        };

        nodes.forEach((node) => {
            if (!node) return;

            const handleMouseEnter = () => {
                // Highlight connected lines
                connectionLines.forEach(line => {
                    if (line && line.style) {
                        Object.assign(line.style, hoverLineStyles);
                    }
                });

                // Pulse effect on hovered node
                Object.assign(node.style, hoverNodeStyles);
            };

            const handleMouseLeave = () => {
                // Reset lines
                connectionLines.forEach(line => {
                    if (line && line.style) {
                        Object.assign(line.style, originalLineStyles);
                    }
                });

                // Reset node
                Object.assign(node.style, originalNodeStyles);
            };

            node.addEventListener('mouseenter', handleMouseEnter);
            node.addEventListener('mouseleave', handleMouseLeave);
        });
    } catch (error) {
        // Silently handle errors to avoid console noise
        console.debug('Neural network initialization skipped:', error.message);
    }
}

// Hero metrics animation - Fixed and optimized with better error handling
function initializeHeroMetrics() {
    function animateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        if (metrics.length === 0) return;

        const activeAnimations = new Set();

        metrics.forEach(metric => {
            // Skip if already animated
            if (metric.dataset.animated === 'true') return;

            const finalValue = metric.textContent;
            if (!finalValue) return;

            const isPercentage = finalValue.includes('%');
            const isDollar = finalValue.includes('$');
            const isTime = finalValue.includes('ms');
            const isPlus = finalValue.includes('+');
            const isTrillion = finalValue.includes('T');

            let numericValue;
            try {
                if (isTrillion) {
                    numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, '')) * 1000;
                } else {
                    numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
                }
            } catch (error) {
                console.debug('Failed to parse metric value:', finalValue);
                return;
            }

            // Handle non-numeric values
            if (isNaN(numericValue) || numericValue === 0) {
                return;
            }

            let currentValue = 0;
            const duration = 2000; // 2 seconds animation
            const startTime = performance.now();
            const animationId = Math.random().toString(36).substr(2, 9);

            const updateMetric = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Use easing function for smoother animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                currentValue = numericValue * easeOutQuart;

                let displayValue = Math.floor(currentValue);
                let formattedValue;

                if (isDollar) {
                    if (isTrillion) {
                        formattedValue = `$${(displayValue / 1000).toFixed(1)}T${isPlus ? '+' : ''}`;
                    } else {
                        formattedValue = `$${displayValue.toLocaleString()}${isPlus ? '+' : ''}`;
                    }
                } else if (isPercentage) {
                    formattedValue = `${displayValue}%`;
                } else if (isTime) {
                    formattedValue = `${displayValue}ms`;
                } else {
                    formattedValue = `${displayValue.toLocaleString()}${isPlus ? '+' : ''}`;
                }

                metric.textContent = formattedValue;

                if (progress < 1) {
                    const animationFrameId = requestAnimationFrame(updateMetric);
                    activeAnimations.add({ id: animationId, frameId: animationFrameId });
                } else {
                    metric.textContent = finalValue;
                    metric.dataset.animated = 'true';
                    activeAnimations.delete(animationId);
                }
            };

            const animationFrameId = requestAnimationFrame(updateMetric);
            activeAnimations.add({ id: animationId, frameId: animationFrameId });
            metric.dataset.animationId = animationId;
        });

        // Store active animations for cleanup
        window.activeMetricAnimations = activeAnimations;
    }

    // Trigger metrics animation when hero section is visible
    const heroSection = document.querySelector('.hero-luxury');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetrics();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });

        heroObserver.observe(heroSection);
        window.heroObserver = heroObserver;
    }
}

// Utility function for throttling (used in analytics)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// NEW FEATURE: Advanced analytics and user behavior tracking
function initializeAdvancedAnalytics() {
    // Track user interactions
    const trackEvent = async (eventName, additionalData = {}) => {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            ...additionalData
        };

        // Get API URL from environment or default to localhost
        const apiUrl = window.VERIDIAN_API_URL || 'http://localhost:8000';

        try {
            // Send to Veridian API
            await fetch(`${apiUrl}/api/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });
        } catch (error) {
            console.debug('Analytics tracking failed:', error);
            // Fallback to localStorage
            const analytics = JSON.parse(localStorage.getItem('veridian_analytics') || '[]');
            analytics.push(eventData);
            if (analytics.length > 100) {
                analytics.shift();
            }
            localStorage.setItem('veridian_analytics', JSON.stringify(analytics));
        }

        console.debug('Event tracked:', eventData);
    };

    // Track page views
    trackEvent('page_view', {
        title: document.title,
        referrer: document.referrer
    });

    // Track button clicks
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const buttonText = button.textContent.trim();
            const buttonClass = button.className;

            trackEvent('button_click', {
                buttonText,
                buttonClass,
                location: button.closest('section')?.id || 'unknown'
            });
        }
    });

    // Track form interactions
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('form_submission', {
                formId: 'contact_form',
                formFields: Array.from(contactForm.querySelectorAll('input, textarea, select')).map(field => field.name)
            });
        });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            trackEvent('scroll_depth', {
                depth: maxScrollDepth
            });
        }
    }, 1000);

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Track time on page
    let timeOnPageInterval;
    if (performance && performance.timing) {
        timeOnPageInterval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
            trackEvent('time_on_page', {
                seconds: timeSpent
            });
        }, 30000); // Track every 30 seconds
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (timeOnPageInterval) {
            clearInterval(timeOnPageInterval);
        }
        if (performance && performance.timing) {
            trackEvent('page_exit', {
                timeOnPage: Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
            });
        }
    });

    // Make analytics available globally
    window.veridianAnalytics = {
        trackEvent,
        getEvents: () => JSON.parse(localStorage.getItem('veridian_analytics') || '[]'),
        clearEvents: () => localStorage.removeItem('veridian_analytics')
    };
}

// NEW FEATURE: Enhanced accessibility features
function initializeAccessibilityFeatures() {
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.remove();
            }
        }, 1000);
    }

    // Add screen reader only styles
    if (!document.querySelector('#sr-styles')) {
        const srStyles = document.createElement('style');
        srStyles.id = 'sr-styles';
        srStyles.textContent = `
