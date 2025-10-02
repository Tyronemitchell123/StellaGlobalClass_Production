import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const ConciergeLandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    membershipTier: 'silver',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.luxury-card, .membership-tier, .contact-card').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your interest! Our concierge team will contact you within 24 hours.');
      setFormData({
        fullName: '',
        email: '',
        company: '',
        membershipTier: 'silver',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const membershipTiers = [
    {
      id: 'silver',
      name: 'Silver',
      title: 'Essential Access',
      price: '$2,499',
      period: '/month',
      features: [
        '5 AI Service Categories',
        'Standard Response Time',
        'Basic Analytics',
        'Email Support'
      ],
      badgeClass: 'tier-silver'
    },
    {
      id: 'gold',
      name: 'Gold',
      title: 'Premium Access',
      price: '$4,999',
      period: '/month',
      features: [
        '10 AI Service Categories',
        'Priority Response Time',
        'Advanced Analytics',
        'Priority Support',
        'Custom Integrations'
      ],
      badgeClass: 'tier-gold'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      title: 'Elite Access',
      price: '$9,999',
      period: '/month',
      features: [
        'All 15+ AI Service Categories',
        'VIP Response Time',
        'Premium Analytics',
        '24/7 Dedicated Support',
        'White-Glove Service'
      ],
      badgeClass: 'tier-platinum'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      title: 'Ultra-Exclusive',
      price: 'Custom',
      period: '/month',
      features: [
        'Unlimited AI Service Access',
        'Instant Response Time',
        'Enterprise Analytics',
        'Personal Concierge Team',
        'Bespoke Solutions'
      ],
      badgeClass: 'tier-diamond'
    }
  ];

  const services = [
    {
      icon: 'fas fa-microchip',
      title: 'Technology Solutions',
      description: 'Advanced AI-driven technology solutions including SaaS platforms, software development, and digital transformation.',
      tags: ['SaaS Integration', 'Custom Development', 'Digital Transformation']
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'Healthcare Management',
      description: 'Comprehensive healthcare concierge services including appointment scheduling, specialist referrals, and wellness programs.',
      tags: ['Medical Coordination', 'Wellness Programs', 'Global Healthcare']
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Education Platform',
      description: 'Premium educational services including personalized learning paths, expert tutoring, and professional development.',
      tags: ['Personalized Learning', 'Expert Instruction', 'Career Development']
    },
    {
      icon: 'fas fa-building',
      title: 'Real Estate Services',
      description: 'Comprehensive real estate solutions including property acquisition, luxury home management, and portfolio optimization.',
      tags: ['Property Acquisition', 'Luxury Management', 'Portfolio Optimization']
    },
    {
      icon: 'fas fa-plane',
      title: 'Travel & Hospitality',
      description: 'Luxury travel planning including exclusive accommodations, private transportation, and curated experiences.',
      tags: ['Luxury Travel', 'Exclusive Experiences', 'Global Logistics']
    },
    {
      icon: 'fas fa-shopping-bag',
      title: 'E-commerce Solutions',
      description: 'Complete e-commerce and retail solutions including online store management and luxury shopping services.',
      tags: ['Online Retail', 'Luxury Shopping', 'Supply Chain']
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'Personalized assessment of your needs and requirements'
    },
    {
      step: 2,
      title: 'Custom Proposal',
      description: 'Tailored service package based on your specific requirements'
    },
    {
      step: 3,
      title: 'VIP Onboarding',
      description: 'White-glove setup and personalized integration'
    },
    {
      step: 4,
      title: 'Concierge Activation',
      description: 'Immediate access to your AI-powered concierge services'
    }
  ];

  const contactInfo = [
    {
      icon: 'fas fa-phone-alt',
      title: 'Phone',
      details: ['+1 (888) VERIDIAN', '+1 (888) 837-4342'],
      label: '24/7 VIP Support'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      details: ['concierge@veridianprivate.com', 'vip@veridianprivate.com'],
      label: 'Response within 1 hour'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Locations',
      details: ['New York | London | Dubai', 'Singapore | Tokyo | Sydney'],
      label: 'Global Presence'
    }
  ];

  return (
    <>
      <Head>
        <title>Veridian Private Concierge - Premium AI-Powered Concierge Services</title>
        <meta name="description" content="Veridian Private Concierge offers comprehensive AI-powered concierge services covering technology, healthcare, education, real estate, travel, e-commerce, and luxury lifestyle management for elite clients worldwide." />
        <meta name="keywords" content="concierge services, AI assistance, luxury lifestyle, technology solutions, healthcare management, education platform, real estate services, travel planning, e-commerce solutions, premium service" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Navigation */}
      <nav className={`navbar ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="navbar-logo">
              <i className="fas fa-crown gold-text"></i>
              <span>Veridian Private</span>
            </div>
          </div>
          <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li><button onClick={() => scrollToSection('#services')} className="navbar-link">Services</button></li>
            <li><button onClick={() => scrollToSection('#membership')} className="navbar-link">Membership</button></li>
            <li><button onClick={() => scrollToSection('#exclusive')} className="navbar-link">Exclusive Access</button></li>
            <li><button onClick={() => scrollToSection('#contact')} className="navbar-link">Contact</button></li>
          </ul>
          <div className="navbar-cta">
            <button onClick={() => scrollToSection('#exclusive')} className="btn btn-primary">Exclusive Access</button>
          </div>
          <div className="navbar-toggle" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero concierge-hero">
        <div className="floating-elements">
          <div className="floating-element diamond"></div>
          <div className="floating-element circle"></div>
          <div className="floating-element square"></div>
        </div>

        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-badge">
              <i className="fas fa-gem"></i>
              <span>Premium Multi-Service Concierge</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line">Comprehensive AI Concierge</span>
              <span className="title-line gold-text">For Every Aspect of Your Life</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of premium lifestyle management with cutting-edge AI technology
              covering technology, healthcare, education, real estate, travel, e-commerce, and luxury services.
            </p>
            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-value gold-text">15+</span>
                <span className="metric-label">AI Service Categories</span>
              </div>
              <div className="metric-item">
                <span className="metric-value gold-text">99.9%</span>
                <span className="metric-label">Automation Rate</span>
              </div>
              <div className="metric-item">
                <span className="metric-value gold-text">24/7</span>
                <span className="metric-label">AI Operations</span>
              </div>
            </div>
            <div className="hero-actions">
              <button onClick={() => scrollToSection('#exclusive')} className="btn btn-primary btn-large">
                <i className="fas fa-lock"></i>
                Request Access
              </button>
              <button onClick={() => scrollToSection('#services')} className="btn btn-secondary btn-large">
                <i className="fas fa-play"></i>
                View Demo
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glass p-8 rounded-2xl">
              <i className="fas fa-brain text-6xl gold-text mb-4 block text-center"></i>
              <p className="text-center text-gray-300">
                Neural Network AI Processing
              </p>
              <div className="flex justify-center mt-4 space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-concierge-bell"></i>
              <span>Premium Services</span>
            </div>
            <h2 className="section-title">
              <span className="title-line">AI-Powered Excellence</span>
              <span className="title-line gold-text">Across All Domains</span>
            </h2>
            <p className="section-subtitle">
              Comprehensive AI-powered solutions across 15+ service categories,
              all automated and delivered with white-glove service excellence.
            </p>
          </div>

          <div className="grid grid-3 services-grid">
            {services.map((service, index) => (
              <div key={index} className="luxury-card">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
                <div className="card-features">
                  {service.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="feature-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-crown"></i>
              <span>Membership Tiers</span>
            </div>
            <h2 className="section-title">
              <span className="title-line">Exclusive Membership</span>
              <span className="title-line gold-text">For Elite Clients</span>
            </h2>
            <p className="section-subtitle">
              Choose your level of exclusive access to our AI-powered concierge services.
            </p>
          </div>

          <div className="grid grid-4 membership-grid">
            {membershipTiers.map((tier) => (
              <div key={tier.id} className="membership-tier">
                <div className={`tier-badge ${tier.badgeClass}`}>{tier.name}</div>
                <h3 className="tier-title">{tier.title}</h3>
                <div className="tier-price">{tier.price}<span className="period">{tier.period}</span></div>
                <div className="exclusive-features">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="exclusive-feature">
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className={`btn ${tier.id === 'silver' ? 'btn-secondary' : 'btn-primary'} btn-block`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, membershipTier: tier.id }));
                    scrollToSection('#exclusive');
                  }}
                >
                  {tier.id === 'diamond' ? 'Contact for Diamond' : `Choose ${tier.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Access Section */}
      <section id="exclusive" className="section concierge-hero">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-lock"></i>
              <span>Exclusive Access</span>
            </div>
            <h2 className="section-title">
              <span className="title-line">Request Your Private</span>
              <span className="title-line gold-text">Concierge Access</span>
            </h2>
            <p className="section-subtitle">
              Join the elite circle of clients who experience the future of AI-powered lifestyle management.
            </p>
          </div>

          <div className="grid grid-2">
            <div className="luxury-card">
              <h3 className="card-title">Application Process</h3>
              <div className="process-steps">
                {processSteps.map((step, index) => (
                  <div key={index} className="process-step">
                    <div className="step-number">{step.step}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="luxury-card">
              <h3 className="card-title">Access Request Form</h3>
              <form className="access-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company/Organization</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="membershipTier">Interest Level</label>
                  <select
                    id="membershipTier"
                    name="membershipTier"
                    value={formData.membershipTier}
                    onChange={handleInputChange}
                  >
                    <option value="silver">Silver - Essential Access</option>
                    <option value="gold">Gold - Premium Access</option>
                    <option value="platinum">Platinum - Elite Access</option>
                    <option value="diamond">Diamond - Ultra-Exclusive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Specific Requirements</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your specific needs and requirements..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Request Exclusive Access
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-phone-alt"></i>
              <span>Contact Information</span>
            </div>
            <h2 className="section-title">
              <span className="title-line">Get in Touch</span>
              <span className="title-line gold-text">With Our Team</span>
            </h2>
            <p className="section-subtitle">
              Our dedicated concierge team is available to assist you with any inquiries.
            </p>
