// Flow Desktop Music Player
// Main entrypoint for Tauri v2 native desktop bundle

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("🚀 [Flow Desktop] Initialized native Tauri shell window");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Flow desktop application");
}
