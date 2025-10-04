'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function HomePage() {
  useEffect(() => {
    // Since the script is loaded, we might need to manually initialize features
    // if they don't run automatically on route changes.
    // This depends on how `unified-veridian-script.js` is written.
    // If it uses DOMContentLoaded, it might need a re-trigger function.
  }, []);

  return (
    <>
      <Head>
        <title>Veridian Private Concierge - Premium AI-Powered Lifestyle Management | Luxury Transportation, Courier & Web Design</title>
        <meta name="description" content="Experience unparalleled luxury with Veridian's AI-powered private concierge service. Comprehensive lifestyle management covering luxury transportation (Velocities), premium courier & logistics (OnTarget Couriers), web design (OnTarget Web Design), healthcare, education, real estate, travel, and e-commerce for elite clients worldwide." />
        {/* All other meta tags from index.html would go here */}
        <link rel="stylesheet" href="/design-system-tokens.css" />
        <link rel="stylesheet" href="/unified-veridian-styles.css" />
      </Head>

      {/* Body Content from index.html */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="particle-field"></div>
      </div>

      <nav className="navbar" id="navbar">
        <div className="nav-container">
            <div className="logo">
                <i className="fas fa-crown logo-icon"></i>
                <div className="logo-content">
                    <span className="logo-text">VERIDIAN</span>
                    <span className="logo-subtitle">Private Concierge</span>
                </div>
            </div>
            <ul className="nav-links" id="navLinks">
                <li><a href="#home" className="nav-link">Home</a></li>
                <li className="nav-dropdown">
                    <a href="#services" className="nav-link">Services <i className="fas fa-chevron-down"></i></a>
                    <ul className="dropdown-menu">
                        <li><a href="#services" className="dropdown-item">All Services</a></li>
                        <li><a href="#lifestyle" className="dropdown-item">Lifestyle Management</a></li>
                        <li><a href="#travel" className="dropdown-item">Luxury Travel</a></li>
                        <li><a href="#technology" className="dropdown-item">Technology Solutions</a></li>
                    </ul>
                </li>
                <li><a href="#experience" className="nav-link">Experience</a></li>
                <li><a href="#membership" className="nav-link">Membership</a></li>
                <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
            <div className="nav-actions">
                <button className="btn-ghost" onClick={() => (window as any).openModal('login')}>
                    <i className="fas fa-user"></i> Sign In
                </button>
                <button className="btn-primary" onClick={() => (window as any).openModal('request')}>
                    <i className="fas fa-lock"></i> Request Access
                </button>
            </div>
            <button className="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <section className="hero" id="home">
        <div className="hero-content">
            <div className="hero-text">
                <div className="hero-badge">
                    <i className="fas fa-gem"></i>
                    <span>Premium Multi-Service AI Concierge</span>
                </div>
                <h1 className="hero-title">
                    <span className="title-line">Comprehensive AI Concierge</span>
                    <span className="title-line gradient-text">For Every Aspect of Your Life</span>
                </h1>
                <p className="hero-subtitle">
                    Experience the future of premium lifestyle management with cutting-edge AI technology
                    covering technology, healthcare, education, real estate, travel, e-commerce, and luxury services.
                </p>
                <div className="hero-cta">
                    <button className="btn-primary btn-large" onClick={() => (window as any).openModal('request')}>
                        <i className="fas fa-lock"></i>
                        <span>Request Exclusive Access</span>
                    </button>
                    <button className="btn-outline btn-large" onClick={() => (window as any).scrollToSection('experience')}>
                        <i className="fas fa-play"></i>
                        <span>View Demo</span>
                    </button>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number" data-target="15">15+</div>
                        <div className="stat-label">AI Service Categories</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number" data-target="99.9">99.9%</div>
                        <div className="stat-label">Automation Rate</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number" data-target="24">24/7</div>
                        <div className="stat-label">AI Operations</div>
                    </div>
                </div>
            </div>
            <div className="hero-visual">
                <div className="floating-card card-1">
                    <i className="fas fa-hotel card-icon"></i>
                    <div className="card-text">Luxury Accommodations</div>
                </div>
                <div className="floating-card card-2">
                    <i className="fas fa-plane card-icon"></i>
                    <div className="card-text">Private Aviation</div>
                </div>
                <div className="floating-card card-3">
                    <i className="fas fa-utensils card-icon"></i>
                    <div className="card-text">Fine Dining</div>
                </div>
                <div className="hero-image-container">
                    <div className="hero-image-glow"></div>
                    <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="AI-powered comprehensive concierge services" className="hero-image" />
                </div>
            </div>
        </div>
        <div className="scroll-indicator">
            <i className="fas fa-chevron-down"></i>
        </div>
    </section>

    <section className="services" id="services">
        <div className="section-container">
            <div className="section-header">
                <span className="section-badge">
                    <i className="fas fa-concierge-bell"></i>
                    Exclusive Services
                </span>
                <h2 className="section-title">
                    <span className="title-line">Premium Services</span>
                    <span className="title-line gradient-text">Tailored for Excellence</span>
                </h2>
                <p className="section-subtitle">
                    Comprehensive AI-powered solutions across 15+ service categories,
                    all automated and delivered with white-glove service excellence.
                </p>
            </div>

            <div className="services-grid">
                <div className="service-card featured">
                    <div className="featured-badge">Most Popular</div>
                    <div className="service-icon">
                        <i className="fas fa-car-side"></i>
                    </div>
                    <h3 className="service-title">Luxury Transportation</h3>
                    <p className="service-description">
                        AI-powered premium chauffeur service with autonomous-ready vehicles including Tesla Model S, BMW i7, and Rolls Royce Spectre.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> AI Route Optimization</li>
                        <li><i className="fas fa-check"></i> Executive Fleet</li>
                        <li><i className="fas fa-check"></i> &lt; 2min Response Time</li>
                        <li><i className="fas fa-check"></i> 50+ Cities Coverage</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-shipping-fast"></i>
                    </div>
                    <h3 className="service-title">Premium Courier & Logistics</h3>
                    <p className="service-description">
                        Quantum-AI powered ultra-premium delivery service with blockchain tracking, neural interfaces, and $10M+ insurance coverage.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> 99.9% On-Time Delivery</li>
                        <li><i className="fas fa-check"></i> Quantum Route Optimization</li>
                        <li><i className="fas fa-check"></i> Blockchain Tracking</li>
                        <li><i className="fas fa-check"></i> Private Aviation Access</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-code"></i>
                    </div>
                    <h3 className="service-title">Digital Solutions & Web Design</h3>
                    <p className="service-description">
                        AI-powered web design and development services with cutting-edge technology including Next.js, React, and TypeScript.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> UI/UX Design</li>
                        <li><i className="fas fa-check"></i> Web Development</li>
                        <li><i className="fas fa-check"></i> AI-Powered Solutions</li>
                        <li><i className="fas fa-check"></i> 200+ Projects Completed</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-heartbeat"></i>
                    </div>
                    <h3 className="service-title">Healthcare Management</h3>
                    <p className="service-description">
                        Comprehensive healthcare concierge including appointment scheduling, specialist referrals, and wellness programs.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> Medical Coordination</li>
                        <li><i className="fas fa-check"></i> Wellness Programs</li>
                        <li><i className="fas fa-check"></i> Global Healthcare</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-plane"></i>
                    </div>
                    <h3 className="service-title">Travel & Hospitality</h3>
                    <p className="service-description">
                        Luxury travel planning including exclusive accommodations, private transportation, and curated experiences.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> Luxury Travel</li>
                        <li><i className="fas fa-check"></i> Exclusive Experiences</li>
                        <li><i className="fas fa-check"></i> Global Logistics</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-building"></i>
                    </div>
                    <h3 className="service-title">Real Estate Services</h3>
                    <p className="service-description">
                        Comprehensive real estate solutions including property acquisition, luxury home management, and portfolio optimization.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> Property Acquisition</li>
                        <li><i className="fas fa-check"></i> Luxury Management</li>
                        <li><i className="fas fa-check"></i> Portfolio Optimization</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <h3 className="service-title">Education Platform</h3>
                    <p className="service-description">
                        Premium educational services including personalized learning paths, expert tutoring, and professional development.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> Personalized Learning</li>
                        <li><i className="fas fa-check"></i> Expert Instruction</li>
                        <li><i className="fas fa-check"></i> Career Development</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <h3 className="service-title">E-commerce Solutions</h3>
                    <p className="service-description">
                        Complete e-commerce solutions including online store management, luxury shopping services, and supply chain optimization.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> Online Retail</li>
                        <li><i className="fas fa-check"></i> Luxury Shopping</li>
                        <li><i className="fas fa-check"></i> Supply Chain</li>
                    </ul>
                </div>

                <div className="service-card">
                    <div className="service-icon">
                        <i className="fas fa-microchip"></i>
                    </div>
                    <h3 className="service-title">Technology Solutions</h3>
                    <p className="service-description">
                        Advanced AI-driven technology solutions including SaaS platforms, software development, and digital transformation.
                    </p>
                    <ul className="service-features">
                        <li><i className="fas fa-check"></i> SaaS Integration</li>
                        <li><i className="fas fa-check"></i> Custom Development</li>
                        <li><i className="fas fa-check"></i> Digital Transformation</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section className="ai-intelligence" id="experience">
        <div className="section-container">
            <div className="section-header">
                <span className="section-badge">
                    <i className="fas fa-brain"></i>
                    AI Intelligence
                </span>
                <h2 className="section-title">
                    <span className="title-line">Cutting-Edge AI Technology</span>
                    <span className="title-line gradient-text">Powered by Neural Networks</span>
                </h2>
                <p className="section-subtitle">
                    Our proprietary AI algorithms analyze millions of data points to provide
                    unprecedented insights and optimization strategies across all aspects of your life.
                </p>
            </div>

            <div className="ai-features">
                <div className="ai-feature-card">
                    <div className="ai-icon">
                        <i className="fas fa-robot"></i>
                    </div>
                    <h3>Complete Automation Suite</h3>
                    <p>Comprehensive automation across all 15+ service categories, eliminating human intervention while maintaining premium quality standards.</p>
                    <ul className="feature-list">
                        <li><i className="fas fa-check-circle"></i> Zero human intervention required</li>
                        <li><i className="fas fa-check-circle"></i> 99.9% automation success rate</li>
                        <li><i className="fas fa-check-circle"></i> Real-time AI optimization</li>
                    </ul>
                </div>

                <div className="ai-feature-card">
                    <div className="ai-icon">
                        <i className="fas fa-brain"></i>
                    </div>
                    <h3>Neural Network Processing</h3>
                    <p>Advanced neural network systems that process and optimize all services simultaneously, learning and improving autonomously.</p>
                    <ul className="feature-list">
                        <li><i className="fas fa-check-circle"></i> Self-learning algorithms</li>
                        <li><i className="fas fa-check-circle"></i> Predictive optimization</li>
                        <li><i className="fas fa-check-circle"></i> Cross-service intelligence</li>
                    </ul>
                </div>

                <div className="ai-feature-card">
                    <div className="ai-icon">
                        <i className="fas fa-infinity"></i>
                    </div>
                    <h3>Infinite Scalability</h3>
                    <p>Fully autonomous service scaling that grows with your needs, handling unlimited requests without any human oversight.</p>
                    <ul className="feature-list">
                        <li><i className="fas fa-check-circle"></i> Unlimited capacity</li>
                        <li><i className="fas fa-check-circle"></i> Instant scaling</li>
                        <li><i className="fas fa-check-circle"></i> Zero downtime</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section className="membership" id="membership">
        <div className="section-container">
            <div className="section-header">
                <span className="section-badge">
                    <i className="fas fa-crown"></i>
                    Membership Tiers
                </span>
                <h2 className="section-title">
                    <span className="title-line">Choose Your Level</span>
                    <span className="title-line gradient-text">of Excellence</span>
                </h2>
                <p className="section-subtitle">
                    Select the membership tier that best suits your lifestyle needs
                </p>
            </div>

            <div className="membership-grid">
                <div className="membership-card">
                    <div className="membership-header">
                        <h3 className="membership-name">Premium</h3>
                        <div className="membership-price">
                            <span className="price-currency">$</span>
                            <span className="price-amount">499</span>
                            <span className="price-period">/month</span>
                        </div>
                    </div>
                    <ul className="membership-features">
                        <li><i className="fas fa-check"></i> 24/7 AI concierge access</li>
                        <li><i className="fas fa-check"></i> Priority booking services</li>
                        <li><i className="fas fa-check"></i> Travel coordination</li>
                        <li><i className="fas fa-check"></i> Restaurant reservations</li>
                        <li><i className="fas fa-check"></i> Event planning assistance</li>
                    </ul>
                    <button className="btn-outline btn-full" onClick={() => (window as any).selectMembership('premium')}>
                        Select Premium
                    </button>
                </div>

                <div className="membership-card featured">
                    <div className="featured-badge">Most Popular</div>
                    <div className="membership-header">
                        <h3 className="membership-name">Elite</h3>
                        <div className="membership-price">
                            <span className="price-currency">$</span>
                            <span className="price-amount">1,999</span>
                            <span className="price-period">/month</span>
                        </div>
                    </div>
                    <ul className="membership-features">
                        <li><i className="fas fa-check"></i> Everything in Premium, plus:</li>
                        <li><i className="fas fa-check"></i> Dedicated human concierge</li>
                        <li><i className="fas fa-check"></i> Private aviation coordination</li>
                        <li><i className="fas fa-check"></i> Luxury accommodation access</li>
                        <li><i className="fas fa-check"></i> VIP event access</li>
                        <li><i className="fas fa-check"></i> Personal shopping services</li>
                    </ul>
                    <button className="btn-primary btn-full" onClick={() => (window as any).selectMembership('elite')}>
                        Select Elite
                    </button>
                </div>

                <div className="membership-card">
                    <div className="membership-header">
                        <h3 className="membership-name">Sovereign</h3>
                        <div className="membership-price">
                            <span className="price-amount">Custom</span>
                        </div>
                    </div>
                    <ul className="membership-features">
                        <li><i className="fas fa-check"></i> Everything in Elite, plus:</li>
                        <li><i className="fas fa-check"></i> Dedicated concierge team</li>
                        <li><i className="fas fa-check"></i> Unlimited service requests</li>
                        <li><i className="fas fa-check"></i> Global property management</li>
                        <li><i className="fas fa-check"></i> Bespoke experiences</li>
                        <li><i className="fas fa-check"></i> White-glove service</li>
                    </ul>
                    <button className="btn-outline btn-full" onClick={() => (window as any).selectMembership('sovereign')}>
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    </section>

    <section className="contact" id="contact">
        <div className="section-container">
            <div className="section-header">
                <span className="section-badge">
                    <i className="fas fa-envelope"></i>
                    Get in Touch
                </span>
                <h2 className="section-title">
                    <span className="title-line">Begin Your</span>
                    <span className="title-line gradient-text">Luxury Journey</span>
                </h2>
                <p className="section-subtitle">
                    Our elite concierge team is ready to assist you 24/7
                </p>
            </div>

            <div className="contact-content">
                <div className="contact-info">
                    <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <div>
                            <h4>Phone</h4>
                            <p>+1 (888) VERIDIAN</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>concierge@veridianprivate.com</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-clock"></i>
                        <div>
                            <h4>Availability</h4>
                            <p>24/7 Premium Support</p>
                        </div>
                    </div>
                </div>

                <form className="contact-form" id="contactForm">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" required placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" required placeholder="john@example.com" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="serviceInterest">Service Interest</label>
                        <select id="serviceInterest" name="serviceInterest" required>
                            <option value="">Select a service category</option>
                            <option value="transportation">🚗 Luxury Transportation (Velocities)</option>
                            <option value="courier">📦 Premium Courier & Logistics (OnTarget Couriers)</option>
                            <option value="web-design">💻 Digital Solutions & Web Design (OnTarget Web Design)</option>
                            <option value="lifestyle">✨ Lifestyle Management</option>
                            <option value="travel">✈️ Luxury Travel & Hospitality</option>
                            <option value="healthcare">❤️ Healthcare Management</option>
                            <option value="real-estate">🏢 Real Estate Services</option>
                            <option value="education">🎓 Education Platform</option>
                            <option value="ecommerce">🛍️ E-commerce Solutions</option>
                            <option value="technology">⚙️ Technology Solutions</option>
                            <option value="events">🎉 Event Planning</option>
                            <option value="other">📋 Other Services</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" rows={4} placeholder="Tell us about your lifestyle needs..." required></textarea>
                    </div>
                    <button type="submit" className="btn-primary btn-full">
                        <i className="fas fa-paper-plane"></i>
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    </section>

    <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo">
                        <i className="fas fa-crown logo-icon"></i>
                        <div className="logo-content">
                            <span className="logo-text">VERIDIAN</span>
                            <span className="logo-subtitle">Private Concierge</span>
                        </div>
                    </div>
                    <p className="footer-tagline">Redefining luxury living through innovation and excellence</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#services">All Services</a></li>
                            <li><a href="#lifestyle">Lifestyle Management</a></li>
                            <li><a href="#travel">Luxury Travel</a></li>
                            <li><a href="#technology">Technology Solutions</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#membership">Membership</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#careers">Careers</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#gdpr">GDPR Compliance</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Veridian Private Concierge. All rights reserved.</p>
                <div className="footer-social">
                    <a href="https://www.facebook.com/VeridianPrivateConcierge" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Follow us on Facebook">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://twitter.com/VeridianConcierge" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" title="Follow us on Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/veridianprivate" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/veridian-private-concierge" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Connect on LinkedIn">
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://www.youtube.com/@VeridianPrivateConcierge" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="Subscribe on YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.tiktok.com/@veridianprivate" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="Follow us on TikTok">
                        <i className="fab fa-tiktok"></i>
                    </a>
                    <a href="https://www.pinterest.com/veridianprivate" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" title="Follow us on Pinterest">
                        <i className="fab fa-pinterest"></i>
                    </a>
                    <a href="https://wa.me/18888374342" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="Chat on WhatsApp">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <div className="modal" id="modal">
        <div className="modal-overlay"></div>
        <div className="modal-content">
            <button className="modal-close" aria-label="Close modal">
                <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-title" id="modalTitle">Request Exclusive Access</h2>
            <div id="modal-body">
                <form className="modal-form" id="requestAccessForm">
                    <div className="form-group">
                        <label htmlFor="modal-name">Full Name</label>
                        <input type="text" id="modal-name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="modal-email-request">Email Address</label>
                        <input type="email" id="modal-email-request" name="email" required placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="modal-membership">Membership Interest</label>
                        <select id="modal-membership" name="membership">
                            <option value="">Select a tier</option>
                            <option value="premium">Premium</option>
                            <option value="elite">Elite</option>
                            <option value="sovereign">Sovereign</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary btn-full">Submit Request</button>
                </form>

                <form className="modal-form" id="signInForm" style={{ display: 'none' }}>
                    <div className="form-group">
                        <label htmlFor="modal-email-login">Email Address</label>
                        <input type="email" id="modal-email-login" name="username" required placeholder="member@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="modal-password">Password</label>
                        <input type="password" id="modal-password" name="password" required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary btn-full">Sign In</button>
                </form>
            </div>
        </div>
    </div>

    <button className="chat-toggle" id="chatToggle" aria-label="Open live chat">
        <i className="fas fa-comments"></i>
    </button>

      <Script src="/unified-veridian-script.js" strategy="lazyOnload" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" strategy="lazyOnload" />
    </>
  );
}

```

### 2. Move Static Assets

Your new Next.js page needs access to the CSS and JavaScript files.

**Action Required:** Move the following files from the `d:\StellaGlobalClass_Production\SuggestlyG4Plus_Projects-1\veridian\` directory into a new `d:\StellaGlobalClass_Production\public\` directory:
*   `design-system-tokens.css`
*   `unified-veridian-styles.css`
*   `unified-veridian-script.js`

You can create the `public` directory if it doesn't exist. Next.js automatically serves any files placed in the `public` folder.

### 3. Clean Up the Old HTML File

Now that its content lives in `page.tsx`, the original `index.html` is no longer needed.

**Action Required:** Delete the following file:
*   `d:\StellaGlobalClass_Production\SuggestlyG4Plus_Projects-1\veridian\index.html`

By completing these steps, you have transformed your project's front door from a static page into a dynamic React application. This is the essential first step to building out the "one of a kind" features you envision, such as a real-time chauffeur booking system, personalized dashboards for members, and dynamic content that updates without a page reload.

<!--
[PROMPT_SUGGESTION]Now that the page is a React component, let's replace the static service cards with dynamic data from an API.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Migrate the custom Express APIs for contact and membership into Next.js API routes.[/PROMPT_SUGGESTION]
-->
