'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIConcierge({ isOpen, onClose }: AIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI concierge for ultra-premium logistics. How can I assist you with your high-value delivery needs?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      let aiResponseText = 'Thank you for your inquiry. Our UHNW concierge team will personally handle your request. For blockchain-secured tracking and private aviation logistics, we recommend our Global Elite service. Would you like me to arrange a consultation?';

      const lowerInput = inputValue.toLowerCase();
      if (lowerInput.includes('partner') || lowerInput.includes('connect')) {
        aiResponseText = 'Yes, our AI concierge can connect you with relevant partners from our Elite Global Network. Partners are carefully vetted and selected based on your specific requirements, location, and security needs using our advanced AI matching algorithm that analyzes global logistics data, security clearances, and performance history to ensure seamless, secure handoffs worldwide.';
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-96 h-[500px] flex flex-col bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-primary-200">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-primary-600 mr-2" />
            <h3 className="font-semibold text-gray-900">AI Concierge</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-primary-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about UHNW services..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
