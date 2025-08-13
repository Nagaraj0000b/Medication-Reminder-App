# Railway Connection Details

This file contains your Railway database connection information. 

⚠️ **IMPORTANT: KEEP THIS FILE PRIVATE** ⚠️
- Never commit this file to Git
- Add it to your .gitignore file
- This file contains sensitive credentials

## Connection Information

### Host
```
shuttle.proxy.rlwy.net
```

### Port
```
37133
```

### Database
```
railway
```

### Username
```
root
```

### Protocol
```
TCP
```

## Connection Methods

### 1. Environment Variables for your .env file
```
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=37133
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_DATABASE=railway
DB_SSL=true
```

### 2. Connection String (for tools that use URL format)
```
DATABASE_URL=mysql://root:YOUR_PASSWORD_HERE@shuttle.proxy.rlwy.net:37133/railway
```

### 3. Connect via MySQL CLI
```bash
mysql -h shuttle.proxy.rlwy.net -u root -p --port 37133 --protocol=TCP railway
```
When prompted, enter your password.

### 4. Connect via Railway CLI
```bash
railway connect MySQL
```

## Testing Connection

Run the test script to verify your connection:
```bash
node server/railway-test.js
```

Or use the Windows batch file:
```
test-railway-connection.bat
```

## Troubleshooting

If you have connection issues:

1. Make sure your credentials are correct
2. Check if your IP is allowed (Railway may restrict access)
3. Try using the Railway proxy URL
4. Verify SSL settings

See the RAILWAY_CONNECTION_GUIDE.md for detailed troubleshooting.
