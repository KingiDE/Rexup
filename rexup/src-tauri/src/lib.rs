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
				storage::read_backup_file,
				storage::write_config_file,
				storage::write_backup_file,
				// Path-Selector
				path_selector::list_contents_of,
				path_selector::get_user_path_to,
				path_selector::get_remaining_drives,
				// TODO: Make useable; Backup execution
				// backup_execution::create_backup_parent_directory,
				// backup_execution::copy_backup_entry,
				// Extra functionality
				extra::has_write_access_to,
				extra::delete_all_data,
				extra::get_variant_of_path
			]
		)
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

/// A global enum that is used when some "thing" is a file or a directory.
#[derive(Debug, Serialize, Deserialize)]
pub enum FileOrDirectory {
	// The "thing" in a directory is a file.
	File,
	// The "thing" in a directory is another directory.
	Directory,
}
