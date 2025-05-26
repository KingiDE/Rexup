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

/// Gets a list  of all directories and files in at the given path.
///
/// ## Notes:
/// - If the directory cannot be read, an empty `Vec` is returned
/// - Every directory_entry that cannot be read will be skipped and not be added to the `Vec` in any form
/// - This also applies to any entry whose file_name cannot be read
///
/// ## Returns:
/// The function returns a `Vec` of all entries in the directory has but it doesn't traverse the directories recursively.
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
						// TODO: Is the lossy conversion ok?
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

/// Helper function to deterimine if the "thing" (file or directory) at the given path is hidden on Windows.
#[cfg(target_family = "windows")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	use std::os::windows::fs::MetadataExt;

	match path.metadata() {
		Ok(metadata) => (metadata.file_attributes() & 2) != 0,
		Err(_err) => false,
	}
}

/// Helper function to deterimine if the "thing" (file or directory) at the given path is hidden on Linux.
#[cfg(target_family = "unix")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	path.starts_with('.')
}

/// Holds all variants of locations the frontend might want to know.
pub enum UserLocation {
	Desktop,
	Downloads,
	Documents,
	Home,
}

/// Is a block in the top bar in the PathSelector on the frontend.
#[derive(Debug, Serialize, Deserialize)]
pub struct PathElement {
	id: String,
	name: String,
}

/// Returns the correct path-elements to the user's specifc location on his file-system.
///
/// ## Returns:
/// Returns the path to the location on the file-system depending on the user's OS in form of `Vec<PathElement>`.
#[tauri::command]
pub fn get_user_path_to(location: UserLocation) -> Vec<PathElement> {
	get_os_specific_path(location)
}

/// Helper function that returns the path to a user's OS-specific directory in form of `PathElements` on Windows.
#[cfg(target_family = "windows")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "C:/".to_string(), name: "C:".to_string() },
		PathElement { id: "C:/Users/".to_string(), name: "Users".to_string() },
		PathElement { id: format!("C:/Users/{}/", &username), name: username.clone() }
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Downloads/", &username),
				name: "Downloads".to_string(),
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Documents/", &username),
				name: "Documents".to_string(),
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Desktop/", &username),
				name: "Desktop".to_string(),
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}

/// Helper function that returns the path to a user's OS-specific directory in form of `PathElements` on Linux.
#[cfg(target_family = "unix")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "/".to_string(), name: "/".to_string() },
		PathElement { id: "/home/".to_string(), name: "/home".to_string() },
		PathElement { id: format!("/home/{}/", &username), name: &username.clone() }
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("/home/{}/Downloads/", &username),
				name: "Downloads".to_string(),
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("/home/{}/Documents/", &username),
				name: "Documents".to_string(),
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("/home/{}/Desktop/", &username),
				name: "Desktop".to_string(),
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}

// TODO: Make drives work on different OSes
#[tauri::command]
pub fn get_remaining_drives() {}
