// Mobile menu toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Camera Bot functionality
class CameraBot {
    constructor() {
        this.video = document.getElementById('camera-video');
        this.canvas = document.getElementById('camera-canvas');
        this.startBtn = document.getElementById('start-camera');
        this.captureBtn = document.getElementById('capture-photo');
        this.stopBtn = document.getElementById('stop-camera');
        this.imageGallery = document.getElementById('image-gallery');
        this.faceDetection = document.getElementById('face-detection');
        this.qrScanner = document.getElementById('qr-scanner');
        this.objectDetection = document.getElementById('object-detection');
        this.stream = null;
        this.isStreaming = false;

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.stopBtn.addEventListener('click', () => this.stopCamera());

        // Feature toggles
        this.faceDetection.addEventListener('change', (e) => this.toggleFeature('face', e.target.checked));
        this.qrScanner.addEventListener('change', (e) => this.toggleFeature('qr', e.target.checked));
        this.objectDetection.addEventListener('change', (e) => this.toggleFeature('object', e.target.checked));
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });

            this.video.srcObject = this.stream;
            this.video.style.display = 'block';
            this.isStreaming = true;

            this.startBtn.style.display = 'none';
            this.captureBtn.style.display = 'inline-block';
            this.stopBtn.style.display = 'inline-block';

            // Clear no images message
            const noImages = this.imageGallery.querySelector('.no-images');
            if (noImages) {
                noImages.style.display = 'none';
            }

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    }

    capturePhoto() {
        if (!this.isStreaming) return;

        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0);

        const imageDataUrl = this.canvas.toDataURL('image/png');
        this.addImageToGallery(imageDataUrl);
    }

    addImageToGallery(imageDataUrl) {
        const img = document.createElement('img');
        img.src = imageDataUrl;
        img.style.width = '100%';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        img.style.cursor = 'pointer';

        img.addEventListener('click', () => {
            // Simple lightbox effect
            const lightbox = document.createElement('div');
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.background = 'rgba(0,0,0,0.8)';
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightbox.style.zIndex = '10000';
            lightbox.style.cursor = 'pointer';

            const imgClone = img.cloneNode();
            imgClone.style.maxWidth = '90%';
            imgClone.style.maxHeight = '90%';
            imgClone.style.objectFit = 'contain';

            lightbox.appendChild(imgClone);
            lightbox.addEventListener('click', () => document.body.removeChild(lightbox));
            document.body.appendChild(lightbox);
        });

        this.imageGallery.appendChild(img);
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            this.isStreaming = false;
        }

        this.video.style.display = 'none';
        this.startBtn.style.display = 'inline-block';
        this.captureBtn.style.display = 'none';
        this.stopBtn.style.display = 'none';
    }

    toggleFeature(feature, enabled) {
        console.log(`${feature} detection ${enabled ? 'enabled' : 'disabled'}`);
        // In a real implementation, this would enable/disable actual detection
        // For demo purposes, we'll just log the state
    }
}

// AI Assistant functionality
class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-message');
        this.clearBtn = document.getElementById('clear-chat');
        this.minimizeBtn = document.getElementById('minimize-chat');
        this.quickOptions = document.querySelectorAll('.quick-option');
        this.requestHumanBtn = document.getElementById('request-human');

        this.responses = {
            'features': 'Veridian offers lightning-fast performance, enterprise security, scalability, developer-friendly APIs, responsive design, and comprehensive analytics.',
            'started': 'To get started with Veridian, simply sign up for a free account and explore our documentation. We offer step-by-step guides and tutorials.',
            'support': 'Our technical support team is available 24/7. You can reach us through the chat, email, or phone. Average response time is under 2 minutes.',
            'pricing': 'We offer flexible pricing plans starting from $29/month for basic features, with enterprise options available. Contact sales for custom pricing.',
            'default': 'Thank you for your message! How else can I assist you today?'
        };

        this.init();
    }

    init() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.clearBtn.addEventListener('click', () => this.clearChat());
        this.minimizeBtn.addEventListener('click', () => this.minimizeChat());

        this.quickOptions.forEach(option => {
            option.addEventListener('click', () => {
                const message = option.getAttribute('data-message');
                this.sendQuickMessage(message);
            });
        });

        this.requestHumanBtn.addEventListener('click', () => this.requestHumanAgent());
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addMessage('user', message);
            this.chatInput.value = '';
            this.simulateResponse(message);
        }
    }

    sendQuickMessage(message) {
        this.addMessage('user', message);
        this.simulateResponse(message);
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const messageText = document.createElement('p');
        messageText.textContent = content;

        const timestamp = document.createElement('span');
        timestamp.className = 'message-time';
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        messageContent.appendChild(messageText);
        messageContent.appendChild(timestamp);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    simulateResponse(userMessage) {
        // Simulate typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p><i class="fas fa-circle-notch fa-spin"></i> Typing...</p>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        setTimeout(() => {
            this.chatMessages.removeChild(typingDiv);
            const response = this.generateResponse(userMessage.toLowerCase());
            this.addMessage('bot', response);
        }, 1500);
    }

    generateResponse(message) {
        if (message.includes('feature')) return this.responses.features;
        if (message.includes('start') || message.includes('begin')) return this.responses.started;
        if (message.includes('support') || message.includes('help')) return this.responses.support;
        if (message.includes('pricing') || message.includes('cost') || message.includes('price')) return this.responses.pricing;
        return this.responses.default;
    }

    clearChat() {
        // Keep only the initial welcome message
        const welcomeMessage = this.chatMessages.querySelector('.message');
        this.chatMessages.innerHTML = '';
        if (welcomeMessage) {
            this.chatMessages.appendChild(welcomeMessage);
        }
    }

    minimizeChat() {
        const chatInterface = document.querySelector('.chat-interface');
        chatInterface.style.display = chatInterface.style.display === 'none' ? 'block' : 'none';
    }

    requestHumanAgent() {
        this.addMessage('bot', 'Connecting you to a human agent... Please wait.');
        setTimeout(() => {
            this.addMessage('bot', 'Sarah Chen is now available to assist you. Hello! How can I help you today?');
        }, 2000);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Simulate form submission
        alert(`Thank you for your message, ${data.name}! We'll get back to you soon.`);

        // Reset form
        contactForm.reset();
    });
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Camera Bot
    if (document.getElementById('camera-video')) {
        new CameraBot();
    }

    // Initialize AI Assistant
    if (document.getElementById('chat-messages')) {
        new AIAssistant();
    }

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Update live stats (demo)
    setInterval(() => {
        const activeAgents = document.getElementById('active-agents');
        const waitTime = document.getElementById('wait-time');
        const satisfaction = document.getElementById('satisfaction');

        if (activeAgents) {
            const current = parseInt(activeAgents.textContent);
            activeAgents.textContent = Math.max(3, Math.min(8, current + (Math.random() > 0.7 ? 1 : -1)));
        }

        if (waitTime) {
            const times = ['1m', '2m', '3m', '45s'];
            waitTime.textContent = times[Math.floor(Math.random() * times.length)];
        }

        if (satisfaction) {
            const current = parseInt(satisfaction.textContent);
            satisfaction.textContent = Math.max(95, Math.min(99, current + (Math.random() > 0.8 ? 1 : -1))) + '%';
        }
    }, 5000);
});
