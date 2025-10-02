/**
 * Production-Ready Tool Handlers
 * Implements Strategy Pattern for tool management with comprehensive error handling
 */

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const WEATHER_CONSTANTS = {
  METRIC: {
    DEFAULT_TEMP: 22,
    DEFAULT_WIND_SPEED: 15,
    UNIT: 'C',
    SPEED_UNIT: 'km/h'
  },
  IMPERIAL: {
    DEFAULT_TEMP: 72,
    DEFAULT_WIND_SPEED: 9,
    UNIT: 'F',
    SPEED_UNIT: 'mph'
  },
  DEFAULT_CONDITION: 'Partly cloudy',
  DEFAULT_HUMIDITY: 65
};

const NEURAL_NETWORK_DEFAULTS = {
  EPOCHS: 100,
  LEARNING_RATE: 0.01
};

const ERROR_MESSAGES = {
  UNKNOWN_TOOL: (name, availableTools) => 
    `Unknown tool: ${name}. Available tools: ${availableTools.join(', ')}`,
  INVALID_INPUT: (fieldName, expectedType) => 
    `Invalid input: "${fieldName}" must be of type ${expectedType}`,
  MISSING_REQUIRED: (fieldName) => 
    `Missing required field: "${fieldName}"`,
  NETWORK_NOT_TRAINED: 'Neural network must be trained before making predictions',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  INVALID_CONTENT_TYPE: 'Content-Type must be application/json',
  REQUEST_TOO_LARGE: 'Request entity too large'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>]/g, '').replace(/javascript:/gi, '');
};

const validateType = (value, expectedType, fieldName) => {
  if (typeof value !== expectedType) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT(fieldName, expectedType));
  }
};

const validateRequired = (obj, requiredFields) => {
  requiredFields.forEach(field => {
    if (obj[field] === undefined || obj[field] === null) {
      throw new Error(ERROR_MESSAGES.MISSING_REQUIRED(field));
    }
  });
};

// ============================================================================
// LOGGING SYSTEM
// ============================================================================

export const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data);
  },
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data);
  },
  error: (message, data = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, data);
  },
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
    }
  }
};

// ============================================================================
// STRATEGY PATTERN - TOOL HANDLERS
// ============================================================================

class ToolHandler {
  constructor(name, description, inputSchema) {
    this.name = name;
    this.description = description;
    this.inputSchema = inputSchema;
    logger.debug(`ToolHandler created: ${name}`);
  }

  async execute(args) {
    throw new Error('Execute method must be implemented by concrete handler');
  }

  validateInput(args) {
    if (!args || typeof args !== 'object') {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT('args', 'object'));
    }

    if (this.inputSchema.required) {
      validateRequired(args, this.inputSchema.required);
    }

    if (this.inputSchema.properties) {
      Object.entries(this.inputSchema.properties).forEach(([field, schema]) => {
        if (args[field] !== undefined) {
          validateType(args[field], schema.type, field);
        }
      });
    }
  }

  getDefinition() {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.inputSchema
    };
  }
}

