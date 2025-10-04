// Quantum Interactions - Ultra Premium JavaScript Engine

class QuantumEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.neuralConnections = [];
    this.animationFrame = null;
    this.isRunning = false;
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.setupCanvas();
    this.createParticles();
    this.createNeuralNetwork();
    this.bindEvents();
    this.start();
  }

  setupCanvas() {
    // Quantum Field Canvas
    const quantumCanvas = document.getElementById('quantumFieldCanvas');
    if (quantumCanvas) {
      this.canvas = quantumCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
    }

    // Neural Canvas
    const neuralCanvas = document.getElementById('neuralCanvas');
    if (neuralCanvas) {
      this.neuralCanvas = neuralCanvas;
      this.neuralCtx = neuralCanvas.getContext('2d');
      this.resizeNeuralCanvas();
    }

    // Navigation Canvas
    const navCanvas = document.getElementById('navNeuralCanvas');
    if (navCanvas) {
      this.navCanvas = navCanvas;
      this.navCtx = navCanvas.getContext('2d');
      this.resizeNavCanvas();
    }
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  resizeNeuralCanvas() {
    if (this.neuralCanvas) {
      this.neuralCanvas.width = window.innerWidth;
      this.neuralCanvas.height = 400;
    }
  }

  resizeNavCanvas() {
    if (this.navCanvas) {
      this.navCanvas.width = window.innerWidth;
      this.navCanvas.height = 80;
    }
  }

  createParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: this.getQuantumColor(),
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50
      });
    }
  }

  createNeuralNetwork() {
    const nodeCount = 20;
    for (let i = 0; i < nodeCount; i++) {
      this.neuralConnections.push({
        x: Math.random() * this.neuralCanvas.width,
        y: Math.random() * this.neuralCanvas.height,
        connections: [],
        activation: Math.random()
      });
    }

    // Create connections
    this.neuralConnections.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i) {
          node.connections.push(targetIndex);
        }
      }
    });
  }

  getQuantumColor() {
    const colors = [
      'rgba(0, 255, 255, 0.8)',
      'rgba(255, 0, 255, 0.8)',
      'rgba(255, 255, 0, 0.8)',
      'rgba(0, 255, 255, 0.6)',
      'rgba(255, 0, 255, 0.6)',
      'rgba(255, 255, 0, 0.6)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.resizeNeuralCanvas();
      this.resizeNavCanvas();
    });

    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Quantum Button Interactions
    document.querySelectorAll('.quantum-btn').forEach(btn => {
      btn.addEventListener('mouseenter', this.handleButtonHover.bind(this));
      btn.addEventListener('mouseleave', this.handleButtonLeave.bind(this));
      btn.addEventListener('click', this.handleButtonClick.bind(this));
    });

    // Card Hover Effects
    document.querySelectorAll('.quantum-card').forEach(card => {
      card.addEventListener('mouseenter', this.handleCardHover.bind(this));
      card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
    });

    // Number Counters
    this.initCounters();

    // Scroll Animations
    this.initScrollAnimations();
  }

  handleButtonHover(e) {
    const btn = e.currentTarget;
    btn.style.transform = 'translateY(-3px) scale(1.02)';
    this.createParticleBurst(btn);
  }

  handleButtonLeave(e) {
    const btn = e.currentTarget;
    btn.style.transform = '';
  }

  handleButtonClick(e) {
    const btn = e.currentTarget;
    this.createClickEffect(btn);
  }

  handleCardHover(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px) scale(1.02)';
    this.createCardGlow(card);
  }

  handleCardLeave(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    this.removeCardGlow(card);
  }

  createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'burst-particle';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.background = this.getQuantumColor();
      particle.style.setProperty('--angle', (i * 45) + 'deg');
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 1000);
    }
  }

  createClickEffect(element) {
    element.style.animation = 'quantum-pulse 0.3s ease-out';
    setTimeout(() => element.style.animation = '', 300);
  }

  createCardGlow(card) {
    const glow = document.createElement('div');
    glow.className = 'card-glow';
    glow.style.position = 'absolute';
    glow.style.top = '-2px';
    glow.style.left = '-2px';
    glow.style.right = '-2px';
    glow.style.bottom = '-2px';
    glow.style.background = 'linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(255, 0, 255, 0.3), rgba(255, 255, 0, 0.3))';
    glow.style.borderRadius = 'inherit';
    glow.style.zIndex = '-1';
    glow.style.animation = 'quantum-glow 2s infinite';
    card.style.position = 'relative';
    card.appendChild(glow);
  }

  removeCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) glow.remove();
  }

  initCounters() {
    const counters = document.querySelectorAll('.quantum-counter, .quantum-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const duration = 2000;
      const start = performance.now();

      const animate = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        if (counter.classList.contains('quantum-number')) {
          // Handle large numbers with commas
          const current = Math.floor(progress * target);
          counter.textContent = this.formatNumber(current);
        } else {
          counter.textContent = Math.floor(progress * target);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      // Start animation when element comes into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(counter);
    });
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-container, .quantum-card, .feature-card').forEach(el => {
      observer.observe(el);
    });
  }

  update() {
    // Update particles
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
      }

      // Respawn dead particles
      if (particle.life <= 0) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.life = particle.maxLife;
      }
    });

    // Update neural network
    this.neuralConnections.forEach(node => {
      node.activation = Math.sin(Date.now() * 0.001 + node.x * 0.01) * 0.5 + 0.5;
    });
  }

  draw() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life / particle.maxLife;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw particle trails
      this.ctx.strokeStyle = particle.color;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(particle.x, particle.y);
      this.ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Draw connections between particles
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.save();
          this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      });
    });
  }

  drawNeuralNetwork() {
    if (!this.neuralCtx) return;

    this.neuralCtx.clearRect(0, 0, this.neuralCanvas.width, this.neuralCanvas.height);

    // Draw connections
    this.neuralConnections.forEach((node, i) => {
      node.connections.forEach(targetIndex => {
        const target = this.neuralConnections[targetIndex];
        const opacity = (node.activation + target.activation) * 0.3;

        this.neuralCtx.save();
        this.neuralCtx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        this.neuralCtx.lineWidth = 1;
        this.neuralCtx.beginPath();
        this.neuralCtx.moveTo(node.x, node.y);
        this.neuralCtx.lineTo(target.x, target.y);
        this.neuralCtx.stroke();
        this.neuralCtx.restore();
      });
    });

    // Draw nodes
    this.neuralConnections.forEach(node => {
      this.neuralCtx.save();
      const intensity = node.activation;
      this.neuralCtx.fillStyle = `rgba(0, 255, 255, ${0.3 + intensity * 0.7})`;
      this.neuralCtx.beginPath();
      this.neuralCtx.arc(node.x, node.y, 3 + intensity * 4, 0, Math.PI * 2);
      this.neuralCtx.fill();
      this.neuralCtx.restore();
    });
  }

  drawNavNetwork() {
    if (!this.navCtx) return;

    this.navCtx.clearRect(0, 0, this.navCanvas.width, this.navCanvas.height);

    // Draw subtle neural network in navigation
    for (let i = 0; i < 15; i++) {
      const x1 = Math.random() * this.navCanvas.width;
      const y1 = Math.random() * this.navCanvas.height;
      const x2 = Math.random() * this.navCanvas.width;
      const y2 = Math.random() * this.navCanvas.height;

      this.navCtx.save();
      this.navCtx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      this.navCtx.lineWidth = 0.5;
      this.navCtx.beginPath();
      this.navCtx.moveTo(x1, y1);
      this.navCtx.lineTo(x2, y2);
      this.navCtx.stroke();
      this.navCtx.restore();
    }
  }

  animate() {
    this.update();
    this.draw();
    this.drawNeuralNetwork();
    this.drawNavNetwork();
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Quantum Modal System
class QuantumModal {
  constructor() {
    this.activeModal = null;
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal]')) {
        e.preventDefault();
        const modalId = e.target.dataset.modal;
        this.openModal(modalId);
      }

      if (e.target.matches('.quantum-modal-close') || e.target.matches('.quantum-modal')) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.activeModal = modal;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove('show');
      document.body.style.overflow = '';
      this.activeModal = null;
    }
  }
}

