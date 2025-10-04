const express = require('express');
const cors = require('cors');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const app = express();
const port = process.env.PORT || 3002;

// Simple logger
const logger = {
  info: (message, meta = {}) => console.log(`INFO: ${new Date().toISOString()} - ${message}`, JSON.stringify(meta)),
  error: (message, meta = {}) => console.error(`ERROR: ${new Date().toISOString()} - ${message}`, JSON.stringify(meta))
};

app.use(cors());
app.use(express.json());

// Simple MCP server setup for Veridium Node App
const server = new Server(
  {
    name: 'veridium-node-app',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Basic tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_ai_insights',
        description: 'Get AI insights for Veridium concierge',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'get_ai_insights') {
    return {
      content: [{ type: 'text', text: `AI insights for query: ${args.query}. Veridium concierge recommends personalized assistance.` }]
    };
  }
  throw new Error('Tool not found');
});

// API endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'veridium-node-app' });
});

app.get('/welcome', (req, res) => {
  logger.info('Request received', { method: req.method, path: req.path });
  res.json({ message: 'Welcome to the Veridium Node App!' });
});

app.get('/api/insights', (req, res) => {
  res.json({ insights: 'Neural network analysis complete. Accuracy: 98.7%' });
});

// Start MCP transport
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);

app.listen(port, () => {
  console.log(`Veridium Node App running on http://localhost:${port}`);
});
