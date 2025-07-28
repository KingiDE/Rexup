//! Copies a given file to a new location in a zip file.

use std::{ ffi::OsStr, fs::File, io::Write, path::Path };
use zip::{ write::SimpleFileOptions, ZipWriter };

use crate::{ BackupExecutionLog };

/// Handles copying of an individual file to a zip file.
///
/// # Arguments
/// * `origin` - Path to the source file.
/// * `zip_writer` - Zip writer that allows writing to the zip file the backup consists of.
/// * `relative_target` - Path within the backup destination relative to the backup root but without the file name.
/// * `file_name` - Name of the file to be copied.
/// * `file_contents` - The contents of the source file as `Vec<u8>`.
///
/// # Returns
/// `Some(BackupExecutionLog)` if an error occurs or `None` if the file was successfully copied with no issues.
pub fn zip_file(
	origin: &Path,
	zip_writer: &mut ZipWriter<File>,
	relative_target: &Path,
	file_name: &OsStr,
	file_contents: Vec<u8>
) -> Option<BackupExecutionLog> {
	let relative_target_and_file_name = relative_target.join(file_name);

	// Start a new file in the correct relative location inside the zip file
	if
		let Err(_err) = zip_writer.start_file_from_path(
			&relative_target_and_file_name,
			SimpleFileOptions::default()
		)
	{
		return Some(
			BackupExecutionLog::ErrorCopying(
				format!(
					"The zip-writer couldn't start a new file at {:?}. Therefore, the file at {:?} can't be copied.",
					relative_target_and_file_name,
					origin
				)
			)
		);
	}

	if let Err(_err) = zip_writer.write(&file_contents) {
		return Some(
			BackupExecutionLog::ErrorCopying(
				format!(
					"The zip-writer couldn't write to the file at {:?} inside the zip-file. Therefore, this file at {:?} can't be copied.",
					relative_target_and_file_name,
					origin
				)
			)
		);
	}

	None
}
