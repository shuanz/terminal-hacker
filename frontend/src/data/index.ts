import { Program, Target } from '../types';

export const programs: Program[] = [
  {
    name: 'nmap',
    description: 'Basic port scanner',
    price: 0,
    level: 1,
    type: 'scan',
    commands: ['scan'],
    successRate: 80,
  },
  {
    name: 'hydra',
    description: 'Password cracker',
    price: 1000,
    level: 2,
    type: 'bruteforce',
    commands: ['bruteforce'],
    successRate: 60,
  },
  {
    name: 'metasploit',
    description: 'Exploit framework',
    price: 5000,
    level: 5,
    type: 'hack',
    commands: ['exploit', 'payload'],
    successRate: 40,
  },
  {
    name: 'wireshark',
    description: 'Network analyzer',
    price: 2000,
    level: 3,
    type: 'utility',
    commands: ['analyze', 'capture'],
    successRate: 90,
  },
];

export const targets: Target[] = [
  {
    name: 'Local Test Server',
    ip: '192.168.1.100',
    difficulty: 1,
    vulnerabilities: ['weak_password', 'open_ports'],
    ports: [22, 80, 443],
    services: ['ssh', 'http', 'https'],
    os: 'Ubuntu 20.04 LTS',
    reward: 500,
  },
  {
    name: 'Corporate Database',
    ip: '10.0.0.50',
    difficulty: 3,
    vulnerabilities: ['sql_injection', 'outdated_software'],
    ports: [1433, 3306],
    services: ['mssql', 'mysql'],
    os: 'Windows Server 2019',
    reward: 2000,
  },
  {
    name: 'Cloud Storage',
    ip: '172.16.0.25',
    difficulty: 2,
    vulnerabilities: ['misconfiguration', 'default_credentials'],
    ports: [21, 2049],
    services: ['ftp', 'nfs'],
    os: 'CentOS 8',
    reward: 1000,
  },
]; 