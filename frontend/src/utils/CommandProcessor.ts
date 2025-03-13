import { GameState, CommandResult, Program, Target } from '../types';
import { programs, targets } from '../data';
import init, { scan_target, bruteforce_target } from '../../node_modules/terminal-hacker-core';
import { AppDispatch } from '../store';
import {
  addMessage,
  setInput,
  clearInput,
  setLevel,
  setExperience,
  setMoney,
  setDetection,
  setStealthMode,
} from '../features/terminalSlice';
import { getWasmModule } from '../wasm/init';

type CommandFunction = (...args: string[]) => Promise<CommandResult>;

interface Commands {
  [key: string]: CommandFunction;
}

const commands: Commands = {
  help: async (): Promise<CommandResult> => {
    return {
      success: true,
      message: `
Available commands:
  help              - Show this help message
  scan <ip>         - Scan a target IP address
  bruteforce <url>  - Attempt to crack passwords
  hack <target>     - Hack a target system
  stealth           - Toggle stealth mode
  status            - Show current status
  clear             - Clear terminal
      `.trim(),
    };
  },

  scan: async (ip: string): Promise<CommandResult> => {
    try {
      const response = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target: ip }),
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      return {
        success: true,
        message: `Scan results for ${ip}:\n${JSON.stringify(data, null, 2)}`,
        experience: 50,
        detection: 10,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `Error scanning ${ip}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        detection: 20,
      };
    }
  },

  bruteforce: async (url: string): Promise<CommandResult> => {
    try {
      const response = await fetch('http://localhost:8000/bruteforce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target: url }),
      });

      if (!response.ok) {
        throw new Error('Bruteforce failed');
      }

      const data = await response.json();
      return {
        success: true,
        message: `Bruteforce results for ${url}:\n${JSON.stringify(data, null, 2)}`,
        experience: 100,
        money: 500,
        detection: 30,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `Error bruteforcing ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        detection: 40,
      };
    }
  },

  hack: async (target: string): Promise<CommandResult> => {
    try {
      // Simulate hacking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        message: `Successfully hacked ${target}!`,
        experience: 200,
        money: 1000,
        detection: 50,
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: `Error hacking ${target}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        detection: 60,
      };
    }
  },

  stealth: async (): Promise<CommandResult> => {
    return {
      success: true,
      message: 'Stealth mode toggled',
    };
  },

  status: async (): Promise<CommandResult> => {
    return {
      success: true,
      message: `
Current Status:
  Level: 1
  Experience: 0/1000
  Money: $1000
  Detection: 0%
  Stealth Mode: Off
      `.trim(),
    };
  },

  clear: async (): Promise<CommandResult> => {
    return {
      success: true,
      message: '',
    };
  },
};

let wasmModule: any = null;

export const initWasm = async () => {
  if (!wasmModule) {
    wasmModule = await getWasmModule();
  }
  return wasmModule;
};

export const processCommand = async (command: string, dispatch: AppDispatch) => {
  const tokens = command.toLowerCase().trim().split(/\s+/);
  const cmd = tokens[0];
  const args = tokens.slice(1);

  if (!wasmModule) {
    try {
      await initWasm();
    } catch (error) {
      dispatch(addMessage({
        type: 'error',
        content: 'Failed to initialize WebAssembly module',
      }));
      return;
    }
  }

  switch (cmd) {
    case 'help':
      dispatch(addMessage({
        type: 'info',
        content: `Available commands:
  help - Show this help message
  targets/list - List available targets
  scan <target> - Scan a target for vulnerabilities
  bruteforce <target> - Attempt to bruteforce a target
  stealth <on|off> - Toggle stealth mode
  clear - Clear terminal output
  status - Show current status`,
      }));
      break;

    case 'targets':
    case 'list':
      const targetsList = targets.map(target => `
Name: ${target.name}
IP: ${target.ip}
Difficulty: ${'★'.repeat(target.difficulty)}
Description: ${target.description}
Reward: ${target.reward.xp} XP, $${target.reward.money}
----------------------------------------`).join('\n');

      dispatch(addMessage({
        type: 'info',
        content: `=== Available Targets ===\n${targetsList}`,
      }));
      break;

    case 'scan':
      if (args.length !== 1) {
        dispatch(addMessage({
          type: 'error',
          content: 'Usage: scan <target>',
        }));
        return;
      }

      try {
        const targetIp = args[0].toString();
        const module = await getWasmModule();

        console.log('Scanning target:', targetIp);
        console.log('Module:', module);

        const result = await scan_target(targetIp, module);
        dispatch(addMessage({
          type: 'success',
          content: `Scan results for ${targetIp}:\n${JSON.stringify(result, null, 2)}`,
        }));

        if (result && typeof result === 'object') {
          if ('detection_level' in result) {
            dispatch(setDetection(result.detection_level));
          }
          if ('experience_gained' in result) {
            dispatch(setExperience(result.experience_gained));
          }
        }
      } catch (error) {
        console.error('Scan error:', error);
        dispatch(addMessage({
          type: 'error',
          content: `Failed to scan target: ${error instanceof Error ? error.message : String(error)}`,
        }));
      }
      break;

    case 'bruteforce':
      if (args.length !== 1) {
        dispatch(addMessage({
          type: 'error',
          content: 'Usage: bruteforce <target>',
        }));
        return;
      }

      try {
        const result = await bruteforce_target(args[0], wasmModule);
        dispatch(addMessage({
          type: 'success',
          content: `Bruteforce results for ${args[0]}:\n${JSON.stringify(result, null, 2)}`,
        }));
        dispatch(setDetection(result.detection_level));
        dispatch(setMoney(result.money_gained));
        dispatch(setExperience(result.experience_gained));
      } catch (error) {
        dispatch(addMessage({
          type: 'error',
          content: `Failed to bruteforce target: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }));
      }
      break;

    case 'stealth':
      if (args.length !== 1 || !['on', 'off'].includes(args[0])) {
        dispatch(addMessage({
          type: 'error',
          content: 'Usage: stealth <on|off>',
        }));
        return;
      }

      const isStealthMode = args[0] === 'on';
      dispatch(setStealthMode(isStealthMode));
      dispatch(addMessage({
        type: 'info',
        content: `Stealth mode ${isStealthMode ? 'enabled' : 'disabled'}`,
      }));
      break;

    case 'clear':
      dispatch(addMessage({
        type: 'info',
        content: 'Terminal cleared',
      }));
      break;

    case 'status':
      dispatch(addMessage({
        type: 'info',
        content: 'Current status: [Status information will be displayed here]',
      }));
      break;

    default:
      dispatch(addMessage({
        type: 'error',
        content: `Unknown command: ${cmd}. Type 'help' for available commands.`,
      }));
  }
};

