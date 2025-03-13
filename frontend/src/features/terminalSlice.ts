import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  type: 'info' | 'success' | 'error' | 'warning';
  content: string;
}

interface TerminalState {
  messages: Message[];
  input: string;
  history: string[];
  historyIndex: number;
  isProcessing: boolean;
  currentCommand: string | null;
  level: number;
  experience: number;
  money: number;
  detection: number;
  isStealthMode: boolean;
}

const initialState: TerminalState = {
  messages: [
    { type: 'info', content: 'Welcome to Terminal Hacker v1.0.0' },
    { type: 'info', content: 'Type "help" for a list of available commands.' },
  ],
  input: '',
  history: [],
  historyIndex: -1,
  isProcessing: false,
  currentCommand: null,
  level: 1,
  experience: 0,
  money: 1000,
  detection: 0,
  isStealthMode: false,
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    clearInput: (state) => {
      state.input = '';
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      state.history.push(action.payload);
    },
    setHistoryIndex: (state, action: PayloadAction<number>) => {
      state.historyIndex = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setCurrentCommand: (state, action: PayloadAction<string | null>) => {
      state.currentCommand = action.payload;
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
    },
    setExperience: (state, action: PayloadAction<number>) => {
      state.experience = action.payload;
    },
    setMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    setDetection: (state, action: PayloadAction<number>) => {
      state.detection = Math.max(0, Math.min(100, action.payload));
    },
    setStealthMode: (state, action: PayloadAction<boolean>) => {
      state.isStealthMode = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setInput,
  clearInput,
  addToHistory,
  setHistoryIndex,
  setProcessing,
  setCurrentCommand,
  setLevel,
  setExperience,
  setMoney,
  setDetection,
  setStealthMode,
  clearMessages,
} = terminalSlice.actions;

export default terminalSlice.reducer; 