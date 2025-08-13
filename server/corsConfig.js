// CORS configuration for deployment
const cors = require('cors');
require('dotenv').config();

// Get the client URL from environment variables
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS options
const corsOptions = {
  origin: [
    clientUrl,
    // Add any additional origins if needed
    // 'https://your-secondary-frontend.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours in seconds
};

// CORS middleware function
const configureCors = () => {
  return cors(corsOptions);
};

// For debugging CORS issues
const debugCors = (req, res, next) => {
  console.log(`CORS: Request from origin: ${req.headers.origin}`);
  next();
};

module.exports = {
  configureCors,
  debugCors,
  corsOptions
};

/*
USAGE:

In your index.js file:

const express = require('express');
const { configureCors, debugCors } = require('./corsConfig');
const app = express();

// Debug CORS in development
if (process.env.NODE_ENV !== 'production') {
  app.use(debugCors);
}

// Apply CORS middleware
app.use(configureCors());

// Your routes and other middleware...
*/
