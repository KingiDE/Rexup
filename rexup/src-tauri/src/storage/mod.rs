//! Contains logic to store and read files on the user's file-system.

mod write_read;

use serde::{ Deserialize, Serialize };
use write_read::{ safely_read_file, safely_write_file, convert_location_to_path, FileLocation };
use crate::FileOrDirectory;

/// Tries to return the value of the user's config-file. If the file cannot be read, the function returns an empty JSON-object "{}".
#[tauri::command]
pub fn read_config_file() -> String {
	match safely_read_file(&convert_location_to_path(FileLocation::Config)) {
		Some(read_value) => read_value,
		None => "{}".to_owned(),
	}
}

/// Tries to return the value of the user's backups-file. If the file cannot be read, the function returns an empty JSON-array "[]".
#[tauri::command]
pub fn read_backup_file() -> String {
	match safely_read_file(&convert_location_to_path(FileLocation::Backups)) {
		Some(read_value) => read_value,
		None => "[]".to_owned(),
	}
}

/// Expected argument from the frontend when saving the config-file.
#[derive(Deserialize, Serialize, Debug)]
pub struct Config {
	show_backup_execution_history: bool,
}

/// Expected argument from the frontend when saving a backup.
#[derive(Debug, Serialize, Deserialize)]
pub struct Backup {
	id: String,
	name: String,
	entries: Vec<BackupEntry>,
	is_zipped: bool,
	location: Option<String>,
	executions: Vec<String>,
	logs_of_last_execution: Vec<BackupExecutionLog>,
}

/// The shape of an BackupExecutionLog that is stored in a backup.
#[derive(Debug, Serialize, Deserialize)]
pub enum BackupExecutionLog {
	Information(String),
	SuccessCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
	},
	ErrorCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
		reason: String,
	},
	IgnoreCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
		reason: String,
	},
}

/// The shape of an BackupEntry that is stored in a backup.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntry {
	id: String,
	name: String,
	variant: Option<FileOrDirectory>,
	origin: Option<String>,
	target: Option<String>,
	is_active: bool,
	filters: BackupEntryFilters,
}

/// The shape of the filters every backup-entry has.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntryFilters {
	pub max_size_in_mb: Option<u32>,
	pub included_file_extensions: Option<Vec<String>>,
	pub included_file_names: Option<Vec<String>>,
}

/// Tries to write the given value in the user's config-file. Even if the file cannot be written to, the function returns nothing.
#[tauri::command]
pub fn write_config_file(value: Config) {
	if let Ok(data) = serde_json::to_string(&value) {
		safely_write_file(&convert_location_to_path(FileLocation::Config), data);
	}
}

/// Tries to write the given value in the user's backups-file. Even if the file cannot be written to, the function returns nothing.
#[tauri::command]
pub fn write_backup_file(value: Vec<Backup>) {
	if let Ok(data) = serde_json::to_string(&value) {
		safely_write_file(&convert_location_to_path(FileLocation::Backups), data);
	}
}
