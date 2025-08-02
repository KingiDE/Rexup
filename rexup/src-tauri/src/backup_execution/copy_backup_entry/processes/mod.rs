//! Contains logic to copy files and directories from the specified origin into a backup directory or zip file.

use std::{ ffi::OsStr, fs::{ self, File }, path::{ Path, PathBuf } };
use zip::ZipWriter;
use crate::{ global_texts, BackupEntryFilters, BackupExecutionLog };
use do_filters_apply::do_filters_apply;

mod copy_file;
mod zip_file;

mod do_filters_apply;

/// Delegates the copying process to either `copy_file` or `zip_file` depending on the value of `zip_writer` but does some shared work before.
/// It checks if the filters apply and reads the file. The it calls these subfunctions with only the required arguments.
///
/// # Arguments
/// - `origin` - Path to the origin (which in this case is a file).
/// - `parent_path` - Path to the backup root location (only of use if `zip_writer` is `None`).
/// - `zip_writer` - An optional `ZipWriter<File>` that handles writing to zip files.
/// - `relative_target` - Relative path from the backup root location to the target location (but without the ending file name).
/// - `file_name` - The file name that is written to.
/// - `filters` - Optional backup entry filters (like allowed names, path elements and size limits) applied before copying.
///
/// # Returns
/// `Some(BackupExecutionLog)` if an error occurs in this function or one of these ones: `copy_file` and `zip_file`.
/// If everything works fine, it returns `None`.
pub fn copy_file_process(
	origin: &Path,
	parent_path: &Path,
	zip_writer: &mut Option<ZipWriter<File>>,
	relative_target: &Path,
	file_name: &OsStr,
	filters: Option<&BackupEntryFilters>
) -> Option<BackupExecutionLog> {
	let relative_target_and_file_name = relative_target.join(file_name);

	match filters {
		Some(actual_filters) => {
			// Check if the filters can be passed and return the correct reason if not
			if let Some(ignore_reason) = do_filters_apply(origin, actual_filters) {
				return Some(BackupExecutionLog::IgnoreCopyingFile {
					from_path: origin.to_string_lossy().to_string(),
					to_path: relative_target_and_file_name.to_string_lossy().to_string(),
					reason: ignore_reason,
				});
			}
		}
		None => {
			// Don't check anything
		}
	}

	// Read the contents of the original file
	let file_contents = match fs::read(origin) {
		Ok(contents) => contents,
		Err(_err) => {
			return Some(BackupExecutionLog::ErrorCopying(global_texts::file_not_read(origin)));
		}
	};

	match zip_writer {
		Some(writer) => {
			return zip_file::zip_file(origin, writer, relative_target, file_name, file_contents);
		}
		None => {
			return copy_file::copy_file(origin, parent_path, relative_target, file_name, file_contents);
		}
	}
}

/// Copies a directory recursively by going through every entry and calling either `copy_directory_process` or `copy_file_process`.
///
/// # Arguments
/// - `origin` - Path to the origin (which in this case is a directory).
/// - `parent_path` - Path to the backup root location (only of use if `zip_writer` is `None`).
/// - `zip_writer` - An optional `ZipWriter<File>` that handles writing to zip files.
/// - `relative_target` - Relative path from the backup root location to the target location (but without the ending file name).
/// - `dir_name` - The directory name that is used in the backup. It's appended to the `relative_target` to preserve nested directories.
/// - `filters` - Optional backup entry filters (like allowed names, path elements and size limits) applied before copying.
///
/// # Returns
/// A `Vec<BackupExecutionLog>` that contains collected logs from the recursive function calls.
pub fn copy_directory_process(
	origin: &Path,
	parent_path: &Path,
	zip_writer: &mut Option<ZipWriter<File>>,
	relative_target: &Path,
	dir_name: &OsStr,
	filters: Option<&BackupEntryFilters>
) -> Vec<BackupExecutionLog> {
	match fs::read_dir(origin) {
		Ok(readable_dir) => {
			let new_path_segment_in_relative_target = PathBuf::from(relative_target).join(dir_name);

			let mut logs: Vec<BackupExecutionLog> = vec![];

			for entry in readable_dir {
				match entry {
					Ok(readable_entry) => {
						let entry_path = readable_entry.path();

						if let Some(file_or_dir_name) = entry_path.file_name() {
							if entry_path.is_file() {
								let file_logs = copy_file_process(
									&entry_path,
									&parent_path,
									zip_writer,
									&new_path_segment_in_relative_target,
									file_or_dir_name,
									filters
								);

								if let Some(file_logs) = file_logs {
									logs.push(file_logs);
								}
							} else if entry_path.is_dir() {
								let mut dir_logs = copy_directory_process(
									&entry_path,
									parent_path,
									zip_writer,
									&new_path_segment_in_relative_target,
									file_or_dir_name,
									filters
								);

								logs.append(&mut dir_logs);
							}
						}
					}
					Err(error) => {
						logs.push(
							BackupExecutionLog::ErrorCopying(global_texts::entry_not_read(error, origin))
						);
					}
				}
			}

			return logs;
		}
		Err(_err) => {
			vec![BackupExecutionLog::ErrorCopying(global_texts::directory_not_read(origin))]
		}
	}
}
