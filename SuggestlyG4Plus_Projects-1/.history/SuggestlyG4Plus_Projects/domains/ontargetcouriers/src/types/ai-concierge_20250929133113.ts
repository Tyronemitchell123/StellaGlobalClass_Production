// Enhanced AI Concierge Types

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  agent?: AgentType;
  voice?: boolean;
}

export interface AgentType {
  id: string;
  name: string;
  role: 'booking' | 'tracking' | 'support' | 'general' | 'emergency';
  specialty: string;
  avatar: string;
  voiceEnabled: boolean;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  voice: string;
  rate: number;
  pitch: number;
}

export interface ConversationContext {
  currentAgent: AgentType;
  conversationHistory: Message[];
  userPreferences: {
    voiceEnabled: boolean;
    preferredAgent?: string;
    language: string;
  };
  sessionId: string;
}

export interface OpenAIResponse {
  message: string;
  agent?: AgentType;
  actions?: string[];
  confidence: number;
}

// Agent definitions
export const AVAILABLE_AGENTS: AgentType[] = [
  {
    id: 'general',
    name: 'Alex',
    role: 'general',
    specialty: 'General concierge services and coordination',
    avatar: '🤖',
    voiceEnabled: true,
  },
  {
    id: 'booking',
    name: 'Sarah',
    role: 'booking',
    specialty: 'Premium booking and logistics coordination',
    avatar: '📋',
    voiceEnabled: true,
  },
  {
    id: 'tracking',
    name: 'Marcus',
    role: 'tracking',
    specialty: 'Real-time package tracking and updates',
    avatar: '📍',
    voiceEnabled: true,
  },
  {
    id: 'support',
    name: 'Emma',
    role: 'support',
    specialty: 'Customer support and issue resolution',
    avatar: '💬',
    voiceEnabled: true,
  },
  {
    id: 'emergency',
    name: 'Victor',
    role: 'emergency',
    specialty: 'Emergency response and critical situations',
    avatar: '🚨',
    voiceEnabled: true,
  },
];
