import net from 'net';
import http from 'http';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { EventEmitter } from 'events';
import cluster from 'cluster';
import os from 'os';

// Multi-task MCP Server with enhanced capabilities
class MultiTaskMCPServer extends EventEmitter {
  constructor() {
    super();
    this.workers = [];
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.taskIdCounter = 0;
    this.connections = new Set();
    this.stats = {
      totalRequests: 0,
      activeConnections: 0,
      completedTasks: 0,
      failedTasks: 0,
      startTime: Date.now()
    };
    
    this.initializeWorkers();
    this.setupTaskProcessor();
  }

  // Initialize worker threads for CPU-intensive tasks
  initializeWorkers() {
    const numWorkers = Math.min(os.cpus().length, 8); // Limit to 8 workers max
    
    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(this.createWorkerScript(), {
        eval: true,
        workerData: { workerId: i }
      });
      
      worker.on('message', (message) => {
        this.handleWorkerMessage(worker, message);
      });
      
      worker.on('error', (error) => {
        console.error(`Worker ${i} error:`, error);
        this.restartWorker(i);
      });
      
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.log(`Worker ${i} exited with code ${code}. Restarting...`);
          this.restartWorker(i);
        }
      });
      
      this.workers.push({
        id: i,
        worker,
        busy: false,
        currentTask: null,
        tasksCompleted: 0
      });
    }
    
    console.log(`Initialized ${numWorkers} worker threads`);
  }

  // Create worker script as a string
  createWorkerScript() {
    return `
      const { workerData, parentPort } = require('worker_threads');
      
      // Simulated tool implementations for worker thread
      const tools = {
        echo: ({ text }) => ({ text }),
        add: ({ a, b }) => ({ text: \`The sum of \${a} and \${b} is \${a + b}\` }),
        get_weather: ({ location, units }) => {
          // Simulate weather API call with delay
          const temp = units === 'metric' ? '22°C' : '72°F';
          const humidity = '65%';
          const wind = units === 'metric' ? '15 km/h' : '9 mph';
          return { text: \`Weather in \${location}: \${temp} Partly cloudy. Humidity: \${humidity} Wind: \${wind}\` };
        },
        calculate_date: ({ base_date, expression }) => {
          const date = base_date ? new Date(base_date) : new Date();
          return { text: \`Calculated date: \${date.toISOString().split('T')[0]}\` };
        },
        list_s3_buckets: ({ region }) => {
          // Simulate AWS S3 operation
          return { text: \`List of S3 buckets in region \${region}\` };
        },
        get_s3_object: ({ bucket, key, region }) => {
          return { text: \`Contents of S3 object \${key} in bucket \${bucket} at region \${region}\` };
        },
        put_s3_object: ({ bucket, key, content, region }) => {
          return { text: \`Put object \${key} in bucket \${bucket} at region \${region} with content length \${content.length}\` };
        },
        list_sqs_queues: ({ region }) => {
          return { text: \`List of SQS queues in region \${region}\` };
        },
        send_sqs_message: ({ queue_url, message_body, region }) => {
          return { text: \`Sent message to queue \${queue_url} in region \${region}\` };
        },
        receive_sqs_message: ({ queue_url, region }) => {
          return { text: \`Received message from queue \${queue_url} in region \${region}\` };
        },
        take_photo: ({ resolution = '1080p' }) => {
          // Simulate camera operation
          return { text: \`Photo captured successfully at \${resolution} resolution. Image data: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...\` };
        },
        record_video: ({ duration = 10, resolution = '1080p' }) => {
          // Simulate video recording
          return { text: \`Video recorded for \${duration} seconds at \${resolution} resolution. Video data: data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMQAAAAhmcmVlAAAGF21kYXQ...\` };
        },
        detect_faces: ({ image_data }) => {
          // Simulate AI face detection
          return { text: \`Face detection completed. Found 2 faces: Face 1 at (100,150) confidence 95%, Face 2 at (300,200) confidence 92%.\` };
        },
        scan_qr: ({ image_data }) => {
          // Simulate QR code scanning
          return { text: \`QR code scanned successfully. Decoded data: https://veridianconcierge.com/secure-access\` };
        },
        detect_objects: ({ image_data }) => {
          // Simulate AI object detection
          return { text: \`Object detection completed. Detected objects: Person (85%), Chair (72%), Table (68%), Laptop (91%).\` };
        },
        measure_distance: ({ point1, point2 }) => {
          // Simulate distance measurement
          const distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
          return { text: \`Measured distance between points: \${distance.toFixed(2)} pixels (approximately \${ (distance * 0.026).toFixed(2) } cm at 96 DPI).\` };
        },
        recognize_emotion: ({ image_data }) => {
          // Simulate emotion recognition
          return { text: \`Emotion recognition completed. Primary emotion: Happy (78%), Secondary: Surprised (15%).\` };
        },
        detect_gestures: ({ video_data }) => {
          // Simulate gesture detection
          return { text: \`Gesture detection completed. Detected gestures: Thumbs up (90%), Open hand (75%).\` };
        },
        speech_recognition: ({ audio_data }) => {
          // Simulate speech recognition
          return { text: \`Speech recognition completed. Transcribed text: "Welcome to Veridian concierge services. How may I assist you today?"\` };
        },
        generate_text: ({ prompt }) => {
          // Simulate AI text generation
          return { text: \`AI-generated enhancement: \${prompt}. This revolutionary AI-powered description provides deeper insights and actionable steps for optimal productivity.\` };
        },
        // CPU-intensive task examples
        fibonacci: ({ n }) => {
          const fib = (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2);
          const result = fib(n);
          return { text: \`Fibonacci(\${n}) = \${result}\` };
        },
        prime_factorization: ({ number }) => {
          const factors = [];
          let n = number;
          for (let i = 2; i <= Math.sqrt(n); i++) {
            while (n % i === 0) {
              factors.push(i);
              n /= i;
            }
          }
          if (n > 1) factors.push(n);
          return { text: \`Prime factors of \${number}: \${factors.join(', ')}\` };
        },
        matrix_multiplication: ({ size }) => {
          // Simulate matrix multiplication
          return { text: \`Matrix multiplication completed for \${size}x\${size} matrices\` };
        }
      };

      parentPort.on('message', async (message) => {
        const { taskId, toolName, args, connectionId } = message;
        
        try {
          if (!tools[toolName]) {
            throw new Error(\`Tool not found: \${toolName}\`);
          }
          
          // Simulate processing time for different tools
          const processingTime = Math.random() * 1000 + 500; // 0.5-1.5 seconds
          await new Promise(resolve => setTimeout(resolve, processingTime));
          
          const result = await tools[toolName](args);
          
          parentPort({
            type: 'result',
            taskId,
            result,
            connectionId,
            workerId: workerData.workerId,
            processingTime
          });
        } catch (error) {
          parentPort({
            type: 'error',
            taskId,
            error: error.message,
            connectionId,
            workerId: workerData.workerId
          });
        }
      });
    `;
  }

  // Restart a failed worker
  restartWorker(workerIndex) {
    const oldWorker = this.workers[workerIndex];
    if (oldWorker.worker) {
      oldWorker.worker.terminate();
    }
    
    const newWorker = new Worker(this.createWorkerScript(), {
      eval: true,
      workerData: { workerId: workerIndex }
    });
    
    newWorker.on('message', (message) => {
      this.handleWorkerMessage(newWorker, message);
    });
    
    this.workers[workerIndex] = {
      ...this.workers[workerIndex],
      worker: newWorker,
      busy: false,
      currentTask: null
    };
    
    console.log(`Worker ${workerIndex} restarted`);
  }

  // Handle messages from worker threads
  handleWorkerMessage(worker, message) {
    const { type, taskId, result, error, connectionId, workerId, processingTime } = message;
    
    if (type === 'result') {
      this.completeTask(taskId, result, connectionId, workerId, processingTime);
    } else if (type === 'error') {
      this.failTask(taskId, error, connectionId, workerId);
    }
    
    // Mark worker as available
    const workerInfo = this.workers.find(w => w.worker === worker);
    if (workerInfo) {
      workerInfo.busy = false;
      workerInfo.currentTask = null;
      workerInfo.tasksCompleted++;
    }
    
    // Process next task in queue
    this.processNextTask();
  }

  // Set up task processor
  setupTaskProcessor() {
    setInterval(() => {
      this.processNextTask();
    }, 100); // Process queue every 100ms
  }

  // Process next task in queue
  processNextTask() {
    if (this.taskQueue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;
    
    const task = this.taskQueue.shift();
    this.executeTask(task, availableWorker);
  }

  // Execute a task on a specific worker
  executeTask(task, worker) {
    const { taskId, toolName, args, connectionId, request } = task;
    
    worker.busy = true;
    worker.currentTask = taskId;
    
    this.activeTasks.set(taskId, {
      toolName,
      connectionId,
      startTime: Date.now(),
      workerId: worker.id
    });
    
    worker.worker.postMessage({
      taskId,
      toolName,
      args,
      connectionId
    });
  }

  // Add a new task to the queue
  addTask(toolName, args, connectionId, request) {
    const taskId = ++this.taskIdCounter;
    const task = { taskId, toolName, args, connectionId, request };
    
    this.taskQueue.push(task);
    this.stats.totalRequests++;
    
    console.log(`Task ${taskId} added to queue: ${toolName}`);
    
    // Try to process immediately
    this.processNextTask();
    
    return taskId;
  }

  // Complete a task successfully
  completeTask(taskId, result, connectionId, workerId, processingTime) {
    const task = this.activeTasks.get(taskId);
    if (!task) return;
    
    const completionTime = Date.now();
    const duration = completionTime - task.startTime;
    
    this.activeTasks.delete(taskId);
    this.stats.completedTasks++;
    
    console.log(`Task ${taskId} completed in ${duration}ms by worker ${workerId}`);
    
    // Send response back to connection
    const connection = this.connections.get(connectionId);
    if (connection) {
      const response = this.makeResponse(request?.id, { content: [result] });
      this.sendToConnection(connection, response);
    }
    
    this.emit('taskCompleted', { taskId, duration, workerId, processingTime });
  }

  // Fail a task
  failTask(taskId, error, connectionId, workerId) {
    const task = this.activeTasks.get(taskId);
    if (!task) return;
    
    this.activeTasks.delete(taskId);
    this.stats.failedTasks++;
    
    console.error(`Task ${taskId} failed: ${error}`);
    
    // Send error response back to connection
    const connection = this.connections.get(connectionId);
    if (connection) {
      const response = this.makeResponse(request?.id, null, new Error(error));
      this.sendToConnection(connection, response);
    }
    
    this.emit('taskFailed', { taskId, error, workerId });
  }

  // Send data to a connection
  sendToConnection(connection, data) {
    if (connection.type === 'tcp') {
      connection.socket.write(data + '\n');
    } else if (connection.type === 'http') {
      connection.res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      connection.res.end(data);
    }
  }

  // JSON-RPC response helper
  makeResponse(id, result, error) {
    if (error) {
      return JSON.stringify({ jsonrpc: "2.0", id, error: { message: error.message } });
    }
    return JSON.stringify({ jsonrpc: "2.0", id, result });
  }

  // Get server statistics
  getStats() {
    const uptime = Date.now() - this.stats.startTime;
    const workerStats = this.workers.map(w => ({
      id: w.id,
      busy: w.busy,
      tasksCompleted: w.tasksCompleted,
      currentTask: w.currentTask
    }));
    
    return {
      ...this.stats,
      uptime,
      queueLength: this.taskQueue.length,
      activeTasks: this.activeTasks.size,
      workers: workerStats
    };
  }

  // List available tools
  listTools() {
    return [
      { name: 'echo', description: 'Echo back the provided text' },
      { name: 'add', description: 'Add two numbers' },
      { name: 'get_weather', description: 'Get weather information for a location' },
      { name: 'calculate_date', description: 'Calculate dates based on expressions' },
      { name: 'list_s3_buckets', description: 'List S3 buckets in a region' },
      { name: 'get_s3_object', description: 'Get S3 object content' },
      { name: 'put_s3_object', description: 'Put object to S3 bucket' },
      { name: 'list_sqs_queues', description: 'List SQS queues in a region' },
      { name: 'send_sqs_message', description: 'Send message to SQS queue' },
      { name: 'receive_sqs_message', description: 'Receive message from SQS queue' },
      { name: 'take_photo', description: 'Capture photo with camera' },
      { name: 'record_video', description: 'Record video with camera' },
      { name: 'detect_faces', description: 'Detect faces in image' },
      { name: 'scan_qr', description: 'Scan QR codes in image' },
      { name: 'detect_objects', description: 'Detect objects in image' },
      { name: 'measure_distance', description: 'Measure distance between points' },
      { name: 'recognize_emotion', description: 'Recognize emotions in image' },
      { name: 'detect_gestures', description: 'Detect gestures in video' },
      { name: 'speech_recognition', description: 'Convert speech to text' },
      { name: 'generate_text', description: 'Generate text using AI' },
      { name: 'fibonacci', description: 'Calculate Fibonacci numbers (CPU-intensive)' },
      { name: 'prime_factorization', description: 'Factorize numbers into primes (CPU-intensive)' },
      { name: 'matrix_multiplication', description: 'Perform matrix multiplication (CPU-intensive)' }
    ];
  }

  // Handle incoming JSON-RPC requests
  async handleRequest(request, connectionId, connection) {
    const { id, method, params } = request;
    
    if (method === 'tools/list') {
      const toolList = this.listTools();
      const response = this.makeResponse(id, { tools: toolList });
      this.sendToConnection(connection, response);
    } else if (method === 'tools/call') {
      const { name, arguments: args } = params;
      const taskId = this.addTask(name, args, connectionId, request);
      console.log(`Task ${taskId} queued for tool: ${name}`);
    } else if (method === 'server/stats') {
      const stats = this.getStats();
      const response = this.makeResponse(id, stats);
      this.sendToConnection(connection, response);
    } else {
      const response = this.makeResponse(id, null, new Error(`Unknown method: ${method}`));
      this.sendToConnection(connection, response);
    }
  }

  // Create TCP server
  createTCPServer(port) {
    const server = net.createServer((socket) => {
      const connectionId = `tcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let buffer = '';
      
      const connection = {
        type: 'tcp',
        socket,
        id: connectionId
      };
      
      this.connections.set(connectionId, connection);
      this.stats.activeConnections++;
      
      console.log(`TCP client connected: ${connectionId}`);
      
      socket.on('data', async (data) => {
        buffer += data.toString();
        let boundary = buffer.indexOf('\n');
        
        while (boundary !== -1) {
          const input = buffer.substring(0, boundary);
          buffer = buffer.substring(boundary + 1);
          
          try {
            const request = JSON.parse(input);
            await this.handleRequest(request, connectionId, connection);
          } catch (error) {
            console.error('TCP request error:', error);
            const response = this.makeResponse(null, null, error);
            socket.write(response + '\n');
          }
          
          boundary = buffer.indexOf('\n');
        }
      });
      
      socket.on('close', () => {
        this.connections.delete(connectionId);
        this.stats.activeConnections--;
        console.log(`TCP client disconnected: ${connectionId}`);
      });
      
      socket.on('error', (err) => {
        console.error(`TCP socket error for ${connectionId}:`, err);
        this.connections.delete(connectionId);
        this.stats.activeConnections--;
      });
    });
    
    server.listen(port, () => {
      console.log(`Multi-task TCP MCP server listening on port ${port}`);
    });
    
    return server;
  }

  // Create HTTP server
  createHTTPServer(port) {
    const server = http.createServer(async (req, res) => {
      const connectionId = `http_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const connection = {
        type: 'http',
        res,
        id: connectionId
      };
      
      this.connections.set(connectionId, connection);
      this.stats.activeConnections++;
      
      if (req.method === 'POST' && req.url === '/call-tool') {
        let body = '';
        
        req.on('data', chunk => {
          body += chunk;
        });
        
        req.on('end', async () => {
          try {
            const { name, args } = JSON.parse(body);
            const taskId = this.addTask(name, args, connectionId, { id: Date.now() });
            console.log(`HTTP task ${taskId} queued for tool: ${name}`);
          } catch (error) {
            console.error('HTTP request error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify({ error: error.message }));
          } finally {
            // Connection will be cleaned up when response is sent
          }
        });
      } else if (req.method === 'GET' && req.url === '/stats') {
        const stats = this.getStats();
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(stats));
        this.connections.delete(connectionId);
        this.stats.activeConnections--;
      } else if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ 
          status: 'healthy', 
          uptime: Date.now() - this.stats.startTime,
          workers: this.workers.length,
          queueLength: this.taskQueue.length
        }));
        this.connections.delete(connectionId);
        this.stats.activeConnections--;
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ error: 'Not Found' }));
        this.connections.delete(connectionId);
        this.stats.activeConnections--;
      }
    });
    
    server.listen(port, () => {
      console.log(`Multi-task HTTP MCP server listening on port ${port}`);
    });
    
    return server;
  }

  // Graceful shutdown
  shutdown() {
    console.log('Shutting down multi-task MCP server...');
    
    // Terminate all workers
    this.workers.forEach(worker => {
      worker.worker.terminate();
    });
    
    // Clear task queue
    this.taskQueue = [];
    
    // Close all connections
    this.connections.forEach(connection => {
      if (connection.type === 'tcp') {
        connection.socket.destroy();
      } else if (connection.type === 'http') {
        connection.res.end();
      }
    });
    
    console.log('Multi-task MCP server shutdown complete');
  }
}

