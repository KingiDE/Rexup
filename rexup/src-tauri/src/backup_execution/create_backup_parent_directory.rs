use std::{ fs, path::PathBuf };

/// Creates a new backup directory or ZIP file path, optionally in a custom location,
/// and returns the resulting `PathBuf` if successful.
///
/// This function is typically used to set up the parent location where a backup will be saved.
/// It either creates a new folder or an empty `.zip` file, depending on the `is_zipped` flag.
/// If a file or directory with the same name already exists at the target location,
/// the function will return `None` to avoid overwriting existing backups.
///
/// If no custom location is provided via `location`, the user's **Desktop** is used as the default
/// backup target. The backup folder or file will be named `Backup {name}`.
///
/// # Parameters
/// - `name`: The base name to be used for the backup folder or ZIP file (e.g., `"June 2025"`).
/// - `location`: Optional custom path (as a `String`) where the backup should be saved.
///   If `None`, the function falls back to the Desktop path (OS-specific).
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
	location: Option<String>,
	is_zipped: bool
) -> Option<PathBuf> {
	let mut used_directory_path = match location {
		Some(path) => { PathBuf::from(path) }
		// Use the user's desktop-path if there's no path set on the frontend
		None => { get_os_specific_desktop_path() }
	};

	// Add the actual name to the path
	used_directory_path.push(format!("Backup {}", name));

	if is_zipped {
		// Add the ".zip"-extension for zip-files
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

/// Helper function that returns the user's desktop-directory on Windows.
#[cfg(target_family = "windows")]
fn get_os_specific_desktop_path() -> PathBuf {
	PathBuf::from(&format!("C:/Users/{}/Desktop/", whoami::username()))
}

/// Helper function that returns the user's desktop-directory on Linux.
#[cfg(target_family = "unix")]
fn get_os_specific_desktop_path() -> PathBuf {
	PathBuf::from(&format!("/home/{}/Desktop/", whoami::username()))
}
