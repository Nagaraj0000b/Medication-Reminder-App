# Medication Reminder App Deployment Guide

This guide provides step-by-step instructions for deploying the Medication Reminder App using affordable services with free tiers for development.

## Table of Contents
1. [Overview](#overview)
2. [Frontend Deployment (Vercel/Netlify)](#frontend-deployment)
3. [Database Deployment (PlanetScale)](#database-deployment)
4. [Backend Deployment (Render)](#backend-deployment)
5. [Environment Variables](#environment-variables)
6. [Testing the Deployment](#testing-the-deployment)
7. [Troubleshooting](#troubleshooting)

## Overview

Our deployment strategy separates the three main components:
- **Frontend**: React app hosted on Vercel or Netlify (both have generous free tiers)
- **Database**: MySQL hosted on Railway or Supabase (both have free/hobby tiers)
- **Backend**: Node.js/Express API hosted on Render (free tier available)

This approach allows each component to be scaled independently and takes advantage of specialized hosting for each part of the stack.

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. Sign up at [Vercel](https://vercel.com/) using your GitHub account
2. Create a new project and import your GitHub repository
3. Configure the project:
   - Root Directory: `client`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - `VITE_API_URL` = your backend URL (e.g., `https://medication-reminder-api.onrender.com`)
5. Click "Deploy"

### Option 2: Netlify

1. Sign up at [Netlify](https://www.netlify.com/) using your GitHub account
2. Create a new site from Git
3. Configure the build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in the "Site settings" > "Build & deploy" > "Environment":
   - `VITE_API_URL` = your backend URL
5. Deploy the site

## Database Deployment

### Option 1: Railway (Free Tier for Development)

1. Sign up for [Railway](https://railway.app/)
2. Create a new project
3. Add a MySQL database to your project
4. Connect to your database using the provided credentials
5. Go to the "Query" tab and paste the contents of `server/schema.mysql.sql` to create your tables
6. Save the connection details:
   - Host
   - Username
   - Password
   - Database name
   - Port

### Option 2: Supabase (Free Tier)

1. Sign up for [Supabase](https://supabase.com/)
2. Create a new project
3. Go to SQL Editor and run the contents of `server/schema.mysql.sql` (with minor modifications for PostgreSQL)
4. Save the connection details from the "Settings" > "Database" section:
   - Host
   - Username
   - Password
   - Database name
   - Port

## Backend Deployment

### Render

1. Sign up at [Render](https://render.com/) using your GitHub account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service:
   - Name: `medication-reminder-api`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Add environment variables:
   - `DB_HOST` = Railway/Supabase host
   - `DB_USER` = Railway/Supabase username
   - `DB_PASSWORD` = Railway/Supabase password
   - `DB_DATABASE` = Railway/Supabase database name
   - `DB_PORT` = Railway/Supabase port (usually 3306 for MySQL or 5432 for PostgreSQL)
   - `JWT_SECRET` = a random string for JWT token generation (use a password generator)
   - `EMAIL_USER` = your email for sending OTPs
   - `EMAIL_PASS` = your email app password
   - `CLIENT_URL` = your frontend URL (from Vercel/Netlify)
6. Deploy the service

## Environment Variables

### Frontend (.env in client folder)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend (.env in server folder)
```
DB_HOST=your-railway-host
DB_USER=your-railway-username
DB_PASSWORD=your-railway-password
DB_DATABASE=your-railway-database
DB_PORT=3306
JWT_SECRET=your-random-jwt-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=8000
```

## Testing the Deployment

1. Navigate to your frontend URL
2. Try to create a new account
3. Verify your email with the OTP
4. Log in to the application
5. Add a medication and reminder
6. Check that reminders are displayed correctly

## Troubleshooting

### CORS Issues
If you're seeing CORS errors in the console:
1. Check that your backend's CORS configuration includes your frontend URL
2. Make sure the protocol (http/https) matches
3. Verify environment variables are correctly set

### Database Connection Issues
If your backend can't connect to the database:
1. Check the connection string format
2. Verify your Railway/Supabase credentials
3. Make sure the correct port is specified
4. Check for SSL configuration requirements
5. For Railway, ensure your IP is allowed or use their proxy connection

### Frontend API Connection Issues
If your frontend can't connect to the backend:
1. Check the VITE_API_URL environment variable
2. Make sure the URL doesn't have a trailing slash
3. Check for HTTPS mixed content issues

### Render Sleep Mode
On Render's free tier, your backend will sleep after 15 minutes of inactivity. The first request after sleep will be slow as the service spins up again. To keep it active:
1. Set up a health check ping service like [UptimeRobot](https://uptimerobot.com/) (free tier available)
2. Configure it to ping your backend URL every 10 minutes

## Maintenance

### Updating Your Application
1. Push changes to your GitHub repository
2. Vercel/Netlify and Render will automatically rebuild and deploy your application

### Monitoring
1. Use the built-in logs in Vercel/Netlify and Render
2. Set up free monitoring with [UptimeRobot](https://uptimerobot.com/)

---

For questions or assistance, refer to each platform's documentation or support channels.
