use std::fs;
use serde::Deserialize;
use serde::Serialize;
use std::fs::OpenOptions;
use std::time::UNIX_EPOCH;
use std::time::SystemTime;

#[cfg(windows)]
use std::os::windows::prelude::*;
use std::path::Path;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder
		::default()
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(
			tauri::generate_handler![
				storage::read_config_file,
				storage::read_backup_file,
				storage::write_config_file,
				storage::write_backup_file,
				backup::copy_origin_to_target,
				backup::create_backup_parent_folder,
				path_selector_ui::read_contents_of,
				// TODO: Remove this; just info: New functions that will slowly replace the others
				list_contents_of,
				get_user_path_to,
				path_selector_ui::get_remaining_drives,
				has_write_access_to,
				delete_all_data
			]
		)
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

//
// SECTION: Read and write config and save-files
//
pub mod storage;

//
// SECTION: Execute backups
//
pub mod backup;

//
// SECTION: Path-Selector-UI
//
pub mod path_selector_ui;

#[derive(Debug, Serialize, Deserialize)]
pub enum FileOrDirectory {
	File,
	Directory,
}

#[derive(Debug, Serialize, Deserialize)]
struct DirectoryResult {
	id: String,
	name: String,
	is_hidden: bool,
	variant: FileOrDirectory,
}

#[tauri::command]
fn list_contents_of(path: String) -> Vec<DirectoryResult> {
	let mut directories: Vec<DirectoryResult> = Vec::new();

	match fs::read_dir(path) {
		Ok(readable_dir) => {
			for entry in readable_dir {
				match entry {
					Ok(readable_entry) => {
						let path = readable_entry.path();

						if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
							let variant = if path.is_file() {
								FileOrDirectory::File
							} else {
								FileOrDirectory::Directory
							};

							#[cfg(windows)]
							fn is_hidden(path: &Path) -> bool {
								match path.metadata() {
									Ok(metadata) => {
										return (metadata.file_attributes() & 2) != 0;
									}
									Err(_err) => {
										return false;
									}
								}
							}

							#[cfg(unix)]
							fn is_hidden(path: &Path) -> bool {
								path.starts_with('.')
							}

							directories.push(DirectoryResult {
								id: path.to_string_lossy().to_string(),
								name: name.to_string(),
								is_hidden: is_hidden(&path),
								variant,
							});
						}
					}
					Err(_err) => {}
				}
			}
		}
		Err(_err) => {}
	}

	directories
}

#[derive(Debug, Serialize, Deserialize)]
struct PathElement {
	id: String,
	name: String,
}

#[tauri::command]
// TODO: Make OS-independent and get correct username
fn get_user_path_to(location: String) -> Vec<PathElement> {
	let mut base_path = vec![
		PathElement { id: "C:/".to_string(), name: "C:".to_string() },
		PathElement { id: "C:/Users/".to_string(), name: "Users".to_string() },
		PathElement { id: "C:/Users/Kingi/".to_string(), name: "Kingi".to_string() }
	];

	if location == "downloads" {
		base_path.push(PathElement {
			id: "C:/Users/Kingi/Downloads/".to_string(),
			name: "Downloads".to_string(),
		});
	} else if location == "documents" {
		base_path.push(PathElement {
			id: "C:/Users/Kingi/Documents/".to_string(),
			name: "Documents".to_string(),
		});
	} else if location == "desktop" {
		base_path.push(PathElement {
			id: "C:/Users/Kingi/Desktop/".to_string(),
			name: "Desktop".to_string(),
		});
	}

	// Append nothing is the value is "home"

	base_path
}

#[tauri::command]
fn has_write_access_to(path: Option<String>) -> bool {
	match path {
		Some(existing_path) => {
			let path = Path::new(&existing_path);
			let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
			let test_file = path.join(format!(".perm_test_{}", timestamp));

			match OpenOptions::new().write(true).create_new(true).open(&test_file) {
				Ok(_) => {
					let _ = fs::remove_file(&test_file);
					true
				}
				Err(_) => false,
			}
		}
		None => { true }
	}
}

#[tauri::command]
// TODO: Make OS-independent and get correct username
fn delete_all_data() {
	let dir_path = Path::new("C:/Users/Kingi/AppData/Roaming/.rexup");
	fs::remove_dir_all(&dir_path);
}