// ============================================================================
// CONCRETE TOOL HANDLERS
// ============================================================================

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
    logger.info('Executing Echo tool', { textLength: args.text?.length });
    this.validateInput(args);
    
    const sanitizedText = sanitizeText(args.text);
    
    return {
      content: [
        {
          type: 'text',
          text: sanitizedText
        }
      ]
    };
  }
}

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
    logger.info('Executing Add tool', { a: args.a, b: args.b });
    this.validateInput(args);
    
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
    logger.info('Executing Weather tool', { location: args.location, units: args.units });
    this.validateInput(args);
    
    const sanitizedLocation = sanitizeText(args.location);
    const unitSystem = args.units === 'metric' ? WEATHER_CONSTANTS.METRIC : WEATHER_CONSTANTS.IMPERIAL;
    
    const weatherData = {
      location: sanitizedLocation,
      temperature: unitSystem.DEFAULT_TEMP,
      condition: WEATHER_CONSTANTS.DEFAULT_CONDITION,
      humidity: WEATHER_CONSTANTS.DEFAULT_HUMIDITY,
      wind_speed: unitSystem.DEFAULT_WIND_SPEED,
      units: args.units
    };

    return {
      content: [
        {
          type: 'text',
          text: `Weather in ${weatherData.location}: ${weatherData.temperature}°${unitSystem.UNIT}, ${weatherData.condition}. Humidity: ${weatherData.humidity}%, Wind: ${weatherData.wind_speed} ${unitSystem.SPEED_UNIT}`
        }
      ]
    };
  }
}

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
    logger.info('Executing S3 tool', { region: args.region });
    this.validateInput(args);
    
    const region = args.region || 'us-east-1';
    const s3Client = new S3Client({ region });
    const buckets = await s3Client.send(new ListBucketsCommand({}));
    
    const bucketNames = buckets.Buckets?.map(b => b.Name).join(', ') || 'None';
    logger.info('S3 buckets listed', { count: buckets.Buckets?.length || 0 });
    
    return {
      content: [
        {
          type: 'text',
          text: `S3 Buckets: ${bucketNames}`
        }
      ]
    };
  }
}

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
          default: NEURAL_NETWORK_DEFAULTS.EPOCHS
        },
        learning_rate: {
          type: 'number',
          description: 'Learning rate for training',
          default: NEURAL_NETWORK_DEFAULTS.LEARNING_RATE
        }
      },
      required: ['training_data', 'labels']
    });
    this.neuralNetwork = neuralNetwork;
  }

  async execute(args) {
    logger.info('Executing Neural Network training', { 
      dataPoints: args.training_data?.length,
      epochs: args.epochs,
      learningRate: args.learning_rate
    });
    this.validateInput(args);
    
    if (!this.neuralNetwork) {
      throw new Error('Neural network not available');
    }
    
    this.neuralNetwork.epochs = args.epochs || NEURAL_NETWORK_DEFAULTS.EPOCHS;
    this.neuralNetwork.learningRate = args.learning_rate || NEURAL_NETWORK_DEFAULTS.LEARNING_RATE;
    
    await this.neuralNetwork.initialize();
    await this.neuralNetwork.train(args.training_data, args.labels);
    
    const trainingHistory = this.neuralNetwork.getTrainingHistory();
    const finalLoss = trainingHistory[trainingHistory.length - 1]?.loss.toFixed(6) || 'N/A';
    
    logger.info('Neural network training completed', { 
      epochs: trainingHistory.length,
      finalLoss
    });
    
    return {
      content: [
        {
          type: 'text',
          text: `Neural Network Training Complete:\nFinal Loss: ${finalLoss}\nEpochs: ${trainingHistory.length}`
        }
      ]
    };
  }
}

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
    logger.info('Executing AI Insights', { 
      dataPoints: args.data?.length,
      insightType: args.insight_type
    });
    this.validateInput(args);
    
    if (!this.aiEngine) {
      throw new Error('AI engine not available');
    }
    
    const processedData = await this.aiEngine.processData(args.data);
    
    const insightSections = {
      patterns: () => `Patterns: ${JSON.stringify(processedData.patterns, null, 2)}`,
      predictions: () => `Predictions: ${JSON.stringify(processedData.predictions, null, 2)}`,
      quality: () => `Data Quality: ${JSON.stringify(processedData.insights, null, 2)}`
    };

    const sections = args.insight_type === 'all' 
      ? Object.keys(insightSections)
      : [args.insight_type];

    const insightsText = sections
      .filter(section => insightSections[section])
      .map(section => insightSections[section]())
      .join('\n');

    logger.info('AI insights generated', { 
      sections: sections.length,
      insightType: args.insight_type
    });
    
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

// ============================================================================
// TOOL REGISTRY
// ============================================================================

export class ToolRegistry {
  constructor() {
    this.handlers = new Map();
    this.aiEngine = null;
    this.neuralNetwork = null;
    this.stats = {
      totalRequests: 0,
      totalErrors: 0,
      toolExecutions: 0
    };
    logger.info('ToolRegistry initialized');
  }

  setAIComponents(aiEngine, neuralNetwork) {
    this.aiEngine = aiEngine;
    this.neuralNetwork = neuralNetwork;
    logger.info('AI components set in registry');
  }

  register(handler) {
    if (!(handler instanceof ToolHandler)) {
      throw new Error('Handler must be an instance of ToolHandler');
    }
    
    this.handlers.set(handler.name, handler);
    logger.info(`Tool handler registered: ${handler.name}`);
  }

  getHandler(name) {
    return this.handlers.get(name);
  }

  getAllToolDefinitions() {
    return Array.from(this.handlers.values()).map(handler => handler.getDefinition());
  }

  async executeTool(name, args) {
    logger.info('Executing tool', { toolName: name });
    this.stats.totalRequests++;
    
    const handler = this.getHandler(name);
    if (!handler) {
      const availableTools = Array.from(this.handlers.keys());
      const errorMessage = ERROR_MESSAGES.UNKNOWN_TOOL(name, availableTools);
      logger.error('Unknown tool requested', { toolName: name, availableTools });
      this.stats.totalErrors++;
      throw new Error(errorMessage);
    }
    
    try {
      const result = await handler.execute(args);
      this.stats.toolExecutions++;
      logger.info('Tool executed successfully', { toolName: name, success: !result.isError });
      return result;
    } catch (error) {
      this.stats.totalErrors++;
      logger.error('Tool execution failed', { 
        toolName: name, 
        error: error.message,
        stack: error.stack 
      });
      
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

  initializeDefaultTools() {
    logger.info('Initializing default tools');
    
    this.register(new EchoToolHandler());
    this.register(new AddToolHandler());
    this.register(new WeatherToolHandler());
    this.register(new S3ToolHandler());

    if (this.aiEngine) {
      this.register(new AIInsightsHandler(this.aiEngine));
    }
    
    if (this.neuralNetwork) {
      this.register(new NeuralNetworkTrainingHandler(this.neuralNetwork));
    }
    
    logger.info(`Initialized ${this.handlers.size} default tools`);
  }

  getStats() {
    return {
      totalTools: this.handlers.size,
      toolNames: Array.from(this.handlers.keys()),
      hasAIEngine: !!this.aiEngine,
      hasNeuralNetwork: !!this.neuralNetwork,
      requests: this.stats.totalRequests,
      errors: this.stats.totalErrors,
      executions: this.stats.toolExecutions
    };
  }
}
