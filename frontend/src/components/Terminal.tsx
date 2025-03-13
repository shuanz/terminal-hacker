import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  addMessage,
  setInput,
  clearInput,
  addToHistory,
  setHistoryIndex,
  setProcessing,
  setCurrentCommand,
} from '../features/terminalSlice';
import { processCommand } from '../utils/CommandProcessor';
import { MatrixBackground } from './MatrixBackground';
import { StatusBar } from './StatusBar';
import '../styles/Terminal.css';

export const Terminal: React.FC = () => {
  const dispatch = useDispatch();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const {
    messages,
    input,
    history,
    historyIndex,
    isProcessing,
    currentCommand,
    level,
    experience,
    money,
    detection,
    isStealthMode,
  } = useSelector((state: RootState) => state.terminal);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setInput(e.target.value));
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      const command = input.trim();
      dispatch(addToHistory(command));
      dispatch(clearInput());
      dispatch(setHistoryIndex(-1));
      dispatch(setProcessing(true));
      dispatch(setCurrentCommand(command));

      try {
        await processCommand(command, dispatch);
      } catch (error: unknown) {
        dispatch(addMessage({
          type: 'error',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }));
      } finally {
        dispatch(setProcessing(false));
        dispatch(setCurrentCommand(null));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        dispatch(setHistoryIndex(newIndex));
        dispatch(setInput(history[history.length - 1 - newIndex]));
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        dispatch(setHistoryIndex(newIndex));
        dispatch(setInput(history[history.length - 1 - newIndex]));
      } else {
        dispatch(setHistoryIndex(-1));
        dispatch(clearInput());
      }
    }
  };

  return (
    <div className="app">
      <MatrixBackground />
      <StatusBar
        level={level}
        experience={experience}
        money={money}
        detection={detection}
        isStealthMode={isStealthMode}
      />
      <div
        className="terminal-container"
        onClick={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div className="terminal-output" ref={terminalRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.content}
            </div>
          ))}
          {isProcessing && (
            <div className="message info">
              <span className="blink">Processing...</span>
            </div>
          )}
        </div>
        <div className="terminal-input">
          <span className="prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}; 
import React, { useState, useRef, useEffect } from 'react';
import '../styles/Terminal.css';

interface TerminalProps {
  prompt?: string;
  initialMessage?: string;
}

interface HistoryItem {
  command: string;
  output: string;
}

const Terminal: React.FC<TerminalProps> = ({ 
  prompt = '>', 
  initialMessage = "Terminal Hacker RPG v1.0.0\nType 'help' for available commands." 
}) => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Commands implementation
  const commands: { [key: string]: (args: string[]) => string } = {
    help: () => `
Available commands:
  help - Show this help message
  scan <target> - Scan a target for vulnerabilities
  bruteforce <target> - Attempt to bruteforce a target
  stealth <on|off> - Toggle stealth mode
  clear - Clear terminal output
  status - Show current status
    `,
    clear: () => {
      setHistory([]);
      return '';
    },
    status: () => `
Status:
  Level: 1
  Experience: 0/1000
  Money: $1000
  Detection: 0%
  Stealth Mode: Off
    `,
    scan: (args) => {
      if (args.length === 0) return 'Usage: scan <target>';
      
      const target = args[0];
      return `
Scanning target ${target}...
Scan complete!

Result:
  OS: Ubuntu 20.04 LTS
  Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
  Vulnerabilities: 
    - Weak SSH password (Risk: Medium)
  Detection level: 20%
      `;
    },
    bruteforce: (args) => {
      if (args.length === 0) return 'Usage: bruteforce <target>';
      
      const target = args[0];
      return `
Bruteforcing target ${target}...
Attempt successful!

Result:
  Password found: password123
  Attempts: 128
  Time elapsed: 3.5s
  Method: Dictionary attack
  Detection level: 40%
      `;
    },
    stealth: (args) => {
      if (args.length === 0 || (args[0] !== 'on' && args[0] !== 'off')) {
        return 'Usage: stealth <on|off>';
      }
      
      const mode = args[0];
      return `Stealth mode ${mode === 'on' ? 'activated' : 'deactivated'}.`;
    }
  };

  // Process command
  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return '';
    
    const parts = trimmedCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (commands[command]) {
      return commands[command](args);
    }
    
    return `Command not found: ${command}. Type 'help' for available commands.`;
  };

  // Handle command execution
  const executeCommand = () => {
    if (!input.trim()) return;
    
    const output = processCommand(input);
    
    setHistory([...history, { command: input, output }]);
    setInput('');
    setHistoryIndex(-1);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Handle terminal click (focus on input)
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal" ref={terminalRef} onClick={handleTerminalClick}>
      {initialMessage && (
        <div className="terminal-initial-message">
          {initialMessage.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
      
      {history.map((item, index) => (
        <div key={index} className="terminal-history-item">
          <div className="terminal-command">
            <span className="terminal-prompt">{prompt}</span> {item.command}
          </div>
          {item.output && (
            <div className="terminal-output">
              {item.output.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <div className="terminal-input-line">
        <span className="terminal-prompt">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
