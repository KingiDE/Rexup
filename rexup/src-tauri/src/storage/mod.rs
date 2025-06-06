//! Contains logic to store and read files on the user's file-system.

mod write_read;

use serde::{ Deserialize, Serialize };
use write_read::{ safely_read_file, safely_write_file, convert_location_to_path, FileLocation };

use crate::Backup;

/// Reads the contents of the configuration file.
///
/// This function attempts to read the file located at the path corresponding to
/// `FileLocation::Config`. If successful, it returns the file content as a `String`.
/// If the file cannot be read or doesn't exist, it returns a default empty JSON object (`"{}"`).
///
/// # Returns
///
/// A `String` containing the configuration data, or `"{}"` if reading fails.
#[tauri::command]
pub fn read_config_file() -> String {
	match safely_read_file(&convert_location_to_path(FileLocation::Config)) {
		Some(read_value) => read_value,
		None => "{}".to_owned(),
	}
}

/// Reads the contents of the backups file.
///
/// This function attempts to read the file located at the path corresponding to
/// `FileLocation::Backups`. If successful, it returns the file content as a `String`.
/// If the file cannot be read or doesn't exist, it returns a default empty JSON array (`"[]"`).
///
/// # Returns
///
/// A `String` containing the backup data, or `"[]"` if reading fails.
#[tauri::command]
pub fn read_backups_file() -> String {
	match safely_read_file(&convert_location_to_path(FileLocation::Backups)) {
		Some(read_value) => read_value,
		None => "[]".to_owned(),
	}
}

/// Expected shape from the frontend when saving the config-file.
#[derive(Deserialize, Serialize, Debug)]
pub struct Config {
	show_backup_execution_history: bool,
}

/// Writes the given configuration data to the configuration file.
///
/// This function serializes the provided `Config` object to a JSON string and writes it
/// to the file located at the path determined by `FileLocation::Config`. If serialization
/// or writing fails, it returns `false`.
///
/// # Parameters
///
/// - `value`: A `Config` instance representing the configuration data to write.
///
/// # Returns
///
/// `true` if the configuration was successfully serialized and written to the file, `false` otherwise.
#[tauri::command]
pub fn write_config_file(value: Config) -> bool {
	if let Ok(data) = serde_json::to_string(&value) {
		return safely_write_file(&convert_location_to_path(FileLocation::Config), data);
	}

	false
}

/// Writes the given list of backups to the backups file.
///
/// This function serializes a `Vec<Backup>` to a JSON string and writes it to the file
/// located at the path determined by `FileLocation::Backups`. If serialization
/// or writing fails, it returns `false`.
///
/// # Parameters
///
/// - `value`: A vector of `Backup` structs representing the backup data to write.
///
/// # Returns
///
/// `true` if the backups were successfully serialized and written to the file, `false` otherwise.
#[tauri::command]
pub fn write_backups_file(value: Vec<Backup>) -> bool {
	if let Ok(data) = serde_json::to_string(&value) {
		return safely_write_file(&convert_location_to_path(FileLocation::Backups), data);
	}

	false
}
