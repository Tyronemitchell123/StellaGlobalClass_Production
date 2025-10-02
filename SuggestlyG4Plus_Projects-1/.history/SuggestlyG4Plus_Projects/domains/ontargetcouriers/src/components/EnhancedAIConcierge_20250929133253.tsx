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
