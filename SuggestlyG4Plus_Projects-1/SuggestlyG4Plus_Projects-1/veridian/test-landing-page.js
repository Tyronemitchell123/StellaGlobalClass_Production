/**
 * Automated Test Script for Veridian Landing Page
 * Tests backend integration, form validation, and API endpoints
 */

const http = require('http');

// Test configuration
const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Make HTTP request
 */
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => reject(error));

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

/**
 * Log test result
 */
function logTest(name, passed, message = '') {
  const status = passed ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
  console.log(`${status} - ${name}`);
  if (message) {
    console.log(`   ${colors.cyan}${message}${colors.reset}`);
  }

  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Log warning
 */
function logWarning(name, message) {
  console.log(`${colors.yellow}⚠️  WARN${colors.reset} - ${name}`);
  console.log(`   ${colors.cyan}${message}${colors.reset}`);
  results.warnings++;
}

/**
 * Test 1: Backend Health Check
 */
async function testBackendHealth() {
  console.log(`\n${colors.blue}=== Testing Backend Health ===${colors.reset}`);

  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      logTest('Backend Health Endpoint', true, `Status: ${data.status}, Uptime: ${data.uptime}s`);
      return true;
    } else {
      logTest('Backend Health Endpoint', false, `Status code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logTest('Backend Health Endpoint', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 2: Contact Form Submission
 */
async function testContactForm() {
  console.log(`\n${colors.blue}=== Testing Contact Form ===${colors.reset}`);

  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    serviceInterest: 'Technology Solutions',
    message: 'This is a test message from automated testing'
  };

  try {
    const postData = JSON.stringify(testData);
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body);
      logTest('Contact Form Submission', true, `Submission ID: ${data.submissionId}`);
      return true;
    } else {
      logTest('Contact Form Submission', false, `Status code: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logTest('Contact Form Submission', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 3: Invalid Form Data
 */
async function testInvalidFormData() {
  console.log(`\n${colors.blue}=== Testing Form Validation ===${colors.reset}`);

  const invalidData = {
    fullName: '',
    email: 'invalid-email',
    serviceInterest: '',
    message: ''
  };

  try {
    const postData = JSON.stringify(invalidData);
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);

    if (response.statusCode === 400) {
      logTest('Form Validation (Invalid Data)', true, 'Correctly rejected invalid data');
      return true;
    } else {
      logTest('Form Validation (Invalid Data)', false, `Expected 400, got ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logTest('Form Validation (Invalid Data)', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 4: CORS Headers
 */
async function testCORS() {
  console.log(`\n${colors.blue}=== Testing CORS Configuration ===${colors.reset}`);

  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const hasCORS = response.headers['access-control-allow-origin'] !== undefined;
    logTest('CORS Headers Present', hasCORS, `CORS: ${response.headers['access-control-allow-origin'] || 'Not set'}`);
    return hasCORS;
  } catch (error) {
    logTest('CORS Headers Present', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 5: Response Time
 */
async function testResponseTime() {
  console.log(`\n${colors.blue}=== Testing Response Time ===${colors.reset}`);

  try {
    const startTime = Date.now();
    await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    });
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const passed = responseTime < 1000; // Should respond within 1 second
    logTest('Response Time', passed, `Response time: ${responseTime}ms (Target: <1000ms)`);
    return passed;
  } catch (error) {
    logTest('Response Time', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 6: Multiple Concurrent Requests
 */
async function testConcurrentRequests() {
  console.log(`\n${colors.blue}=== Testing Concurrent Requests ===${colors.reset}`);

  try {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/health',
        method: 'GET'
      }));
    }

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();

    const allSuccessful = responses.every(r => r.statusCode === 200);
    const totalTime = endTime - startTime;

    logTest('Concurrent Requests', allSuccessful, `10 requests completed in ${totalTime}ms`);
    return allSuccessful;
  } catch (error) {
    logTest('Concurrent Requests', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test 7: Error Handling
 */
async function testErrorHandling() {
  console.log(`\n${colors.blue}=== Testing Error Handling ===${colors.reset}`);

  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/nonexistent',
      method: 'GET'
    });

    const passed = response.statusCode === 404;
    logTest('404 Error Handling', passed, `Status code: ${response.statusCode}`);
    return passed;
  } catch (error) {
    logTest('404 Error Handling', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Print final summary
 */
function printSummary() {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

  const total = results.passed + results.failed;
  const passRate = ((results.passed / total) * 100).toFixed(1);

  console.log(`\n${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${results.warnings}${colors.reset}`);
  console.log(`\nTotal Tests: ${total}`);
  console.log(`Pass Rate: ${passRate}%`);

  if (results.failed === 0) {
    console.log(`\n${colors.green}🎉 ALL TESTS PASSED! 🎉${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  SOME TESTS FAILED${colors.reset}`);
  }

  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}VERIDIAN LANDING PAGE - AUTOMATED TEST SUITE${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`\nBackend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Test Date: ${new Date().toISOString()}\n`);

  // Run all tests
  await testBackendHealth();
  await testContactForm();
  await testInvalidFormData();
  await testCORS();
  await testResponseTime();
  await testConcurrentRequests();
  await testErrorHandling();

  // Print summary
  printSummary();

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
