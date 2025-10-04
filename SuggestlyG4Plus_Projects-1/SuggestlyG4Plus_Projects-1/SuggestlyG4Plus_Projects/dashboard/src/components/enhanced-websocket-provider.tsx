'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  metrics: any;
  alerts: string[];
  detections: string[];
  connect: (token?: string) => void;
  disconnect: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  metrics: {},
  alerts: [],
  detections: [],
  connect: () => {},
  disconnect: () => {},
  connectionStatus: 'disconnected'
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export function EnhancedWebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [alerts, setAlerts] = useState<string[]>([]);
  const [detections, setDetections] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = useCallback((token?: string) => {
    if (connectionStatus === 'connecting' || connectionStatus === 'connected') {
      return;
    }

    setConnectionStatus('connecting');
    
    // Construct WebSocket URL with token if provided
    const wsUrl = token 
      ? `ws://localhost:3000?token=${token}`
      : 'ws://localhost:3000';
    
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        console.log('✅ Connected to MCP Server WebSocket');
        
        // Send initial connection message
        ws.send(JSON.stringify({
          type: 'connect',
          message: 'Dashboard client connected',
          timestamp: new Date().toISOString()
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'metrics':
              setMetrics(data.data);
              break;
            case 'alert':
              setAlerts(prev => {
                // Keep only last 10 alerts to prevent memory issues
                const newAlerts = [...prev, data.message];
                return newAlerts.slice(-10);
              });
              break;
            case 'detection':
              setDetections(prev => {
                // Keep only last 20 detections
                const newDetections = [...prev, data.message];
                return newDetections.slice(-20);
              });
              break;
            case 'connected':
              console.log('WebSocket connection confirmed:', data.message);
              break;
            case 'error':
              console.error('WebSocket error from server:', data.message);
              break;
            default:
              console.log('Unknown WebSocket message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts < 5) {
          const backoffTime = Math.pow(2, reconnectAttempts) * 1000; // 1s, 2s, 4s, 8s, 16s
          console.log(`Reconnecting in ${backoffTime}ms...`);
          
          setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect(token);
          }, backoffTime);
        } else {
          console.error('Max reconnection attempts reached');
          setConnectionStatus('error');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [connectionStatus, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setReconnectAttempts(0);
    }
  }, [socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  // Clear old alerts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.slice(-5)); // Keep only last 5 alerts
      setDetections(prev => prev.slice(-10)); // Keep only last 10 detections
    }, 60000); // Clean up every minute

    return () => clearInterval(interval);
  }, []);

  const value: WebSocketContextType = {
    socket,
    isConnected,
    metrics,
    alerts,
    detections,
    connect,
    disconnect,
    connectionStatus
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a EnhancedWebSocketProvider');
  }
  return context;
}
