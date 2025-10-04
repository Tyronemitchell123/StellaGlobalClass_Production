# SuggestlyG4Plus Projects

A comprehensive project suite featuring both a Model Context Protocol (MCP) server and modern web applications. This repository combines backend API services with cutting-edge frontend web experiences.

## Project Overview

This repository contains two main components:

1. **MCP Server** - A Node.js-based Model Context Protocol server providing various API tools
2. **Web Applications** - Modern, responsive web applications including landing pages, task management systems, and portfolio showcases

---

## MCP Server

A comprehensive Model Context Protocol (MCP) server that provides various tools including weather information, date calculations, mathematical operations, and AWS S3/SQS services.

### Features

- **Echo Tool**: Simple echo functionality for testing
- **Math Operations**: Basic arithmetic operations
- **Weather Information**: Mock weather data for different locations and units
- **Date Calculations**: Relative date calculations using date-fns
- **AWS S3 Operations**: List buckets, get and put objects
- **AWS SQS Operations**: List queues, send and receive messages
- **Error Handling**: Robust error handling for all operations

### Installation

#### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

#### Install Dependencies
```bash
npm install
```

### Usage

#### Start the Server
```bash
npm start
```

#### Run Tests
```bash
# Run basic tests
npm test

# Run comprehensive tests
npm run test:comprehensive

# Run all CI checks
npm run ci
```

#### Development
```bash
# Run with auto-reload
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Security audit
npm run security
```

### Available Tools

#### Basic Tools

##### 1. Echo
```json
{
  "name": "echo",
  "arguments": {
    "text": "Hello, World!"
  }
}
```

##### 2. Add
```json
{
  "name": "add",
  "arguments": {
    "a": 15,
    "b": 27
  }
}
```

##### 3. Weather
```json
{
  "name": "get_weather",
  "arguments": {
    "location": "London, UK",
    "units": "metric"
  }
}
```

##### 4. Date Calculation
```json
{
  "name": "calculate_date",
  "arguments": {
    "expression": "2 days ago"
  }
}
```

#### AWS Tools

##### 5. List S3 Buckets
```json
{
  "name": "list_s3_buckets",
  "arguments": {
    "region": "us-east-1"
  }
}
```

##### 6. Get S3 Object
```json
{
  "name": "get_s3_object",
  "arguments": {
    "bucket": "my-bucket",
    "key": "path/to/file.txt",
    "region": "us-east-1"
  }
}
```

##### 7. Put S3 Object
```json
{
  "name": "put_s3_object",
  "arguments": {
    "bucket": "my-bucket",
    "key": "path/to/file.txt",
    "content": "File content here",
    "region": "us-east-1"
  }
}
```

##### 8. List SQS Queues
```json
{
  "name": "list_sqs_queues",
  "arguments": {
    "region": "us-east-1"
  }
}
```

##### 9. Send SQS Message
```json
{
  "name": "send_sqs_message",
  "arguments": {
    "queue_url": "https://sqs.us-east-1.amazonaws.com/123456789/my-queue",
    "message_body": "Hello, SQS!",
    "region": "us-east-1"
  }
}
```

##### 10. Receive SQS Message
```json
{
  "name": "receive_sqs_message",
  "arguments": {
    "queue_url": "https://sqs.us-east-1.amazonaws.com/123456789/my-queue",
    "region": "us-east-1"
  }
}
```

### AWS Configuration

The AWS tools require proper AWS credentials configuration. You can configure credentials using:

1. **Environment Variables**:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=us-east-1
   ```

2. **AWS Credentials File**:
   Create `~/.aws/credentials` with:
   ```ini
   [default]
   aws_access_key_id = your_access_key
   aws_secret_access_key = your_secret_key
   ```

3. **IAM Roles** (when running on EC2/ECS)

---

## Web Applications

Modern, responsive web applications built with HTML5, CSS3, and vanilla JavaScript. Located in the `New folder/web/` directory.

### Features

- **Modern Landing Pages**: Cutting-edge design with glassmorphism effects and animations
- **Task Management System**: Complete todo application with category filtering and priority management
- **Travel Applications**: Specialized travel planning and management interfaces
- **Portfolio Showcase**: Dynamic portfolio presentations with data-driven content
- **Responsive Design**: Mobile-first approach with cross-browser compatibility
- **Performance Optimized**: Lazy loading, optimized assets, and efficient code
- **Accessibility**: WCAG compliant with screen reader support

### Applications Included

#### 1. Nexus Landing Page
- Location: `New folder/web/ultimate-modern-landing.html`
- Features: Modern glassmorphism design, animated backgrounds, responsive navigation
- Tech: HTML5, CSS3, vanilla JavaScript

#### 2. Veridian Concierge System
- Location: `New folder/web/todo.html`
- Features: Personal task management, concierge service interface, priority-based task organization
- Tech: HTML5, CSS3, ES6+ JavaScript, LocalStorage

#### 3. Travel Management
- Location: `New folder/web/travel.html`
- Features: Travel planning, itinerary management, booking interfaces
- Tech: HTML5, CSS3, JavaScript

#### 4. Portfolio Showcase
- Location: `New folder/web/assets/portfolio/`
- Features: Dynamic portfolio display, data-driven content, filtering capabilities
- Tech: HTML5, CSS3, JavaScript, JSON data

### Web Application Usage

#### Running the Web Applications
The web applications are static HTML files and can be opened directly in a web browser:

```bash
# Open Nexus Landing Page
open New folder/web/ultimate-modern-landing.html

