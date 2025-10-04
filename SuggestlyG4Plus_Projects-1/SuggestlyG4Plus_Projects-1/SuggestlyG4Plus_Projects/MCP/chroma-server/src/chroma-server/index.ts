#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ChromaClient } from 'chromadb';

class ChromaServer {
  private server: Server;
  private chromaClient: ChromaClient;

  constructor() {
    this.server = new Server(
      {
        name: 'chroma-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.chromaClient = new ChromaClient();

    this.setupToolHandlers();

    // Error handling
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
          name: 'create_collection',
          description: 'Create a new collection in Chroma',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the collection',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'add_documents',
          description: 'Add documents to a collection',
          inputSchema: {
            type: 'object',
            properties: {
              collection_name: {
                type: 'string',
                description: 'Name of the collection',
              },
              documents: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of document strings',
              },
              metadatas: {
                type: 'array',
                items: { type: 'object' },
                description: 'Array of metadata objects',
              },
              ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of unique IDs for documents',
              },
            },
            required: ['collection_name', 'documents', 'ids'],
          },
        },
        {
          name: 'query_collection',
          description: 'Query a collection for similar documents',
          inputSchema: {
            type: 'object',
            properties: {
              collection_name: {
                type: 'string',
                description: 'Name of the collection',
              },
              query_texts: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of query texts',
              },
              n_results: {
                type: 'number',
                description: 'Number of results to return',
                default: 10,
              },
              where: {
                type: 'object',
                description: 'Metadata filter',
              },
              where_document: {
                type: 'object',
                description: 'Document filter',
              },
            },
            required: ['collection_name', 'query_texts'],
          },
        },
        {
          name: 'get_collection',
          description: 'Get information about a collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the collection',
              },
            },
            required: ['name'],
          },
        },
        {
          name: 'delete_collection',
          description: 'Delete a collection',
          inputSchema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the collection',
              },
            },
            required: ['name'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_collection':
            if (!args || typeof args.name !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for create_collection');
            }
            const collection = await this.chromaClient.createCollection(args.name);
            return {
              content: [
                {
                  type: 'text',
                  text: `Collection '${args.name}' created successfully.`,
                },
              ],
            };

          case 'add_documents':
            if (!args || typeof args.collection_name !== 'string' || !Array.isArray(args.documents) || !Array.isArray(args.ids)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for add_documents');
            }
            const coll = await this.chromaClient.getCollection(args.collection_name);
            await coll.add({
              documents: args.documents,
              metadatas: args.metadatas,
              ids: args.ids,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: `Added ${args.documents.length} documents to collection '${args.collection_name}'.`,
                },
              ],
            };

          case 'query_collection':
            if (!args || typeof args.collection_name !== 'string' || !Array.isArray(args.query_texts)) {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for query_collection');
            }
            const queryColl = await this.chromaClient.getCollection(args.collection_name);
            const results = await queryColl.query({
              queryTexts: args.query_texts,
              nResults: args.n_results || 10,
              where: args.where,
              whereDocument: args.where_document,
            });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };

          case 'get_collection':
            if (!args || typeof args.name !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for get_collection');
            }
            const getColl = await this.chromaClient.getCollection(args.name);
            return {
              content: [
                {
                  type: 'text',
                  text: `Collection '${args.name}' exists.`,
                },
              ],
            };

          case 'delete_collection':
            if (!args || typeof args.name !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments for delete_collection');
            }
            await this.chromaClient.deleteCollection(args.name);
            return {
              content: [
                {
                  type: 'text',
                  text: `Collection '${args.name}' deleted successfully.`,
                },
              ],
            };

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Chroma MCP server running on stdio');
  }
}

const server = new ChromaServer();
server.run().catch(console.error);
