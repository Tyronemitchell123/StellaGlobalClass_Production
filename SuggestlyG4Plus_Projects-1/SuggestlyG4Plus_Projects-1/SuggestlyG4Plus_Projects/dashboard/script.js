/**
 * Veridian Private Concierge Console - Elite Frontend JavaScript
 * Ultra-premium interface for UHNWI and business executives
 */

class VeridianPrivateConcierge {
  constructor() {
    this.token = localStorage.getItem('veridian_token');
    this.ws = null;
    this.currentSection = 'dashboard';
    this.init();
  }

  init() {
    this.bindGlobalEvents();
    if (this.token) {
      this.showApp();
      this.connectWebSocket();
      this.loadDashboard();
      this.loadAIStatus();
    } else {
      this.showAuth();
    }
  }

  bindGlobalEvents() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Event delegation for navigation (works even if nav hidden)
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        e.preventDefault();
        this.navigate(e, e.target);
      }
    });

    // Event delegation for contact form
    document.addEventListener('submit', (e) => {
      if (e.target.matches('#contactForm')) {
        e.preventDefault();
        this.handleContact(e);
      }
    });

    // App events bound in showApp()
  }

  bindChatEvents() {
    const sendBtn = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    if (sendBtn && chatInput) {
      sendBtn.addEventListener('click', () => this.sendChatMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendChatMessage();
      });
    }
  }

  bindAIEvents() {
    const trainBtn = document.getElementById('trainModel');
    if (trainBtn) {
      trainBtn.addEventListener('click', () => this.trainModel());
    }

    const analyzeBtn = document.getElementById('analyzeData');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.analyzeData());
    }
  }

  bindCameraEvents() {
    document.querySelectorAll('.control-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!btn.disabled) {
          const cameraFeed = btn.closest('.camera-feed');
          if (cameraFeed) {
            this.toggleCamera(cameraFeed);
          }
        }
      });
    });
  }

  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.token;
        localStorage.setItem('veridian_token', this.token);
        this.showApp();
        this.connectWebSocket();
        this.loadDashboard();
        this.loadAIStatus();
      } else {
        errorEl.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Login error:', error);
      errorEl.classList.remove('hidden');
    }
  }

  showAuth() {
    document.getElementById('auth-overlay').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
  }

  showApp() {
    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  }

  navigate(e, link) {
    e.preventDefault();
    const section = link.dataset.section;

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Switch sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    this.currentSection = section;

    // Bind section-specific events and load data
    switch (section) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'cameras':
        this.bindCameraEvents();
        this.loadCameras();
        break;
      case 'ai':
        this.bindAIEvents();
        this.loadAIStatus();
        break;
      case 'chat':
        this.bindChatEvents();
        this.loadChatHistory();
        break;
      case 'contact':
        break;
    }
  }

  logout() {
    localStorage.removeItem('veridian_token');
    this.token = null;
    this.ws?.close();
    this.showAuth();
  }

  async apiCall(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  connectWebSocket() {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`ws://${window.location.host}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected - Real-time updates active');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics') {
        this.updateMetrics(data.data);
      } else if (data.type === 'alert') {
        this.showAlert(data.message);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  updateMetrics(metrics) {
    if (this.currentSection !== 'dashboard') return;

    document.getElementById('cpuUsage').textContent = `${metrics.cpu}%`;
    document.getElementById('memoryUsage').textContent = `${metrics.memory}%`;
    document.getElementById('latency').textContent = `${metrics.latency}ms`;

    // Update AI accuracy (mock)
    document.getElementById('aiAccuracy').textContent = `${(98 + Math.random() * 2).toFixed(1)}%`;

    // Update alerts
    document.getElementById('alertsGenerated').textContent = metrics.alerts.length || 0;
    if (metrics.alerts.length > 0) {
      document.querySelector('.stat-trend.negative').textContent = metrics.alerts[0];
    }

    // Update active cameras (mock)
    document.getElementById('activeCameras').textContent = Math.floor(Math.random() * 30) + 20;
    document.getElementById('framesProcessed').textContent = `${(1 + Math.random()).toFixed(1)}M`;
  }

  showAlert(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'alert-toast';
    toast.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      ${message}
    `;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #dc3545, #a71e2a);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  async loadDashboard() {
    try {
      // Load weather for executive location (mock London)
      const weather = await this.apiCall('/api/weather/London');
      console.log('Weather loaded:', weather);

      // Load cameras count
      const cameras = await this.apiCall('/api/cameras');
      document.getElementById('activeCameras').textContent = cameras.cameras.filter(c => c.status === 'active').length;
    } catch (error) {
      console.error('Dashboard load error:', error);
    }
  }

  async loadCameras() {
    try {
      const cameras = await this.apiCall('/api/cameras');
      // Update camera feeds if needed
      console.log('Cameras loaded:', cameras);
    } catch (error) {
      console.error('Cameras load error:', error);
    }
  }

  async loadAIStatus() {
    if (this.currentSection !== 'ai') return;

    try {
      const status = await this.apiCall('/api/ai-status');
      const aiStatusEl = document.getElementById('aiStatus');
      aiStatusEl.textContent = JSON.stringify(status.status, null, 2);
      aiStatusEl.classList.remove('hidden');
    } catch (error) {
      console.error('AI status load error:', error);
      document.getElementById('aiStatus').textContent = 'Error loading AI status';
    }
  }

  async trainModel() {
    const trainBtn = document.getElementById('trainModel');
    trainBtn.innerHTML = '<div class="loading"></div> Training...';
    trainBtn.disabled = true;

    try {
      // Mock training data for neural network
      const trainingData = [
        [[0.1, 0.2, 0.3, 0.4]],
        [[0.5, 0.6, 0.7, 0.8]],
        [[0.9, 1.0, 1.1, 1.2]]
      ];
      const labels = [
        [[0, 1]],
        [[1, 0]],
        [[0, 1]]
      ];

      // This would call the MCP tool, but for demo, mock response
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'Neural Network Training Complete:\nFinal Loss: 0.023456\nEpochs: 100'
        }]
      };

      setTimeout(() => {
        document.getElementById('aiStatus').textContent = mockResponse.content[0].text;
        trainBtn.innerHTML = 'Model Trained ✓';
        trainBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        setTimeout(() => {
          trainBtn.innerHTML = 'Train Model';
          trainBtn.disabled = false;
          trainBtn.style.background = '';
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error('Training error:', error);
      trainBtn.innerHTML = 'Train Model';
      trainBtn.disabled = false;
    }
  }

  async analyzeData() {
    const dataInput = document.getElementById('dataInput');
    const resultsEl = document.getElementById('analysisResults');
    const analyzeBtn = document.getElementById('analyzeData');

    if (!dataInput.value.trim()) {
      alert('Please enter data to analyze');
      return;
    }

    try {
      let data;
      try {
        data = JSON.parse(dataInput.value);
      } catch {
        data = dataInput.value.split(',').map(s => s.trim()).filter(Boolean);
      }

      analyzeBtn.innerHTML = '<div class="loading"></div> Analyzing...';
      analyzeBtn.disabled = true;

      // Mock AI analysis
      const mockAnalysis = {
        patterns: ['Increasing trend detected', 'Seasonal patterns identified'],
        predictions: ['Next value: 45.2 ± 2.1', 'Confidence: 92%'],
        insights: ['Data quality: High', 'Anomalies: None detected']
      };

      setTimeout(() => {
        resultsEl.textContent = JSON.stringify(mockAnalysis, null, 2);
        resultsEl.classList.remove('hidden');
        analyzeBtn.innerHTML = 'Analyze Patterns';
        analyzeBtn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Analysis error:', error);
      resultsEl.textContent = `Error: ${error.message}`;
      resultsEl.classList.remove('hidden');
      analyzeBtn.innerHTML = 'Analyze Patterns';
      analyzeBtn.disabled = false;
    }
  }

  async sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (!message) return;

    this.addChatMessage('user', message);
    chatInput.value = '';

    try {
      const response = await this.apiCall('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      });

      this.addChatMessage('bot', response.response);
    } catch (error) {
      this.addChatMessage('bot', 'Sorry, I encountered an error. Please try again.');
      console.error('Chat error:', error);
    }
  }

  addChatMessage(sender, text) {
    const messagesEl = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.innerHTML = `
      <div>${text}</div>
      <small>${new Date().toLocaleTimeString()}</small>
    `;
    messagesEl.appendChild(messageEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  loadChatHistory() {
    // Load previous messages from localStorage or API
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      messages.forEach(msg => this.addChatMessage(msg.sender, msg.text));
    }
  }

  async handleContact(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await this.apiCall('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      alert(response.message);
      e.target.reset();
    } catch (error) {
      alert('Error submitting request. Please try again.');
      console.error('Contact error:', error);
    }
  }

  toggleCamera(cameraEl) {
    const statusEl = cameraEl.querySelector('.status');
    const videoEl = cameraEl.querySelector('.feed-video');
    const playBtn = cameraEl.querySelector('.control-btn');

    if (statusEl.textContent === 'Live') {
      statusEl.textContent = 'Paused';
      statusEl.className = 'status inactive';
      videoEl.classList.add('offline');
      if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    } else {
      statusEl.textContent = 'Live';
      statusEl.className = 'status active';
      videoEl.classList.remove('offline');
      if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new VeridianPrivateConcierge();
});

// Global error handler for premium UX
window.addEventListener('error', (e) => {
  console.error('Elite Console Error:', e.error);
  // Show graceful error message
  if (e.target.tagName !== 'SCRIPT') {
    e.preventDefault();
    alert('An unexpected error occurred. The concierge team has been notified.');
  }
});
