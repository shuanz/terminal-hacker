# Terminal Hacker Frontend

A React-based frontend for the Terminal Hacker game, featuring a retro terminal interface with modern web technologies.

## Features

- Interactive terminal interface
- Real-time command processing
- Matrix-style background animation
- Status bar with player information
- Integration with Rust-based WebAssembly core

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- Vite
- WebAssembly (Rust)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Rust toolchain (for WebAssembly compilation)
- wasm-pack

### Installation

1. Install dependencies:
```bash
npm install
```

2. Build the WebAssembly module:
```bash
cd ../backend/rust-core
wasm-pack build --target web
cd ../../frontend
```

3. Start the development server:
```bash
npm run dev
```

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
  ├── components/     # React components
  ├── features/       # Redux slices
  ├── styles/        # CSS styles
  ├── utils/         # Utility functions
  ├── wasm/          # WebAssembly bindings
  ├── types/         # TypeScript type definitions
  ├── data/          # Game data
  ├── App.tsx        # Root component
  └── index.tsx      # Entry point
```

## Game Commands

- `help` - Show available commands
- `scan <target>` - Scan a target for vulnerabilities
- `bruteforce <target>` - Attempt to bruteforce a target
- `stealth <on|off>` - Toggle stealth mode
- `clear` - Clear terminal output
- `status` - Show current status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details 