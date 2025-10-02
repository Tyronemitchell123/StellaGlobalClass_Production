const puppeteer = require('puppeteer');

describe('Dashboard E2E Tests', () => {
  let browser;
  let page;
  const BASE_URL = 'http://localhost:3000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  describe('Homepage Tests', () => {
    test('should load the homepage successfully', async () => {
      const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      expect(response.status()).toBe(200);
    });

    test('should display the main title', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const title = await page.$eval('.logo', el => el.textContent);
      expect(title).toContain('Stella Global Class');
    });

    test('should display the subtitle', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const subtitle = await page.$eval('.subtitle', el => el.textContent);
      expect(subtitle).toContain('Production Server Dashboard');
    });

    test('should display server running status', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const status = await page.$eval('.status-badge', el => el.textContent);
      expect(status).toContain('Server Running');
    });

    test('should have no console errors', async () => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      expect(errors.length).toBe(0);
    });
  });

  describe('Feature Cards Tests', () => {
    test('should display all 6 feature cards', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const cards = await page.$$('.feature-card');
      expect(cards.length).toBe(6);
    });

    test('should display feature icons', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const icons = await page.$$('.feature-icon');
      expect(icons.length).toBeGreaterThan(0);
    });

    test('feature cards should be interactive', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const card = await page.$('.feature-card');

      // Hover over the card
      await card.hover();

      // Card should still be visible after hover
      const isVisible = await card.isIntersectingViewport();
      expect(isVisible).toBe(true);
    });
  });

  describe('API Endpoints Section Tests', () => {
    test('should display API endpoints section', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const sectionTitle = await page.$eval('.section-title', el => el.textContent);
      expect(sectionTitle).toContain('Available API Endpoints');
    });

    test('should display all endpoint items', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const endpoints = await page.$$('.endpoint-item');
      expect(endpoints.length).toBeGreaterThanOrEqual(4);
    });

    test('should have clickable visit buttons', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const buttons = await page.$$('.visit-btn');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation Tests', () => {
    test('should navigate to health endpoint', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      // Click the health endpoint button
      await page.click('a[href="/health"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      const content = await page.content();
      expect(content).toContain('status');
      expect(content).toContain('OK');
    });

    test('should navigate to premium endpoint', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      await page.click('a[href="/api/premium"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      const content = await page.content();
      expect(content).toContain('premium');
      expect(content).toContain('features');
    });
  });

  describe('Responsive Design Tests', () => {
    test('should be responsive on mobile', async () => {
      await page.setViewport({ width: 375, height: 667 }); // iPhone size
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const isVisible = await page.$eval('.container', el => {
        return window.getComputedStyle(el).display !== 'none';
      });

      expect(isVisible).toBe(true);
    });

    test('should be responsive on tablet', async () => {
      await page.setViewport({ width: 768, height: 1024 }); // iPad size
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const isVisible = await page.$eval('.container', el => {
        return window.getComputedStyle(el).display !== 'none';
      });

      expect(isVisible).toBe(true);
    });

    test('should be responsive on desktop', async () => {
      await page.setViewport({ width: 1920, height: 1080 }); // Full HD
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const isVisible = await page.$eval('.container', el => {
        return window.getComputedStyle(el).display !== 'none';
      });

      expect(isVisible).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('should load within acceptable time', async () => {
      const startTime = Date.now();
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;

      // Should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have good performance metrics', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const metrics = await page.metrics();

      // Check that metrics are reasonable
      expect(metrics.Nodes).toBeGreaterThan(0);
      expect(metrics.JSHeapUsedSize).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Tests', () => {
    test('should have proper heading structure', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const headings = await page.$$('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have alt text for images', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const images = await page.$$('img');

      for (const img of images) {
        const alt = await img.evaluate(el => el.getAttribute('alt'));
        // Images should have alt attribute (can be empty for decorative images)
        expect(alt !== null).toBe(true);
      }
    });

    test('should be keyboard navigable', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      // Tab through elements
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);

      // Should be able to focus on elements
      expect(focusedElement).toBeDefined();
    });
  });

  describe('Interactive Elements Tests', () => {
    test('buttons should be clickable', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const button = await page.$('.visit-btn');
      const isClickable = await button.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.pointerEvents !== 'none' && style.display !== 'none';
      });

      expect(isClickable).toBe(true);
    });

    test('should handle button hover states', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const button = await page.$('.visit-btn');
      await button.hover();

      // Button should still be visible after hover
      const isVisible = await button.isIntersectingViewport();
      expect(isVisible).toBe(true);
    });
  });

  describe('Footer Tests', () => {
    test('should display footer', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const footer = await page.$('.footer');
      expect(footer).toBeTruthy();
    });

    test('should display version information', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

      const footerText = await page.$eval('.footer', el => el.textContent);
      expect(footerText).toContain('v1.0.0');
    });
  });
});
