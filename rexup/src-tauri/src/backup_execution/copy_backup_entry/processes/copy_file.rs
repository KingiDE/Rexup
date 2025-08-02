//! Copies a given file to a new location in a "default" directory.

use std::{ ffi::OsStr, fs, path::Path };

use crate::{ global_texts, BackupExecutionLog };

/// Handles copying of an individual file to a target directory.
///
/// # Arguments
/// * `origin` - Path to the source file.
/// * `parent_path` - Path to the root of the backup location.
/// * `relative_target` - Path within the backup destination relative to the backup root but without the file name.
/// * `file_name` - Name of the file to be copied.
/// * `file_contents` - The contents of the source file as `Vec<u8>`.
///
/// # Returns
/// `Some(BackupExecutionLog)` if an error occurs or `None` if the file was successfully copied with no issues.
pub fn copy_file(
	origin: &Path,
	parent_path: &Path,
	relative_target: &Path,
	file_name: &OsStr,
	file_contents: Vec<u8>
) -> Option<BackupExecutionLog> {
	let parent_directory_and_relative_target = &parent_path.join(&relative_target);

	// Create the required subdirectories in the backup parent directory
	if let Err(_err) = fs::create_dir_all(&parent_directory_and_relative_target) {
		return Some(
			BackupExecutionLog::ErrorCopying(
				global_texts::subdirectories_for_file_in_backup_parent_not_created(relative_target, origin)
			)
		);
	}

	// Then, the file name can be appended to this path...
	let entire_filepath = parent_directory_and_relative_target.join(file_name);

	// ...and the original file contents can be copied to the new location
	if let Err(_err) = fs::write(entire_filepath, file_contents) {
		return Some(
			BackupExecutionLog::ErrorCopying(
				global_texts::file_not_copied(origin, relative_target.join(file_name))
			)
		);
	}

	None
}
