use std::{ ffi::OsStr, fs::{ self, File }, io::Write, path::Path };
use zip::{ write::SimpleFileOptions, ZipWriter };

use crate::{
	backup_execution::procedures::do_filters_apply::do_filters_apply,
	BackupEntryFilters,
	BackupExecutionLog,
};

/// Handles copying of an individual file either to the filesystem or into a zip archive.
///
/// Applies file filters before copying. If the file is filtered out, a reason is returned.
/// Supports fallback between writing to the filesystem and writing to a zip archive.
///
/// # Arguments
/// * `origin` - Path to the source file.
/// * `relative_target` - Path within the backup destination relative to the backup root.
/// * `parent_path` - Path to the root of the backup location.
/// * `file_name` - Name of the file to be copied.
/// * `zip_writer` - Optional ZipWriter used to write files into a zip archive.
/// * `filters` - Backup filters such as allowed file names, extensions, or size limits.
///
/// # Returns
/// `Some(BackupExecutionLog)` if a log-worthy event occurs (e.g., ignore, error),
/// or `None` if the file was successfully copied with no issues.
pub fn copy_file_procedure(
	origin: &Path,
	relative_target: &Path,
	parent_path: &Path,
	file_name: &OsStr,
	zip_writer: &mut Option<ZipWriter<File>>,
	filters: &BackupEntryFilters
) -> Option<BackupExecutionLog> {
	// Check if the filters can be validated and return the correct reason if not
	if let Some(ignore_reason) = do_filters_apply(origin, file_name, filters) {
		return Some(BackupExecutionLog::IgnoreCopying {
			from_path: origin.to_string_lossy().to_string(),
			to_path: relative_target.join(file_name).to_string_lossy().to_string(),
			reason: ignore_reason,
		});
	}

	// Read the contents of the original file
	let file_contents = match fs::read(origin) {
		Ok(contents) => contents,
		Err(_err) => {
			return Some(
				BackupExecutionLog::ErrorCopying(
					format!("The file at {:?} could not be read and therefore not be copied.", origin)
				)
			);
		}
	};

	match zip_writer {
		Some(zip_writer) => {
			// ...and then write to the opened zip-file at the relative_target + file_name
			match
				zip_writer.start_file_from_path(
					relative_target.join(file_name),
					SimpleFileOptions::default()
				)
			{
				Ok(_nothing) => {}
				Err(_err) => {
					return Some(
						BackupExecutionLog::ErrorCopying(
							format!(
								"The zip-writer couldn't start a new file at {:?}. Therefore, this file at {:?} can't be copied.",
								relative_target.join(file_name),
								origin
							)
						)
					);
				}
			}

			match zip_writer.write(&file_contents) {
				Ok(_nothing) => {}
				Err(_err) => {
					return Some(
						BackupExecutionLog::ErrorCopying(
							format!(
								"The zip-writer couldn't write to the file at {:?} inside the zip-file. Therefore, this file at {:?} can't be copied.",
								relative_target.join(file_name),
								origin
							)
						)
					);
				}
			}
		}
		None => {
			let parent_directory_and_relative_target = &parent_path.join(&relative_target);

			// Create the required subdirectories in the backup-parent-directory
			match fs::create_dir_all(&parent_directory_and_relative_target) {
				Ok(_nothing) => {}
				Err(_err) => {
					return Some(
						BackupExecutionLog::ErrorCopying(
							format!(
								"The subdirectories at {:?} inside the backup-parent-directory couldn't be created. Therefore, this file at {:?} can't be copied.",
								parent_directory_and_relative_target,
								origin
							)
						)
					);
				}
			}

			// Then, the file_name can be appended to this path...
			let entire_filepath = parent_directory_and_relative_target.join(file_name);

			// ...and the original file-data can be copied to the new location
			match fs::write(entire_filepath, file_contents) {
				Ok(_nothing) => {}
				Err(_err) => {
					return Some(
						BackupExecutionLog::ErrorCopying(
							format!(
								"The file at {:?} couldn't be written to {:?}. Therefore, this file at {:?} can't be copied.",
								origin,
								relative_target.join(file_name),
								origin
							)
						)
					);
				}
			}
		}
	}

	None
}
