use serde::Deserialize;
use serde::Serialize;

mod storage;
mod path_selector;
mod backup_execution;
mod extra;
mod path_utils;
mod global_texts;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder
		::default()
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(
			tauri::generate_handler![
				// Read and write the config and backup files
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
	location: String,
	executions: Vec<String>,
	logs_of_last_execution: Vec<BackupExecutionLog>,
}

/// The shape of an `BackupEntry` that is stored in a `Backup`.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntry {
	id: String,
	name: String,
	origin: BackupEntryOrigin,
	target: String,
	rename_to: String,
	is_active: bool,
	variant: Option<FileOrDirectory>,
	filters: BackupEntryFilters,
}

/// The shape of an `BackupEntryOrigin` that is stored in a `BackupEntry`.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntryOrigin {
	active_mode: BackupEntryOriginMode,
	commands: Vec<String>,
	local_file_system: String,
}

/// The possible modes of the origin in a `BackupEntryOrigin`.
#[derive(Debug, Serialize, Deserialize)]
pub enum BackupEntryOriginMode {
	Commands,
	LocalFileSystem,
}

/// The shape of filters every `BackupEntry` has.
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntryFilters {
	max_size_in_mb: Option<u32>,
	mode: BackupEntryFiltersMode,
	path_elements: Vec<String>,
	file_names: Vec<String>,
}

/// The possible modes of filters in a `BackupEntry`.
#[derive(Debug, Serialize, Deserialize)]
pub enum BackupEntryFiltersMode {
	Include,
	Exclude,
}

/// The shape of an `BackupExecutionLog` that is stored in a `Backup`.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum BackupExecutionLog {
	Finished(String),
	Information(String),
	ErrorCopying(String),
	SuccessExecutingCommand {
		command: String,
		to_path: String,
	},
	SuccessCopyingFileOrDirectory {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
	},
	IgnoreCopyingFile {
		from_path: String,
		to_path: String,
		reason: IgnoreFileReason,
	},
}

/// The possible reasons why a file is ignored in the copy-process.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum IgnoreFileReason {
	/// The file has not the correct path elements
	WrongPathElements,
	/// The file has not the correct name
	WrongName,
	/// The file is too large
	TooLargeSize,
}