// Create and start the multi-task MCP server
const mcpServer = new MultiTaskMCPServer();

// Set up graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  mcpServer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  mcpServer.shutdown();
  process.exit(0);
});

// Start servers
const TCP_PORT = 3000;
const HTTP_PORT = 3001;

const tcpServer = mcpServer.createTCPServer(TCP_PORT);
const httpServer = mcpServer.createHTTPServer(HTTP_PORT);

// Log server statistics every 30 seconds
setInterval(() => {
  const stats = mcpServer.getStats();
  console.log('=== Server Statistics ===');
  console.log(`Uptime: ${Math.floor(stats.uptime / 1000)}s`);
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Completed Tasks: ${stats.completedTasks}`);
  console.log(`Failed Tasks: ${stats.failedTasks}`);
  console.log(`Active Connections: ${stats.activeConnections}`);
  console.log(`Queue Length: ${stats.queueLength}`);
  console.log(`Active Tasks: ${stats.activeTasks}`);
  console.log('Workers:', stats.workers.map(w => 
    `Worker ${w.id}: ${w.busy ? 'BUSY' : 'IDLE'} (${w.tasksCompleted} completed)`
  ).join(', '));
  console.log('========================');
}, 30000);

console.log('🚀 Multi-Task MCP Server started successfully!');
console.log(`📡 TCP Server: http://localhost:${TCP_PORT}`);
console.log(`🌐 HTTP Server: http://localhost:${HTTP_PORT}`);
console.log(`📊 Health Check: http://localhost:${HTTP_PORT}/health`);
console.log(`📈 Statistics: http://localhost:${HTTP_PORT}/stats`);
console.log('🔧 Available tools: echo, add, get_weather, calculate_date, AWS operations, camera/AI tools, CPU-intensive tasks');
