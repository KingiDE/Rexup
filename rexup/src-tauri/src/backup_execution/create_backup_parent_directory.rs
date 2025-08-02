use std::{ fs, path::PathBuf };

use crate::path_utils::get_desktop_path;

/// Creates a new backup directory or ZIP file path, optionally in a custom location,
/// and returns the resulting `PathBuf` if successful.
///
/// This function is used to set up the parent location where a backup is saved.
/// It either creates a new folder or an empty `.zip` file, depending on the `is_zipped` flag.
/// If a file or directory with the same name already exists at the target location,
/// the function returns `None` to avoid overwriting existing backups.
///
/// If no custom location is provided via `location`, the user's **Desktop** is used as the default
/// backup target. The backup folder or file is named `Backup {name}`.
///
/// # Parameters
/// - `name`: The base name to be used for the backup folder or ZIP file (e.g., `"GHG"`).
/// - `location`: Custom path (as a `&str`) where the backup should be saved.
///   If empty (= ""), the function falls back to the Desktop path (OS-specific).
/// - `is_zipped`: If `true`, creates a `.zip` file; if `false`, creates a folder.
///
/// # Returns
/// - `Some(PathBuf)` if the directory or file is successfully created and did **not** already exist.
/// - `None` if a file/folder with the target name already exists, or if creation fails (e.g., due to permissions).
///
/// # Platform Behavior
/// - On **Windows**, the default Desktop path is `C:/Users/{username}/Desktop/`.
/// - On **Unix/Linux**, the default Desktop path is `/home/{username}/Desktop/`.
pub fn create_backup_parent_directory(
	name: String,
	location: &str,
	is_zipped: bool
) -> Option<PathBuf> {
	// Use the user's desktop as default backup location
	let mut used_directory_path = get_desktop_path();

	// Update this value if the input is not empty
	if !location.is_empty() {
		used_directory_path = PathBuf::from(location);
	}

	// Add the actual name to the path
	used_directory_path.push(format!("Backup {}", name));

	if is_zipped {
		// Add the ".zip"-extension for zip files
		used_directory_path.set_extension("zip");

		// If the path with .zip already exists, return None
		if std::path::Path::new(&used_directory_path).exists() {
			return None;
		}

		match fs::File::create(&used_directory_path) {
			Ok(_x) => { Some(used_directory_path) }
			Err(_err) => { None }
		}
	} else {
		// If the path without .zip already exists, return None
		if std::path::Path::new(&used_directory_path).exists() {
			return None;
		}

		match fs::create_dir(&used_directory_path) {
			Ok(_x) => { Some(used_directory_path) }
			Err(_err) => { None }
		}
	}
}
