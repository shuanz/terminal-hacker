
import React, { useState, useEffect } from 'react';
import Terminal from './Terminal';
import '../styles/Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState({
    level: 1,
    experience: 0,
    money: 1000,
    detection: 0,
    stealthMode: false
  });

  // Matrix background effect
  useEffect(() => {
    const canvas = document.getElementById('matrix-bg') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setting canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for matrix effect
    const characters = '01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    
    // Array to hold character positions
    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(0);

    // Draw the characters
    const draw = () => {
      // Black background with opacity
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';

      // Looping through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // x = i * character width, y = drops[i] * character height
        ctx.fillText(text, i * 20, drops[i] * 20);

        // Sending the drop back to the top randomly after it has crossed the screen
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Incrementing Y coordinate
        drops[i]++;
      }
    };

    // Call draw function at regular intervals
    const interval = setInterval(draw, 33);

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="game-container">
      <canvas id="matrix-bg" className="matrix-background"></canvas>
      
      <div className="game-content">
        <header className="game-header">
          <h1>Terminal Hacker</h1>
          <div className="game-stats">
            <div className="stat">Level: {gameState.level}</div>
            <div className="stat">XP: {gameState.experience}/1000</div>
            <div className="stat">Money: ${gameState.money}</div>
            <div className="stat">Detection: {gameState.detection}%</div>
            <div className="stat">Stealth: {gameState.stealthMode ? 'ON' : 'OFF'}</div>
          </div>
        </header>
        
        <main className="game-main">
          <Terminal />
        </main>
      </div>
    </div>
  );
};

export default Game;
