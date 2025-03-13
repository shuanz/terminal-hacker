import React, { useState, useEffect, useRef } from 'react';
import '../styles/Terminal.css';

interface TerminalProps {
  initialCommands?: string[];
}

// Removida definição duplicada do componente Terminal
// A definição completa está mais abaixo no arquivo

export const Terminal: React.FC<TerminalProps> = ({ 
  initialCommands = []
}) => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Process any initial commands
    initialCommands.forEach(cmd => {
      processCommand(cmd);
    });
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = input.trim();
      if (command) {
        processCommand(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(1);
    }
  };

  const navigateHistory = (direction: number) => {
    if (commandHistory.length === 0) return;

    const newIndex = historyIndex + direction;
    if (newIndex >= -1 && newIndex < commandHistory.length) {
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setInput('');
      } else {
        setInput(commandHistory[newIndex]);
      }
    }
  };

  const processCommand = (command: string) => {
    setHistory(prev => [...prev, `> ${command}`]);

    // Add to command history
    setCommandHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);

    // Process command logic
    let response = '';

    // Simple command processing example
    if (command.toLowerCase() === 'help') {
      response = `Available commands:
- help     : Show this help message
- clear    : Clear the terminal screen
- scan     : Scan a target (usage: scan <target>)
- connect  : Connect to a target (usage: connect <target>)
- bruteforce: Attempt to crack a target's password (usage: bruteforce <target>)
- info     : Display system information
- targets  : List available targets
- buy      : Purchase a program (usage: buy <program>)
- upgrade  : Upgrade a program (usage: upgrade <program>)
- ls       : List local files
- cat      : Display file contents (usage: cat <filename>)`;
    } else if (command.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (command.toLowerCase().startsWith('scan')) {
      response = 'Scanning network...\nFound 3 potential targets:\n- 192.168.1.100 (Windows Server)\n- 192.168.1.101 (Linux)\n- 192.168.1.102 (Unknown OS)';
    } else if (command.toLowerCase().startsWith('connect')) {
      const target = command.split(' ')[1];
      if (target) {
        response = `Attempting to connect to ${target}...\nConnection established. Use 'help' for available commands.`;
      } else {
        response = 'Usage: connect <target_ip>';
      }
    } else if (command.toLowerCase().startsWith('bruteforce')){
        response = 'Bruteforcing...';
    } else if (command.toLowerCase().startsWith('info')){
        response = 'System Info: \n OS: Ubuntu 22.04 \n Kernel: 5.15.0-76-generic \n Uptime: 3 days';
    } else {
      response = `Command not recognized: ${command}`;
    }

    setHistory(prev => [...prev, response]);
    setInput('');
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal" ref={terminalRef} onClick={handleClick}>
      <div className="terminal-header">
        <div className="terminal-title">Terminal Hacker v1.0</div>
      </div>
      <div className="terminal-content">
        {history.map((line, index) => (
          <div key={index} className="terminal-line">
            {line}
          </div>
        ))}
        <div className="terminal-input-line">
          <span className="terminal-prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;