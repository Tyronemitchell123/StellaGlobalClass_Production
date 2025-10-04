#!/usr/bin/env node

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
import { fromSSO } from "@aws-sdk/credential-provider-sso";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

// Create server instance
const server = new Server(
  {
    name: "mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Store available tools
const tools = [
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
        // Mock weather data - in a real implementation, you would call a weather API
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
        const calculatedDate = dateFns.addDays(baseDate, 0); // Placeholder - would parse expression in real implementation
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server started");
}

main().catch(console.error);
