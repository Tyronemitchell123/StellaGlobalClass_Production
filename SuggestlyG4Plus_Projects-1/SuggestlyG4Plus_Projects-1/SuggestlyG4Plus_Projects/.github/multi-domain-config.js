/**
 * Multi-Domain Configuration System for MCP Server
 * Enables white-label solutions for multiple businesses
 */

const domainConfigs = {
  // Default Veridian Configuration
  'localhost:3001': {
    business: {
      name: 'Veridian',
      tagline: 'Next-Gen AI Concierge Platform',
      description: 'Advanced AI-powered concierge services with neural networks and real-time processing'
    },
    branding: {
      logo: '👑',
      primaryColor: '#ffd700',
      secondaryColor: '#0a0a1a',
      theme: 'luxury'
    },
    features: {
      aiChat: true,
      cameraBot: true,
      analytics: true,
      weather: true,
      subscriptionPlans: true
    },
    subscription: {
      currency: 'USD',
      plans: [
        {
          name: 'Basic',
          price: 199,
          features: ['Core AI Assistance', 'Basic Analytics', 'Email Support']
        },
        {
          name: 'Pro',
          price: 30000,
          featured: true,
          features: ['Advanced AI Features', 'Real-time Processing', 'Priority Support', 'Custom Integrations']
        },
        {
          name: 'Enterprise',
          price: 5000,
          features: ['All Pro Features', 'Dedicated Server', '24/7 Support', 'Custom Development']
        },
        {
          name: 'Ultra Premium',
          price: 15000,
          features: ['All Enterprise Features', 'UHNWI Lifestyle Concierge', 'Private Jet Bookings', 'Yacht Charters']
        },
        {
          name: 'Elite',
          price: 999,
          features: ['All Ultra Premium Features', '24/7 Dedicated Concierge', 'Global Security Services', 'Custom AI Lifestyle Coach']
        }
      ]
    },
    contact: {
      email: 'hello@veridian.ai',
      phone: '+1 (555) 123-4567',
      support: 'support@veridian.ai'
    }
  },

  // Business Example 1: Healthcare AI Platform
  'healthcare-ai.com:3001': {
    business: {
      name: 'MediAI',
      tagline: 'Intelligent Healthcare Solutions',
      description: 'AI-powered medical diagnostics and patient care management'
    },
    branding: {
      logo: '🏥',
      primaryColor: '#00a8e8',
      secondaryColor: '#ffffff',
      theme: 'healthcare'
    },
    features: {
      aiChat: true,
      cameraBot: false, // Disabled for healthcare privacy
      analytics: true,
      weather: false,
      subscriptionPlans: true
    },
    subscription: {
      currency: 'USD',
      plans: [
        {
          name: 'Clinic',
          price: 299,
          features: ['Basic AI Diagnostics', 'Patient Management', 'Email Support']
        },
        {
          name: 'Hospital',
          price: 1999,
          featured: true,
          features: ['Advanced AI Diagnostics', 'Real-time Monitoring', 'Priority Support', 'HIPAA Compliance']
        },
        {
          name: 'Enterprise',
          price: 9999,
          features: ['All Hospital Features', 'Dedicated Server', '24/7 Medical Support', 'Custom Integration']
        }
      ]
    },
    contact: {
      email: 'info@mediai.com',
      phone: '+1 (555) 987-6543',
      support: 'support@mediai.com'
    }
  },

  // Business Example 2: Financial AI Platform
  'finance-ai.com:3001': {
    business: {
      name: 'FinTech AI',
      tagline: 'Smart Financial Intelligence',
      description: 'AI-powered financial analysis and investment management'
    },
    branding: {
      logo: '💰',
      primaryColor: '#2ecc71',
      secondaryColor: '#27ae60',
      theme: 'finance'
    },
    features: {
      aiChat: true,
      cameraBot: false,
      analytics: true,
      weather: false,
      subscriptionPlans: true
    },
    subscription: {
      currency: 'USD',
      plans: [
        {
          name: 'Personal',
          price: 99,
          features: ['Basic AI Analysis', 'Portfolio Tracking', 'Email Support']
        },
        {
          name: 'Professional',
          price: 499,
          featured: true,
          features: ['Advanced AI Analysis', 'Real-time Trading', 'Priority Support', 'Risk Management']
        },
        {
          name: 'Institutional',
          price: 4999,
          features: ['All Professional Features', 'Dedicated Server', '24/7 Trading Support', 'Custom Algorithms']
        }
      ]
    },
    contact: {
      email: 'info@fintechai.com',
      phone: '+1 (555) 456-7890',
      support: 'support@fintechai.com'
    }
  },

  // Business Example 3: Education AI Platform
  'edu-ai.com:3001': {
    business: {
      name: 'EduAI',
      tagline: 'Intelligent Learning Solutions',
      description: 'AI-powered education platforms and personalized learning'
    },
    branding: {
      logo: '🎓',
      primaryColor: '#9b59b6',
      secondaryColor: '#8e44ad',
      theme: 'education'
    },
    features: {
      aiChat: true,
      cameraBot: false,
      analytics: true,
      weather: false,
      subscriptionPlans: true
    },
    subscription: {
      currency: 'USD',
      plans: [
        {
          name: 'Classroom',
          price: 149,
          features: ['Basic AI Tutoring', 'Student Management', 'Email Support']
        },
        {
          name: 'School',
          price: 999,
          featured: true,
          features: ['Advanced AI Tutoring', 'Real-time Progress', 'Priority Support', 'Custom Curriculum']
        },
        {
          name: 'District',
          price: 4999,
          features: ['All School Features', 'Dedicated Server', '24/7 Educational Support', 'District-wide Analytics']
        }
      ]
    },
    contact: {
      email: 'info@eduai.com',
      phone: '+1 (555) 234-5678',
      support: 'support@eduai.com'
    }
  }
};

