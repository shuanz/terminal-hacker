import { useState, useEffect, useRef } from 'react';
import '../styles/Terminal.css';

export const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(500);
  const [detection, setDetection] = useState(0);
  const [stealth, setStealth] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const asciiLogo = `
  ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
     ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
     ██╗  ██╗ █████╗  ██████╗██╗  ██╗███████╗██████╗                
     ██║  ██║██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗               
     ███████║███████║██║     █████╔╝ █████╗  ██████╔╝               
     ██╔══██║██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗               
     ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║               
     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝               
  `;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  // Mostrar introdução ao carregar a primeira vez
  useEffect(() => {
    setHistory([
      `${asciiLogo}`,
      "Sistema inicializado. Bem-vindo ao Terminal Hacker v1.0",
      "Digite 'help' para ver a lista de comandos disponíveis."
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const command = input;
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
- cat      : Display file contents (usage: cat <filename>)
- stealth  : Toggle stealth mode (reduces detection chance)`;
      } else if (command.toLowerCase() === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (command.toLowerCase().startsWith('scan')) {
        const target = command.split(' ')[1];
        if (!target) {
          response = 'Error: Target not specified. Usage: scan <target>';
        } else {
          response = `Scanning target: ${target}...\n` + 
            'PORT     STATE    SERVICE\n' +
            '22/tcp   open     ssh\n' +
            '80/tcp   open     http\n' +
            '443/tcp  open     https\n' +
            '3306/tcp filtered mysql';

          // Aumenta ligeiramente a detecção
          setDetection(prev => Math.min(100, prev + 5));
        }
      } else if (command.toLowerCase().startsWith('connect')) {
        const target = command.split(' ')[1];
        if (!target) {
          response = 'Error: Target not specified. Usage: connect <target>';
        } else {
          response = `Connecting to ${target}...\nAccess denied: Authentication required.`;
          // Aumenta um pouco a detecção
          setDetection(prev => Math.min(100, prev + 10));
        }
      } else if (command.toLowerCase().startsWith('bruteforce')) {
        const target = command.split(' ')[1];
        if (!target) {
          response = 'Error: Target not specified. Usage: bruteforce <target>';
        } else {
          response = `Attempting to crack password on ${target}...\n` +
            '[██████████] 100% Complete\n' +
            'Success! Password found: p4$$w0rd';

          // Ganhar dinheiro e experiência
          setMoney(prev => prev + 200);

          // Aumenta muito a detecção
          setDetection(prev => Math.min(100, prev + 25));

          // Possível subir de nível
          if (Math.random() > 0.7) {
            setLevel(prev => prev + 1);
            response += '\n[LEVEL UP] You are now level ' + (level + 1);
          }
        }
      } else if (command.toLowerCase() === 'info') {
        response = `
┌───────────────[ System Information ]───────────────┐
│ Terminal Hacker v1.0                              │
│ User: Anonymous                                   │
│ IP: 127.0.0.1                                     │
│ Network: Proxied (3 jumps)                        │
│ Level: ${level}                                     │
│ Funds: $${money}                                   │
│ Detection: ${detection}%                            │
│ Stealth Mode: ${stealth ? 'ACTIVE' : 'INACTIVE'}                            │
│ Uptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m                               │
└────────────────────────────────────────────────────┘`;
      } else if (command.toLowerCase() === 'targets') {
        response = `
┌───────────────[ Available Targets ]───────────────┐
│ 1. 192.168.1.1    - Local Router                 │
│ 2. 10.0.0.15      - Corporate Server (MEDIUM)    │
│ 3. 204.15.67.124  - Bank System (HARD)           │
│ 4. 103.27.168.44  - Government Database (EXPERT) │
└────────────────────────────────────────────────────┘`;
      } else if (command.toLowerCase() === 'stealth') {
        setStealth(!stealth);
        response = stealth ? 
          'Stealth mode deactivated. Detection chance increased.' : 
          'Stealth mode activated. Detection chance reduced.';
      } else if (command.toLowerCase() === 'ls') {
        response = `
total 16K
drwxr-xr-x 2 hacker hacker 4.0K May 12 14:38 .
drwxr-xr-x 4 hacker hacker 4.0K May 12 14:22 ..
-rw-r--r-- 1 hacker hacker 3.5K May 12 14:38 scan_results.txt
-rw-r--r-- 1 hacker hacker 2.1K May 12 14:30 bruteforce.py
-rwxr-xr-x 1 hacker hacker 1.2K May 12 14:25 proxy_chain.sh`;
      } else if (command.toLowerCase().startsWith('cat')) {
        const file = command.split(' ')[1];
        if (!file) {
          response = 'Error: File not specified. Usage: cat <filename>';
        } else if (file === 'scan_results.txt') {
          response = `# Scan Results - Last update: ${new Date().toLocaleString()}

PORT     STATE    SERVICE     VERSION
22/tcp   open     ssh         OpenSSH 8.4p1
80/tcp   open     http        Apache httpd 2.4.46
443/tcp  open     https       Apache httpd 2.4.46
3306/tcp filtered mysql       MySQL 5.7.33

# Host Details
OS: Linux 5.4.0-54-generic
Uptime: 127 days
Last reboot: ${new Date(Date.now() - 127 * 24 * 60 * 60 * 1000).toLocaleDateString()}`;
        } else {
          response = `File not found: ${file}`;
        }
      } else if (command.trim() === '') {
        response = '';
      } else {
        response = `Command not found: ${command}`;
      }

      setHistory([...history, `> ${command}`, response]);
      setInput('');
    }
  };

  return (
    <div className="terminal-container">
      <div className="matrix-effect"></div>
      <div className="terminal-header">
        <div className="terminal-title">Terminal Hacker v1.0</div>
        <div className="terminal-controls">
          <div className="terminal-control minimize"></div>
          <div className="terminal-control maximize"></div>
          <div className="terminal-control close"></div>
        </div>
      </div>
      <div className="terminal-output" ref={terminalRef}>
        {history.map((line, index) => {
          if (index === 0 && line.includes('████████')) {
            return <div key={index} className="ascii-logo">{line}</div>;
          }

          if (line.startsWith('>')) {
            return <div key={index} className="message command">{line.substring(2)}</div>;
          }

          if (line.includes('Error:') || line.includes('not found') || line.includes('denied')) {
            return <div key={index} className="message error">{line}</div>;
          }

          if (line.includes('Success') || line.includes('LEVEL UP')) {
            return <div key={index} className="message success">{line}</div>;
          }

          if (line.includes('System') && line.includes('init')) {
            return <div key={index} className="message system">{line}</div>;
          }

          return <div key={index} className="message result">{line}</div>;
        })}
      </div>
      <div className="terminal-input-container">
        <div className="terminal-input">
          <span className="prompt">{'user@terminal'}</span>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            autoFocus
          />
        </div>
      </div>
      <div className="status-bar">
        <div className="left">
          <span className="status-item level">LVL: {level}</span>
          <span className="status-item money">${money}</span>
        </div>
        <div className="right">
          <span className="status-item detection">
            <span className="status-item-icon">⚠</span>
            Detection: {detection}%
          </span>
          <span className={`status-item stealth ${stealth ? 'active' : ''}`}>
            <span className="status-item-icon">⚡</span>
            Stealth: {stealth ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};