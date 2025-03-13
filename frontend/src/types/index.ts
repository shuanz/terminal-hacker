export interface Program {
  name: string;
  description: string;
  price: number;
  level: number;
  type: 'scan' | 'bruteforce' | 'firewall' | 'crypto';
  commands: Record<string, string>;
  successRate: number;
}

export interface System {
  strength: number;
  compromised: boolean;
}

export interface Target {
  name: string;
  ip: string;
  difficulty: number;
  description: string;
  reward: {
    xp: number;
    money: number;
  };
  systems: {
    firewall: System;
    authentication: System;
    database: System;
  };
  os: string;
  vulnerabilities: string[];
}

export interface GameState {
  level: number;
  experience: number;
  money: number;
  detection: number;
  currentTarget: string | null;
  availablePrograms: string[];
  inventory: string[];
  isStealthMode: boolean;
  playerLevel: number;
  playerMoney: number;
}

export interface CommandResult {
  success: boolean;
  message?: string;
  experience?: number;
  money?: number;
  detection?: number;
  output?: string;
  stateUpdate?: Partial<GameState>;
}

export interface ProgramExecutionContext {
  program: Program;
  target: Target;
  gameState: GameState;
  args: string[];
} 