// Quantum Tooltip System
class QuantumTooltip {
  constructor() {
    this.tooltip = null;
    this.init();
  }

  init() {
    this.createTooltip();
    document.addEventListener('mouseover', (e) => {
      if (e.target.hasAttribute('data-tooltip')) {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.hasAttribute('data-tooltip')) {
        this.hideTooltip();
      }
    });
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'quantum-tooltip';
    document.body.appendChild(this.tooltip);
  }

  showTooltip(element, text) {
    this.tooltip.textContent = text;
    this.tooltip.classList.add('show');

    const rect = element.getBoundingClientRect();
    this.tooltip.style.left = rect.left + rect.width / 2 + 'px';
    this.tooltip.style.top = rect.top - 10 + 'px';
  }

  hideTooltip() {
    this.tooltip.classList.remove('show');
  }
}

// Quantum Notification System
class QuantumNotification {
  static show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `quantum-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="ti ti-${type === 'success' ? 'check' : type === 'error' ? 'x' : type === 'warning' ? 'alert-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// Quantum Demo Functions
function showQuantumDemo() {
  QuantumNotification.show('Initializing Quantum Demonstration...', 'info');
  setTimeout(() => {
    QuantumNotification.show('Quantum algorithms engaged! Processing market data at 1.5M operations/sec', 'success');
  }, 2000);
}

function requestQuantumAccess() {
  QuantumNotification.show('Access request initiated. Quantum verification in progress...', 'info');
  setTimeout(() => {
    QuantumNotification.show('Verification complete. Welcome to the quantum realm!', 'success');
  }, 3000);
}

function initiateQuantumOnboarding() {
  QuantumNotification.show('Beginning quantum onboarding sequence...', 'info');
  setTimeout(() => {
    QuantumNotification.show('Quantum portfolio analysis initiated. Stand by for optimization results.', 'success');
  }, 2000);
}

function viewQuantumCapabilities() {
  QuantumNotification.show('Loading quantum capabilities overview...', 'info');
  setTimeout(() => {
    QuantumNotification.show('Capabilities loaded. Quantum advantage: 500x faster than classical computing.', 'success');
  }, 1500);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Quantum Engine
  const quantumEngine = new QuantumEngine();

  // Initialize Modal System
  const quantumModal = new QuantumModal();

  // Initialize Tooltip System
  const quantumTooltip = new QuantumTooltip();

  // Hide loader after initialization
  setTimeout(() => {
    const loader = document.getElementById('quantumLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, 3000);

  // Add quantum effects to body
  document.body.classList.add('quantum-active');

  console.log('🌀 Quantum Engine Initialized - Ultra Premium Mode Active');
});

// Performance monitoring
window.addEventListener('load', () => {
  console.log('⚡ Quantum Performance Metrics:');
  console.log(`Page Load Time: ${performance.now().toFixed(2)}ms`);
  console.log(`Quantum Particles: ${document.querySelectorAll('.particle-3d').length}`);
  console.log(`Neural Connections: Active`);
  console.log(`Memory Usage: Optimized`);
});
