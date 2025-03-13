import asyncio
import random
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class ScanResult:
    open_ports: List[int]
    os_info: str
    vulnerabilities: List[Dict[str, str]]
    services: Dict[int, str]
    detection_level: int
    scan_time: float

class NetworkScanner:
    def __init__(self):
        self.common_ports = [
            20, 21, 22, 23, 25, 53, 80, 110, 
            143, 443, 465, 587, 993, 995, 3306, 
            3389, 5432, 8080, 8443, 27017
        ]
        
        self.os_signatures = [
            "Linux 5.15.0-generic",
            "Windows Server 2019",
            "FreeBSD 13.0-RELEASE",
            "Ubuntu 22.04 LTS",
            "CentOS 8.5",
        ]
        
        self.vulnerabilities = [
            {
                "name": "SQL Injection",
                "severity": "High",
                "description": "Web application vulnerable to SQL injection attacks",
            },
            {
                "name": "Weak Password Policy",
                "severity": "Medium",
                "description": "System allows weak passwords that can be easily cracked",
            },
            {
                "name": "Outdated OpenSSL",
                "severity": "Critical",
                "description": "System using vulnerable version of OpenSSL",
            },
            {
                "name": "Default Credentials",
                "severity": "High",
                "description": "Service using default manufacturer credentials",
            },
            {
                "name": "Open SMB Shares",
                "severity": "Medium",
                "description": "Unsecured SMB file shares accessible",
            },
        ]
        
        self.services = {
            21: "FTP",
            22: "SSH",
            23: "Telnet",
            25: "SMTP",
            53: "DNS",
            80: "HTTP",
            110: "POP3",
            143: "IMAP",
            443: "HTTPS",
            445: "SMB",
            3306: "MySQL",
            3389: "RDP",
            5432: "PostgreSQL",
            8080: "HTTP-Proxy",
            27017: "MongoDB",
        }

    async def scan(self, target: str, stealth_mode: bool = False) -> ScanResult:
        """
        Perform a network scan on the target.
        
        Args:
            target: The target IP or hostname
            stealth_mode: Whether to use stealth scanning techniques
        
        Returns:
            ScanResult object containing scan findings
        """
        # Simulate scan delay based on stealth mode
        scan_delay = random.uniform(2.0, 5.0) if stealth_mode else random.uniform(0.5, 2.0)
        await asyncio.sleep(scan_delay)
        
        # Generate random open ports
        num_open_ports = random.randint(3, 8)
        open_ports = random.sample(self.common_ports, num_open_ports)
        open_ports.sort()
        
        # Select random OS
        os_info = random.choice(self.os_signatures)
        
        # Select random vulnerabilities
        num_vulns = random.randint(1, 3)
        vulnerabilities = random.sample(self.vulnerabilities, num_vulns)
        
        # Map services to open ports
        services = {
            port: self.services.get(port, "Unknown Service")
            for port in open_ports
        }
        
        # Calculate detection level based on scan aggressiveness
        base_detection = 20 if stealth_mode else 40
        detection_level = min(
            100,
            base_detection + (num_open_ports * 5) + (num_vulns * 10)
        )
        
        return ScanResult(
            open_ports=open_ports,
            os_info=os_info,
            vulnerabilities=vulnerabilities,
            services=services,
            detection_level=detection_level,
            scan_time=scan_delay
        )

    def _is_valid_target(self, target: str) -> bool:
        """Validate target IP/hostname format"""
        # TODO: Implement proper validation
        return bool(target and len(target) > 0)

    def _calculate_detection_chance(self, num_ports: int, stealth_mode: bool) -> int:
        """Calculate probability of being detected during scan"""
        base_chance = 20 if stealth_mode else 40
        port_factor = num_ports * 2
        return min(100, base_chance + port_factor)

