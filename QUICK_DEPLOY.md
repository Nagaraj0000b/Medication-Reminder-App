# Quick Deployment Guide

This is a simplified guide for deploying your Medication Reminder App.

## 1. Frontend (Vercel)

1. Push your code to GitHub
2. Sign up at [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Configure:
   - Root Directory: `client`
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
6. Deploy

## 2. Database (Railway)

1. Sign up at [Railway](https://railway.app/)
2. Create a new project with MySQL
3. Save connection details:
   - Host
   - Username
   - Password
   - Database
   - Port
4. Execute schema.mysql.sql in the SQL editor

## 3. Backend (Render)

1. Sign up at [Render](https://render.com/)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Set environment variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT` (from Railway)
   - `JWT_SECRET` (random string)
   - `EMAIL_USER`, `EMAIL_PASS` (for OTP emails)
   - `CLIENT_URL` (your Vercel frontend URL)
6. Deploy

## Testing

After deployment, visit your frontend URL and try to:
1. Create a new account
2. Add a medication
3. Set a reminder
4. Navigate between screens

## Common Issues

- **CORS errors**: Check that your backend's CORS config includes your frontend URL
- **Database connection errors**: Verify credentials and that DB is accessible
- **Authentication errors**: Ensure JWT_SECRET is set correctly
- **Render sleep mode**: Use a service like UptimeRobot to ping your backend periodically

For more details, see the full DEPLOYMENT_GUIDE.md
