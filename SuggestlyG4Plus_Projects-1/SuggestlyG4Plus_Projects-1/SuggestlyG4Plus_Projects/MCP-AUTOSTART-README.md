# MCP Server Auto-Start functionality

This document describes the enhanced auto-restart capabilities implemented for the Integrated MCP AI Server.

## Overview

The MCP Server now includes comprehensive auto-restart functionality that ensures the server automatically recovers from failures and restarts when necessary. This capability operates at multiple levels:

1. **Application-level auto-restart** - Built into the server itself
2. **Process-level auto-restart** - Managed by the startup script
3. **System-level auto-restart** - Configurable for system services

## Features

### 🔧 Enhanced Server Configuration

The server now includes additional configuration options:

```javascript
const SERVER_CONFIG = {
  AUTOSTART_ENABLED: process.env.AUTOSTART_ENABLED === 'true',
  MAX_RESTART_ATTEMPTS: parseInt(process.env.MAX_RESTART_ATTEMPTS) || 5,
  RESTART_DELAY: parseInt(process.env.RESTART_DELAY) || 5000,
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000
};
```

### 🏥 Health Monitoring

The server includes a comprehensive health monitoring system that:

- Monitors memory usage (threshold: 500MB)
- Tracks error rates (threshold: 50%)
- Checks system resources
- Performs automatic health checks every 30 seconds
- Initiates restart when health checks fail

### 🔄 Auto-Restart Manager

A dedicated `AutoRestartManager` class handles:

- Graceful shutdown and restart procedures
- Configurable restart attempts (default: 5)
- Restart delay configuration (default: 5 seconds)
- Proper cleanup of resources
- Logging of restart events

## Usage

### Environment Variables

Configure auto-restart behavior using these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTOSTART_ENABLED` | `false` | Enable/disable auto-restart functionality |
| `MAX_RESTART_ATTEMPTS` | `5` | Maximum number of restart attempts before giving up |
| `RESTART_DELAY` | `5000` | Delay between restart attempts in milliseconds |
| `HEALTH_CHECK_INTERVAL` | `30000` | Health check interval in milliseconds |

### Starting the Server

#### Method 1: Direct Execution with Auto-Restart

```bash
# Enable auto-restart
AUTOSTART_ENABLED=true node src/integrated-mcp-ai-server-updated.js

# With custom configuration
AUTOSTART_ENABLED=true \
MAX_RESTART_ATTEMPTS=10 \
RESTART_DELAY=3000 \
HEALTH_CHECK_INTERVAL=15000 \
node src/integrated-mcp-ai-server-updated.js
```

#### Method 2: Using the Auto-Start Script

```bash
# Start with auto-restart enabled
node scripts/start-mcp-server.js start

# Check status
node scripts/start-mcp-server.js status

# View logs
node scripts/start-mcp-server.js logs info
node scripts/start-mcp-server.js logs error

# Stop server
node scripts/start-mcp-server.js stop
```

#### Method 3: System Service (Linux/systemd)

1. Create a systemd service file:

```bash
sudo nano /etc/systemd/system/mcp-server.service
```

2. Add the following configuration:

```ini
[Unit]
Description=Integrated MCP AI Server
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/SuggestlyG4Plus_Projects
ExecStart=/usr/bin/node scripts/start-mcp-server.js start
ExecReload=/bin/kill -HUP $MAINPID
ExecStop=/usr/bin/node scripts/start-mcp-server.js stop
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=AUTOSTART_ENABLED=true
Environment=PORT=8001
Environment=MAX_RESTART_ATTEMPTS=5
Environment=RESTART_DELAY=5000
Environment=HEALTH_CHECK_INTERVAL=30000

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/path/to/SuggestlyG4Plus_Projects/logs

# Resource limits
LimitNOFILE=65536
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mcp-server
sudo systemctl start mcp-server
sudo systemctl status mcp-server
```

#### Method 4: Windows Service

1. **Using NSSM (Non-Sucking Service Manager)**:

```bash
# Download and install NSSM from https://nssm.cc

# Install the service
nssm install MCPAIServer "C:\Program Files\nodejs\node.exe" "C:\path\to\SuggestlyG4Plus_Projects\scripts\start-mcp-server.js" "start"

# Configure the service
nssm set MCPAIServer AppDirectory "C:\path\to\SuggestlyG4Plus_Projects"
nssm set MCPAIServer DisplayName "Integrated MCP AI Server"
nssm set MCPAIServer Description "Integrated MCP AI Server with auto-restart capabilities"
nssm set MCPAIServer AppEnvironmentExtra "NODE_ENV=production" "AUTOSTART_ENABLED=true" "PORT=8001"

# Start the service
nssm start MCPAIServer
```

2. **Using Windows Task Scheduler**:

- Create a new task that runs on system startup
- Set the action to: `node scripts/start-mcp-server.js start`
- Configure it to run with highest privileges
- Set recovery options to restart the service on failure

#### Method 5: Process Managers

**Using PM2:**

```bash
# Install PM2
npm install -g pm2

