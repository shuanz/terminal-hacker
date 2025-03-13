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

#[derive(Serialize, Deserialize, Clone)]
pub struct GameState {
    level: u32,
    experience: u32,
    money: u32,
    detection: u32,
    stealth_mode: bool,
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

#[derive(Serialize, Deserialize)]
pub struct ScanResult {
    open_ports: Vec<u16>,
    vulnerabilities: Vec<String>,
    os_info: String,
    detection_chance: u32,
}

#[derive(Serialize, Deserialize)]
pub struct BruteforceResult {
    success: bool,
    attempts: u32,
    time_taken: f64,
    password: Option<String>,
    detection_chance: u32,
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
    let mut discovered = Vec::new();
    let scan_success_rate = if context.game_state.stealth_mode { 0.7 } else { 0.9 };
    
    // Scan for vulnerabilities
    for vuln in &context.target.vulnerabilities {
        if rng.gen::<f32>() < scan_success_rate {
            discovered.push(vuln.clone());
        }
    }
    
    // Generate port scan results
    let common_ports = vec![
        "22/tcp (SSH)",
        "80/tcp (HTTP)",
        "443/tcp (HTTPS)",
        "3306/tcp (MySQL)",
        "5432/tcp (PostgreSQL)",
        "8080/tcp (Proxy)",
    ];
    
    let mut open_ports = Vec::new();
    for port in common_ports {
        if rng.gen::<f32>() > 0.3 {
            open_ports.push(port.to_string());
        }
    }
    
    let mut new_detection = context.game_state.detection;
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode { 5 } else { 10 }
    );
    
    CommandResult {
        success: true,
        message: Some(format!(
            "Scan complete!\n\nDiscovered vulnerabilities:\n{}\n\nOpen ports:\n{}\n",
            discovered.join("\n"),
            open_ports.join("\n")
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
    let level_bonus = (context.game_state.level as f32) * 0.05;
    let stealth_penalty = if context.game_state.stealth_mode { -0.2 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.2 } else { 0.0 };
    
    let success_chance = (base_chance + level_bonus + stealth_penalty + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < success_chance;
    
    let mut new_detection = context.game_state.detection;
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode { 15 } else { 25 }
    );
    
    // Generate random password if successful
    let password = if success {
        let chars: Vec<char> = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
            .chars()
            .collect();
        let password: String = (0..12)
            .map(|_| chars[rng.gen_range(0..chars.len())])
            .collect();
        Some(password)
    } else {
        None
    };
    
    CommandResult {
        success,
        message: Some(if success {
            format!("Password cracked: {}", password.as_ref().unwrap())
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
    let level_bonus = (context.game_state.level as f32) * 0.05;
    let stealth_bonus = if context.game_state.stealth_mode { 0.1 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.2 } else { 0.0 };
    
    let bypass_chance = (base_chance + level_bonus + stealth_bonus + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < bypass_chance;
    
    let mut new_detection = context.game_state.detection;
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode { 10 } else { 20 }
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
    let level_bonus = (context.game_state.level as f32) * 0.05;
    let stealth_penalty = if context.game_state.stealth_mode { -0.1 } else { 0.0 };
    let tool_bonus = if context.program.name.contains("Pro") { 0.3 } else { 0.0 };
    
    let decrypt_chance = (base_chance + level_bonus + stealth_penalty + tool_bonus)
        .clamp(0.1, 0.9);
    
    let success = rng.gen::<f32>() < decrypt_chance;
    
    let mut new_detection = context.game_state.detection;
    new_detection = std::cmp::min(
        100,
        new_detection + if context.game_state.stealth_mode { 15 } else { 25 }
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

#[wasm_bindgen]
pub fn scan_target(target: &str, stealth_mode: bool) -> JsValue {
    let mut rng = rand::thread_rng();
    
    let result = ScanResult {
        open_ports: vec![
            rng.gen_range(20..100),
            rng.gen_range(1000..5000),
            rng.gen_range(5000..10000),
        ],
        vulnerabilities: vec![
            "SQL Injection".to_string(),
            "Weak Password".to_string(),
            "Outdated Software".to_string(),
        ],
        os_info: "Linux 5.15.0-generic".to_string(),
        detection_chance: if stealth_mode { 10 } else { 30 },
    };

    JsValue::from_serde(&result).unwrap()
}

#[wasm_bindgen]
pub fn bruteforce_target(target: &str, stealth_mode: bool) -> JsValue {
    let mut rng = rand::thread_rng();
    let success = rng.gen_bool(0.7);
    
    let result = BruteforceResult {
        success,
        attempts: rng.gen_range(100..10000),
        time_taken: rng.gen_range(0.5..5.0),
        password: if success {
            Some("P@ssw0rd123!".to_string())
        } else {
            None
        },
        detection_chance: if stealth_mode { 20 } else { 50 },
    };

    JsValue::from_serde(&result).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_game_state() {
        let state = GameState {
            level: 1,
            experience: 0,
            money: 1000,
            detection: 0,
            stealth_mode: false,
        };
        assert_eq!(state.level, 1);
        assert_eq!(state.experience, 0);
        assert_eq!(state.money, 1000);
        assert_eq!(state.detection, 0);
        assert_eq!(state.stealth_mode, false);
    }

    #[test]
    fn test_stealth_mode() {
        let mut state = GameState {
            level: 1,
            experience: 0,
            money: 1000,
            detection: 0,
            stealth_mode: false,
        };
        state.stealth_mode = true;
        assert!(state.stealth_mode);
        state.stealth_mode = false;
        assert!(!state.stealth_mode);
    }
} 