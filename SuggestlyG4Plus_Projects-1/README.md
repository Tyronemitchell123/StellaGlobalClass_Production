# Stella Global Class Production Server

A premium, enterprise-grade production server with auto-start capabilities for global class projects.

## Features

### Core Features
- **Next.js Framework**: Full-stack application built on Next.js and React.
- **Custom Express Server**: Enhanced server capabilities with a custom Express.js backend.
- **Premium Security**: Helmet.js security middleware with a strong Content Security Policy.
- **Health Monitoring**: Built-in health check endpoints.
- **API Endpoints**: Pre-built API endpoints for metrics, premium features, and domain status.
- **Graceful Shutdown**: Proper server shutdown handling.

### Premium Features
- **Production-Ready Deployment**: Optimized for production environments.
- **Enterprise-Grade Security**: Advanced security configurations.
- **Premium Analytics Dashboard**: Metrics and monitoring endpoints.

## Project Structure

```
SuggestlyG4Plus_Projects-1/
├── public/              # For static files like images, fonts
├── src/                 # All source code
│   ├── pages/           # Next.js pages and API routes
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── api/
│   └── server.js        # The single, unified Express server
├── .env.production      # Environment variables
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json
├── README.md            # This documentation
└── next.config.js
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

This will start the server with `nodemon`, which will automatically restart the server on file changes.

### 3. Run in Production Mode

```bash
npm start
```

This will start the server in production mode.

### 4. Build for Production

```bash
npm run build
```

This will create an optimized production build of the Next.js application.

## Configuration

Create a `.env.production` file in the root of the project with the following variables:

```env
# Server Configuration
NODE_ENV=production
PORT=3000

# Security Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## API Endpoints

- **GET /health**: Returns server health status.
- **GET /api/premium**: Returns available premium features.
- **GET /api/metrics**: Returns real-time server metrics.
- **GET /api/domains**: Returns status and information for all managed domains.

## Linting and Formatting

- **`npm run lint`**: Lints the code using ESLint.
- **`npm run format`**: Formats the code using Prettier.