export class CommandProcessor {
  private async executeProgram(
    programName: string,
    args: string[],
    gameState: GameState
  ): Promise<CommandResult> {
    const program = programs.find(p => p.name === programName);
    if (!program) {
      throw new Error(`Program ${programName} not found`);
    }

    if (!gameState.currentTarget) {
      throw new Error('No target selected. Use attack [IP] first.');
    }

    // Create execution context
    const context = {
      program,
      target: gameState.currentTarget,
      gameState,
      args
    };

    // Get WebAssembly module
    const wasmModule = await getWasmModule();

    // Execute program-specific logic using WebAssembly functions
    switch (program.type) {
      case 'scan':
        const scanResult = await scan_target(context.target, wasmModule);
        return {
          success: true,
          message: `Scan results:\n${JSON.stringify(scanResult, null, 2)}`,
          experience: scanResult.experience_gained,
          detection: scanResult.detection_level
        };
      case 'bruteforce':
        const bruteforceResult = await bruteforce_target(context.target, wasmModule);
        return {
          success: bruteforceResult.success,
          message: `Bruteforce results:\n${JSON.stringify(bruteforceResult, null, 2)}`,
          experience: bruteforceResult.experience_gained,
          money: bruteforceResult.money_gained,
          detection: bruteforceResult.detection_level
        };
      default:
        throw new Error(`Unsupported program type: ${program.type}`);
    }
  }

  private showHelp(command?: string): CommandResult {
    if (!command) {
      return {
        success: true,
        output: `
===== AVAILABLE COMMANDS =====

help [command]    Show help for a specific command
targets/list      List available targets
attack [IP]       Start attack on specified IP
scan              Analyze target's defense systems
bruteforce        Attack authentication system
bypass            Try to bypass firewall
decrypt           Try to decrypt database
shop/store        Show available programs
buy [program]     Purchase a program
inventory/inv     Show owned programs and tools
run [program]     Execute a program
stealth           Toggle stealth mode
clear             Clear terminal
exit              Exit current operation

Use help [command] for detailed information about a command.
`
      };
    }

    // Add specific command help here
    return { 
      success: true,
      output: `Help for command: ${command}` 
    };
  }

  private showTargets(): CommandResult {
    return {
      success: true,
      output: targets.map(target => `
Name: ${target.name}
IP: ${target.ip}
Difficulty: ${'★'.repeat(target.difficulty)}
Description: ${target.description}
Reward: ${target.reward.xp} XP, $${target.reward.money}
----------------------------------------
`).join('\n')
    };
  }

  private attackTarget(ip: string, gameState: GameState): CommandResult {
    if (!ip) {
      throw new Error('You must specify an IP to attack.');
    }

    const target = targets.find(t => t.ip === ip);
    if (!target) {
      throw new Error('Target IP not found.');
    }

    return {
      success: true,
      output: `
Connecting to ${target.ip} (${target.name})...

Connection established successfully.
WARNING: Detection system active. Proceed with caution.

Use scan command to analyze defense systems.
`,
      stateUpdate: {
        currentTarget: target.ip,
        detection: 0,
        availablePrograms: [...gameState.availablePrograms]
      }
    };
  }

  private showStore(gameState: GameState): CommandResult {
    return {
      success: true,
      output: `
===== PROGRAM STORE =====

${programs.map(program => `
${program.name} - $${program.price} ${program.level <= gameState.playerLevel ? '[AVAILABLE]' : '[LOCKED]'}
${program.description}
Required level: ${program.level}
Type: ${program.type}
`).join('\n')}

Use buy [program name] to purchase a program.
`
    };
  }

  private buyProgram(programName: string, gameState: GameState): CommandResult {
    if (!programName) {
      throw new Error('You must specify a program to buy.');
    }

    const program = programs.find(p => p.name === programName);
    if (!program) {
      throw new Error('Program not found in store.');
    }

    if (gameState.inventory.includes(program.name)) {
      throw new Error('You already own this program.');
    }

    if (program.level > gameState.playerLevel) {
      throw new Error(`Your level is too low. Required level: ${program.level}`);
    }

    if (program.price > gameState.playerMoney) {
      throw new Error(`Not enough money. Price: $${program.price}`);
    }

    return {
      success: true,
      output: `Program ${programName} purchased successfully!
Price: $${program.price}
Type: ${program.type}
Success Rate: ${program.successRate}%

Use 'help ${programName}' for usage instructions.`,
      stateUpdate: {
        inventory: [...gameState.inventory, program.name],
        playerMoney: gameState.playerMoney - program.price
      }
    };
  }
}