use std::fs;

use crate::path_utils::get_config_directory;

/// Deletes all data stored by Rexup by removing the entire parent data directory.
///
/// This function determines the directory where Rexup stores its data,
/// depending on the operating system, and attempts to remove that directory
/// and all its contents using `fs::remove_dir_all`.
///
/// On **Windows**, this typically targets:
/// `C:/Users/{username}/AppData/Roaming/rexup`
///
/// On **Linux**, this typically targets:
/// `/home/{username}/rexup`
///
/// # Note
/// If the directory does not exist or the removal fails, the error is ignored silently.
#[tauri::command]
pub fn delete_all_data() {
	let _ = fs::remove_dir_all(&get_config_directory());
}
