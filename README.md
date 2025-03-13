# Terminal Hacker RPG

A terminal-based hacking RPG game built with React, TypeScript, Rust, and Python.

## Features

- Terminal-style interface with Matrix-inspired background
- Network scanning and password cracking tools
- Stealth mode for avoiding detection
- Experience and leveling system
- Money-based economy
- Real-time detection system

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Python (FastAPI) + Rust (WebAssembly)
- State Management: Redux Toolkit
- Styling: CSS Modules

## Prerequisites

- Node.js 16+
- Python 3.8+
- Rust 1.70+
- wasm-pack

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/terminal-hacker.git
cd terminal-hacker
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install Python dependencies:
```bash
cd ../backend/python-tools
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. Build Rust to WebAssembly:
```bash
cd ../rust-core
wasm-pack build --target web
```

## Development

1. Start the frontend development server:
```bash
cd frontend
npm run dev
```

2. Start the Python backend server:
```bash
cd backend/python-tools
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m src.server
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Available Commands

- `help` - Show available commands
- `scan <ip>` - Scan a target IP address
- `bruteforce <url>` - Attempt to crack passwords
- `hack <target>` - Hack a target system
- `stealth` - Toggle stealth mode
- `status` - Show current status
- `clear` - Clear terminal

## Game Mechanics

### Leveling System
- Gain experience by completing missions
- Level up to unlock new abilities
- Experience required increases with each level

### Detection System
- Actions increase detection level
- Stealth mode reduces detection rate
- High detection leads to mission failure

### Economy
- Earn money by completing missions
- Spend money on upgrades and tools
- Different missions offer different rewards

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 