async def main():
    # Example usage
    scanner = NetworkScanner()
    def __init__(self, target_ip: str, stealth_mode: bool = False):
        self.target_ip = target_ip
        self.stealth_mode = stealth_mode
        self.common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 5432, 8080]
        self.timeout = 2.0 if stealth_mode else 1.0
        
    async def scan_port(self, port: int) -> Optional[str]:
        try:
            # Create connection with timeout
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(self.target_ip, port),
                timeout=self.timeout
            )
            
            # Send probe data
            if not self.stealth_mode:
                writer.write(b'\\x00' * 8)
                await writer.drain()
                
                # Try to read banner
                try:
                    banner = await asyncio.wait_for(reader.read(1024), timeout=1.0)
                    banner = banner.decode().strip()
                except:
                    banner = ''
            else:
                banner = ''
                
            writer.close()
            await writer.wait_closed()
            
            return banner or 'open'
            
        except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
            return None
            
    async def scan_ports(self) -> Dict[int, str]:
        open_ports = {}
        
        # Randomize port order in stealth mode
        ports = self.common_ports.copy()
        if self.stealth_mode:
            random.shuffle(ports)
            await asyncio.sleep(random.uniform(0.1, 0.3))
        
        # Scan ports concurrently
        tasks = [self.scan_port(port) for port in ports]
        results = await asyncio.gather(*tasks)
        
        for port, result in zip(ports, results):
            if result:
                open_ports[port] = result
                
            if self.stealth_mode:
                await asyncio.sleep(random.uniform(0.2, 0.5))
                
        return open_ports
        
    def fingerprint_os(self, ttl: int) -> str:
        """Guess OS based on TTL value"""
        if ttl <= 64:
            return 'Linux/Unix'
        elif ttl <= 128:
            return 'Windows'
        else:
            return 'Unknown'
            
    async def check_vulnerabilities(self, services: Dict[int, str]) -> List[str]:
        vulnerabilities = []
        
        # Check for common vulnerabilities based on services and versions
        for port, banner in services.items():
            banner = banner.lower()
            
            if 'apache' in banner and 'apache/2.4.49' in banner:
                vulnerabilities.append(f'Apache 2.4.49 Path Traversal (CVE-2021-41773)')
                
            if 'openssh' in banner and any(v in banner for v in ['5.', '6.', '7.0']):
                vulnerabilities.append(f'OpenSSH Legacy Version ({banner})')
                
            if port == 3306 and 'mysql' in banner:
                if any(v in banner for v in ['5.5', '5.6', '5.7']):
                    vulnerabilities.append(f'MySQL Legacy Version ({banner})')
                    
        return vulnerabilities
        
    async def scan(self) -> ScanResult:
        # Get open ports and services
        services = await self.scan_ports()
        
        # Get TTL from ping
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
            sock.settimeout(self.timeout)
            
            # Send ping
            sock.sendto(struct.pack('!BBHHH', 8, 0, 0, 0, 0), (self.target_ip, 0))
            
            # Receive reply
            data, _ = sock.recvfrom(1024)
            ttl = data[8]  # TTL is the 9th byte in ICMP reply
            
        except:
            ttl = 64  # Default to Linux-like TTL
            
        finally:
            sock.close()
            
        # Fingerprint OS
        os_guess = self.fingerprint_os(ttl)
        
        # Check for vulnerabilities
        vulnerabilities = await self.check_vulnerabilities(services)
        
        return ScanResult(
            ip=self.target_ip,
            open_ports=list(services.keys()),
            os_fingerprint=os_guess,
            vulnerabilities=vulnerabilities,
            services=services
        )

async def main():
    # Example usage
    scanner = NetworkScanner('192.168.1.1', stealth_mode=True)
    result = await scanner.scan()
    print(f'Scan results for {result.ip}:')
    print(f'OS: {result.os_fingerprint}')
    print('Open ports:')
    for port, service in result.services.items():
        print(f'  {port}/tcp: {service}')
    print('Vulnerabilities:')
    for vuln in result.vulnerabilities:
        print(f'  - {vuln}')

if __name__ == '__main__':
    asyncio.run(main()) 