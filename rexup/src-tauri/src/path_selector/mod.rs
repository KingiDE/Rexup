use serde::{ Deserialize, Serialize };

use std::{ fs, path::Path };

use crate::FileOrDirectory;

/// Describes a "thing" inside a directory, either a file or another directory.
#[derive(Debug, Serialize, Deserialize)]
pub struct DirectoryContent {
	id: String,
	name: String,
	is_hidden: bool,
	variant: FileOrDirectory,
}

/// Returns a list of all direcotries and files in at the given path in form of a `DirectoryContent`. If the directory cannot be read, the returned Vec will be empty.
#[tauri::command]
pub fn list_contents_of(path: String) -> Vec<DirectoryContent> {
	let mut directories: Vec<DirectoryContent> = Vec::new();

	if let Ok(readable_dir) = fs::read_dir(path) {
		for entry in readable_dir {
			if let Ok(readable_entry) = entry {
				let path = readable_entry.path();

				if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
					let variant = if path.is_file() {
						FileOrDirectory::File
					} else {
						FileOrDirectory::Directory
					};

					directories.push(DirectoryContent {
						id: path.to_string_lossy().to_string(),
						name: name.to_string(),
						is_hidden: is_thing_at_path_hidden(&path),
						variant,
					});
				}
			}
		}
	}

	directories
}

/// Helper function to deterimine if the "thing" (file or direcotry) at the given path is hidden on Windows.
#[cfg(target_family = "windows")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	use std::os::windows::fs::MetadataExt;

	match path.metadata() {
		Ok(metadata) => {
			return (metadata.file_attributes() & 2) != 0;
		}
		Err(_err) => {
			return false;
		}
	}
}

/// Helper function to deterimine if the "thing" (file or direcotry) at the given path is hidden on Linux.
#[cfg(target_family = "unix")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	path.starts_with('.')
}

/// Is a block in the top bar in the PathSelector on the frontend.
#[derive(Debug, Serialize, Deserialize)]
pub struct PathElement {
	id: String,
	name: String,
}

/// Returns the correct path-elements to the user's specifc location on his file-system.
#[tauri::command]
pub fn get_user_path_to(location: String) -> Vec<PathElement> {
	get_os_specific_path(location)
}

/// Helper function that returns the path to the user's home-direcotry in form of PathElements on Windows.
#[cfg(target_family = "windows")]
fn get_os_specific_path(location: String) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "C:/".to_string(), name: "C:".to_string() },
		PathElement { id: "C:/Users/".to_string(), name: "Users".to_string() },
		PathElement { id: format!("C:/Users/{}/", &username), name: username.clone() }
	];

	if location == "downloads" {
		base_path.push(PathElement {
			id: format!("C:/Users/{}/Downloads/", &username),
			name: "Downloads".to_string(),
		});
	} else if location == "documents" {
		base_path.push(PathElement {
			id: format!("C:/Users/{}/Documents/", &username),
			name: "Documents".to_string(),
		});
	} else if location == "desktop" {
		base_path.push(PathElement {
			id: format!("C:/Users/{}/Desktop/", &username),
			name: "Desktop".to_string(),
		});
	}

	// Append nothing if the value is "home" or something different
	base_path
}

/// Helper function that returns the path to the user's home-direcotry in form of PathElements on Windows.
#[cfg(target_family = "unix")]
fn get_os_specific_path() -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "/".to_string(), name: "/".to_string() },
		PathElement { id: "/home/".to_string(), name: "/home".to_string() },
		PathElement { id: format!("/home/{}/", &username), name: &username.clone() }
	];

	if location == "downloads" {
		base_path.push(PathElement {
			id: format!("/home/{}/Downloads/", &username),
			name: "Downloads".to_string(),
		});
	} else if location == "documents" {
		base_path.push(PathElement {
			id: format!("/home/{}/Documents/", &username),
			name: "Documents".to_string(),
		});
	} else if location == "desktop" {
		base_path.push(PathElement {
			id: format!("/home/{}/Desktop/", &username),
			name: "Desktop".to_string(),
		});
	}

	// Append nothing if the value is "home" or something different
	base_path
}

#[tauri::command]
pub fn get_remaining_drives() {}
