//! Contains logic to store and read files on the user's file-system.

mod write_read;

use serde::{ Deserialize, Serialize };
use write_read::{ safely_read_file, safely_write_file };

use crate::{ path_utils::{ get_backups_file_path, get_config_file_path }, Backup };

/// Reads the contents of the configuration file as a `String`.
///
/// # Returns
/// The function returns the contents as a `String` or an empty JSON object (`"{}"`)
/// if the file cannot be read or doesn't exist.
#[tauri::command]
pub fn read_config_file() -> String {
	match safely_read_file(&get_config_file_path()) {
		Some(read_value) => read_value,
		None => "{}".to_owned(),
	}
}

/// Reads the contents of the backups file as a `String`.
///
/// # Returns
/// The function returns the contents as a `String` or an empty JSON array (`"[]"`)
/// if the file cannot be read or doesn't exist.
#[tauri::command]
pub fn read_backups_file() -> String {
	match safely_read_file(&get_backups_file_path()) {
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
/// to the file located at the returned `PathBuf` by calling `get_config_file_path()`.
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
	if let Ok(data) = serde_json::to_string_pretty(&value) {
		return safely_write_file(&get_config_file_path(), data);
	}

	false
}

/// Writes the given list of backups to the backups file.
///
/// This function serializes a `Vec<Backup>` to a JSON string and writes it to the file
/// located at the returned `PathBuf` by calling `get_backups_file_path()`.
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
	if let Ok(data) = serde_json::to_string_pretty(&value) {
		return safely_write_file(&get_backups_file_path(), data);
	}

	false
}
