// healthRoutes.js - Health check endpoints for monitoring
const express = require('express');
const router = express.Router();
const db = require('./db'); // Import your database connection

// Basic health check endpoint
router.get('/', async (req, res) => {
  try {
    // Get server status
    const serverStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    // Return success response
    return res.status(200).json(serverStatus);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Detailed health check with database connection test
router.get('/detailed', async (req, res) => {
  try {
    const health = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development',
      database: 'checking...',
      memory: process.memoryUsage(),
    };

    // Test database connection
    try {
      // Query to test connection
      const result = await db.query('SELECT 1 AS test');
      health.database = result && result.length > 0 ? 'connected' : 'error';
    } catch (dbError) {
      health.database = 'error';
      health.databaseError = dbError.message;
    }

    // Return health check results
    return res.status(200).json(health);
  } catch (error) {
    console.error('Detailed health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Detailed health check failed',
      error: error.message
    });
  }
});

module.exports = router;

/*
USAGE:

In your index.js file:

const healthRoutes = require('./healthRoutes');

// Health check endpoints (no auth required)
app.use('/health', healthRoutes);

// Make sure to place this BEFORE any auth middleware
// so health checks can run without authentication
*/