// Domain detection middleware
function domainMiddleware(req, res, next) {
  const host = req.headers.host || 'localhost:3001';
  const config = domainConfigs[host] || domainConfigs['localhost:3001'];
  
  // Attach config to request for use in routes
  req.domainConfig = config;
  req.businessName = config.business.name;
  req.businessTheme = config.branding.theme;
  
  next();
}

// Dynamic content generator based on domain
function generateBrandedContent(config, templateType) {
  const { business, branding, features } = config;
  
  switch (templateType) {
    case 'index':
      return generateIndexPage(config);
    case 'subscription':
      return generateSubscriptionPage(config);
    case 'dashboard':
      return generateDashboardConfig(config);
    default:
      return generateIndexPage(config);
  }
}

// Generate branded index page
function generateIndexPage(config) {
  const { business, branding } = config;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - ${business.tagline}</title>
    <meta name="description" content="${business.description}">
    <style>
        :root {
            --primary-color: ${branding.primaryColor};
            --secondary-color: ${branding.secondaryColor};
        }
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .tagline {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .description {
            font-size: 1.2rem;
            margin-bottom: 3rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }
        .cta-button {
            background: var(--primary-color);
            color: var(--secondary-color);
            padding: 1rem 2rem;
            border: none;
            border-radius: 50px;
            font-size: 1.2rem;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        .cta-button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">${branding.logo}</div>
        <h1>${business.name}</h1>
        <p class="tagline">${business.tagline}</p>
        <p class="description">${business.description}</p>
        <a href="/dashboard" class="cta-button">Access Dashboard</a>
        <a href="/subscription.html" class="cta-button" style="margin-left: 1rem;">View Plans</a>
    </div>
</body>
</html>
  `;
}

// Generate branded subscription page
function generateSubscriptionPage(config) {
  const { business, branding, subscription } = config;
  
  let plansHTML = subscription.plans.map(plan => `
    <div class="pricing-card ${plan.featured ? 'featured' : ''}">
        ${plan.featured ? '<div class="pricing-badge">Most Popular</div>' : ''}
        <div class="pricing-header">
            <h3>${plan.name}</h3>
            <div class="pricing-price">
                <span class="price">$${plan.price}</span>
                <span class="period">/month</span>
            </div>
            <p>Perfect for your needs</p>
        </div>
        <ul class="pricing-features">
            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <button type="button" class="pricing-btn btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}">
            ${plan.featured ? 'Subscribe' : 'Get Started'}
        </button>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Subscription Plans</title>
    <style>
        :root {
            --primary-color: ${branding.primaryColor};
            --secondary-color: ${branding.secondaryColor};
        }
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: var(--secondary-color);
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        .pricing-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            border: 2px solid var(--primary-color);
            transition: transform 0.3s ease;
        }
        .pricing-card:hover {
            transform: translateY(-5px);
        }
        .pricing-card.featured {
            border-color: var(--primary-color);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
        }
        .pricing-badge {
            background: var(--primary-color);
            color: var(--secondary-color);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
            position: absolute;
            top: -10px;
            right: 20px;
        }
        .pricing-header h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }
        .pricing-price {
            margin-bottom: 1rem;
        }
        .price {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }
        .period {
            font-size: 1rem;
            opacity: 0.8;
        }
        .pricing-features {
            list-style: none;
            padding: 0;
            margin: 2rem 0;
        }
        .pricing-features li {
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pricing-btn {
            background: var(--primary-color);
            color: var(--secondary-color);
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        }
        .pricing-btn:hover {
            background: var(--secondary-color);
            color: var(--primary-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${branding.logo}</div>
            <h1>${business.name} Subscription Plans</h1>
            <p>Choose the perfect plan for your needs</p>
        </div>
        <div class="pricing-grid">
            ${plansHTML}
        </div>
    </div>
</body>
</html>
  `;
}

// Generate dashboard configuration
function generateDashboardConfig(config) {
  const { business, branding, features } = config;
  
  return {
    business: business.name,
    theme: branding.theme,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    logo: branding.logo,
    enabledFeatures: features
  };
}

module.exports = {
  domainConfigs,
  domainMiddleware,
  generateBrandedContent,
  generateIndexPage,
  generateSubscriptionPage,
  generateDashboardConfig
};
