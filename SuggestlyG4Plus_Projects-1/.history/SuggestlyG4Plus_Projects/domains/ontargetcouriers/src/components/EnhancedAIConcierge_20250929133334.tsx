'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Mic, MicOff, Volume2, VolumeX, User } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OpenAI from 'openai';
import {
  Message,
  AgentType,
  VoiceSettings,
  ConversationContext,
  AVAILABLE_AGENTS
} from '@/types/ai-concierge';

interface EnhancedAIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedAIConcierge({ isOpen, onClose }: EnhancedAIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI concierge for ultra-premium logistics. How can I assist you with your high-value delivery needs?',
      isUser: false,
      timestamp: new Date(),
      agent: AVAILABLE_AGENTS[0], // General agent
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>(AVAILABLE_AGENTS[0]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    language: 'en-US',
    voice: 'default',
    rate: 1,
    pitch: 1,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Speech recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true // Note: In production, use server-side API calls
  });

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && voiceSettings.enabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceSettings.language;
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;

      // Try to find a suitable voice
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesisRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({
        continuous: false,
        language: voiceSettings.language,
      });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSendMessage = async () => {
    const messageText = inputValue.trim() || transcript;
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      voice: listening,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    resetTranscript();
    setIsTyping(true);

    try {
      // Determine appropriate agent based on message content
      const detectedAgent = determineAgent(messageText);
      if (detectedAgent.id !== currentAgent.id) {
        setCurrentAgent(detectedAgent);

        // Add agent switch message
        const switchMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `Switching you to ${detectedAgent.name}, our ${detectedAgent.specialty.toLowerCase()}.`,
          isUser: false,
          timestamp: new Date(),
          agent: detectedAgent,
        };
        setMessages(prev => [...prev, switchMessage]);
      }

      // Get AI response from OpenAI
      const aiResponse = await getOpenAIResponse(messageText, detectedAgent);

      const responseMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: aiResponse.message,
        isUser: false,
        timestamp: new Date(),
        agent: detectedAgent,
      };

      setMessages(prev => [...prev, responseMessage]);

      // Speak the response if voice is enabled
      if (voiceSettings.enabled) {
        speakText(aiResponse.message);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact our human concierge team.',
        isUser: false,
        timestamp: new Date(),
        agent: currentAgent,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const determineAgent = (message: string): AgentType => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('pickup')) {
      return AVAILABLE_AGENTS.find(a => a.role === 'booking')!;
    }
    if (lowerMessage.includes('track') || lowerMessage.includes('where') || lowerMessage.includes('status')) {
      return AVAILABLE_AGENTS.find(a => a.role === 'tracking')!;
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return AVAILABLE_AGENTS.find(a => a.role === 'support')!;
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('critical')) {
      return AVAILABLE_AGENTS.find(a => a.role === 'emergency')!;
    }

    return AVAILABLE_AGENTS.find(a => a.role === 'general')!;
  };

  const getOpenAIResponse = async (message: string, agent: AgentType): Promise<{ message: string; confidence: number }> => {
    const systemPrompt = `You are ${agent.name}, a premium AI concierge specializing in ${agent.specialty}.
    You work for OnTarget Couriers, the world's most exclusive courier service for ultra-high-net-worth individuals.
    Always maintain the highest level of professionalism, discretion, and luxury service standards.
    Be helpful, knowledgeable, and anticipate client needs. Use sophisticated language appropriate for UHNW clients.
    If you need to transfer to another agent, clearly indicate this in your response.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return {
        message: completion.choices[0]?.message?.content || 'I apologize, but I\'m unable to respond at the moment.',
        confidence: 0.9
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback responses based on agent
      const fallbacks = {
        booking: 'I\'d be delighted to assist with arranging your premium delivery. Could you please provide the pickup and delivery details?',
        tracking: 'I can help you track your valuable shipment. May I have your tracking number?',
        support: 'I apologize for any inconvenience. How can I assist you with your concern?',
        emergency: 'This is an emergency situation. Please contact our 24/7 emergency line immediately at +1 (800) ELITE-911.',
        general: 'How may I assist you with your premium logistics needs today?'
      };

      return {
        message: fallbacks[agent.role] || fallbacks.general,
        confidence: 0.5
      };
    }
  };

  const toggleVoice = () => {
    setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-96 h-[600px] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              {currentAgent.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{currentAgent.name}</h3>
              <p className="text-xs opacity-90">{currentAgent.specialty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {voiceSettings.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
