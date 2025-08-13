# README: Deploying Your Medication Reminder App to Render

This guide explains how to deploy your Medication Reminder App to Render.com for free. Render offers a managed cloud platform that allows you to host both your React frontend and Node.js backend without needing to keep your laptop on.

## Prerequisites

1. Create a [Render account](https://render.com/)
2. Connect your GitHub repository to Render
3. Have your MongoDB Atlas connection string ready (or other database)

## Step 1: Deploy the Backend (Node.js Server)

1. Go to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: medication-reminder-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free
   
5. Add environment variables:
   - `NODE_ENV` = production
   - `PORT` = 10000 (Render will override this)
   - `JWT_SECRET` = [a secure random string]
   - `ALLOWED_ORIGINS` = https://your-frontend-name.onrender.com
   - [Add your database connection variables]

6. Click "Create Web Service"

## Step 2: Deploy the Frontend (React App)

1. Go to your Render dashboard
2. Click "New" and select "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: medication-reminder-app
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL` = [URL of your backend service]

5. Click "Create Static Site"

## Step 3: Connect Your Services

Make sure your frontend application is correctly configured to communicate with your backend service by setting the `VITE_API_URL` environment variable in the frontend deployment settings.

## Checking Your Deployment

1. Your backend API will be available at: `https://medication-reminder-api.onrender.com`
2. Your frontend app will be available at: `https://medication-reminder-app.onrender.com`

## Troubleshooting

If you encounter issues:

1. Check Render logs for both services
2. Verify environment variables are correctly set
3. Make sure CORS is properly configured in your backend
4. Ensure API calls use the correct URL format

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Router for SPA Routing](https://reactrouter.com/en/main)
