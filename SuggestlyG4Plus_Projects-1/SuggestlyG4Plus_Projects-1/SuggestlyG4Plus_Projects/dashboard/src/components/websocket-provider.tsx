'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  }, [socket, isConnected]);

  const addEventListener = useCallback((type: string, listener: EventListenerOrEventListenerObject) => {
    if (socket) {
      socket.addEventListener(type, listener);
    }
  }, [socket]);

  const removeEventListener = useCallback((type: string, listener: EventListenerOrEventListenerObject) => {
    if (socket) {
      socket.removeEventListener(type, listener);
    }
  }, [socket]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected - Ultra Premium Real-Time Link Established');
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => {
        const newWs = new WebSocket('ws://localhost:3001');
        setSocket(newWs);
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      // Handle incoming messages if needed
      console.log('WebSocket message received:', event.data);
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, addEventListener, removeEventListener }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}
