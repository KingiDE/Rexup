use crate::path_selector::PathElement;
use crate::FileOrDirectory;

/// Returns a list of all detected drives on the system as a vector of path sequences.
///
/// Each drive is represented as a `Vec<PathElement>`, which describes the full path
/// to that drive using individual components (elements).
///
/// This function internally delegates to `get_os_specific_drives()`, which uses platform-specific
/// logic to detect available drives:
///
/// - **On Windows**: Uses the WinAPI function `GetLogicalDrives()` to retrieve a bitmask
///   representing the currently mounted drives (e.g., `C:/`, `D:/`, etc.).
///
/// - **On Unix-like systems (Linux/macOS)**: Looks in `/media/{username}/` for mounted drives,
///   commonly where external or removable media are auto-mounted. Each entry there is interpreted
///   as a separate drive.
///
/// # Returns
/// A `Vec<Vec<PathElement>>` where each inner vector represents a path to a drive,
/// composed of multiple `PathElement`s with metadata (ID, name, and type).
#[tauri::command]
pub fn get_remaining_drives() -> Vec<Vec<PathElement>> {
	get_os_specific_drives()
}

#[cfg(target_family = "windows")]
/// Returns a Vec<String> containing paths to all detected drives on Windows.
fn get_os_specific_drives() -> Vec<Vec<PathElement>> {
	// Stores a list of drives found on the machine
	let mut drives = vec![];

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
				drives.push(
					vec![PathElement {
						id: format!("{}:/", drive_letter),
						name: format!("{}:/", drive_letter),
						variant: FileOrDirectory::Directory,
					}]
				);
			}
		}
	}

	drives
}

/// Returns a Vec<String> containing paths to all detected drives on Linux.
#[cfg(target_family = "unix")]
fn get_os_specific_drives() -> Vec<Vec<PathElement>> {
	let mut drives = Vec::new();

	let username = whoami::username();

	use std::fs;

	if let Ok(entries) = fs::read_dir(format!("/media/{}/", &username)) {
		for entry in entries {
			if let Ok(working_entry) = entry {
				let path_to_drive = vec![
					PathElement {
						id: "/".to_string(),
						name: "/".to_string(),
						variant: FileOrDirectory::Directory,
					},
					PathElement {
						id: "/media/".to_string(),
						name: "media".to_string(),
						variant: FileOrDirectory::Directory,
					},
					PathElement {
						id: format!("/media/{}/", &username),
						name: username.clone(),
						variant: FileOrDirectory::Directory,
					},
					PathElement {
						id: format!(
							"/media/{}/{}/",
							&username,
							working_entry.file_name().to_string_lossy().to_string()
						),
						name: working_entry.file_name().to_string_lossy().to_string(),
						variant: FileOrDirectory::Directory,
					}
				];

				drives.push(path_to_drive);
			}
		}
	}

	drives
}
