//! Contains logic to navigate through directories on the users's file-system.
//! It allows the user to select directories/files to backup and choose a location to put the created backup.

use serde::{ Deserialize, Serialize };

use std::{ fs, path::Path };

use crate::FileOrDirectory;

/// Describes a "thing" inside a directory, either a file or another directory.
#[derive(Debug, Serialize, Deserialize)]
pub struct DirectoryContent {
	id: String,
	name: String,
	variant: FileOrDirectory,
	is_hidden: bool,
}

/// Gets a list of all directories and files in at the given `path`.
///
/// ## Notes:
/// - If the directory cannot be read, an empty `Vec<DirectoryContent>` is returned
/// - Every directory_entry that cannot be read will be skipped and not be added to the `Vec<DirectoryContent>` in any form
/// - This also applies to any entry whose file_name cannot be read
///
/// ## Returns:
/// The function returns a `Vec<DirectoryContent>` of all entries in the directory has but it doesn't traverse the directories recursively.
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

/// Helper function to deterimine if the "thing" (file or directory) at the given `path` is hidden on Windows.
#[cfg(target_family = "windows")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	use std::os::windows::fs::MetadataExt;

	match path.metadata() {
		Ok(metadata) => (metadata.file_attributes() & 2) != 0,
		Err(_err) => false,
	}
}

/// Helper function to deterimine if the "thing" (file or directory) at the given `path` is hidden on Linux.
#[cfg(target_family = "unix")]
fn is_thing_at_path_hidden(path: &Path) -> bool {
	path.starts_with('.')
}

/// Holds all variants of locations the frontend might want to know.
#[derive(Debug, Serialize, Deserialize)]
pub enum UserLocation {
	Desktop,
	Downloads,
	Documents,
	Home,
}

/// Is a path-block/segment of a path in the top bar in the PathSelector on the frontend.
#[derive(Debug, Serialize, Deserialize)]
pub struct PathElement {
	id: String,
	name: String,
	variant: FileOrDirectory,
}

/// Returns the correct path-elements to the user's specifc `location` on his file-system.
///
/// ## Returns:
/// Returns the path to the `location` on the file-system depending on the user's OS in form of `Vec<PathElement>`.
#[tauri::command]
pub fn get_user_path_to(location: UserLocation) -> Vec<PathElement> {
	get_os_specific_path(location)
}

/// Helper function that returns the path to a user's OS-specific directory-`location` in form of `PathElements` on Windows.
#[cfg(target_family = "windows")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement {
			id: "C:/".to_string(),
			name: "C:".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: "C:/Users/".to_string(),
			name: "Users".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: format!("C:/Users/{}/", &username),
			name: username.clone(),
			variant: FileOrDirectory::Directory,
		}
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Downloads/", &username),
				name: "Downloads".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Documents/", &username),
				name: "Documents".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Desktop/", &username),
				name: "Desktop".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}

/// Helper function that returns the path to a user's OS-specific directory-`location` in form of `PathElements` on Linux.
#[cfg(target_family = "unix")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "/".to_string(), name: "/".to_string(), variant: FileOrDirectory::Directory },
		PathElement {
			id: "/home/".to_string(),
			name: "/home".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: format!("/home/{}/", &username),
			name: &username.clone(),
			variant: FileOrDirectory::Directory,
		}
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("/home/{}/Downloads/", &username),
				name: "Downloads".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("/home/{}/Documents/", &username),
				name: "Documents".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("/home/{}/Desktop/", &username),
				name: "Desktop".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}

/// Gets a list of all existing drives on the user's OS.
///
/// ## Returns:
/// The function returns a `Vec<String>` containing the names of all existing drives on the user's OS.
// TODO: Make drives work on different OSes
#[tauri::command]
pub fn get_remaining_drives() -> Vec<String> {
	get_os_specific_drives()
}

#[cfg(target_family = "windows")]
fn get_os_specific_drives() -> Vec<String> {
	let mut drives = Vec::new();

	unsafe {
		extern "system" {
			fn GetLogicalDrives() -> u32;
		}

		let drive_mask = GetLogicalDrives();
		if drive_mask == 0 {
			return drives;
		}

		for i in 0..26 {
			if (drive_mask & (1 << i)) != 0 {
				let drive_letter = (b'A' + i) as char;
				drives.push(format!("{}:/", drive_letter));
			}
		}
	}

	drives
}
