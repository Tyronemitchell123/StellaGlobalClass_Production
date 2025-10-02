/**
 * Refactored Tool Handlers using Strategy Pattern
 * This replaces the massive switch statement with individual strategy classes
 */

// Base interface for all tool handlers
class ToolHandler {
  constructor(name, description, inputSchema) {
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
  }

  // Abstract method to be implemented by concrete handlers
  async execute(args) {
    throw new Error('Execute method must be implemented by concrete handler');
  }

  // Get tool definition
  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema
    };
  }
}

// Strategy for Echo tool
class EchoToolHandler extends ToolHandler {
  constructor() {
    super('echo', 'Echo back the input text', {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to echo back'
        }
      },
      required: ['text']
    });
  }

  async execute(args) {
    return {
      content: [
        {
          type: 'text',
          text: args.text
        }
      ]
    };
  }
}

// Strategy for Add tool
class AddToolHandler extends ToolHandler {
  constructor() {
    super('add', 'Add two numbers', {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: 'First number'
        },
        b: {
          type: 'number',
          description: 'Second number'
        }
      },
      required: ['a', 'b']
    });
  }

  async execute(args) {
    const sum = args.a + args.b;
    return {
      content: [
        {
          type: 'text',
          text: `The sum of ${args.a} and ${args.b} is ${sum}`
        }
      ]
    };
  }
}

// Strategy for Weather tool
class WeatherToolHandler extends ToolHandler {
  constructor() {
    super('get_weather', 'Get weather information for a location', {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Location to get weather for (e.g., "London, UK")'
        },
        units: {
          type: 'string',
          enum: ['metric', 'imperial'],
          description: 'Temperature units (metric for Celsius, imperial for Fahrenheit)',
          default: 'metric'
        }
      },
      required: ['location']
    });
  }

  async execute(args) {
    const weatherData = {
      location: args.location,
      temperature: args.units === 'metric' ? 22 : 72,
      condition: 'Partly cloudy',
      humidity: 65,
      wind_speed: args.units === 'metric' ? 15 : 9,
      units: args.units
    };

    return {
      content: [
        {
          type: 'text',
          text: `Weather in ${weatherData.location}: ${weatherData.temperature}°${weatherData.units === 'metric' ? 'C' : 'F'}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${weatherData.units === 'metric' ? 'km/h' : 'mph'}`
        }
      ]
    };
  }
}

// Strategy for S3 operations
class S3ToolHandler extends ToolHandler {
  constructor() {
    super('list_s3_buckets', 'List all S3 buckets', {
      type: 'object',
      properties: {
        region: {
          type: 'string',
          description: 'AWS region (defaults to us-east-1)',
          default: 'us-east-1'
        }
      }
    });
  }

  async execute(args) {
    const { S3Client, ListBucketsCommand } = await import('@aws-sdk/client-s3');
    const s3Client = new S3Client({ region: args.region || 'us-east-1' });
    const buckets = await s3Client.send(new ListBucketsCommand({}));
    
    return {
      content: [
        {
          type: 'text',
          text: `S3 Buckets: ${buckets.Buckets?.map(b => b.Name).join(', ') || 'None'}`
        }
      ]
    };
  }
}

// Strategy for Neural Network training
class NeuralNetworkTrainingHandler extends ToolHandler {
  constructor(neuralNetwork) {
    super('train_neural_network', 'Train a neural network with provided data', {
      type: 'object',
      properties: {
        training_data: {
          type: 'array',
          description: 'Training data arrays',
          items: {
            type: 'array',
            items: { type: 'number' }
          }
        },
        labels: {
          type: 'array',
          description: 'Training labels',
          items: {
            type: 'array',
            items: { type: 'number' }
          }
        },
        epochs: {
          type: 'number',
          description: 'Number of training epochs',
          default: 100
        },
        learning_rate: {
          type: 'number',
          description: 'Learning rate for training',
          default: 0.01
        }
      },
      required: ['training_data', 'labels']
    });
    this.neuralNetwork = neuralNetwork;
  }

  async execute(args) {
    this.neuralNetwork.epochs = args.epochs || 100;
    this.neuralNetwork.learningRate = args.learning_rate || 0.01;
    await this.neuralNetwork.initialize();
    await this.neuralNetwork.train(args.training_data, args.labels);
    const trainingHistory = this.neuralNetwork.getTrainingHistory();
    
    return {
      content: [
        {
          type: 'text',
          text: `Neural Network Training Complete:\nFinal Loss: ${trainingHistory[trainingHistory.length - 1]?.loss.toFixed(6) || 'N/A'}\nEpochs: ${trainingHistory.length}`
        }
      ]
    };
  }
}

// Strategy for AI Insights
class AIInsightsHandler extends ToolHandler {
  constructor(aiEngine) {
    super('get_ai_insights', 'Get AI-powered insights from data', {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          description: 'Data to analyze for insights',
          items: {
            oneOf: [
              { type: 'number' },
              { type: 'string' }
            ]
          }
        },
        insight_type: {
          type: 'string',
          enum: ['patterns', 'predictions', 'quality', 'all'],
          description: 'Type of insights to generate',
          default: 'all'
        }
      },
      required: ['data']
    });
    this.aiEngine = aiEngine;
  }

  async execute(args) {
    const processedData = await this.aiEngine.processData(args.data);
    let insightsText = '';
    
    if (args.insight_type === 'all' || args.insight_type === 'patterns') {
      insightsText += `Patterns: ${JSON.stringify(processedData.patterns, null, 2)}\n`;
    }
    
    if (args.insight_type === 'all' || args.insight_type === 'predictions') {
      insightsText += `Predictions: ${JSON.stringify(processedData.predictions, null, 2)}\n`;
    }
    
    if (args.insight_type === 'all' || args.insight_type === 'quality') {
      insightsText += `Data Quality: ${JSON.stringify(processedData.insights, null, 2)}\n`;
    }
    
    return {
      content: [
        {
          type: 'text',
          text: `AI Insights:\n${insightsText}`
        }
      ]
    };
  }
}

// Tool Registry - manages all tool strategies
class ToolRegistry {
  constructor() {
    this.handlers = new Map();
    this.aiEngine = null;
    this.neuralNetwork = null;
  }

  // Set AI components for handlers that need them
  setAIComponents(aiEngine, neuralNetwork) {
    this.aiEngine = aiEngine;
    this.neuralNetwork = neuralNetwork;
  }

  // Register a tool handler
  register(handler) {
    this.handlers.set(handler.name, handler);
  }

  // Get a tool handler by name
  getHandler(name) {
    return this.handlers.get(name);
  }

  // Get all tool definitions
  getAllToolDefinitions() {
    return Array.from(this.handlers.values()).map(handler => handler.getDefinition());
  }

  // Execute a tool by name
  async executeTool(name, args) {
    const handler = this.getHandler(name);
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }
    
    try {
      return await handler.execute(args);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }

  // Initialize all default tools
  initializeDefaultTools() {
    // Basic tools
    this.register(new EchoToolHandler());
    this.register(new AddToolHandler());
    this.register(new WeatherToolHandler());
    this.register(new S3ToolHandler());

    // AI tools (only if AI components are available)
    if (this.aiEngine) {
      this.register(new AIInsightsHandler(this.aiEngine));
    }
    
    if (this.neuralNetwork) {
      this.register(new NeuralNetworkTrainingHandler(this.neuralNetwork));
    }
  }
}

// Export for use in the main server
export { ToolRegistry, ToolHandler, EchoToolHandler, AddToolHandler, WeatherToolHandler, S3ToolHandler, NeuralNetworkTrainingHandler, AIInsightsHandler };
