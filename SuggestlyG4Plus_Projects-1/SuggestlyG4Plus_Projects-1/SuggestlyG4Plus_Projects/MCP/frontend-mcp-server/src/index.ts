#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

type Topic = 'essential-knowledge' | 'basic-ui-setup' | 'authentication' | 'routing' | 'customizing' | 'creating-components' | 'troubleshooting' | 'python-basics' | 'javascript-fundamentals' | 'best-practices' | 'code-review-tips';

const docs: { [topic in Topic]: string } = {
  'essential-knowledge': `# Essential Knowledge for React Applications

## Fundamental Concepts

React is a JavaScript library for building user interfaces. Key concepts include:

- **Components**: Reusable pieces of UI
- **JSX**: Syntax extension for JavaScript
- **State**: Data that changes over time
- **Props**: Data passed to components
- **Hooks**: Functions for using state and lifecycle in functional components

## Getting Started

To create a new React app:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

This sets up a basic React application with all necessary dependencies.`,

  'basic-ui-setup': `# Basic UI Setup with Tailwind CSS and shadcn/ui

## Setting Up Tailwind CSS

1. Install Tailwind CSS:

\`\`\`bash
npm install -D tailwindcss
npx tailwindcss init
\`\`\`

2. Configure tailwind.config.js:

\`\`\`js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

3. Add Tailwind directives to CSS:

\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Installing shadcn/ui

\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

This sets up a modern UI component library with Tailwind CSS.`,

  'authentication': `# AWS Amplify Authentication Integration

## Setting Up Authentication

1. Install AWS Amplify:

\`\`\`bash
npm install aws-amplify @aws-amplify/ui-react
\`\`\`

2. Configure Amplify in your app:

\`\`\`js
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id',
  },
});
\`\`\`

3. Add authentication component:

\`\`\`jsx
import { withAuthenticator } from '@aws-amplify/ui-react';

function App() {
  return <div>Welcome to your app!</div>;
}

export default withAuthenticator(App);
\`\`\``,

  'routing': `# Implementing Routing with React Router

## Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Navigation

\`\`\`jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
\`\`\``,

  'customizing': `# Theming with AWS Amplify Components

## Customizing Themes

AWS Amplify UI components support theming through CSS variables and theme objects.

\`\`\`js
import { ThemeProvider } from '@aws-amplify/ui-react';

const theme = {
  name: 'my-theme',
  tokens: {
    colors: {
      brand: {
        primary: { value: '#007bff' },
      },
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
\`\`\`

## Using CSS Variables

Override default styles with CSS custom properties:

\`\`\`css
:root {
  --amplify-colors-brand-primary: #007bff;
  --amplify-colors-brand-secondary: #6c757d;
}
\`\`\``,

  'creating-components': `# Building React Components with AWS Integrations

## Component Structure

\`\`\`jsx
import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';

function DataComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await API.get('myAPI', '/items');
      setData(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
\`\`\`

## Best Practices

- Use hooks for state management
- Implement error handling
- Separate concerns with custom hooks
- Use TypeScript for type safety`,

  'troubleshooting': `# Troubleshooting React Development

## Common Issues

### Component Not Re-rendering

If your component isn't updating when state changes:

- Ensure you're using state setters correctly
- Check if the state value is actually changing
- Use useEffect for side effects

### Props Not Passing

- Verify prop names match between parent and child
- Check for typos in prop destructuring
- Ensure parent is passing props correctly

### Performance Issues

- Use React.memo for expensive components
- Implement useMemo for expensive calculations
- Avoid unnecessary re-renders with useCallback

### AWS Integration Issues

- Verify AWS credentials are configured
- Check API Gateway endpoints
- Ensure proper IAM permissions
- Use Amplify CLI for configuration`,

  'python-basics': `# Python Programming Basics

## Getting Started

Python is a high-level programming language known for its simplicity and readability.

### Installation

Download from python.org or use package managers.

### Basic Syntax

\`\`\`python
# Hello World
print("Hello, World!")

# Variables
name = "Alice"
age = 30

# Functions
def greet(name):
    return f"Hello, {name}!"

print(greet("Bob"))
\`\`\`

### Data Structures

- Lists: \`[1, 2, 3]\`
- Dictionaries: \`{'key': 'value'}\`
- Tuples: \`(1, 2, 3)\`
- Sets: \`{1, 2, 3}\``,

  'javascript-fundamentals': `# JavaScript Fundamentals

## Core Concepts

### Variables

\`\`\`javascript
// var (avoid in modern code)
var oldWay = "old";

// let and const
let changeable = "can change";
const constant = "cannot change";
\`\`\`

### Functions

\`\`\`javascript
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function
const greet = (name) => \`Hello, \${name}!\`;
\`\`\`

### Async/Await

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\``,

  'best-practices': `# Development Best Practices

## Code Quality

### Clean Code Principles

- Write readable, maintainable code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Version Control

- Commit frequently with clear messages
- Use branches for features
- Review code before merging

### Testing

- Write unit tests for functions
- Integration tests for components
- End-to-end tests for user flows

### Security

- Validate user input
- Use HTTPS
- Implement proper authentication
- Keep dependencies updated`,

  'code-review-tips': `# Code Review Best Practices

## What to Look For

### Functionality
- Does the code work as intended?
- Are edge cases handled?
- Is error handling adequate?

### Code Quality
- Is the code readable and maintainable?
- Are there any code smells?
- Is the code well-documented?

### Performance
- Are there any performance bottlenecks?
- Is the code optimized?
- Are resources properly managed?

### Security
- Are there any security vulnerabilities?
- Is user input validated?
- Are sensitive data handled properly?

## Giving Feedback

- Be constructive and respectful
- Explain why changes are needed
- Suggest specific improvements
- Acknowledge good practices`
};

const isValidTopic = (topic: string): topic is Topic => {
  return topic in docs;
};

class FrontendServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'frontend-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'GetReactDocsByTopic',
          description: 'Get comprehensive documentation on React and AWS integration topics',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'Topic to get documentation for',
                enum: ['essential-knowledge', 'basic-ui-setup', 'authentication', 'routing', 'customizing', 'creating-components', 'troubleshooting']
              },
            },
            required: ['topic'],
          },
        },
        {
          name: 'GetGeneralDocsByTopic',
          description: 'Get documentation on general programming topics',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'General programming topic',
                enum: ['python-basics', 'javascript-fundamentals', 'best-practices', 'code-review-tips']
              },
            },
            required: ['topic'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'GetReactDocsByTopic' || request.params.name === 'GetGeneralDocsByTopic') {
        const topic = String(request.params.arguments?.topic);

        if (!isValidTopic(topic)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid topic: ${topic}`
          );
        }

        return {
          content: [
            {
              type: 'text',
              text: docs[topic],
            },
          ],
        };
      }

      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Frontend MCP server running on stdio');
  }
}

const server = new FrontendServer();
server.run().catch(console.error);
