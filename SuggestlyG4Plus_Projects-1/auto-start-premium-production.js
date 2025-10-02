const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Veridian Private Concierge Premium Production Server...');
console.log('📅 Timestamp:', new Date().toISOString());

// Check if required files exist
const requiredFiles = [
    'premium-production-server.js',
    'veridian/index.html',
    'veridian/unified-veridian-styles.css',
    'veridian/unified-veridian-script.js',
    'package.json'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    process.exit(1);
}

console.log('✅ All required files found');

// Environment setup
const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '3000',
    HOST: process.env.HOST || '0.0.0.0'
};

console.log('🌍 Environment:', env.NODE_ENV);
console.log('🔌 Port:', env.PORT);
console.log('🌐 Host:', env.HOST);

// Start the premium production server
console.log('🎯 Launching premium production server...');
const serverProcess = spawn('node', ['premium-production-server.js'], {
    cwd: __dirname,
    env: env,
    stdio: 'inherit'
});

serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
});

serverProcess.on('exit', (code, signal) => {
    if (code !== 0) {
        console.error(`❌ Server exited with code ${code}${signal ? ` and signal ${signal}` : ''}`);

        // Auto-restart logic
        console.log('🔄 Attempting to restart server in 5 seconds...');
        setTimeout(() => {
            console.log('🚀 Restarting premium production server...');
            spawn('node', [__filename], {
                cwd: __dirname,
                env: env,
                stdio: 'inherit',
                detached: true
            }).unref();
            process.exit(0);
        }, 5000);
    } else {
        console.log('✅ Server stopped gracefully');
    }
});

// Handle process termination
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    serverProcess.kill('SIGINT');
});

console.log('✅ Premium production server startup initiated');
console.log('🎯 Serving professional landing page instead of dev server');
console.log('🌟 Veridian Private Concierge - Premium AI Lifestyle Management');
