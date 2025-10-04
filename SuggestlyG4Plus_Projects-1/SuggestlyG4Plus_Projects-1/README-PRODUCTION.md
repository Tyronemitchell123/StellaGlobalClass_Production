were ar  Global Class Production Server

A premium, enterprise-grade production server with auto-start capabilities for global class projects.

## Features

### 🚀 Core Features
- **Auto-Start Production**: Automatically starts in production mode
- **Global Class Architecture**: Enterprise-grade server architecture
- **Premium Security**: Helmet.js security middleware with CORS configuration
- **Health Monitoring**: Built-in health check endpoints
- **Graceful Shutdown**: Proper server shutdown handling

### 💎 Premium Features
- **Production-Ready Deployment**: Optimized for production environments
- **Auto-Scaling Capabilities**: Built for scalability
- **Enterprise-Grade Security**: Advanced security configurations
- **Premium Analytics Dashboard**: Metrics and monitoring endpoints
- **Advanced Monitoring**: Real-time server metrics
- **Global CDN Integration**: CDN support for global delivery
- **24/7 Premium Support**: Production-ready support structure

### 🏗️ Domain Management
- **Multi-Domain Support**: Auto-start for multiple domains:
  - Velocities (Port 3001)
  - Concierge (Port 3002)
  - OnTarget Web Design (Port 3003)

## Quick Start

### Method 1: Using the Auto-Start Script (Recommended)
```bash
# Windows
start-production.bat
```

### Method 2: Using NPM
```bash
npm install
npm start
```

### Method 3: Direct Node.js
```bash
set NODE_ENV=production
node auto-start-production.js
```

## Configuration

### Environment Variables
Create a `.env.production` file with the following configuration:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Security Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Premium Features
PREMIUM_MODE=true
GLOBAL_ACCESS=true
ENTERPRISE_SECURITY=true
AUTO_SCALING=true

# Monitoring
ENABLE_METRICS=true
ENABLE_HEALTH_CHECK=true
ENABLE_PREMIUM_ANALYTICS=true

# Domain Configuration
DOMAIN_VELOCITIES_ENABLED=true
DOMAIN_CONCIERGE_ENABLED=true
DOMAIN_ONTARGETWEBDESIGN_ENABLED=true
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status and timestamp.

### Main Server Info
```
GET /
```
Returns server information and configuration.

### Premium Features
```
GET /api/premium
```
Returns available premium features and capabilities.

### Server Metrics
```
GET /api/metrics
```
Returns real-time server metrics including:
- Uptime
- Memory usage
- Node.js version
- Platform information

### Domain Management
```
GET /api/domains
```
Returns status and information for all managed domains.

## File Structure

```
├── auto-start-production.js    # Main server file
├── start-production.bat        # Windows auto-start script
├── .env.production            # Production environment variables
├── package.json               # Project dependencies and scripts
├── README-PRODUCTION.md       # This documentation
└── public/                    # Static files directory
```

## Dependencies

### Production Dependencies
- **express**: Web server framework
- **helmet**: Security middleware
- **cors**: CORS configuration
- **morgan**: HTTP request logging
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Development server with auto-restart

## Server Management

### Starting the Server
```bash
# Using npm script
npm start

# Using the batch file
start-production.bat

# Direct execution
node auto-start-production.js
```

### Stopping the Server
- Press `Ctrl+C` in the terminal
- The server will shut down gracefully
- All connections will be properly closed

### Restarting the Server
```bash
# Stop the server (Ctrl+C)
# Then start again:
npm start
```

## Monitoring

### Health Checks
The server provides automatic health monitoring:
- **Health Endpoint**: `/health`
- **Metrics Endpoint**: `/api/metrics`
- **Domain Status**: `/api/domains`

### Logging
- Request logging with Morgan
- Error logging with timestamps
- Console output for server status

## Security Features

### Built-in Security
- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Optional rate limiting configuration
- **Environment Variables**: Secure configuration management

### Production Security
- **SSL/TLS Support**: Configurable HTTPS
- **CDN Integration**: Global content delivery
- **Backup Configuration**: Automated backup settings
- **Enterprise Authentication**: Ready for integration

## Troubleshooting

### Port Already in Use
If you get "Port 3000 is already in use":
1. Find the process using the port:
   ```bash
   netstat -ano | findstr :3000
   ```
2. Kill the process:
   ```bash
   taskkill /PID <process_id> /F
   ```

### Dependencies Issues
```bash
# Reinstall dependencies
npm install

# Clear cache and reinstall
npm cache clean --force
npm install
```

### Environment Variables Not Loading
1. Ensure `.env.production` file exists
2. Check file permissions
3. Verify syntax (no spaces around `=`)

## Production Deployment

### Environment Setup
1. Copy `.env.production` to production server
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

### Process Management
For production deployment, consider using:
- **PM2**: Process manager for Node.js
- **Systemd**: Linux service manager
- **Windows Service**: Windows service integration

### Scaling
- **Horizontal Scaling**: Multiple instances behind load balancer
- **Vertical Scaling**: Increase server resources
- **Auto-Scaling**: Cloud provider auto-scaling

## Support

### Documentation
- This README file
- Code comments in `auto-start-production.js`
- Environment variable documentation in `.env.production`

### Premium Support
- 24/7 monitoring capabilities
- Enterprise-grade security features
- Global CDN integration
- Advanced analytics dashboard

## License

MIT License - See package.json for details.

---

**Stella Global Class Production Server** - Enterprise-grade auto-start production server for premium global class projects.
