use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use rand::Rng;
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
pub struct System {
    strength: u8,
    compromised: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Target {
    name: String,
    ip: String,
    difficulty: u8,
    description: String,
    reward: Reward,
    systems: HashMap<String, System>,
    os: String,
    vulnerabilities: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Reward {
    xp: u32,
    money: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Program {
    name: String,
    description: String,
    price: u32,
    level: u8,
    program_type: String,
    commands: HashMap<String, String>,
    success_rate: f32,
}

#[wasm_bindgen]
pub struct GameState {
    level: u32,
    experience: u32,
    money: u32,
    detection: u32,
    stealth_mode: bool,
}

#[wasm_bindgen]
impl GameState {
    pub fn new() -> Self {
        Self {
            level: 1,
            experience: 0,
            money: 1000,
            detection: 0,
            stealth_mode: false,
        }
    }

    pub fn level(&self) -> u32 {
        self.level
    }

    pub fn experience(&self) -> u32 {
        self.experience
    }

    pub fn money(&self) -> u32 {
        self.money
    }

    pub fn detection(&self) -> u32 {
        self.detection
    }

    pub fn stealth_mode(&self) -> bool {
        self.stealth_mode
    }

    pub fn add_experience(&mut self, amount: u32) -> bool {
        self.experience += amount;

        // Level up if experience exceeds 1000
        if self.experience >= 1000 {
            self.level += 1;
            self.experience = 0;
            return true;
        }

        false
    }

    pub fn add_money(&mut self, amount: u32) {
        self.money += amount;
    }

    pub fn set_detection(&mut self, amount: u32) {
        self.detection = if amount > 100 { 100 } else { amount };
    }

    pub fn toggle_stealth_mode(&mut self) {
        self.stealth_mode = !self.stealth_mode;
    }
}

#[wasm_bindgen]
pub struct Vulnerability {
    name: String,
    risk_level: u32,
    description: String,
}

#[wasm_bindgen]
impl Vulnerability {
    pub fn new(name: &str, risk_level: u32, description: &str) -> Self {
        Self {
            name: name.to_string(),
            risk_level,
            description: description.to_string(),
        }
    }
}

#[wasm_bindgen]
pub struct ScanResult {
    open_ports: Vec<u16>,
    os_info: String,
    vulnerabilities: Vec<Vulnerability>,
    services: HashMap<u16, String>,
    detection_level: u32,
}

#[wasm_bindgen]
impl ScanResult {
    fn new(os_info: &str, detection_level: u32) -> Self {
        Self {
            open_ports: Vec::new(),
            os_info: os_info.to_string(),
            vulnerabilities: Vec::new(),
            services: HashMap::new(),
            detection_level,
        }
    }
}

#[wasm_bindgen]
pub struct BruteforceResult {
    success: bool,
    password: Option<String>,
    attempts: u32,
    time_elapsed: f64,
    method_used: String,
    detection_level: u32,
}

#[wasm_bindgen]
impl BruteforceResult {
    fn new(success: bool, password: Option<String>, attempts: u32, time_elapsed: f64, method_used: &str, detection_level: u32) -> Self {
        Self {
            success,
            password,
            attempts,
            time_elapsed,
            method_used: method_used.to_string(),
            detection_level,
        }
    }
}

#[wasm_bindgen]
pub fn scan_target(target_ip: &str, stealth_mode: bool) -> ScanResult {
    let detection_level = if stealth_mode { 5 } else { 20 };

    // Simple implementation for demo purposes
    // In a real game, this would be more complex with actual network scanning logic
    let os_info = match target_ip {
        "192.168.1.100" => "Ubuntu 20.04 LTS",
        "10.0.0.50" => "Windows Server 2019",
        "172.16.0.25" => "CentOS 8",
        _ => "Unknown OS",
    };

    let mut result = ScanResult::new(os_info, detection_level);

    // Add demo open ports based on target IP
    match target_ip {
        "192.168.1.100" => {
            result.open_ports = vec![22, 80, 443];
            result.services.insert(22, "ssh".to_string());
            result.services.insert(80, "http".to_string());
            result.services.insert(443, "https".to_string());
            result.vulnerabilities.push(Vulnerability::new("weak_password", 2, "Weak SSH password"));
        },
        "10.0.0.50" => {
            result.open_ports = vec![1433, 3306];
            result.services.insert(1433, "mssql".to_string());
            result.services.insert(3306, "mysql".to_string());
            result.vulnerabilities.push(Vulnerability::new("sql_injection", 3, "SQL Injection vulnerability"));
            result.vulnerabilities.push(Vulnerability::new("outdated_software", 2, "Outdated DBMS version"));
        },
        "172.16.0.25" => {
            result.open_ports = vec![21, 2049];
            result.services.insert(21, "ftp".to_string());
            result.services.insert(2049, "nfs".to_string());
            result.vulnerabilities.push(Vulnerability::new("misconfiguration", 2, "FTP anonymous access enabled"));
            result.vulnerabilities.push(Vulnerability::new("default_credentials", 3, "Default admin credentials in use"));
        },
        _ => {}
    }

    result
}

#[wasm_bindgen]
pub fn bruteforce_target(target_ip: &str, port: u16, stealth_mode: bool) -> BruteforceResult {
    let detection_level = if stealth_mode { 15 } else { 40 };

    // Simple implementation for demo purposes
    // In a real game, this would be more complex
    let success = match (target_ip, port) {
        ("192.168.1.100", 22) => true,
        ("10.0.0.50", 1433) => true,
        ("172.16.0.25", 21) => true,
        _ => false,
    };

    let password = if success {
        match (target_ip, port) {
            ("192.168.1.100", 22) => Some("password123".to_string()),
            ("10.0.0.50", 1433) => Some("admin2019".to_string()),
            ("172.16.0.25", 21) => Some("anonymous".to_string()),
            _ => None,
        }
    } else {
        None
    };

    let attempts = if success { 128 } else { 500 };
    let time_elapsed = if success { 3.5 } else { 10.0 };
    let method_used = if stealth_mode { "dictionary_attack" } else { "brute_force" };

    BruteforceResult::new(success, password, attempts, time_elapsed, method_used, detection_level)
}


#[wasm_bindgen]
pub fn execute_command(program_type: &str, context_json: &str) -> String {
    let context: ExecutionContext = serde_json::from_str(context_json)
        .expect("Failed to parse execution context");
    
    let result = match program_type {
        "scan" => execute_scan(&context),
        "bruteforce" => execute_bruteforce(&context),
        "firewall" => execute_firewall(&context),
        "crypto" => execute_crypto(&context),
        _ => CommandResult {
            success: false,
            message: Some(format!("Unknown program type: {}", program_type)),
            experience: None,
            money: None,
            detection: None,
        }
    };
    
    serde_json::to_string(&result).expect("Failed to serialize result")
}

fn execute_scan(context: &ExecutionContext) -> CommandResult {
    let mut rng = rand::thread_rng();
    
    let scan_success_rate = if context.game_state.stealth_mode() { 0.7 } else { 0.9 };

    // Scan for vulnerabilities
    let mut discovered_vulnerabilities = Vec::new();
    for vuln in &context.target.vulnerabilities {
        if rng.gen::<f32>() < scan_success_rate {
            discovered_vulnerabilities.push(vuln.clone());
        }
    }

    let scan_result = scan_target(&context.target.ip, context.game_state.stealth_mode());
    let mut new_detection = context.game_state.detection();
    new_detection = std::cmp::min(100, new_detection + scan_result.detection_level);


    CommandResult {
        success: true,
        message: Some(format!(
            "Scan complete!\n\nDiscovered vulnerabilities:\n{}\n\nOpen ports:\n{}\nOS: {}\n",
            discovered_vulnerabilities.iter().map(|v| v.to_string()).collect::<Vec<String>>().join("\n"),
            scan_result.open_ports.iter().map(|p| p.to_string()).collect::<Vec<String>>().join("\n"),
            scan_result.os_info
        )),
        experience: Some(50),
        money: None,
        detection: Some(new_detection),
    }
}

fn execute_bruteforce(context: &ExecutionContext) -> CommandResult {
    let mut rng = rand::thread_rng();
    
    // Calculate success chance
    let base_chance = 0.7;
    let level_bonus = (context.game_state.level() as f32) * 0.05;
    let stealth_penalty = if context.game_state.stealth_mode() { -0.2 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.2 } else { 0.0 };
    
    let success_chance = (base_chance + level_bonus + stealth_penalty + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < success_chance;
    
    let bruteforce_result = bruteforce_target(&context.target.ip, 22, context.game_state.stealth_mode()); // Assuming port 22 for bruteforce
    let mut new_detection = context.game_state.detection();
    new_detection = std::cmp::min(100, new_detection + bruteforce_result.detection_level);

    CommandResult {
        success,
        message: Some(if success {
            format!("Password cracked: {}, Attempts: {}, Time: {:.2}, Method: {}", bruteforce_result.password.unwrap(), bruteforce_result.attempts, bruteforce_result.time_elapsed, bruteforce_result.method_used)
        } else {
            "Failed to crack password".to_string()
        }),
        experience: Some(if success { 100 } else { 25 }),
        money: Some(if success { 500 } else { 0 }),
        detection: Some(new_detection),
    }
}

fn execute_firewall(context: &ExecutionContext) -> CommandResult {
    let mut rng = rand::thread_rng();
    
    // Calculate bypass chance
    let base_chance = 0.6;
    let level_bonus = (context.game_state.level() as f32) * 0.05;
    let stealth_bonus = if context.game_state.stealth_mode() { 0.1 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.2 } else { 0.0 };
    
    let bypass_chance = (base_chance + level_bonus + stealth_bonus + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < bypass_chance;
    
    let mut new_detection = context.game_state.detection();
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode() { 10 } else { 20 }
    );
    
    CommandResult {
        success,
        message: Some(if success {
            "Firewall successfully bypassed!\nInternal network access established.".to_string()
        } else {
            "Failed to bypass firewall. Access denied.".to_string()
        }),
        experience: Some(if success { 150 } else { 30 }),
        money: Some(if success { 750 } else { 0 }),
        detection: Some(new_detection),
    }
}

fn execute_crypto(context: &ExecutionContext) -> CommandResult {
    let mut rng = rand::thread_rng();
    
    // Calculate decryption chance
    let base_chance = 0.5;
    let level_bonus = (context.game_state.level() as f32) * 0.05;
    let stealth_penalty = if context.game_state.stealth_mode() { -0.1 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.3 } else { 0.0 };
    
    let decrypt_chance = (base_chance + level_bonus + stealth_penalty + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < decrypt_chance;
    
    let mut new_detection = context.game_state.detection();
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode() { 15 } else { 25 }
    );
    
    CommandResult {
        success,
        message: Some(if success {
            "Database successfully decrypted!\nSensitive data access granted.".to_string()
        } else {
            "Failed to decrypt database. Encryption remains intact.".to_string()
        }),
        experience: Some(if success { 200 } else { 40 }),
        money: Some(if success { 1000 } else { 0 }),
        detection: Some(new_detection),
    }
}

#[derive(Serialize, Deserialize)]
pub struct CommandResult {
    success: bool,
    message: Option<String>,
    experience: Option<u32>,
    money: Option<u32>,
    detection: Option<u32>,
}

#[derive(Serialize, Deserialize)]
pub struct ExecutionContext {
    program: Program,
    target: Target,
    game_state: GameState,
    args: Vec<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_game_state() {
        let mut state = GameState::new();
        assert_eq!(state.level(), 1);
        assert_eq!(state.experience(), 0);
        assert_eq!(state.money(), 1000);
        assert_eq!(state.detection(), 0);
        assert_eq!(state.stealth_mode(), false);
        state.add_experience(1500);
        assert_eq!(state.level(), 2);
        assert_eq!(state.experience(), 0);
        state.add_money(500);
        assert_eq!(state.money(), 1500);
        state.set_detection(110);
        assert_eq!(state.detection(), 100);
        state.toggle_stealth_mode();
        assert!(state.stealth_mode());
        state.toggle_stealth_mode();
        assert!(!state.stealth_mode());
    }

    #[test]
    fn test_stealth_mode() {
        let mut state = GameState::new();
        state.toggle_stealth_mode();
        assert!(state.stealth_mode());
        state.toggle_stealth_mode();
        assert!(!state.stealth_mode());
    }
}