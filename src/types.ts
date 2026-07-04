export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    size: string;
    base64?: string;
  };
  groundingLinks?: Array<{ title: string; uri: string }>;
  isPending?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface StoredMemory {
  id: string;
  category: 'preference' | 'app' | 'writing_style' | 'personal_info';
  content: string;
  extractedAt: string;
}

export interface LocalNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  text: string;
  dueTime: string;
  completed: boolean;
  createdAt: string;
}

export interface LocalFile {
  id: string;
  name: string;
  path: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'archive' | 'audio' | 'folder';
  category: 'Documents' | 'Downloads' | 'Desktop';
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'light' | 'plug' | 'thermostat' | 'speaker';
  status: boolean;
  value?: string;
  room: string;
}

export interface AuditLog {
  id: string;
  type: 'automation' | 'permission' | 'memory' | 'system';
  message: string;
  timestamp: string;
  status: 'success' | 'denied' | 'pending';
}

export interface UserConfig {
  userName: string;
  assistantName: string;
  language: string;
  theme: string; // 'cosmic' | 'polar' | 'cyber'
  selectedModel: string;
  personality: string; // 'professional' | 'warm' | 'geeky' | 'witty'
  voiceEnabled: boolean;
  textToSpeech: boolean;
}
