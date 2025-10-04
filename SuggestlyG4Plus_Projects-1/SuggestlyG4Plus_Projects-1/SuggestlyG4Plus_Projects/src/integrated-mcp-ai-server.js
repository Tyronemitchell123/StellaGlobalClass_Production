/**
 * Integrated MCP AI Server - Combining MCP functionality with optimized AI components
 *
 * This server integrates the MCP protocol with practical AI capabilities,
 * providing a unified platform for both MCP tools and AI-powered features.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import axios from "axios";
import * as dateFns from "date-fns";
import { S3Client, ListBucketsCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, ListQueuesCommand, SendMessageCommand, ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { WebSocketServer } from "ws";
import OptimizedAIEngine from "./optimized-ai-engine.js";
import OptimizedNeuralNetwork from "./optimized-neural-network.js";
import { authMiddleware, generateToken } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server instance
const server = new Server(
  {
    name: "integrated-mcp-ai-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize AI components
const aiEngine = new OptimizedAIEngine();
const neuralNetwork = new OptimizedNeuralNetwork({
  architecture: [4, 8, 6, 2],
  learningRate: 0.01,
  epochs: 50
});

// Store available tools
const tools = [
  // Original MCP tools
  {
    name: "echo",
    description: "Echo back the input text",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to echo back",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "add",
    description: "Add two numbers",
    inputSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "First number",
        },
        b: {
          type: "number",
          description: "Second number",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "get_weather",
    description: "Get weather information for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Location to get weather for (e.g., 'London, UK')",
        },
        units: {
          type: "string",
          enum: ["metric", "imperial"],
          description: "Temperature units (metric for Celsius, imperial for Fahrenheit)",
          default: "metric",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "calculate_date",
    description: "Calculate a date based on a relative expression",
    inputSchema: {
      type: "object",
      properties: {
        base_date: {
          type: "string",
          description: "Base date to calculate from (YYYY-MM-DD format, defaults to today)",
        },
        expression: {
          type: "string",
          description: "Relative date expression (e.g., '2 days ago', 'next week', '3 months from now')",
        },
      },
      required: ["expression"],
    },
  },
  {
    name: "list_s3_buckets",
    description: "List all S3 buckets",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
    },
  },
  {
    name: "get_s3_object",
    description: "Get an object from S3",
    inputSchema: {
      type: "object",
      properties: {
        bucket: {
          type: "string",
          description: "S3 bucket name",
        },
        key: {
          type: "string",
          description: "S3 object key",
        },
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
      required: ["bucket", "key"],
    },
  },
  {
    name: "put_s3_object",
    description: "Put an object to S3",
    inputSchema: {
      type: "object",
      properties: {
        bucket: {
          type: "string",
          description: "S3 bucket name",
        },
        key: {
          type: "string",
          description: "S3 object key",
        },
        content: {
          type: "string",
          description: "Content to put in the object",
        },
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
      required: ["bucket", "key", "content"],
    },
  },
  {
    name: "list_sqs_queues",
    description: "List SQS queues",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
    },
  },
  {
    name: "send_sqs_message",
    description: "Send a message to an SQS queue",
    inputSchema: {
      type: "object",
      properties: {
        queue_url: {
          type: "string",
          description: "SQS queue URL",
        },
        message_body: {
          type: "string",
          description: "Message body to send",
        },
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
      required: ["queue_url", "message_body"],
    },
  },
  {
    name: "receive_sqs_message",
    description: "Receive a message from an SQS queue",
    inputSchema: {
      type: "object",
      properties: {
        queue_url: {
          type: "string",
          description: "SQS queue URL",
        },
        region: {
          type: "string",
          description: "AWS region (defaults to us-east-1)",
          default: "us-east-1",
        },
      },
      required: ["queue_url"],
    },
  },

  // New AI-powered tools
  {
    name: "analyze_data_patterns",
    description: "Analyze data patterns using AI engine",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "Array of data points to analyze",
          items: {
            oneOf: [
              { type: "number" },
              { type: "string" }
            ]
          }
        },
      },
      required: ["data"],
    },
  },
  {
    name: "train_neural_network",
    description: "Train a neural network with provided data",
    inputSchema: {
      type: "object",
      properties: {
        training_data: {
          type: "array",
          description: "Training data arrays",
          items: {
            type: "array",
            items: { type: "number" }
          }
        },
        labels: {
          type: "array",
          description: "Training labels",
          items: {
            type: "array",
            items: { type: "number" }
          }
        },
        epochs: {
          type: "number",
          description: "Number of training epochs",
          default: 100
        },
        learning_rate: {
          type: "number",
          description: "Learning rate for training",
          default: 0.01
        },
      },
      required: ["training_data", "labels"],
    },
  },
  {
    name: "predict_with_neural_network",
    description: "Make predictions using trained neural network",
    inputSchema: {
      type: "object",
      properties: {
        input_data: {
          type: "array",
          description: "Input data for prediction",
          items: { type: "number" }
        },
      },
      required: ["input_data"],
    },
  },
  {
    name: "get_ai_insights",
    description: "Get AI-powered insights from data",
    inputSchema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          description: "Data to analyze for insights",
          items: {
            oneOf: [
              { type: "number" },
              { type: "string" }
            ]
          }
        },
        insight_type: {
          type: "string",
          enum: ["patterns", "predictions", "quality", "all"],
          description: "Type of insights to generate",
          default: "all"
        },
      },
      required: ["data"],
    },
  },
  {
    name: "get_ai_system_status",
    description: "Get status of AI components",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },


];

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Original MCP tools
      case "echo":
        return {
          content: [
            {
              type: "text",
              text: args.text,
            },
          ],
        };

      case "add":
        const sum = args.a + args.b;
        return {
          content: [
            {
              type: "text",
              text: `The sum of ${args.a} and ${args.b} is ${sum}`,
            },
          ],
        };

      case "get_weather":
        // Mock weather data
        const weatherData = {
          location: args.location,
          temperature: args.units === "metric" ? 22 : 72,
          condition: "Partly cloudy",
          humidity: 65,
          wind_speed: args.units === "metric" ? 15 : 9,
          units: args.units,
        };
        return {
          content: [
            {
              type: "text",
              text: `Weather in ${weatherData.location}: ${weatherData.temperature}°${weatherData.units === "metric" ? "C" : "F"}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${weatherData.units === "metric" ? "km/h" : "mph"}`,
            },
          ],
        };

      case "calculate_date":
        const baseDate = args.base_date ? new Date(args.base_date) : new Date();
        const calculatedDate = dateFns.addDays(baseDate, 0); // Placeholder
        return {
          content: [
            {
              type: "text",
              text: `Calculated date: ${dateFns.format(calculatedDate, 'yyyy-MM-dd')}`,
            },
          ],
        };

      case "list_s3_buckets":
        const s3Client = new S3Client({ region: args.region || "us-east-1" });
        const buckets = await s3Client.send(new ListBucketsCommand({}));
        return {
          content: [
            {
              type: "text",
              text: `S3 Buckets: ${buckets.Buckets?.map(b => b.Name).join(', ') || 'None'}`,
            },
          ],
        };

      case "get_s3_object":
        const s3GetObjectClient = new S3Client({ region: args.region || "us-east-1" });
        const object = await s3GetObjectClient.send(new GetObjectCommand({
          Bucket: args.bucket,
          Key: args.key,
        }));
        const objectContent = await object.Body?.transformToString();
        return {
          content: [
            {
              type: "text",
              text: `S3 Object content: ${objectContent}`,
            },
          ],
        };

      case "put_s3_object":
        const s3PutObjectClient = new S3Client({ region: args.region || "us-east-1" });
        await s3PutObjectClient.send(new PutObjectCommand({
          Bucket: args.bucket,
          Key: args.key,
          Body: args.content,
        }));
        return {
          content: [
            {
              type: "text",
              text: `Successfully put object to S3: ${args.key}`,
            },
          ],
        };

      case "list_sqs_queues":
        const sqsClient = new SQSClient({ region: args.region || "us-east-1" });
        const queues = await sqsClient.send(new ListQueuesCommand({}));
        return {
          content: [
            {
              type: "text",
              text: `SQS Queues: ${queues.QueueUrls?.join(', ') || 'None'}`,
            },
          ],
        };

      case "send_sqs_message":
        const sqsSendClient = new SQSClient({ region: args.region || "us-east-1" });
        await sqsSendClient.send(new SendMessageCommand({
          QueueUrl: args.queue_url,
          MessageBody: args.message_body,
        }));
        return {
          content: [
            {
              type: "text",
              text: `Successfully sent message to SQS queue`,
            },
          ],
        };

      case "receive_sqs_message":
        const sqsReceiveClient = new SQSClient({ region: args.region || "us-east-1" });
        const messages = await sqsReceiveClient.send(new ReceiveMessageCommand({
          QueueUrl: args.queue_url,
          MaxNumberOfMessages: 1,
        }));
        return {
          content: [
            {
              type: "text",
              text: `Received message: ${messages.Messages?.[0]?.Body || 'No messages'}`,
            },
          ],
        };

      // New AI-powered tools
      case "analyze_data_patterns":
        const analysis = await aiEngine.processData(args.data);
        return {
          content: [
            {
              type: "text",
              text: `Data Analysis Complete:\nPatterns: ${JSON.stringify(analysis.patterns, null, 2)}\nPredictions: ${JSON.stringify(analysis.predictions, null, 2)}\nInsights: ${JSON.stringify(analysis.insights, null, 2)}`,
            },
          ],
        };

      case "train_neural_network":
        neuralNetwork.epochs = args.epochs || 100;
        neuralNetwork.learningRate = args.learning_rate || 0.01;
        await neuralNetwork.initialize();
        await neuralNetwork.train(args.training_data, args.labels);
        const trainingHistory = neuralNetwork.getTrainingHistory();
        return {
          content: [
            {
              type: "text",
              text: `Neural Network Training Complete:\nFinal Loss: ${trainingHistory[trainingHistory.length - 1]?.loss.toFixed(6) || 'N/A'}\nEpochs: ${trainingHistory.length}`,
            },
          ],
        };

      case "predict_with_neural_network":
        if (!neuralNetwork.isTrained) {
          throw new Error("Neural network must be trained before making predictions");
        }
        const prediction = neuralNetwork.predict(args.input_data);
        return {
          content: [
            {
              type: "text",
              text: `Neural Network Prediction: ${JSON.stringify(prediction)}`,
            },
          ],
        };

      case "get_ai_insights":
        const processedData = await aiEngine.processData(args.data);
        let insightsText = "";

        if (args.insight_type === "all" || args.insight_type === "patterns") {
          insightsText += `Patterns: ${JSON.stringify(processedData.patterns, null, 2)}\n`;
        }

        if (args.insight_type === "all" || args.insight_type === "predictions") {
          insightsText += `Predictions: ${JSON.stringify(processedData.predictions, null, 2)}\n`;
        }

        if (args.insight_type === "all" || args.insight_type === "quality") {
          insightsText += `Data Quality: ${JSON.stringify(processedData.insights, null, 2)}\n`;
        }

        return {
          content: [
            {
              type: "text",
              text: `AI Insights:\n${insightsText}`,
            },
          ],
        };

      case "get_ai_system_status":
        const aiStatus = {
          aiEngine: {
            capabilities: aiEngine.getCapabilities(),
            processingHistory: aiEngine.getProcessingHistory().length
          },
          neuralNetwork: {
            initialized: neuralNetwork.layers.length > 0,
            trained: neuralNetwork.isTrained,
            architecture: neuralNetwork.architecture,
            parameters: neuralNetwork.countParameters(),
            trainingHistory: neuralNetwork.getTrainingHistory().length
          }
        };
        return {
          content: [
            {
              type: "text",
              text: `AI System Status:\n${JSON.stringify(aiStatus, null, 2)}`,
            },
          ],
        };







      case "get_financial_news":
        const category = args.category || "business";
        const limit = args.limit || 5;

        // Mock news headlines
        const mockNews = {
          business: [
            "Fed Signals Potential Rate Cuts Amid Economic Uncertainty",
            "Tech Giants Report Strong Q4 Earnings, AI Investments Pay Off",
            "Oil Prices Surge on Middle East Tensions",
            "Cryptocurrency Market Sees Record Institutional Adoption",
            "Global Supply Chain Disruptions Continue to Impact Manufacturing"
          ],
          technology: [
            "AI Breakthrough: New Model Achieves Human-Level Performance",
            "Quantum Computing Milestone Reached by Research Team",
            "Cybersecurity Firm Uncovers Major Data Breach",
            "Electric Vehicle Sales Hit Record High in Q4",
            "SpaceX Successfully Launches Satellite Constellation"
          ],
          markets: [
            "Stock Market Closes Higher on Positive Economic Data",
            "Bond Yields Rise as Inflation Concerns Grow",
            "Emerging Markets See Capital Inflows Amid Global Recovery",
            "Real Estate Sector Shows Signs of Cooling",
            "Commodity Prices Volatile Due to Weather Events"
          ]
        };

        const newsHeadlines = (mockNews[category] || mockNews.business).slice(0, limit);

        return {
          content: [
            {
              type: "text",
              text: `Latest ${category.charAt(0).toUpperCase() + category.slice(1)} News:\n${newsHeadlines.map((headline, i) => `${i + 1}. ${headline}`).join('\n')}`,
            },
          ],
        };

      case "get_economic_indicators":
        const indicators = args.indicators || ["unemployment", "inflation", "interest_rates"];
        const mockIndicators = {
          unemployment: { name: "Unemployment Rate", value: "3.7%", change: "-0.1%", trend: "down" },
          inflation: { name: "CPI Inflation (YoY)", value: "2.3%", change: "+0.2%", trend: "up" },
          gdp: { name: "GDP Growth (QoQ)", value: "2.1%", change: "+0.3%", trend: "up" },
          interest_rates: { name: "Federal Funds Rate", value: "5.25-5.50%", change: "0%", trend: "stable" },
          consumer_confidence: { name: "Consumer Confidence Index", value: "102.3", change: "+2.1", trend: "up" }
        };

        const indicatorsData = indicators.map(indicator => {
          const data = mockIndicators[indicator] || {
            name: indicator.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: "N/A",
            change: "N/A",
            trend: "unknown"
          };
          return `${data.name}: ${data.value} (${data.change}) - Trend: ${data.trend}`;
        });

        return {
          content: [
            {
              type: "text",
              text: `Economic Indicators:\n${indicatorsData.join('\n')}`,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Create Express app for web interface
const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../concierge-landing.html'));
});

// Serve concierge landing page
app.get('/concierge', (req, res) => {
  res.sendFile(path.join(__dirname, '../concierge-landing.html'));
});

app.use(express.static(path.join(__dirname, '..'), { index: false }));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      mcp: 'running',
      ai: 'initialized',
      web: 'active'
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') { // Placeholder - use proper auth in production
    const token = generateToken({ username, role: 'admin' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const units = req.query.units || 'metric';

    // Mock weather data (same as MCP tool)
    const weatherData = {
      location,
      temperature: units === "metric" ? 22 : 72,
      condition: "Partly cloudy",
      humidity: 65,
      wind_speed: units === "metric" ? 15 : 9,
      units,
    };

    res.json({
      success: true,
      data: `Weather in ${weatherData.location}: ${weatherData.temperature}°${weatherData.units === "metric" ? "C" : "F"}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${weatherData.units === "metric" ? "km/h" : "mph"}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, service_interest, message } = req.body;

    // Store contact message (could use S3 or database)
    console.log('📧 New contact message:', { name, email, service_interest, message });

    res.json({
      success: true,
      message: `Thank you ${name}! Your message has been received. We'll respond to ${email} soon.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Use AI engine for chat response
    const response = await aiEngine.processData([message]);

    res.json({
      success: true,
      response: response.insights || 'Hello! How can I help you today?',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/cameras', (req, res) => {
  res.json({
    success: true,
    cameras: [
      { id: 1, name: 'Front Door', url: 'http://example.com/stream1.mjpg', status: 'active' },
      { id: 2, name: 'Back Yard', url: 'http://example.com/stream2.mjpg', status: 'active' },
      { id: 3, name: 'Garage', url: 'http://example.com/stream3.mjpg', status: 'inactive' }
    ]
  });
});

app.get('/api/ai-status', authMiddleware, async (req, res) => {
  try {
    const aiStatus = {
      aiEngine: {
        initialized: true,
        capabilities: aiEngine.getCapabilities(),
        processingHistory: aiEngine.getProcessingHistory().length
      },
      neuralNetwork: {
        initialized: neuralNetwork.layers.length > 0,
        trained: neuralNetwork.isTrained,
        architecture: neuralNetwork.architecture,
        parameters: neuralNetwork.countParameters(),
        trainingHistory: neuralNetwork.getTrainingHistory().length
      }
    };

    res.json({
      success: true,
      status: aiStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Concierge Service API Routes
app.post('/api/analytics', async (req, res) => {
  try {
    const { event, data } = req.body;

    // Store analytics data (could use S3 or database)
    console.log('📊 Analytics event:', { event, data, timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: 'Analytics data recorded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/todos', (req, res) => {
  try {
    // In a real app, this would fetch from a database
    // For now, return mock data
    const todos = [
      { id: 1, text: 'Plan vacation itinerary', completed: false, priority: 'high' },
      { id: 2, text: 'Book dinner reservation', completed: true, priority: 'medium' },
      { id: 3, text: 'Schedule personal shopping appointment', completed: false, priority: 'high' }
    ];

    res.json({
      success: true,
      todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const { text, priority = 'medium' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Todo text is required'
      });
    }

    // In a real app, this would save to a database
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };

    console.log('✅ New todo created:', newTodo);

    res.json({
      success: true,
      todo: newTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // In a real app, this would update in database
    console.log('🔄 Todo updated:', { id, completed });

    res.json({
      success: true,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;

    // In a real app, this would delete from database
    console.log('🗑️ Todo deleted:', id);

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Valid email is required'
      });
    }

    // Store subscription (could use S3 or database)
    console.log('📧 New subscription:', { email, plan, timestamp: new Date().toISOString() });

    res.json({
      success: true,
      message: `Thank you for subscribing to the ${plan} plan! We'll send you a confirmation email shortly.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
async function main() {
  console.log('🚀 Initializing Integrated MCP AI Server...');

  // Initialize AI components
  await aiEngine.initialize();
  await neuralNetwork.initialize();

  console.log('✅ AI Components Initialized');

  // Start Express server
  const httpServer = app.listen(PORT, () => {
    console.log(`🌐 Web server running on http://localhost:${PORT}`);
  });

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer });
  const clients = [];

  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('New WebSocket client connected');
    ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to Veridian Private Concierge Console' }));

    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Broadcast real-time data
  setInterval(() => {
    const metrics = {
      timestamp: new Date().toISOString(),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      latency: Math.floor(Math.random() * 200),
      alerts: Math.random() > 0.8 ? ['Motion detected in zone 1'] : [],
      detections: Math.random() > 0.5 ? ['Person detected', 'Vehicle detected'] : []
    };

    const data = { type: 'metrics', data: metrics };
    clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }, 5000);

  console.log('✅ WebSocket server ready for real-time updates');

  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('✅ Integrated MCP AI Server started successfully');
  console.log('🔧 Available Tools: MCP utilities + AI-powered analysis');
  console.log('📡 Full Stack Application Ready!');
}

main().catch(console.error);
