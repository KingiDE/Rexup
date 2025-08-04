use std::{ fs::{ self, OpenOptions }, path::Path };
use chrono::Utc;

/// Checks whether the current process has write access to the specified directory path.
///
/// This function attempts to create a temporary file in the provided directory to verify
/// write permissions. The temporary file is uniquely named using the current timestamp
/// (in nanoseconds since the Unix epoch) to avoid conflicts with existing files.
///
/// # Returns
/// If the file is successfully created and then deleted, the function returns `true`,
/// indicating that write access is available. If any step fails (file creation or deletion),
/// it returns `false`.
///
/// # Parameters
/// - `path`: A `String` representing the absolute or relative path to the directory
///   where write access should be checked.
///
/// # Notes
/// - The test file is not guaranteed to be removed if the process fails or is terminated
///   between file creation and deletion.
#[tauri::command]
pub fn has_write_access_to(path: String) -> bool {
	let file_path = Path::new(&path).join(&format!("temp_rexup_{}", Utc::now().timestamp_millis()));

	if let Ok(_) = OpenOptions::new().write(true).create_new(true).open(&file_path) {
		if let Ok(_) = fs::remove_file(&file_path) {
			return true;
		}
	}

	false
}
