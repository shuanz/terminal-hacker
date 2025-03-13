declare module 'terminal-hacker-core' {
  export default function init(): Promise<any>;

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

  export function scan_target(target: string, module: any): Promise<ScanResult>;
  export function bruteforce_target(target: string, module: any): Promise<BruteforceResult>;
} 