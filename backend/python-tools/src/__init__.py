"""
Terminal Hacker Tools Backend

This package provides network scanning and password cracking tools
for the Terminal Hacker RPG game.
"""

from .network_scanner import NetworkScanner
from .bruteforce import PasswordCracker

__version__ = "0.1.0"
__author__ = "Terminal Hacker Team"

__all__ = ['NetworkScanner', 'PasswordCracker'] 