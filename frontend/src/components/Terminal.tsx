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