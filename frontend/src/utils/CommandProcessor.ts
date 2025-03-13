
import { GameState, CommandResult, Program, Target } from '../types';
import { programs, targets } from '../data';
import { AppDispatch } from '../store';
import {
  addMessage,
  setCurrentTarget,
  setPrograms,
  setTargets,
  setMoney,
  setLevel,
  setExperience,
  setHealth,
  setDetection,
  setStealthMode,
} from '../features/terminalSlice';

// Simulações temporárias das funções que viriam do WebAssembly
const mockScanResult = {
  open_ports: [22, 80, 443],
  os_info: "Linux 5.4.0",
  vulnerabilities: [
    { name: "CVE-2021-1234", severity: "high", description: "Remote code execution" }
  ],
  services: { "22": "SSH", "80": "HTTP", "443": "HTTPS" },
  detection_level: 2,
  experience_gained: 25,
  scan_time: 1.5
};

const mockBruteforceResult = {
  success: true,
  password: "********",
  time_taken: 2.3,
  experience_gained: 50,
  money_gained: 100,
  detection_level: 4
};

type CommandFunction = (...args: string[]) => Promise<CommandResult>;

const createCommandMap = (
  state: GameState,
  dispatch: AppDispatch
): Record<string, CommandFunction> => {
  return {
    help: async () => {
      return {
        success: true,
        message: `Available commands:
- help: Show this help message
- scan <target>: Scan a target for vulnerabilities
- connect <target>: Connect to a target
- bruteforce <target>: Attempt to crack a target's password
- ls: List available files
- cat <file>: View file contents
- stealth <on|off>: Toggle stealth mode
- status: Show current status
- targets: List known targets
- programs: List available programs
- upgrade <program>: Upgrade a program
- buy <program>: Purchase a new program
- clear: Clear the terminal`,
      };
    },

    clear: async () => {
      return {
        success: true,
        clearTerminal: true,
        message: '',
      };
    },

    scan: async (targetId) => {
      if (!targetId) {
        return {
          success: false,
          message: 'Usage: scan <target>',
        };
      }

      const target = state.targets.find(
        (t) => t.id === targetId || t.ip === targetId
      );

      if (!target) {
        return {
          success: false,
          message: `Target ${targetId} not found.`,
        };
      }

      dispatch(addMessage(`Scanning ${target.ip} (${target.name})...`));
      
      // Simulação de espera para o scan
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const result = mockScanResult;
      
      let resultMessage = `Scan results for ${target.ip} (${target.name}):\n`;
      resultMessage += `OS: ${result.os_info}\n`;
      resultMessage += `Open ports: ${result.open_ports.join(', ')}\n`;
      
      if (result.vulnerabilities.length > 0) {
        resultMessage += `\nVulnerabilities found:\n`;
        result.vulnerabilities.forEach((vuln) => {
          resultMessage += `- ${vuln.name} (${vuln.severity}): ${vuln.description}\n`;
        });
      }
      
      resultMessage += `\nServices:\n`;
      for (const [port, service] of Object.entries(result.services)) {
        resultMessage += `- Port ${port}: ${service}\n`;
      }
      
      resultMessage += `\nScan completed in ${result.scan_time.toFixed(1)}s`;
      resultMessage += `\nExperience gained: ${result.experience_gained}`;
      
      if (result.detection_level > 0) {
        resultMessage += `\nDetection level increased by ${result.detection_level}`;
        dispatch(setDetection(state.detection + result.detection_level));
      }
      
      dispatch(setExperience(state.experience + result.experience_gained));

      return {
        success: true,
        message: resultMessage,
      };
    },

    bruteforce: async (targetId) => {
      if (!targetId) {
        return {
          success: false,
          message: 'Usage: bruteforce <target>',
        };
      }

      const target = state.targets.find(
        (t) => t.id === targetId || t.ip === targetId
      );

      if (!target) {
        return {
          success: false,
          message: `Target ${targetId} not found.`,
        };
      }

      dispatch(
        addMessage(`Attempting to bruteforce ${target.ip} (${target.name})...`)
      );
      
      // Simulação de espera para o bruteforce
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const result = mockBruteforceResult;
      
      let resultMessage = '';
      
      if (result.success) {
        resultMessage += `Successfully cracked password for ${target.ip}!\n`;
        resultMessage += `Password: ${result.password}\n`;
        resultMessage += `Time taken: ${result.time_taken.toFixed(1)}s\n`;
        resultMessage += `Money gained: $${result.money_gained}\n`;
        resultMessage += `Experience gained: ${result.experience_gained}`;
        
        dispatch(setMoney(state.money + result.money_gained));
        dispatch(setExperience(state.experience + result.experience_gained));
      } else {
        resultMessage += `Failed to crack password for ${target.ip}.\n`;
        resultMessage += `Bruteforce protection detected.\n`;
      }
      
      if (result.detection_level > 0) {
        resultMessage += `\nDetection level increased by ${result.detection_level}`;
        dispatch(setDetection(state.detection + result.detection_level));
      }

      return {
        success: result.success,
        message: resultMessage,
      };
    },

    connect: async (targetId) => {
      if (!targetId) {
        return {
          success: false,
          message: 'Usage: connect <target>',
        };
      }

      const target = state.targets.find(
        (t) => t.id === targetId || t.ip === targetId
      );

      if (!target) {
        return {
          success: false,
          message: `Target ${targetId} not found.`,
        };
      }

      dispatch(addMessage(`Connecting to ${target.ip} (${target.name})...`));
      dispatch(setCurrentTarget(target));

      return {
        success: true,
        message: `Connected to ${target.ip} (${target.name}).\nType 'help' for available commands.`,
      };
    },

    stealth: async (mode) => {
      if (!mode || (mode !== 'on' && mode !== 'off')) {
        return {
          success: false,
          message: 'Usage: stealth <on|off>',
        };
      }

      const stealthMode = mode === 'on';
      dispatch(setStealthMode(stealthMode));

      return {
        success: true,
        message: `Stealth mode ${stealthMode ? 'enabled' : 'disabled'}.`,
      };
    },

    status: async () => {
      const levelProgress = Math.floor(
        (state.experience / (state.level * 1000)) * 100
      );
      
      return {
        success: true,
        message: `System Status:
Level: ${state.level}
Experience: ${state.experience}/${state.level * 1000} (${levelProgress}%)
Money: $${state.money}
Health: ${state.health}%
Detection Level: ${state.detection}%
Stealth Mode: ${state.stealthMode ? 'Enabled' : 'Disabled'}
${state.currentTarget ? `Connected to: ${state.currentTarget.ip} (${state.currentTarget.name})` : 'Not connected to any target'}`,
      };
    },

    targets: async () => {
      if (state.targets.length === 0) {
        return {
          success: false,
          message: 'No targets available.',
        };
      }

      let message = 'Available targets:\n';
      state.targets.forEach((target) => {
        message += `- ${target.ip} (${target.name}): ${target.description}\n`;
      });

      return {
        success: true,
        message,
      };
    },

    programs: async () => {
      if (state.programs.length === 0) {
        return {
          success: false,
          message: 'No programs available.',
        };
      }

      let message = 'Available programs:\n';
      state.programs.forEach((program) => {
        message += `- ${program.name} (v${program.version}): ${program.description}\n`;
        message += `  Cost: $${program.cost} | Upgrade: $${program.upgradeCost}\n`;
      });

      return {
        success: true,
        message,
      };
    },

    upgrade: async (programId) => {
      if (!programId) {
        return {
          success: false,
          message: 'Usage: upgrade <program>',
        };
      }

      const program = state.programs.find(
        (p) => p.id === programId || p.name.toLowerCase() === programId.toLowerCase()
      );

      if (!program) {
        return {
          success: false,
          message: `Program ${programId} not found.`,
        };
      }

      if (state.money < program.upgradeCost) {
        return {
          success: false,
          message: `Not enough money to upgrade ${program.name}. Need $${program.upgradeCost}.`,
        };
      }

      const updatedProgram = {
        ...program,
        version: program.version + 0.1,
        upgradeCost: Math.floor(program.upgradeCost * 1.5),
      };

      const updatedPrograms = state.programs.map((p) =>
        p.id === program.id ? updatedProgram : p
      );

      dispatch(setPrograms(updatedPrograms));
      dispatch(setMoney(state.money - program.upgradeCost));

      return {
        success: true,
        message: `Upgraded ${program.name} to version ${updatedProgram.version.toFixed(1)}.`,
      };
    },

    buy: async (programId) => {
      if (!programId) {
        return {
          success: false,
          message: 'Usage: buy <program>',
        };
      }

      const program = programs.find(
        (p) => p.id === programId || p.name.toLowerCase() === programId.toLowerCase()
      );

      if (!program) {
        return {
          success: false,
          message: `Program ${programId} not found in store.`,
        };
      }

      const alreadyOwned = state.programs.find((p) => p.id === program.id);
      if (alreadyOwned) {
        return {
          success: false,
          message: `You already own ${program.name}.`,
        };
      }

      if (state.money < program.cost) {
        return {
          success: false,
          message: `Not enough money to buy ${program.name}. Need $${program.cost}.`,
        };
      }

      dispatch(setPrograms([...state.programs, program]));
      dispatch(setMoney(state.money - program.cost));

      return {
        success: true,
        message: `Purchased ${program.name} for $${program.cost}.`,
      };
    },

    ls: async () => {
      return {
        success: true,
        message: `Available files:
- readme.txt
- notes.txt
- hacking_tools.sh
- targets.db`,
      };
    },

    cat: async (fileName) => {
      if (!fileName) {
        return {
          success: false,
          message: 'Usage: cat <file>',
        };
      }

      let content;
      switch (fileName.toLowerCase()) {
        case 'readme.txt':
          content = `TERMINAL HACKER v1.0

Welcome to Terminal Hacker, a simulation of hacking activities in a terminal environment.

Available commands:
- help: Show all available commands
- scan <target>: Scan a target for vulnerabilities
- connect <target>: Connect to a target
- bruteforce <target>: Attempt to crack a target's password

Start by typing 'targets' to see available targets.`;
          break;
        case 'notes.txt':
          content = `PERSONAL NOTES

Remember to always enable stealth mode before attempting any high-risk operations.
The detection system can trigger countermeasures if it reaches 100%.

Todo:
- Upgrade scanning tools
- Research new targets
- Buy advanced password cracker`;
          break;
        case 'hacking_tools.sh':
          content = `#!/bin/bash
# This is a collection of hacking tools

echo "Initializing hacking environment..."
echo "This would be actual code in a real scenario."
echo "Use the terminal commands instead of trying to run this file."`;
          break;
        case 'targets.db':
          content = `DATABASE ENCRYPTED

Access denied. This file requires higher privileges.
Upgrade your security bypass program to access this content.`;
          break;
        default:
          return {
            success: false,
            message: `File ${fileName} not found.`,
          };
      }

      return {
        success: true,
        message: content,
      };
    },
  };
};

export const processCommand = async (
  input: string,
  state: GameState,
  dispatch: AppDispatch
): Promise<CommandResult> => {
  if (!input.trim()) {
    return {
      success: false,
      message: '',
    };
  }

  const parts = input.trim().split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const commandMap = createCommandMap(state, dispatch);

  if (commandMap[command]) {
    return await commandMap[command](...args);
  }

  return {
    success: false,
    message: `Command not recognized: ${command}. Type 'help' for available commands.`,
  };
};

// Função mock simulando a inicialização do WASM
export const initWasm = async (): Promise<void> => {
  console.log("WebAssembly module mock initialized");
  return Promise.resolve();
};
