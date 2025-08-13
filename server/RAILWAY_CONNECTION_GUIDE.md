# Railway Database Connection Guide

This guide will help you connect your Medication Reminder App to a Railway MySQL database.

## Getting Started with Railway

1. **Create a Railway Account**
   - Go to [Railway.app](https://railway.app/)
   - Sign up with GitHub or Email

2. **Create a New Project**
   - Click "New Project" in the dashboard
   - Select "Provision MySQL"

3. **Access Your Database**
   - Click on your MySQL service
   - Go to the "Connect" tab
   - Copy the connection details

## Connection Parameters

Railway provides two ways to connect to your database:

### Option 1: Connection String
```
MYSQL_URL=mysql://<username>:<password>@<host>:<port>/<database>
```

### Option 2: Individual Parameters
```
MYSQL_HOST=<host>
MYSQL_PORT=<port>
MYSQL_USER=<username>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database>
```

## Setting Up Your Environment Variables

1. **Local Development**
   - Create a `.env` file in your server directory
   - Add the following variables:
   ```
   DB_HOST=your-railway-mysql-host.railway.app
   DB_USER=your-railway-username
   DB_PASSWORD=your-railway-password
   DB_DATABASE=your-railway-database
   DB_PORT=3306
   DB_SSL=true
   ```

2. **Railway Deployment**
   - If you deploy your backend to Railway, the environment variables are automatically provided
   - Update `railway-config.js` to use these automatic variables

## Testing Your Connection

1. **Run the Test Script**
   ```bash
   node railway-test.js
   ```

2. **Check the Output**
   - If successful, you'll see "CONNECTION SUCCESSFUL!"
   - If it fails, follow the troubleshooting tips provided

## Common Connection Issues

### 1. "Access denied" Error
- Double-check your username and password
- Make sure you're using the right database name
- Verify the user has proper permissions

### 2. Timeout Error
- Check your network connection
- Verify Railway hasn't restricted access by IP
- Try connecting from a different network

### 3. SSL Error
- Make sure SSL is enabled (DB_SSL=true)
- Your MySQL client might need specific SSL configurations
- Try updating mysql2 to the latest version

### 4. "Unknown database" Error
- The database specified doesn't exist
- You need to create the database first
- Run the schema.mysql.sql file to set up your database

## Railway Database Management

### Importing Your Schema
1. Go to your MySQL service in Railway
2. Click on the "Data" tab
3. Use the SQL editor to paste and run your `schema.mysql.sql` file

### Monitoring Usage
1. Go to the "Metrics" tab to monitor usage
2. Keep an eye on storage usage to stay within your plan limits

## Switching Between Local and Railway Databases

Add this code to your app's initialization to automatically detect Railway:

```javascript
const { setupRailwayDb } = require('./railway-config');

// Auto-detect and use Railway environment variables if available
setupRailwayDb();

// Continue with normal database initialization
const db = require('./db.railway.js');
```

## Still Having Issues?

If you're still experiencing connection problems:

1. Check Railway's status page: [status.railway.app](https://status.railway.app/)
2. Verify your Railway plan hasn't expired or hit limits
3. Try creating a new database instance on Railway
4. Contact Railway support through their Discord community

Remember to never commit your actual database credentials to Git. Always use environment variables and .env files (which should be in your .gitignore).
