const request = require('supertest');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Create a test app instance
function createTestApp() {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  }));

  app.use(cors({
    origin: ['*'],
    credentials: true
  }));

  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString(), project: 'Stella Global Class' });
  });

  // Premium features endpoint
  app.get('/api/premium', (req, res) => {
    res.json({
      premium: true,
      features: [
        'Global Class Architecture',
        'Production-Ready Deployment',
        'Auto-Scaling Capabilities',
        'Enterprise-Grade Security',
        'Premium Analytics Dashboard',
        'Advanced Monitoring',
        'Global CDN Integration',
        '24/7 Premium Support'
      ]
    });
  });

  // Metrics endpoint
  app.get('/api/metrics', (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
      uptime: uptime,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      nodeVersion: process.version,
      platform: process.platform
    });
  });

  // Domains endpoint
  app.get('/api/domains', (req, res) => {
    res.json({
      domains: [
        {
          name: 'velocities',
          status: 'active',
          url: 'http://localhost:3001'
        },
        {
          name: 'concierge',
          status: 'active',
          url: 'http://localhost:3002'
        },
        {
          name: 'ontargetwebdesign',
          status: 'active',
          url: 'http://localhost:3003'
        }
      ]
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

describe('API Endpoints - Unit Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    test('should return OK status', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('OK');
    });

    test('should return timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    test('should return project name', async () => {
      const response = await request(app).get('/health');
      expect(response.body.project).toBe('Stella Global Class');
    });

    test('should return JSON content type', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('GET /api/premium', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/api/premium');
      expect(response.status).toBe(200);
    });

    test('should return premium flag as true', async () => {
      const response = await request(app).get('/api/premium');
      expect(response.body.premium).toBe(true);
    });

    test('should return array of features', async () => {
      const response = await request(app).get('/api/premium');
      expect(Array.isArray(response.body.features)).toBe(true);
      expect(response.body.features.length).toBeGreaterThan(0);
    });

    test('should include expected premium features', async () => {
      const response = await request(app).get('/api/premium');
      const features = response.body.features;

      expect(features).toContain('Global Class Architecture');
      expect(features).toContain('Enterprise-Grade Security');
      expect(features).toContain('24/7 Premium Support');
    });

    test('should return JSON content type', async () => {
      const response = await request(app).get('/api/premium');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('GET /api/metrics', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.status).toBe(200);
    });

    test('should return uptime', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.body.uptime).toBeDefined();
      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });

    test('should return memory metrics', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.body.memory).toBeDefined();
      expect(response.body.memory.rss).toBeDefined();
      expect(response.body.memory.heapTotal).toBeDefined();
      expect(response.body.memory.heapUsed).toBeDefined();
      expect(response.body.memory.external).toBeDefined();
    });

    test('should return Node.js version', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.body.nodeVersion).toBeDefined();
      expect(response.body.nodeVersion).toMatch(/^v\d+\.\d+\.\d+/);
    });

    test('should return platform information', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.body.platform).toBeDefined();
      expect(['win32', 'darwin', 'linux']).toContain(response.body.platform);
    });

    test('memory values should be formatted correctly', async () => {
      const response = await request(app).get('/api/metrics');
      expect(response.body.memory.rss).toMatch(/^\d+MB$/);
      expect(response.body.memory.heapTotal).toMatch(/^\d+MB$/);
      expect(response.body.memory.heapUsed).toMatch(/^\d+MB$/);
    });
  });

  describe('GET /api/domains', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/api/domains');
      expect(response.status).toBe(200);
    });

    test('should return domains array', async () => {
      const response = await request(app).get('/api/domains');
      expect(response.body.domains).toBeDefined();
      expect(Array.isArray(response.body.domains)).toBe(true);
    });

    test('should return 3 domains', async () => {
      const response = await request(app).get('/api/domains');
      expect(response.body.domains.length).toBe(3);
    });

    test('should include velocities domain', async () => {
      const response = await request(app).get('/api/domains');
      const velocities = response.body.domains.find(d => d.name === 'velocities');

      expect(velocities).toBeDefined();
      expect(velocities.status).toBe('active');
      expect(velocities.url).toBe('http://localhost:3001');
    });

    test('should include concierge domain', async () => {
      const response = await request(app).get('/api/domains');
      const concierge = response.body.domains.find(d => d.name === 'concierge');

      expect(concierge).toBeDefined();
      expect(concierge.status).toBe('active');
      expect(concierge.url).toBe('http://localhost:3002');
    });

    test('should include ontargetwebdesign domain', async () => {
      const response = await request(app).get('/api/domains');
      const ontarget = response.body.domains.find(d => d.name === 'ontargetwebdesign');

      expect(ontarget).toBeDefined();
      expect(ontarget.status).toBe('active');
      expect(ontarget.url).toBe('http://localhost:3003');
    });

    test('all domains should have required properties', async () => {
      const response = await request(app).get('/api/domains');

      response.body.domains.forEach(domain => {
        expect(domain).toHaveProperty('name');
        expect(domain).toHaveProperty('status');
        expect(domain).toHaveProperty('url');
      });
    });
  });

  describe('404 Error Handling', () => {
    test('should return 404 for non-existent route', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    test('should return error message for 404', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.body.error).toBe('Not Found');
      expect(response.body.message).toBe('The requested resource was not found');
    });

    test('should return timestamp in 404 response', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.body.timestamp).toBeDefined();
    });

    test('should return JSON for 404 errors', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers from helmet', async () => {
      const response = await request(app).get('/health');

      // Helmet adds various security headers
      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBeDefined();
    });

    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://example.com');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Response Time', () => {
    test('health endpoint should respond quickly', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200); // Should respond in less than 200ms
    });

    test('metrics endpoint should respond quickly', async () => {
      const start = Date.now();
      await request(app).get('/api/metrics');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });

    test('premium endpoint should respond quickly', async () => {
      const start = Date.now();
      await request(app).get('/api/premium');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });

  describe('Content Type Validation', () => {
    test('all API endpoints should return JSON', async () => {
      const endpoints = ['/health', '/api/premium', '/api/metrics', '/api/domains'];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.headers['content-type']).toMatch(/json/);
      }
    });
  });

  describe('HTTP Methods', () => {
    test('should only accept GET for health endpoint', async () => {
      const postResponse = await request(app).post('/health');
      expect([404, 405]).toContain(postResponse.status);
    });

    test('should only accept GET for API endpoints', async () => {
      const endpoints = ['/api/premium', '/api/metrics', '/api/domains'];

      for (const endpoint of endpoints) {
        const postResponse = await request(app).post(endpoint);
        expect([404, 405]).toContain(postResponse.status);
      }
    });
  });
});

describe('Data Validation Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  test('health response should have valid structure', async () => {
    const response = await request(app).get('/health');

    expect(response.body).toMatchObject({
      status: expect.any(String),
      timestamp: expect.any(String),
      project: expect.any(String)
    });
  });

  test('premium response should have valid structure', async () => {
    const response = await request(app).get('/api/premium');

    expect(response.body).toMatchObject({
      premium: expect.any(Boolean),
      features: expect.any(Array)
    });
  });

  test('metrics response should have valid structure', async () => {
    const response = await request(app).get('/api/metrics');

    expect(response.body).toMatchObject({
      uptime: expect.any(Number),
      memory: expect.any(Object),
      nodeVersion: expect.any(String),
      platform: expect.any(String)
    });
  });

  test('domains response should have valid structure', async () => {
    const response = await request(app).get('/api/domains');

    expect(response.body).toMatchObject({
      domains: expect.any(Array)
    });

    response.body.domains.forEach(domain => {
      expect(domain).toMatchObject({
        name: expect.any(String),
        status: expect.any(String),
        url: expect.any(String)
      });
    });
  });
});
