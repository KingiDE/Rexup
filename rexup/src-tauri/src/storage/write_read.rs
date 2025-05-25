use core::str;
use std::{ fs, path::{ Path, PathBuf } };

/// Tries to read from a file a the given path and returns the file contents as a String.
/// In case of an error, the function will return nothing.
pub fn safely_read_file(path: &Path) -> Option<String> {
	if let Ok(file_data) = fs::read(&path) {
		if let Ok(converted_bytes) = str::from_utf8(&file_data) {
			Some(converted_bytes.to_owned());
		}
	}

	None
}

/// Tries to write the given data to a file at the given path.
/// The function will try to create the file and its parent-directories if the file doesn't exist already.
/// Returns true if it could write successfully, in all other cases the functions returns false.
pub fn safely_write_file(path: &Path, data: String) -> bool {
	let mut path_without_file = PathBuf::from(path);
	path_without_file.pop();

	let _ = fs::create_dir_all(path_without_file);

	match fs::write(&path, &data) {
		Ok(_nothing) => true,
		Err(_err) => false,
	}
}

/// Contains the two variants a stored file can be written to or read from.
pub enum FileLocation {
	/// location of the config-file in the file-system
	Config,
	/// location of the backups-file in the file-system
	Backups,
}

/// Converts the `file_location` to an usable path on different operating systems.
pub fn convert_location_to_path(file_location: FileLocation) -> PathBuf {
	match file_location {
		FileLocation::Config => get_config_file_location(),
		FileLocation::Backups => get_backups_file_location(),
	}
}

/// Helper function that returns the correct config-file location on Windows.
#[cfg(target_family = "windows")]
fn get_config_file_location() -> PathBuf {
	PathBuf::from(format!("C:/Users/{}/AppData/Roaming/.rexup/config.json", whoami::username()))
}

/// Helper function that returns the correct config-file location on Linux.
#[cfg(target_family = "unix")]
fn get_config_file_location() -> PathBuf {
	PathBuf::from(format!("/home/{}/.rexup/config.json", whoami::username()))
}

/// Helper function that returns the correct backups-file location on Windows.
#[cfg(target_family = "windows")]
fn get_backups_file_location() -> PathBuf {
	PathBuf::from(format!("C:/Users/{}/AppData/Roaming/.rexup/backups.json", whoami::username()))
}

/// Helper function that returns the correct backups-file location on Linux.
#[cfg(target_family = "unix")]
fn get_backups_file_location() -> PathBuf {
	PathBuf::from(format!("/home/{}/.rexup/backups.json", whoami::username()))
}
