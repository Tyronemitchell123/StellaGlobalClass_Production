/*
 * Suggestly & Veridian Design System
 * Shared JavaScript Utilities
 */

// Utility Functions
const DSUtils = {
  // DOM Utilities
  getElement: (selector) => document.querySelector(selector),
  getElements: (selector) => document.querySelectorAll(selector),
  
  // Class Utilities
  addClass: (element, className) => element.classList.add(className),
  removeClass: (element, className) => element.classList.remove(className),
  toggleClass: (element, className) => element.classList.toggle(className),
  hasClass: (element, className) => element.classList.contains(className),
  
  // Event Utilities
  on: (element, event, handler) => element.addEventListener(event, handler),
  off: (element, event, handler) => element.removeEventListener(event, handler),
  once: (element, event, handler) => {
    element.addEventListener(event, handler, { once: true });
  },
  
  // Animation Utilities
  animate: (element, keyframes, options) => element.animate(keyframes, options),
  
  // Style Utilities
  setStyle: (element, property, value) => element.style.setProperty(property, value),
  getStyle: (element, property) => getComputedStyle(element).getPropertyValue(property),
  
  // Data Utilities
  setData: (element, key, value) => element.dataset[key] = value,
  getData: (element, key) => element.dataset[key],
  
  // Form Utilities
  serializeForm: (form) => new FormData(form),
  formDataToObject: (formData) => Object.fromEntries(formData),
  
  // Array Utilities
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // String Utilities
  slugify: (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },
  
  truncate: (text, length, suffix = '...') => {
    if (text.length <= length) return text;
    return text.substring(0, length) + suffix;
  },
  
  // URL Utilities
  getQueryParam: (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  updateQueryParam: (param, value) => {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },
  
  // Storage Utilities
  storage: {
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: (key) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
  },
  
  // Cookie Utilities
  cookies: {
    set: (name, value, days = 7) => {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = `expires=${date.toUTCString()}`;
      document.cookie = `${name}=${value};${expires};path=/`;
    },
    get: (name) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    remove: (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  },
  
  // Device Detection
  device: {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: () => /Android/.test(navigator.userAgent)
  },
  
  // Theme Management
  theme: {
    set: (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      DSUtils.storage.set('theme', theme);
    },
    get: () => {
      return DSUtils.storage.get('theme') || 'light';
    },
    toggle: () => {
      const current = DSUtils.theme.get();
      const newTheme = current === 'light' ? 'dark' : 'light';
      DSUtils.theme.set(newTheme);
    },
    init: () => {
      const savedTheme = DSUtils.theme.get();
      if (savedTheme) {
        DSUtils.theme.set(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        DSUtils.theme.set('dark');
      }
    }
  },
  
  // Navigation Management
  nav: {
    toggleMobileMenu: (menuId, buttonId) => {
      const menu = DSUtils.getElement(menuId);
      const button = DSUtils.getElement(buttonId);
      
      if (menu && button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        DSUtils.toggleClass(menu, 'open');
      }
    },
    
    closeMobileMenu: (menuId, buttonId) => {
      const menu = DSUtils.getElement(menuId);
      const button = DSUtils.getElement(buttonId);
      
      if (menu && button) {
        button.setAttribute('aria-expanded', 'false');
        DSUtils.removeClass(menu, 'open');
      }
    },
    
    setActiveNavLink: (links, currentPath) => {
      links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          DSUtils.addClass(link, 'active');
        } else {
          DSUtils.removeClass(link, 'active');
        }
      });
    }
  },
  
  // Form Validation
  validation: {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value, min) => value.length >= min,
    maxLength: (value, max) => value.length <= max,
    phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
    
    validateForm: (form, rules) => {
      const formData = DSUtils.formDataToObject(DSUtils.serializeForm(form));
      const errors = {};
      
      Object.keys(rules).forEach(field => {
        const value = formData[field];
        const fieldRules = rules[field];
        
        fieldRules.forEach(rule => {
          if (typeof rule === 'function') {
            const result = rule(value);
            if (result !== true) {
              errors[field] = result;
            }
          } else if (typeof rule === 'object') {
            const { validator, message } = rule;
            if (!validator(value)) {
              errors[field] = message;
            }
          }
        });
      });
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  },
  
  // API Utilities
  api: {
    get: async (url, options = {}) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API GET error:', error);
        throw error;
      }
    },
    
    post: async (url, data, options = {}) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: JSON.stringify(data),
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API POST error:', error);
        throw error;
      }
    },
    
    put: async (url, data, options = {}) => {
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          body: JSON.stringify(data),
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API PUT error:', error);
        throw error;
      }
    },
    
    delete: async (url, options = {}) => {
      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API DELETE error:', error);
        throw error;
      }
    }
  },
  
  // Performance Monitoring
  performance: {
    mark: (name) => performance.mark(name),
    measure: (name, startMark, endMark) => {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name);
      return measures[0];
    },
    clearMarks: () => performance.clearMarks(),
    clearMeasures: () => performance.clearMeasures()
  },
  
  // Accessibility Utilities
  a11y: {
    trapFocus: (container) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };
      
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    },
    
    announceToScreenReader: (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.setAttribute('aria-hidden', 'false');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSUtils;
} else if (typeof window !== 'undefined') {
  window.DSUtils = DSUtils;
}
