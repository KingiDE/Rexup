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
				has_write_access_to
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

#[tauri::command]
// TODO: Make OS-independent and get correct username
fn get_user_path_to(location: String) -> String {
	match location.as_str() {
		"downloads" => "C:/Users/Kingi/Downloads".to_string(),
		"documents" => "C:/Users/Kingi/Documents".to_string(),
		"desktop" => "C:/Users/Kingi/Desktop".to_string(),
		"home" | _ => "C:/Users/Kingi".to_string(),
	}
}

#[tauri::command]
fn has_write_access_to(path: String) -> bool {
	let path = Path::new(&path);
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
