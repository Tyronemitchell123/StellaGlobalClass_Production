/**
 * Veridian Private Concierge - Interactive JavaScript
 * Premium User Experience with Smooth Animations and Interactions
 */

class ConciergeInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeAnimations();
    this.setupScrollEffects();
    this.initializeModals();
    this.setupFormValidation();
    this.initializeParticles();
    this.setupIntersectionObserver();
    this.setupTodoList();
    this.hideLoadingScreen();
  }

  bindEvents() {
    // Navigation
    this.setupNavigation();

    // Buttons
    this.setupButtons();

    // Forms
    this.setupForms();

    // Scroll effects
    this.setupScrollToTop();

    // Keyboard navigation
    this.setupKeyboardNavigation();
  }

  setupNavigation() {
    const nav = document.querySelector('.luxury-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky navigation with backdrop blur
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }

      lastScrollY = currentScrollY;
    });

    // Smooth scroll navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupButtons() {
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary-large, .btn-primary');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.classList.contains('booking-trigger')) {
          e.preventDefault();
          this.openBookingModal();
        }
      });
    });

    // Modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        this.openModal(modalId);
      });
    });
  }

  setupForms() {
    const forms = document.querySelectorAll('.booking-form, .contact-form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    });
  }

  setupScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
    });

    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }

      // Tab navigation for accessibility
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });
  }

  initializeAnimations() {
    // Add animation classes to elements
    this.addAnimationClasses();

    // Initialize counter animations
    this.initializeCounters();

    // Initialize progress bars
    this.initializeProgressBars();
  }

  addAnimationClasses() {
    // Hero section animations
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
      heroContent.classList.add('animate-fade-in-left');
    }

    if (heroVisual) {
      heroVisual.classList.add('animate-fade-in-right');
    }

    // Service cards stagger animation
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      card.classList.add('animate-fade-in-up', `stagger-${(index % 6) + 1}`);
    });

    // Trust items animation
    const trustItems = document.querySelectorAll('.trust-item');
    trustItems.forEach((item, index) => {
      item.classList.add('animate-scale-in', `stagger-${(index % 4) + 1}`);
    });
  }

  initializeCounters() {
    const counters = document.querySelectorAll('.counter-number');

    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width || '100%';
        }
      });
    });

    progressBars.forEach(bar => {
      progressObserver.observe(bar);
    });
  }

  setupScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.concierge-hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }

    // Smooth reveal animations
    this.setupScrollReveal();
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  initializeModals() {
    // Create modal containers
    this.createModals();

    // Setup modal event listeners
    this.setupModalEvents();
  }

  createModals() {
    const bookingModal = `
      <div id="booking-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Book Your Service</h3>
            <button class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="modal-body">
            <form class="booking-form">
              <div class="form-section">
                <h4>Select Service</h4>
                <div class="service-selection">
                  <label class="service-option">
                    <input type="radio" name="service" value="concierge" checked>
                    <div class="option-content">
                      <span class="option-icon">🏛️</span>
                      <div class="option-text">
                        <div class="option-title">Personal Concierge</div>
                        <div class="option-desc">Complete personal assistance services</div>
                      </div>
                    </div>
                  </label>
                  <label class="service-option">
                    <input type="radio" name="service" value="chauffeur">
                    <div class="option-content">
                      <span class="option-icon">🚗</span>
                      <div class="option-text">
                        <div class="option-title">Chauffeur Service</div>
                        <div class="option-desc">Professional transportation services</div>
                      </div>
                    </div>
                  </label>
                  <label class="service-option">
                    <input type="radio" name="service" value="security">
                    <div class="option-content">
                      <span class="option-icon">🛡️</span>
                      <div class="option-text">
                        <div class="option-title">Security Services</div>
                        <div class="option-desc">Comprehensive security solutions</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="first-name">First Name</label>
                  <input type="text" id="first-name" name="firstName" required>
                </div>
                <div class="form-group">
                  <label for="last-name">Last Name</label>
                  <input type="text" id="last-name" name="lastName" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                  <label for="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" required>
                </div>
              </div>

              <div class="form-group">
                <label for="date">Preferred Date</label>
                <input type="date" id="date" name="date" required>
              </div>

              <div class="form-group">
                <label for="message">Additional Details</label>
                <textarea id="message" name="message" rows="4" placeholder="Please describe your specific needs..."></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="conciergeInteractions.closeAllModals()">Cancel</button>
                <button type="submit" class="btn-primary">Book Service</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bookingModal);
  }

  setupModalEvents() {
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.closeAllModals();
      });
    });

    // Click outside modal to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  openBookingModal() {
    this.openModal('booking-modal');
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';

      // Focus management
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      modal.classList.remove('show');
    });
    document.body.style.overflow = '';
  }

  setupFormValidation() {
    // Custom validation rules
    this.validationRules = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      date: (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
    };
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    // Type-specific validation
    if (value && this.validationRules[field.type]) {
      if (typeof this.validationRules[field.type] === 'function') {
        isValid = this.validationRules[field.type](value);
        errorMessage = isValid ? '' : `Please enter a valid ${field.type}`;
      } else {
        isValid = this.validationRules[field.type].test(value);
        errorMessage = isValid ? '' : `Please enter a valid ${field.type}`;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    let errorElement = field.parentNode.querySelector('.field-error');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate all fields
    const fields = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      this.showNotification('Thank you! Your booking request has been submitted. We will contact you within 24 hours.', 'success');
      this.closeAllModals();
      form.reset();

      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    }, 5000);

    // Close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 500);
    });
  }

  initializeParticles() {
    // Create floating particles for hero section
    const hero = document.querySelector('.concierge-hero');
    if (hero) {
      const particlesContainer = document.createElement('div');
      particlesContainer.className = 'particles';

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
      }

      hero.appendChild(particlesContainer);
    }
  }

  setupIntersectionObserver() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      import('https://unpkg.com/web-vitals@3.1.1/dist/web-vitals.es5.min.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }

  handleTabNavigation(e) {
    const modal = document.querySelector('.modal.show');
    if (modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }

  // Todo List Management
  setupTodoList() {
    this.todos = JSON.parse(localStorage.getItem('conciergeTodos')) || [];
    this.currentFilter = 'all';
    this.currentSort = 'dueDate';

    this.renderTodos();
    this.updateTodoStats();
  }

  addTodo() {
    const input = document.getElementById('todoInput');
    const category = document.getElementById('todoCategory');
    const priority = document.getElementById('todoPriority');
    const dueDate = document.getElementById('todoDueDate');

    if (!input.value.trim()) return;

    const todo = {
      id: Date.now(),
      text: input.value.trim(),
      category: category.value,
      priority: priority.value,
      dueDate: dueDate.value,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.unshift(todo);
    this.saveTodos();
    this.renderTodos();
    this.updateTodoStats();

    // Clear form
    input.value = '';
    dueDate.value = '';
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.renderTodos();
      this.updateTodoStats();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.renderTodos();
    this.updateTodoStats();
  }

  filterTodos(filter) {
    this.currentFilter = filter;
    this.renderTodos();

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
  }

  sortTodos(sortBy) {
    this.currentSort = sortBy;
    this.renderTodos();

    // Update active sort button
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-sort="${sortBy}"]`).classList.add('active');
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.saveTodos();
    this.renderTodos();
    this.updateTodoStats();
  }

  renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('todoEmptyState');

    let filteredTodos = this.todos;

    // Apply filter
    if (this.currentFilter === 'active') {
      filteredTodos = filteredTodos.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filteredTodos = filteredTodos.filter(t => t.completed);
    }

    // Apply sorting
    filteredTodos.sort((a, b) => {
      if (this.currentSort === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (this.currentSort === 'category') {
        return a.category.localeCompare(b.category);
      } else if (this.currentSort === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    if (filteredTodos.length === 0) {
      todoList.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    todoList.style.display = 'block';
    emptyState.style.display = 'none';

    todoList.innerHTML = filteredTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-content">
          <div class="todo-text">${todo.text}</div>
          <div class="todo-meta">
            <span class="todo-category">${todo.category}</span>
            <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
            ${todo.dueDate ? `<span class="todo-due">Due: ${new Date(todo.dueDate).toLocaleDateString()}</span>` : ''}
          </div>
        </div>
        <div class="todo-actions">
          <button class="todo-toggle" onclick="conciergeInteractions.toggleTodo(${todo.id})">
            <i class="fas fa-${todo.completed ? 'check-circle' : 'circle'}"></i>
          </button>
          <button class="todo-delete" onclick="conciergeInteractions.deleteTodo(${todo.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  updateTodoStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById('todoCount').textContent = `${active} active, ${completed} completed`;

    const clearButton = document.querySelector('.clear-completed');
    if (completed > 0) {
      clearButton.style.display = 'block';
    } else {
      clearButton.style.display = 'none';
    }
  }

  saveTodos() {
    localStorage.setItem('conciergeTodos', JSON.stringify(this.todos));
  }

  exportTodos(format) {
    let data;
    let filename;
    let mimeType;

    if (format === 'json') {
      data = JSON.stringify(this.todos, null, 2);
      filename = 'concierge-todos.json';
      mimeType = 'application/json';
    } else if (format === 'csv') {
      const headers = ['ID', 'Text', 'Category', 'Priority', 'Due Date', 'Completed', 'Created At'];
      const rows = this.todos.map(todo => [
        todo.id,
        `"${todo.text}"`,
        todo.category,
        todo.priority,
        todo.dueDate || '',
        todo.completed,
        todo.createdAt
      ]);
      data = [headers, ...rows].map(row => row.join(',')).join('\n');
      filename = 'concierge-todos.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  importTodos(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedTodos;

        if (file.name.endsWith('.json')) {
          importedTodos = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          const lines = e.target.result.split('\n');
          const headers = lines[0].split(',');
          importedTodos = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            return {
              id: Date.now() + Math.random(),
              text: values[1]?.replace(/"/g, '') || '',
              category: values[2] || 'other',
              priority: values[3] || 'medium',
              dueDate: values[4] || '',
              completed: values[5] === 'true',
              createdAt: new Date().toISOString()
            };
          });
        }

        if (importedTodos && Array.isArray(importedTodos)) {
          this.todos = [...this.todos, ...importedTodos];
          this.saveTodos();
          this.renderTodos();
          this.updateTodoStats();
          this.showNotification(`Successfully imported ${importedTodos.length} todos`, 'success');
        }
      } catch (error) {
        this.showNotification('Error importing file. Please check the format.', 'error');
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  }

  // Global Functions for HTML onclick handlers
  openExclusiveAccess() {
    this.showNotification('Exclusive access request received. Our team will contact you within 24 hours.', 'success');
  }

  requestExclusiveAccess() {
    this.showNotification('Access request submitted. Welcome to Veridian Private Concierge.', 'success');
  }

  viewDemo() {
    this.showNotification('Demo loading... Experience the power of AI wealth management.', 'info');
  }

  selectMembership(tier) {
    this.showNotification(`${tier.charAt(0).toUpperCase() + tier.slice(1)} membership selected. Redirecting to secure checkout...`, 'info');
  }

  searchCollaborators() {
    const expertise = document.getElementById('expertiseFilter').value;
    const location = document.getElementById('locationFilter').value;
    const focus = document.getElementById('focusFilter').value;

    this.showNotification(`Searching for collaborators with expertise: ${expertise || 'Any'}, location: ${location || 'Any'}, focus: ${focus || 'Any'}`, 'info');
  }

  connectWithUs() {
    this.showNotification('Connection request received. Our elite team will contact you shortly.', 'success');
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.conciergeInteractions = new ConciergeInteractions();
});

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.log('ServiceWorker registration failed');
      });
  });
}

// Add CSS for additional interactive elements
const additionalStyles = `
  .scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    background: var(--secondary-gold);
    color: var(--primary-navy);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 1.2rem;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
  }

  .scroll-to-top:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .nav-scrolled {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .field-error {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .error {
    border-color: #e53e3e !important;
  }

  .notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    max-width: 400px;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.5s ease;
  }

  .notification-success {
    border-left: 4px solid #48bb78;
  }

  .notification-error {
    border-left: 4px solid #e53e3e;
  }

  .notification-info {
    border-left: 4px solid var(--secondary-gold);
  }

  .notification-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .notification-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    margin-left: auto;
  }

  .notification.hide {
    transform: translateX(100%);
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