# Start the server with auto-restart
pm2 start scripts/start-mcp-server.js --name mcp-server -- start

# Configure auto-restart settings
pm2 set mcp-server autorestart true
pm2 set mcp-server max_restarts 10
pm2 set mcp-server min_uptime 30000

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor the process
pm2 status mcp-server
pm2 logs mcp-server
```

**Using forever:**

```bash
# Install forever
npm install -g forever

# Start with auto-restart
forever start -c "node scripts/start-mcp-server.js start" --minUptime 30000 --spinSleepTime 5000

# List running processes
forever list

# View logs
forever logs
```

## Monitoring and Logs

### Health Check Endpoint

The server provides a health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-09-29T00:00:00.000Z",
  "uptime": 123456,
  "services": {
    "mcp": "running",
    "ai": "initialized",
    "web": "active"
  },
  "metrics": {
    "totalRequests": 100,
    "totalErrors": 2,
    "errorRate": "2.00%",
    "toolExecutions": 50,
    "uptime": "123s",
    "restartCount": 0,
    "lastRestart": null
  },
  "system": {
    "nodeVersion": "v18.17.0",
    "platform": "win32",
    "memoryUsage": {...},
    "cpuUsage": {...},
    "healthCheck": {...}
  }
}
```

### Log Files

The auto-start script creates log files in the `logs/` directory:

- `logs/mcp-server-info.log` - General information logs
- `logs/mcp-server-error.log` - Error logs

### Monitoring Commands

```bash
# Check server status
curl http://localhost:8001/api/health

# Follow application logs
node scripts/start-mcp-server.js logs info

# Follow error logs
node scripts/start-mcp-server.js logs error

# Check process status
node scripts/start-mcp-server.js status
```

## Troubleshooting

### Common Issues

1. **Server not starting**:
   - Check if port 8001 is available
   - Verify Node.js version compatibility
   - Check log files for error messages

2. **Auto-restart not working**:
   - Ensure `AUTOSTART_ENABLED=true` is set
   - Check health check configuration
   - Verify file permissions for log directory

3. **Memory issues**:
   - Monitor memory usage via `/api/health`
   - Adjust `MAX_RESTART_ATTEMPTS` if needed
   - Check for memory leaks in custom code

4. **Service not starting on boot**:
   - Verify service configuration
   - Check system logs for service errors
   - Ensure proper file permissions

### Debug Commands

```bash
# Test server startup manually
node src/integrated-mcp-ai-server-updated.js

# Test with auto-restart enabled
AUTOSTART_ENABLED=true node src/integrated-mcp-ai-server-updated.js

# Check system resources
node scripts/start-mcp-server.js status

# View recent logs
tail -f logs/mcp-server-info.log
tail -f logs/mcp-server-error.log

# Test health endpoint
curl http://localhost:8001/api/health | jq .
```

## Configuration Examples

### Development Environment

```bash
# Development with auto-restart for testing
NODE_ENV=development \
AUTOSTART_ENABLED=true \
MAX_RESTART_ATTEMPTS=3 \
RESTART_DELAY=2000 \
HEALTH_CHECK_INTERVAL=10000 \
node src/integrated-mcp-ai-server-updated.js
```

### Production Environment

```bash
# Production with robust auto-restart
NODE_ENV=production \
AUTOSTART_ENABLED=true \
MAX_RESTART_ATTEMPTS=10 \
RESTART_DELAY=5000 \
HEALTH_CHECK_INTERVAL=30000 \
PORT=8001 \
node scripts/start-mcp-server.js start
```

### High Availability Setup

```bash
# High availability with aggressive monitoring
NODE_ENV=production \
AUTOSTART_ENABLED=true \
MAX_RESTART_ATTEMPTS=20 \
RESTART_DELAY=1000 \
HEALTH_CHECK_INTERVAL=5000 \
PORT=8001 \
pm2 start scripts/start-mcp-server.js --name mcp-server-ha -- start
```

## Best Practices

1. **Monitor Regularly**: Use the health endpoint and logs to monitor server status
2. **Configure Appropriately**: Adjust restart parameters based on your environment
3. **Test Failover**: Test auto-restart functionality in a safe environment
4. **Log Management**: Implement log rotation to prevent disk space issues
5. **Resource Monitoring**: Monitor system resources and adjust thresholds as needed
6. **Security**: Ensure proper file permissions and access controls

## Support

For issues or questions regarding the auto-restart functionality:

1. Check the log files in the `logs/` directory
2. Review the health status via `/api/health`
3. Consult the troubleshooting section above
4. Verify environment variable configuration

The auto-restart functionality ensures your MCP Server remains operational and responsive, automatically recovering from failures and maintaining high availability.
