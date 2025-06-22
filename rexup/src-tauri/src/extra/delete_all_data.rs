use std::{ fs, path::PathBuf };

/// Deletes all data stored by Rexup by removing the entire parent data directory.
///
/// This function determines the directory where Rexup stores its data,
/// depending on the operating system, and attempts to remove that directory
/// and all its contents using `fs::remove_dir_all`.
///
/// On **Windows**, this typically targets:
/// `C:/Users/{username}/AppData/Roaming/.rexup`
///
/// On **Linux**, this typically targets:
/// `/home/{username}/.rexup`
///
/// # Note
/// If the directory does not exist or the removal fails (due to permission
/// issues or other reasons), the error is ignored silently.
#[tauri::command]
pub fn delete_all_data() {
	let _ = fs::remove_dir_all(&get_parent_directory());
}

/// Helper function that returns the correct directory where Rexup stores its data on Windows.
#[cfg(target_family = "windows")]
fn get_parent_directory() -> PathBuf {
	PathBuf::from(format!("C:/Users/{}/AppData/Roaming/.rexup", whoami::username()))
}

/// Helper function that returns the correct directory where Rexup stores its data on Linux.
#[cfg(target_family = "unix")]
fn get_parent_directory() -> PathBuf {
	PathBuf::from(format!("/home/{}/.rexup", whoami::username()))
}
