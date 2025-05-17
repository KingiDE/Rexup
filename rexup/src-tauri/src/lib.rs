#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder
		::default()
		.plugin(tauri_plugin_opener::init())
		.invoke_handler(
			tauri::generate_handler![
				storage::read_config_file,
				storage::read_backup_file,
				storage::write_config_file,
				storage::write_backup_file,
				backup::copy_origin_to_target,
				backup::create_backup_parent_folder,
				path_selector_ui::get_user_path_to,
				path_selector_ui::read_contents_of,
				path_selector_ui::get_remaining_drives
			]
		)
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

//
// SECTION: Read and write config and save-files
//
pub mod storage;

//
// SECTION: Execute backups
//
pub mod backup;

//
// SECTION: Path-Selector-UI
//
pub mod path_selector_ui;
