use serde::Deserialize;
use serde::Serialize;

pub mod storage;
pub mod path_selector;
pub mod backup_execution;
pub mod extra;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder
		::default()
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(
			tauri::generate_handler![
				// Read and write the config- and backups-files
				storage::read_config_file,
				storage::read_backups_file,
				storage::write_config_file,
				storage::write_backups_file,
				// Path-Selector
				path_selector::list_contents_of::list_contents_of,
				path_selector::get_user_path_to::get_user_path_to,
				path_selector::get_remaining_drives::get_remaining_drives,
				// Backup execution
				backup_execution::execute_backup,
				// Extra functionality
				extra::has_write_access_to::has_write_access_to,
				extra::delete_all_data::delete_all_data,
				extra::get_variant_of_path::get_variant_of_path
			]
		)
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

/// A global enum that is used when some "thing" is a file or a directory.
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum FileOrDirectory {
	// The "thing" in a directory is a file.
	File,
	// The "thing" in a directory is another directory.
	Directory,
}

/// Expected shape from the frontend when saving a backup.
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

/// The shape of an `BackupEntry` that is stored in a `Backup`.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntry {
	id: String,
	name: String,
	origin: String,
	target: String,
	is_active: bool,
	variant: Option<FileOrDirectory>,
	filters: BackupEntryFilters,
}

/// The shape of the filters every `BackupEntry` has.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntryFilters {
	max_size_in_mb: Option<u32>,
	included_file_extensions: Option<Vec<String>>,
	included_file_names: Option<Vec<String>>,
}

/// The shape of an `BackupExecutionLog` that are stored in a `Backup`.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum BackupExecutionLog {
	Finished(String),
	Information(String),
	ErrorCopying(String),
	SuccessCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
	},
	IgnoreCopying {
		from_path: String,
		to_path: String,
		reason: IgnoreFileReason,
	},
}

/// The possible reasons why a file is ignored when it's copied.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum IgnoreFileReason {
	/// The file has not the correct name
	WrongName,
	/// The file has not the correct file-extension
	WrongExtension,
	/// The file is too large
	TooLargeSize,
}
