# Terminal Hacker Core

Core game mechanics for Terminal Hacker RPG, implemented in Rust and compiled to WebAssembly.

## Features

- Game state management
- Network scanning simulation
- Password cracking simulation
- Detection level calculation
- WebAssembly integration

## Prerequisites

- Rust 1.70+
- wasm-pack
- Node.js 16+ (for testing)

## Installation

1. Install wasm-pack:
```bash
cargo install wasm-pack
```

2. Build WebAssembly module:
```bash
wasm-pack build --target web
```

## Development

1. Run tests:
```bash
cargo test
```

2. Build in debug mode:
```bash
wasm-pack build --dev
```

3. Build in release mode:
```bash
wasm-pack build --release
```

## Usage

### Game State Management

```rust
use terminal_hacker_core::GameState;

let mut state = GameState::new();
state.add_experience(500);
state.add_money(1000);
state.toggle_stealth_mode();
```

### Network Scanning

```rust
use terminal_hacker_core::scan_target;

let result = scan_target("192.168.1.1", true);
println!("Scan results: {:?}", result);
```

### Password Cracking

```rust
use terminal_hacker_core::bruteforce_target;

let result = bruteforce_target("https://example.com/login", false);
println!("Bruteforce results: {:?}", result);
```

## API Reference

### GameState

```rust
pub struct GameState {
    level: u32,
    experience: u32,
    money: u32,
    detection: u32,
    stealth_mode: bool,
}

impl GameState {
    pub fn new() -> Self;
    pub fn add_experience(&mut self, amount: u32) -> bool;
    pub fn add_money(&mut self, amount: u32);
    pub fn set_detection(&mut self, amount: u32);
    pub fn toggle_stealth_mode(&mut self);
}
```

### ScanResult

```rust
pub struct ScanResult {
    open_ports: Vec<u16>,
    os_info: String,
    vulnerabilities: Vec<Vulnerability>,
    services: HashMap<u16, String>,
    detection_level: u32,
}
```

### BruteforceResult

```rust
pub struct BruteforceResult {
    success: bool,
    password: Option<String>,
    attempts: u32,
    time_elapsed: f64,
    method_used: String,
    detection_level: u32,
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests and ensure they pass
4. Submit a pull request

## License

This project is licensed under the MIT License. 