// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Serialize, Deserialize)]
pub struct Note {
    filename: String,
    title: String,
    content: String,
}

fn get_notes_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let mut path = app_handle
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Failed to get directory: {}", e))?;
    
    path.push("notes");

    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| format!("Failed to create folder: {}", e))?;
    }
    
    Ok(path)
}

#[tauri::command]
fn get_all_notes(app_handle: tauri::AppHandle) -> Result<Vec<Note>, String> {
    let dir = get_notes_dir(&app_handle)?;
    let mut notes = Vec::new();

    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            
            if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("md") {
                let filename = path.file_name().unwrap().to_string_lossy().into_owned();
                let title = filename.trim_end_matches(".md").to_string();
                let content = fs::read_to_string(&path).unwrap_or_default();
                
                notes.push(Note {
                    filename,
                    title,
                    content,
                });
            }
        }
    }
    
    Ok(notes)
}

#[tauri::command]
fn save_note(app_handle: tauri::AppHandle, title: String, content: String) -> Result<Note, String> {
    let dir = get_notes_dir(&app_handle)?;
    
    let safe_title: String = title
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == ' ' || *c == '-')
        .collect();
        
    let filename = format!("{}.md", safe_title);
    let path = dir.join(&filename);

    fs::write(&path, &content).map_err(|e| format!("Failed to save file: {}", e))?;

    Ok(Note {
        filename,
        title: safe_title,
        content,
    })
}

#[tauri::command]
fn delete_note(app_handle: tauri::AppHandle, filename: String) -> Result<(), String> {
    let dir = get_notes_dir(&app_handle)?;
    let path = dir.join(filename);
    
    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("Failed to delete file: {}", e))?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_all_notes,
            save_note,
            delete_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