# Open Veridian Concierge Todo System
open New folder/web/todo.html

# Open Travel Management
open New folder/web/travel.html
```

#### Web Server (Optional)
For local development with a web server:

```bash
# Using Python (if installed)
cd New folder/web
python -m http.server 8000

# Using Node.js (if installed)
cd New folder/web
npx http-server -p 8000

# Then visit http://localhost:8000
```

### Web Application Structure

```
New folder/web/
├── *.html                 # Main HTML files
├── *.css                  # Stylesheets
├── *.js                   # JavaScript files
├── assets/                # Static assets
│   ├── images/           # Image files
│   └── portfolio/        # Portfolio assets
├── css/                  # Organized CSS
│   ├── ai/              # AI-related styles
│   ├── components/      # Component styles
│   ├── design-system/   # Design system
│   ├── enterprise/      # Enterprise styles
│   ├── quantum/         # Quantum-themed styles
│   └── utils/           # Utility styles
└── src/                 # Source JavaScript
    └── utils/           # Utility functions
```

### Key Web Features

#### Design System
- **CSS Variables**: Consistent theming and color management
- **Component Library**: Reusable UI components
- **Responsive Grid**: Flexible layout system
- **Typography**: Modern font stacks with fallbacks

#### Performance Optimizations
- **Lazy Loading**: Images and scripts load on demand
- **Optimized Assets**: Minified CSS and JavaScript
- **Caching Strategies**: Browser and service worker caching
- **Critical CSS**: Above-the-fold content optimization

#### Accessibility Features
- **ARIA Labels**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Visible focus indicators

---

## Development

### Project Structure
```
.
├── .github/workflows/     # CI/CD workflows
├── lib/                   # Library files
├── New folder/web/        # Web applications
│   ├── *.html            # HTML files
│   ├── *.css             # CSS files
│   ├── *.js              # JavaScript files
│   ├── assets/           # Static assets
│   ├── css/              # Organized CSS
│   └── src/              # Source files
├── .eslintrc.json        # ESLint configuration
├── .gitignore           # Git ignore rules
├── mcp-server.js        # Main server file
├── package.json         # Project dependencies and scripts
├── simple-test.js       # Basic test suite
├── test-mcp-server.js   # Comprehensive test suite
├── test-report.md       # Test documentation
└── README.md           # This file
```

### Code Style

#### MCP Server
- ESLint with Standard configuration
- 2-space indentation
- Double quotes
- Semicolons required
- ES6+ modules

#### Web Applications
- BEM methodology for CSS classes
- Semantic HTML5 structure
- ES6+ JavaScript features
- Mobile-first responsive design
- Progressive enhancement approach

### Testing

#### MCP Server Testing
- Basic tests validate expected behavior
- Comprehensive tests use MCP protocol
- All tests run in CI/CD pipeline
- Test coverage reports available

#### Web Application Testing
- Manual testing across browsers
- Responsive design validation
- Accessibility compliance testing
- Cross-device compatibility checks

---

## Continuous Integration

This project uses GitHub Actions for CI/CD:

### CI Pipeline
1. **Test Job**: Runs syntax checks and tests across multiple Node.js versions
2. **Lint Job**: Validates code style and quality
3. **Security Job**: Runs security audits and vulnerability checks
4. **Build Job**: Builds and publishes to npm on releases

### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` branch
- Releases (publishes to npm)

### Environment Variables Required
- `NPM_TOKEN`: For publishing to npm
- `DOCKER_USERNAME`: For Docker image publishing
- `DOCKER_PASSWORD`: For Docker image publishing

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run ci`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style for both MCP server and web applications
- Add tests for new MCP server features
- Update documentation as needed
- Ensure all CI checks pass
- For web applications, test across multiple browsers and devices
- Maintain accessibility standards

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, please open an issue in the GitHub repository or contact the development team.

### MCP Server Support
- API documentation and tool usage
- AWS integration issues
- Server deployment and configuration

### Web Application Support
- Browser compatibility issues
- Responsive design problems
- Feature requests and enhancements

---

## Changelog

### v1.0.0
- Initial release
- **MCP Server**:
  - Basic tools: echo, add, weather, date calculation
  - AWS tools: S3 and SQS operations
  - Comprehensive testing suite
  - CI/CD pipeline setup
- **Web Applications**:
  - Nexus modern landing page
  - Veridian Concierge task management system
  - Travel management interface
  - Portfolio showcase components
  - Responsive design system
  - Performance optimizations
  - Accessibility features
- Documentation and examples for both components
