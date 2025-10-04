#!/usr/bin/env node

/**
 * MCP Server Auto-Start Script
 *
 * This script provides system-level autostart capabilities for the MCP server.
 * It can be used with:
 * - System services (systemd, launchd)
 * - Process managers (PM2, forever, nodemon)
 * - Direct execution
 * - Windows Task Scheduler
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const CONFIG = {
  serverPath: path.join(__dirname, '../src/integrated-mcp-ai-server-updated.js'),
  logPath: path.join(__dirname, '../logs'),
  pidPath: path.join(__dirname, '../mcp-server.pid'),
  maxMemory: '512',
  nodeEnv: process.env.NODE_ENV || 'production',
  autostartEnabled: process.env.AUTOSTART_ENABLED !== 'false'
};

// Ensure log directory exists
if (!fs.existsSync(CONFIG.logPath)) {
  fs.mkdirSync(CONFIG.logPath, { recursive: true });
}

class MCPServerManager {
  constructor() {
    this.process = null;
    this.startTime = null;
    this.restartCount = 0;
    this.maxRestarts = 10;
    this.restartDelay = 5000;
  }

  start() {
    console.log('🚀 Starting MCP Server with auto-restart capabilities...');

    if (this.process && !this.process.killed) {
      console.log('⚠️  Server is already running');
      return;
    }

    const env = {
      ...process.env,
      NODE_ENV: CONFIG.nodeEnv,
      AUTOSTART_ENABLED: CONFIG.autostartEnabled.toString(),
      PORT: process.env.PORT || 8001,
      MAX_RESTART_ATTEMPTS: '5',
      RESTART_DELAY: '5000',
      HEALTH_CHECK_INTERVAL: '30000'
    };

    const args = [
      '--max-old-space-size=' + CONFIG.maxMemory,
      '--unhandled-rejections=strict',
      CONFIG.serverPath
    ];

    this.process = spawn('node', args, {
      env,
      stdio: 'pipe',
      detached: false
    });

    this.startTime = Date.now();

    // Handle process output
    this.process.stdout.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        console.log(`[MCP] ${message}`);
        this.writeToLog('info', message);
      }
    });

    this.process.stderr.on('data', (data) => {
      const message = data.toString().trim();
      if (message) {
        console.error(`[MCP ERROR] ${message}`);
        this.writeToLog('error', message);
      }
    });

    // Handle process exit
    this.process.on('exit', (code, signal) => {
      console.log(`📴 MCP Server exited with code ${code}, signal ${signal}`);
      this.writeToLog('info', `Server exited with code ${code}, signal ${signal}`);

      this.handleRestart();
    });

    this.process.on('error', (error) => {
      console.error(`❌ MCP Server error: ${error.message}`);
      this.writeToLog('error', `Server error: ${error.message}`);

      this.handleRestart();
    });

    // Write PID file
    fs.writeFileSync(CONFIG.pidPath, this.process.pid.toString());

    console.log(`✅ MCP Server started with PID ${this.process.pid}`);
    console.log(`📄 Logs available in: ${CONFIG.logPath}`);
    console.log(`⚙️  Configuration:`, {
      nodeEnv: CONFIG.nodeEnv,
      autostartEnabled: CONFIG.autostartEnabled,
      maxMemory: CONFIG.maxMemory
    });
  }

  handleRestart() {
    if (this.restartCount >= this.maxRestarts) {
      console.error(`❌ Maximum restart attempts (${this.maxRestarts}) reached. Giving up.`);
      this.writeToLog('error', `Maximum restart attempts reached. Stopping.`);
      process.exit(1);
    }

    this.restartCount++;
    console.log(`🔄 Restarting server (attempt ${this.restartCount}/${this.maxRestarts}) in ${this.restartDelay}ms...`);
    this.writeToLog('info', `Restarting server (attempt ${this.restartCount}/${this.maxRestarts})`);

    setTimeout(() => {
      this.start();
    }, this.restartDelay);
  }

  stop() {
    if (!this.process || this.process.killed) {
      console.log('⚠️  Server is not running');
      return;
    }

    console.log('🛑 Stopping MCP Server...');

    this.process.kill('SIGTERM');

    // Wait for graceful shutdown
    setTimeout(() => {
      if (!this.process.killed) {
        console.log('⚠️  Force killing server...');
        this.process.kill('SIGKILL');
      }

      // Remove PID file
      if (fs.existsSync(CONFIG.pidPath)) {
        fs.unlinkSync(CONFIG.pidPath);
      }

      console.log('✅ MCP Server stopped');
      this.writeToLog('info', 'Server stopped by manager');
    }, 5000);
  }

  getStatus() {
    if (!this.process || this.process.killed) {
      return { status: 'stopped', pid: null, uptime: null, restartCount: this.restartCount };
    }

    const uptime = this.startTime ? Date.now() - this.startTime : 0;

    return {
      status: 'running',
      pid: this.process.pid,
      uptime: uptime,
      restartCount: this.restartCount,
      startTime: this.startTime ? new Date(this.startTime).toISOString() : null
    };
  }

  writeToLog(level, message) {
    const timestamp = new Date().toISOString();
    const logFile = path.join(CONFIG.logPath, `mcp-server-${level}.log`);
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFile, logEntry);
  }

  cleanup() {
    if (fs.existsSync(CONFIG.pidPath)) {
      fs.unlinkSync(CONFIG.pidPath);
    }
  }
}

// Command line interface
const manager = new MCPServerManager();

const command = process.argv[2];

switch (command) {
  case 'start':
    manager.start();
    break;

  case 'stop':
    manager.stop();
    break;

  case 'restart':
    manager.stop();
    setTimeout(() => manager.start(), 2000);
    break;

  case 'status':
    const status = manager.getStatus();
    console.log('📊 MCP Server Status:', JSON.stringify(status, null, 2));
    process.exit(status.status === 'running' ? 0 : 1);
    break;

  case 'logs':
    const logType = process.argv[3] || 'info';
    const logFile = path.join(CONFIG.logPath, `mcp-server-${logType}.log`);

    if (fs.existsSync(logFile)) {
      const tail = require('child_process').spawn('tail', ['-f', logFile]);
      tail.stdout.pipe(process.stdout);
      tail.stderr.pipe(process.stderr);

      process.on('SIGINT', () => {
        tail.kill();
        process.exit(0);
      });
    } else {
      console.error(`❌ Log file not found: ${logFile}`);
      process.exit(1);
    }
    break;

  default:
    console.log(`
MCP Server Manager

Usage: node start-mcp-server.js <command>

Commands:
  start     Start the MCP server with auto-restart
  stop      Stop the MCP server
  restart   Restart the MCP server
  status    Show server status
  logs [type]  Follow logs (info, error)

Environment Variables:
  NODE_ENV              Environment (development/production)
  AUTOSTART_ENABLED     Enable auto-restart (true/false)
  PORT                  Server port (default: 8001)
  MAX_RESTART_ATTEMPTS  Maximum restart attempts (default: 5)
  RESTART_DELAY         Restart delay in ms (default: 5000)
  HEALTH_CHECK_INTERVAL Health check interval in ms (default: 30000)

Examples:
  node start-mcp-server.js start
  AUTOSTART_ENABLED=true node start-mcp-server.js start
  node start-mcp-server.js status
  node start-mcp-server.js logs error
`);
    process.exit(1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  manager.cleanup();
  manager.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  manager.cleanup();
  manager.stop();
  process.exit(0);
});
