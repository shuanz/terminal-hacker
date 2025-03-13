use terminal_hacker_core::{GameState, scan_target, bruteforce_target};
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn test_game_state_initialization() {
    let state = GameState::new();
    assert_eq!(state.level(), 1);
    assert_eq!(state.experience(), 0);
    assert_eq!(state.money(), 1000);
    assert_eq!(state.detection(), 0);
    assert!(!state.stealth_mode());
}

#[wasm_bindgen_test]
fn test_experience_and_leveling() {
    let mut state = GameState::new();
    
    // Add experience but not enough to level up
    assert!(!state.add_experience(500));
    assert_eq!(state.level(), 1);
    assert_eq!(state.experience(), 500);
    
    // Add enough experience to level up
    assert!(state.add_experience(500));
    assert_eq!(state.level(), 2);
    assert_eq!(state.experience(), 0);
}

#[wasm_bindgen_test]
fn test_money_management() {
    let mut state = GameState::new();
    assert_eq!(state.money(), 1000);
    
    state.add_money(500);
    assert_eq!(state.money(), 1500);
    
    state.add_money(1000);
    assert_eq!(state.money(), 2500);
}

#[wasm_bindgen_test]
fn test_detection_system() {
    let mut state = GameState::new();
    assert_eq!(state.detection(), 0);
    
    state.set_detection(50);
    assert_eq!(state.detection(), 50);
    
    // Test that detection cannot exceed 100
    state.set_detection(150);
    assert_eq!(state.detection(), 100);
}

#[wasm_bindgen_test]
fn test_stealth_mode() {
    let mut state = GameState::new();
    assert!(!state.stealth_mode());
    
    state.toggle_stealth_mode();
    assert!(state.stealth_mode());
    
    state.toggle_stealth_mode();
    assert!(!state.stealth_mode());
}

#[wasm_bindgen_test]
fn test_scan_target() {
    let result = scan_target("192.168.1.1", false);
    let scan_result: serde_json::Value = serde_json::from_str(&result.as_string().unwrap()).unwrap();
    
    assert!(scan_result.get("open_ports").is_some());
    assert!(scan_result.get("os_info").is_some());
    assert!(scan_result.get("vulnerabilities").is_some());
    assert!(scan_result.get("detection_chance").is_some());
}

#[wasm_bindgen_test]
fn test_bruteforce_target() {
    let result = bruteforce_target("https://example.com/login", false);
    let bf_result: serde_json::Value = serde_json::from_str(&result.as_string().unwrap()).unwrap();
    
    assert!(bf_result.get("success").is_some());
    assert!(bf_result.get("attempts").is_some());
    assert!(bf_result.get("time_taken").is_some());
    assert!(bf_result.get("detection_chance").is_some());
}

#[wasm_bindgen_test]
fn test_stealth_mode_effects() {
    // Test scan with stealth mode
    let stealth_scan = scan_target("192.168.1.1", true);
    let stealth_result: serde_json::Value = serde_json::from_str(&stealth_scan.as_string().unwrap()).unwrap();
    let stealth_detection = stealth_result["detection_chance"].as_u64().unwrap();
    
    // Test scan without stealth mode
    let normal_scan = scan_target("192.168.1.1", false);
    let normal_result: serde_json::Value = serde_json::from_str(&normal_scan.as_string().unwrap()).unwrap();
    let normal_detection = normal_result["detection_chance"].as_u64().unwrap();
    
    // Stealth mode should have lower detection chance
    assert!(stealth_detection < normal_detection);
} 