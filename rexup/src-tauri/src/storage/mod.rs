//! Contains logic to store and read files on the user's file-system.

mod write_read;

use serde::{ Deserialize, Serialize };
use write_read::{ safely_read_file, safely_write_file, convert_location_to_path, FileLocation };

use crate::Backup;

/// Tries to return the content of the user's config-file as a `String`.
///
/// ## Returns:
/// Returns the content of the user's config-file as a `String`.
/// If the `safely_read_file`-function returns `None`, this function returns an empty JSON-object like this: `{}`.
#[tauri::command]
pub fn read_config_file() -> String {
	match safely_read_file(&convert_location_to_path(FileLocation::Config)) {
		Some(read_value) => read_value,
		None => "{}".to_owned(),
	}
}

/// Tries to return the content of the user's backups-file as a `String`.
///
/// ## Returns:
/// Returns the content of the user's backups-file as a `String`.
/// If the `safely_read_file`-function returns `None`, this function returns an empty JSON-array like this: `[]`.
#[tauri::command]
pub fn read_backup_file() -> String {
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

/// Tries to write the given value to the user's config-file.
///
/// ## Returns:
/// Always returns nothing, even if the conversion to JSON fails or the `safely_write_file`-function returns false.
#[tauri::command]
pub fn write_config_file(value: Config) {
	if let Ok(data) = serde_json::to_string(&value) {
		safely_write_file(&convert_location_to_path(FileLocation::Config), data);
	}
}

/// Tries to write the given value to the user's backups-file.
///
/// ## Returns:
/// Always returns nothing, even if the conversion to JSON fails or the `safely_write_file`-function returns false.
#[tauri::command]
pub fn write_backup_file(value: Vec<Backup>) {
	if let Ok(data) = serde_json::to_string(&value) {
		safely_write_file(&convert_location_to_path(FileLocation::Backups), data);
	}
}
