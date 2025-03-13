import init from 'terminal-hacker-core';
import { scan_target, bruteforce_target } from 'terminal-hacker-core';

let wasmModule: any = null;

export const initWasm = async () => {
  if (!wasmModule) {
    wasmModule = await init();
  }
  return wasmModule;
};

export interface ScanResult {
  target: string;
  ports: number[];
  services: string[];
  vulnerabilities: string[];
  os: string;
  detection_level: number;
  experience_gained: number;
}

export interface BruteforceResult {
  target: string;
  success: boolean;
  password?: string;
  detection_level: number;
  money_gained: number;
  experience_gained: number;
}

export const scanTarget = async (target: string): Promise<ScanResult> => {
  if (!wasmModule) {
    await initWasm();
  }
  return scan_target(target, wasmModule);
};

export const bruteforceTarget = async (target: string): Promise<BruteforceResult> => {
  if (!wasmModule) {
    await initWasm();
  }
  return bruteforce_target(target, wasmModule);
}; 