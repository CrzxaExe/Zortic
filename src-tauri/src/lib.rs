// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use sysinfo::{Components, System};
use tauri::{Manager, State};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Note {
    filename: String,
    title: String,
    content: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileEntry {
    name: String,
    is_dir: bool,
    size: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FolderContents {
    path: String,
    parent_path: Option<String>,
    entries: Vec<FileEntry>,
}

fn canonical_directory(folder_path: &str) -> Result<PathBuf, String> {
    let path = Path::new(folder_path);
    if !path.is_absolute() {
        return Err("Folder path must be absolute".to_string());
    }

    let path = fs::canonicalize(path).map_err(|e| format!("Failed to open folder: {}", e))?;
    if !path.is_dir() {
        return Err("The selected path is not a folder".to_string());
    }

    Ok(path)
}

fn validate_file_name(filename: &str) -> Result<(), String> {
    if filename.is_empty()
        || filename == "."
        || filename == ".."
        || filename.contains('/')
        || filename.contains('\\')
        || filename.contains('\0')
    {
        return Err("Invalid filename".to_string());
    }

    Ok(())
}

fn validated_file_path(folder_path: &str, filename: &str) -> Result<PathBuf, String> {
    validate_file_name(filename)?;
    let dir = canonical_directory(folder_path)?;
    Ok(dir.join(filename))
}

fn ensure_regular_file(path: &Path) -> Result<(), String> {
    let metadata =
        fs::symlink_metadata(path).map_err(|e| format!("Failed to access file: {}", e))?;
    if !metadata.file_type().is_file() {
        return Err("The selected entry is not a regular file".to_string());
    }

    Ok(())
}

fn is_generated_note_filename(filename: &str) -> bool {
    filename
        .strip_suffix(".md")
        .and_then(|id| Uuid::parse_str(id).ok())
        .is_some()
}

fn validated_note_path(dir: &Path, filename: &str) -> Result<PathBuf, String> {
    if filename == ".md"
        || !filename.ends_with(".md")
        || filename.contains('/')
        || filename.contains('\\')
    {
        return Err("Invalid note filename".to_string());
    }

    Ok(dir.join(filename))
}

fn parse_note_file(filename: String, stored_content: String) -> Note {
    if is_generated_note_filename(&filename) {
        let (title, content) = stored_content
            .split_once('\n')
            .map(|(title, content)| (title, content))
            .unwrap_or((&stored_content, ""));

        Note {
            filename,
            title: title.strip_suffix('\r').unwrap_or(title).to_string(),
            content: content.to_string(),
        }
    } else {
        let title = Path::new(&filename)
            .file_stem()
            .and_then(|stem| stem.to_str())
            .unwrap_or_default()
            .to_string();

        Note {
            filename,
            title,
            content: stored_content,
        }
    }
}

fn format_note_contents(title: &str, content: &str) -> (String, String) {
    let title = title.lines().next().unwrap_or_default().to_string();
    let stored_content = format!("{}\n{}", title, content);
    (title, stored_content)
}

#[derive(Serialize, Deserialize)]
pub struct TempReading {
    label: String,
    temperature: Option<f32>,
}

#[derive(Serialize, Deserialize)]
pub struct SystemPerformance {
    cpu_usage: f32,
    total_ram: u64,
    used_ram: u64,
    temperatures: Vec<TempReading>,
}

pub struct AppState {
    pub sys: Mutex<System>,
    pub components: Mutex<Components>,
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
fn list_folder(folder_path: String) -> Result<FolderContents, String> {
    let dir = canonical_directory(&folder_path)?;
    let mut entries = Vec::new();

    for entry in fs::read_dir(&dir).map_err(|e| format!("Failed to read folder: {}", e))? {
        let entry = entry.map_err(|e| format!("Failed to read folder entry: {}", e))?;
        let file_type = entry
            .file_type()
            .map_err(|e| format!("Failed to inspect folder entry: {}", e))?;

        if !file_type.is_file() && !file_type.is_dir() {
            continue;
        }

        let size = if file_type.is_file() {
            entry
                .metadata()
                .map_err(|e| format!("Failed to inspect file: {}", e))?
                .len()
        } else {
            0
        };

        entries.push(FileEntry {
            name: entry.file_name().to_string_lossy().into_owned(),
            is_dir: file_type.is_dir(),
            size,
        });
    }

    entries.sort_by(|left, right| {
        right
            .is_dir
            .cmp(&left.is_dir)
            .then_with(|| left.name.to_lowercase().cmp(&right.name.to_lowercase()))
    });

    Ok(FolderContents {
        path: dir.to_string_lossy().into_owned(),
        parent_path: dir.parent().map(|parent| parent.to_string_lossy().into_owned()),
        entries,
    })
}

#[tauri::command]
fn read_text_file(folder_path: String, filename: String) -> Result<String, String> {
    let path = validated_file_path(&folder_path, &filename)?;
    ensure_regular_file(&path)?;
    fs::read_to_string(path).map_err(|e| format!("Failed to read text file: {}", e))
}

#[tauri::command]
fn create_text_file(
    folder_path: String,
    filename: String,
    content: String,
) -> Result<FileEntry, String> {
    let path = validated_file_path(&folder_path, &filename)?;
    let mut file = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(FileEntry {
        name: filename,
        is_dir: false,
        size: content.len() as u64,
    })
}

#[tauri::command]
fn update_text_file(
    folder_path: String,
    filename: String,
    content: String,
) -> Result<FileEntry, String> {
    let path = validated_file_path(&folder_path, &filename)?;
    ensure_regular_file(&path)?;
    fs::write(&path, content.as_bytes()).map_err(|e| format!("Failed to update file: {}", e))?;

    Ok(FileEntry {
        name: filename,
        is_dir: false,
        size: content.len() as u64,
    })
}

#[tauri::command]
fn delete_file(folder_path: String, filename: String) -> Result<(), String> {
    let path = validated_file_path(&folder_path, &filename)?;
    ensure_regular_file(&path)?;
    fs::remove_file(path).map_err(|e| format!("Failed to delete file: {}", e))
}

#[tauri::command]
fn get_all_notes(app_handle: tauri::AppHandle) -> Result<Vec<Note>, String> {
    let dir = get_notes_dir(&app_handle)?;
    let mut notes = Vec::new();

    let entries = fs::read_dir(dir).map_err(|e| format!("Failed to read notes folder: {}", e))?;
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read note entry: {}", e))?;
        let path = entry.path();

        if path.is_file() && path.extension().and_then(|s| s.to_str()) == Some("md") {
            let filename = entry.file_name().to_string_lossy().into_owned();
            let stored_content = fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read note '{}': {}", filename, e))?;
            notes.push(parse_note_file(filename, stored_content));
        }
    }

    Ok(notes)
}

#[tauri::command]
fn get_performance_stats(state: State<'_, AppState>) -> SystemPerformance {
    let mut sys = state.sys.lock().unwrap();
    let mut components = state.components.lock().unwrap();

    sys.refresh_cpu_usage();
    sys.refresh_memory();
    components.refresh(false);

    let cpus = sys.cpus();
    let avg_cpu: f32 = if !cpus.is_empty() {
        cpus.iter().map(|c| c.cpu_usage()).sum::<f32>() / cpus.len() as f32
    } else {
        0.0
    };

    let mut temps = Vec::new();
    for component in components.iter() {
        temps.push(TempReading {
            label: component.label().to_string(),
            temperature: component.temperature(),
        });
    }

    SystemPerformance {
        cpu_usage: avg_cpu,
        total_ram: sys.total_memory(),
        used_ram: sys.used_memory(),
        temperatures: temps,
    }
}

#[tauri::command]
fn save_note(
    app_handle: tauri::AppHandle,
    filename: Option<String>,
    title: String,
    content: String,
) -> Result<Note, String> {
    let dir = get_notes_dir(&app_handle)?;

    let (filename, path, legacy_path) = match filename {
        Some(filename) => {
            let old_path = validated_note_path(&dir, &filename)?;
            if is_generated_note_filename(&filename) {
                (filename, old_path, None)
            } else {
                let filename = format!("{}.md", Uuid::new_v4());
                let path = validated_note_path(&dir, &filename)?;
                (filename, path, Some(old_path))
            }
        }
        None => {
            let filename = format!("{}.md", Uuid::new_v4());
            let path = validated_note_path(&dir, &filename)?;
            (filename, path, None)
        }
    };

    let (title, stored_content) = format_note_contents(&title, &content);
    let mut file = fs::File::create(&path).map_err(|e| format!("Failed to save note: {}", e))?;
    file.write_all(stored_content.as_bytes())
        .map_err(|e| format!("Failed to save note: {}", e))?;

    if let Some(legacy_path) = legacy_path {
        if legacy_path.exists() {
            fs::remove_file(legacy_path)
                .map_err(|e| format!("Failed to migrate old note: {}", e))?;
        }
    }

    Ok(Note {
        filename,
        title,
        content,
    })
}

#[tauri::command]
fn delete_note(app_handle: tauri::AppHandle, filename: String) -> Result<(), String> {
    let dir = get_notes_dir(&app_handle)?;
    let path = validated_note_path(&dir, &filename)?;

    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("Failed to delete file: {}", e))?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let sys = System::new_all();
            let components = Components::new();

            app.manage(AppState {
                sys: Mutex::new(sys),
                components: Mutex::new(components),
            });
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            list_folder,
            read_text_file,
            create_text_file,
            update_text_file,
            delete_file,
            get_all_notes,
            save_note,
            delete_note,
            get_performance_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::{format_note_contents, parse_note_file, validate_file_name};

    #[test]
    fn file_name_validation_rejects_paths_and_accepts_plain_names() {
        for invalid_name in [
            "",
            ".",
            "..",
            "../outside.txt",
            "nested/file.txt",
            r"..\outside.txt",
        ] {
            assert!(validate_file_name(invalid_name).is_err(), "{invalid_name}");
        }

        assert!(validate_file_name("notes.txt").is_ok());
    }

    #[test]
    fn generated_note_uses_first_line_as_title() {
        let note = parse_note_file(
            "550e8400-e29b-41d4-a716-446655440000.md".to_string(),
            "Judul\nBaris isi pertama\nBaris isi kedua".to_string(),
        );

        assert_eq!(note.title, "Judul");
        assert_eq!(note.content, "Baris isi pertama\nBaris isi kedua");
    }

    #[test]
    fn legacy_note_keeps_its_filename_title_and_content() {
        let note = parse_note_file("Judul lama.md".to_string(), "Isi lama".to_string());

        assert_eq!(note.title, "Judul lama");
        assert_eq!(note.content, "Isi lama");
    }

    #[test]
    fn saved_note_content_starts_with_the_title() {
        let (title, stored_content) = format_note_contents("Judul\nbaris lain", "Isi");

        assert_eq!(title, "Judul");
        assert_eq!(stored_content, "Judul\nIsi");
    }
}
