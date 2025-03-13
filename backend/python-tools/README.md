# Terminal Hacker Tools

Python backend tools for network scanning and password cracking in the Terminal Hacker RPG game.

## Features

- Network scanning with stealth mode
- Password cracking with multiple methods
- FastAPI-based REST API
- Asynchronous operations
- Detection level simulation

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Development

1. Install development dependencies:
```bash
pip install -e ".[dev]"
```

2. Run tests:
```bash
pytest
```

3. Start the server:
```bash
python -m src.server
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### GET /
- Description: Get API information
- Response: API metadata and available endpoints

### GET /health
- Description: Check API health
- Response: Health status

### POST /scan
- Description: Scan a target system
- Request:
  ```json
  {
    "target": "string",
    "stealth_mode": false
  }
  ```
- Response:
  ```json
  {
    "open_ports": [int],
    "os_info": "string",
    "vulnerabilities": [
      {
        "name": "string",
        "severity": "string",
        "description": "string"
      }
    ],
    "services": {
      "port": "service_name"
    },
    "detection_level": int,
    "scan_time": float
  }
  ```

### POST /bruteforce
- Description: Attempt to crack passwords
- Request:
  ```json
  {
    "target": "string",
    "stealth_mode": false,
    "hints": ["string"]
  }
  ```
- Response:
  ```json
  {
    "success": boolean,
    "password": "string",
    "attempts": int,
    "time_elapsed": float,
    "method_used": "string",
    "detection_level": int
  }
  ```

## Configuration

Environment variables:
- `HOST`: Server host (default: "0.0.0.0")
- `PORT`: Server port (default: 8000)
- `LOG_LEVEL`: Logging level (default: "info")

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests and ensure they pass
4. Submit a pull request

## License

This project is licensed under the MIT License. 