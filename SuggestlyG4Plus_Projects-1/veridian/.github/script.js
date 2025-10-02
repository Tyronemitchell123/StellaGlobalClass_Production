// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const bars = mobileMenu.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger menu
        const bars = mobileMenu.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Sending message...', 'info');
        
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'info':
            notification.style.background = '#3b82f6';
            break;
        default:
            notification.style.background = '#6b7280';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    .nav-link.active {
        color: #4f46e5 !important;
        font-weight: 600;
    }
`;
document.head.appendChild(style);

// Feature cards animation on scroll
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

// Observe feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (hero && heroGraphic) {
        const speed = 0.5;
        heroGraphic.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
    
    // Initialize Camera Bot and AI Assistant
    if (document.getElementById('camera-video')) {
        window.cameraBot = new CameraBot();
    }
    
    if (document.getElementById('chat-messages')) {
        window.aiAssistant = new AIAssistant();
    }
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Camera Bot Functionality
class CameraBot {
    constructor() {
        this.video = document.getElementById('camera-video');
        this.canvas = document.getElementById('camera-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
        this.capturedImages = [];
        this.isStreaming = false;
        this.faceDetectionInterval = null;
        this.qrScannerInterval = null;
        this.objectDetectionInterval = null;
        
        this.initializeCamera();
        this.setupEventListeners();
    }
    
    initializeCamera() {
        this.startBtn = document.getElementById('start-camera');
        this.captureBtn = document.getElementById('capture-photo');
        this.stopBtn = document.getElementById('stop-camera');
        this.imageGallery = document.getElementById('image-gallery');
        
        // Feature toggles
        this.faceDetectionToggle = document.getElementById('face-detection');
        this.qrScannerToggle = document.getElementById('qr-scanner');
        this.objectDetectionToggle = document.getElementById('object-detection');
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.capturePhoto());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        
        // Feature toggle listeners
        this.faceDetectionToggle.addEventListener('change', (e) => {
            this.toggleFeature('faceDetection', e.target.checked);
        });
        
        this.qrScannerToggle.addEventListener('change', (e) => {
            this.toggleFeature('qrScanner', e.target.checked);
        });
        
        this.objectDetectionToggle.addEventListener('change', (e) => {
            this.toggleFeature('objectDetection', e.target.checked);
        });
    }
    
    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                } 
            });
            
            this.video.srcObject = this.stream;
            this.isStreaming = true;
            
            // Update UI
            this.startBtn.style.display = 'none';
            this.captureBtn.style.display = 'flex';
            this.stopBtn.style.display = 'flex';
            
            // Set canvas size to match video
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
            });
            
            showNotification('Camera started successfully!', 'success');
            
            // Start AI processing if features are enabled
            this.startAIProcessing();
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            showNotification('Failed to access camera. Please check permissions.', 'error');
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        this.isStreaming = false;
        
        // Stop all AI processing
        this.stopAIProcessing();
        
        // Update UI
        this.startBtn.style.display = 'flex';
        this.captureBtn.style.display = 'none';
        this.stopBtn.style.display = 'none';
        
        showNotification('Camera stopped', 'info');
    }
    
    capturePhoto() {
        if (!this.isStreaming) return;
        
        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Convert to image data
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        // Add to captured images array
        this.capturedImages.push({
            id: Date.now(),
            data: imageData,
            timestamp: new Date().toLocaleString()
        });
        
        // Update gallery
        this.updateImageGallery();
        
        // Apply AI processing to captured image
        this.processCapturedImage(imageData);
        
        showNotification('Photo captured!', 'success');
    }
    
    updateImageGallery() {
        if (this.capturedImages.length === 0) {
            this.imageGallery.innerHTML = '<p class="no-images">No images captured yet</p>';
            return;
        }
        
        this.imageGallery.innerHTML = this.capturedImages.map(image => `
            <img src="${image.data}" alt="Captured image" 
                 onclick="cameraBot.viewImage('${image.data}')"
                 title="Captured at ${image.timestamp}">
        `).join('');
    }
    
    viewImage(imageData) {
        // Create modal to view full-size image
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = imageData;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    toggleFeature(feature, enabled) {
        const featureNames = {
            faceDetection: 'Face Detection',
            qrScanner: 'QR Scanner',
            objectDetection: 'Object Detection'
        };
        
        if (enabled) {
            showNotification(`${featureNames[feature]} enabled`, 'success');
            this.activateFeature(feature);
        } else {
            showNotification(`${featureNames[feature]} disabled`, 'info');
            this.deactivateFeature(feature);
        }
    }
    
    activateFeature(feature) {
        const viewfinder = document.querySelector('.camera-viewfinder');
        
        // Add visual overlay for active feature
        const overlay = document.createElement('div');
        overlay.className = `camera-overlay ${feature}-overlay`;
        overlay.id = `${feature}-overlay`;
        viewfinder.appendChild(overlay);
        
        // Start feature-specific processing
        switch (feature) {
            case 'faceDetection':
                this.startFaceDetection();
                break;
            case 'qrScanner':
                this.startQRScanning();
                break;
            case 'objectDetection':
                this.startObjectDetection();
                break;
        }
    }
    
    deactivateFeature(feature) {
        const overlay = document.getElementById(`${feature}-overlay`);
        if (overlay) {
            overlay.remove();
        }
        
        // Stop feature-specific processing
        switch (feature) {
            case 'faceDetection':
                this.stopFaceDetection();
                break;
            case 'qrScanner':
                this.stopQRScanning();
                break;
            case 'objectDetection':
                this.stopObjectDetection();
                break;
        }
    }
    
    startAIProcessing() {
        // Simulate AI processing with periodic analysis
        this.aiProcessingInterval = setInterval(() => {
            if (this.isStreaming) {
                this.analyzeFrame();
            }
        }, 1000);
    }
    
    stopAIProcessing() {
        if (this.aiProcessingInterval) {
            clearInterval(this.aiProcessingInterval);
            this.aiProcessingInterval = null;
        }
        this.stopFaceDetection();
        this.stopQRScanning();
        this.stopObjectDetection();
    }
    
    analyzeFrame() {
        // Simulate AI analysis
        const analysis = {
            faces: Math.floor(Math.random() * 3),
            objects: Math.floor(Math.random() * 5),
            qrCodes: Math.floor(Math.random() * 2)
        };
        
        // Update UI with analysis results if features are enabled
        if (this.faceDetectionToggle.checked && analysis.faces > 0) {
            this.showDetectionResult(`Detected ${analysis.faces} face(s)`);
        }
        
        if (this.objectDetectionToggle.checked && analysis.objects > 0) {
            this.showDetectionResult(`Detected ${analysis.objects} object(s)`);
        }
        
        if (this.qrScannerToggle.checked && analysis.qrCodes > 0) {
            this.showDetectionResult(`Detected ${analysis.qrCodes} QR code(s)`);
        }
    }
    
    showDetectionResult(message) {
        // Create temporary detection result overlay
        const result = document.createElement('div');
        result.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        result.textContent = message;
        
        const viewfinder = document.querySelector('.camera-viewfinder');
        viewfinder.appendChild(result);
        
        setTimeout(() => {
            if (result.parentNode) {
                result.parentNode.removeChild(result);
            }
        }, 2000);
    }
    
    processCapturedImage(imageData) {
        // Simulate AI processing of captured image
        setTimeout(() => {
            const analysis = {
                faces: Math.floor(Math.random() * 3),
                objects: Math.floor(Math.random() * 8),
                text: Math.random() > 0.5
            };
            
            let results = [];
            if (analysis.faces > 0) {
                results.push(`${analysis.faces} face(s) detected`);
            }
            if (analysis.objects > 0) {
                results.push(`${analysis.objects} object(s) identified`);
            }
            if (analysis.text) {
                results.push('Text detected in image');
            }
            
            if (results.length > 0) {
                showNotification(`Analysis complete: ${results.join(', ')}`, 'success');
            }
        }, 1500);
    }
    
    startFaceDetection() {
        this.faceDetectionInterval = setInterval(() => {
            if (this.isStreaming && this.faceDetectionToggle.checked) {
                // Simulate face detection
                const facesDetected = Math.random() > 0.7;
                if (facesDetected) {
                    this.showDetectionResult('Face detected!');
                }
            }
        }, 2000);
    }
    
    stopFaceDetection() {
        if (this.faceDetectionInterval) {
            clearInterval(this.faceDetectionInterval);
            this.faceDetectionInterval = null;
        }
    }
    
    startQRScanning() {
        this.qrScannerInterval = setInterval(() => {
            if (this.isStreaming && this.qrScannerToggle.checked) {
                // Simulate QR code detection
                const qrDetected = Math.random() > 0.8;
                if (qrDetected) {
                    this.showDetectionResult('QR code detected!');
                    // Simulate QR code content
                    setTimeout(() => {
                        showNotification('QR Code: https://example.com', 'info');
                    }, 1000);
                }
            }
        }, 3000);
    }
    
    stopQRScanning() {
        if (this.qrScannerInterval) {
            clearInterval(this.qrScannerInterval);
            this.qrScannerInterval = null;
        }
    }
    
    startObjectDetection() {
        this.objectDetectionInterval = setInterval(() => {
            if (this.isStreaming && this.objectDetectionToggle.checked) {
                // Simulate object detection
                const objects = ['Person', 'Car', 'Dog', 'Cat', 'Phone', 'Laptop'];
                const detectedObject = objects[Math.floor(Math.random() * objects.length)];
                this.showDetectionResult(`${detectedObject} detected!`);
            }
        }, 2500);
    }
    
    stopObjectDetection() {
        if (this.objectDetectionInterval) {
            clearInterval(this.objectDetectionInterval);
            this.objectDetectionInterval = null;
        }
    }
}

// AI Assistant Functionality
class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-message');
        this.clearBtn = document.getElementById('clear-chat');
        this.quickOptions = document.querySelectorAll('.quick-option');
        this.requestHumanBtn = document.getElementById('request-human');
        
        this.messages = [];
        this.isTyping = false;
        
        this.setupEventListeners();
        this.addBotMessage('Hello! I\'m Veridian AI Assistant. How can I help you today?');
    }
    
    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.clearBtn.addEventListener('click', () => this.clearChat());
        
        this.quickOptions.forEach(option => {
            option.addEventListener('click', () => {
                const message = option.getAttribute('data-message');
                this.chatInput.value = message;
                this.sendMessage();
            });
        });
        
        this.requestHumanBtn.addEventListener('click', () => this.requestHumanAgent());
    }
    
    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        this.addUserMessage(message);
        this.chatInput.value = '';
        
        // Simulate bot thinking and response
        this.isTyping = true;
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            this.generateBotResponse(message);
            this.isTyping = false;
        }, 1000 + Math.random() * 2000);
    }
    
    addUserMessage(message) {
        const messageElement = this.createMessageElement('user', message);
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        this.messages.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
    }
    
    addBotMessage(message) {
        const messageElement = this.createMessageElement('bot', message);
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        this.messages.push({
            type: 'bot',
            content: message,
            timestamp: new Date()
        });
    }
    
    createMessageElement(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = content;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = 'Just now';
        
        messageContent.appendChild(paragraph);
        messageContent.appendChild(timeSpan);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        return messageDiv;
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    generateBotResponse(userMessage) {
        const responses = {
            'features': 'Veridian offers powerful features including lightning-fast performance, enterprise-grade security, scalability, developer-friendly APIs, responsive design, and comprehensive analytics. Each feature is designed to provide the best possible experience for users and developers alike.',
            'get started': 'Getting started with Veridian is easy! Simply sign up for an account, choose your plan, and you\'ll have access to our dashboard where you can create projects, configure settings, and start building. We also provide comprehensive documentation and tutorials to help you along the way.',
            'support': 'We offer 24/7 customer support through multiple channels. You can chat with our AI assistant right here, request a human agent for complex issues, email us at support@veridian.com, or check our extensive knowledge base and community forums.',
            'pricing': 'Veridian offers flexible pricing plans to suit every need. We have a free tier for small projects, professional plans for growing businesses, and enterprise solutions for large organizations. All plans include core features, with higher tiers offering advanced capabilities and priority support.',
            'default': 'I understand you\'re interested in Veridian. I\'d be happy to help you learn more about our platform, features, pricing, or answer any other questions you might have. What specific aspect would you like to know more about?'
        };
        
        let response = responses.default;
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('feature')) {
            response = responses.features;
        } else if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
            response = responses.getStarted;
        } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
            response = responses.support;
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
            response = responses.pricing;
        }
        
        this.addBotMessage(response);
    }
    
    clearChat() {
        this.chatMessages.innerHTML = '';
        this.messages = [];
        this.addBotMessage('Chat cleared. How can I help you today?');
    }
    
    requestHumanAgent() {
        this.addBotMessage('I\'m connecting you with a human agent. Please wait a moment...');
        
        // Simulate human agent connection
        setTimeout(() => {
            this.addBotMessage('A human agent will be with you shortly. The current wait time is approximately 2 minutes. Is there anything else I can help you with while you wait?');
            
            // Update live chat stats
            document.getElementById('wait-time').textContent = '2m';
            document.getElementById('active-agents').textContent = '4';
        }, 2000);
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Add typing dots CSS
const typingStyle = document.createElement('style');
typingStyle.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #64748b;
        border-radius: 50%;
        animation: typingPulse 1.4s infinite;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typingPulse {
        0%, 60%, 100% {
            transform: scale(1);
            opacity: 0.7;
        }
        30% {
            transform: scale(1.2);
            opacity: 1;
        }
    }
`;
document.head.appendChild(typingStyle);

// Initialize live chat stats updates
setInterval(() => {
    const activeAgents = document.getElementById('active-agents');
    const waitTime = document.getElementById('wait-time');
    const satisfaction = document.getElementById('satisfaction');
    
    if (activeAgents) {
        const current = parseInt(activeAgents.textContent);
        const change = Math.random() > 0.5 ? 1 : -1;
        const newValue = Math.max(1, Math.min(10, current + change));
        activeAgents.textContent = newValue;
    }
    
    if (waitTime) {
        const times = ['1m', '2m', '3m', '5m'];
        const currentIndex = times.indexOf(waitTime.textContent);
        const newIndex = Math.max(0, Math.min(times.length - 1, currentIndex + (Math.random() > 0.5 ? 1 : -1)));
        waitTime.textContent = times[newIndex];
    }
    
    if (satisfaction) {
        const current = parseInt(satisfaction.textContent);
        const change = Math.random() > 0.7 ? 1 : -1;
        const newValue = Math.max(90, Math.min(100, current + change));
        satisfaction.textContent = newValue + '%';
    }
}, 5000);
