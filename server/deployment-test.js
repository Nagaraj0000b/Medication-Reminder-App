// deployment-test.js
// Run this script to test if your deployment is working correctly
// Usage: node deployment-test.js [API_URL]

const fetch = require('node-fetch');

// Get API URL from command line argument or use default
const API_URL = process.argv[2] || 'http://localhost:8000';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper to log with color
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// Test endpoints
const testEndpoints = async () => {
  log.title('MEDICATION REMINDER APP - DEPLOYMENT TEST');
  log.info(`Testing API at: ${API_URL}`);
  log.info('Running tests...\n');

  // Test 1: Health Check
  try {
    log.info('Testing health endpoint...');
    const response = await fetch(`${API_URL}/health`);
    
    if (response.ok) {
      const data = await response.json();
      log.success(`Health check passed: ${JSON.stringify(data)}`);
    } else {
      log.error(`Health check failed with status: ${response.status}`);
      log.warn('You may need to add a /health endpoint to your server');
    }
  } catch (error) {
    log.error(`Health check error: ${error.message}`);
  }

  // Test 2: CORS Headers
  try {
    log.info('\nTesting CORS headers...');
    const response = await fetch(`${API_URL}/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
      },
    });
    
    const corsHeader = response.headers.get('access-control-allow-origin');
    if (corsHeader) {
      log.success(`CORS headers present: ${corsHeader}`);
    } else {
      log.error('CORS headers missing');
      log.warn('Your API may not be accessible from your frontend');
    }
  } catch (error) {
    log.error(`CORS test error: ${error.message}`);
  }

  // Test 3: Database Connection
  try {
    log.info('\nTesting database connection...');
    const response = await fetch(`${API_URL}/medications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // No auth token, should get 401 if auth is working
      },
    });
    
    if (response.status === 401) {
      log.success('Authentication working correctly (got 401 without token)');
    } else if (response.ok) {
      log.warn('Got 200 without authentication token - check your auth middleware');
    } else {
      log.error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    log.error(`Database test error: ${error.message}`);
  }

  log.title('\nSUMMARY');
  log.info('These tests provide a basic check of your deployment.');
  log.info('If any tests failed, check the error messages and your server logs.');
  log.info('Remember to:');
  log.info('1. Add a /health endpoint to your server');
  log.info('2. Configure CORS correctly');
  log.info('3. Check that your database connection is working');
  log.info('4. Verify that authentication is working properly');
  log.info('\nFor more detailed diagnostics, use tools like Postman or the browser DevTools.');
};

// Run the tests
testEndpoints().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
});
