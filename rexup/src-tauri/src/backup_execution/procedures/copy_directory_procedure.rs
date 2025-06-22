use std::{ ffi::OsStr, fs::{ self, File }, path::{ Path, PathBuf }, vec };
use zip::ZipWriter;

use crate::{
	backup_execution::procedures::copy_file_procedure,
	BackupEntryFilters,
	BackupExecutionLog,
};

/// Recursively copies the contents of a directory into the backup location.
///
/// For each entry in the directory, it checks if it’s a file or subdirectory,
/// applies filters, and copies accordingly.
///
/// # Arguments
/// * `origin` - Path to the directory to be copied.
/// * `relative_target` - The relative target path within the backup.
/// * `parent_path` - The base backup directory or zip root.
/// * `file_or_dir_name` - The name of the directory to be created in the target.
/// * `zip_writer` - Optional ZipWriter used for zip file creation.
/// * `filters` - Filters applied to the files during copying.
///
/// # Returns
/// A `Vec<BackupExecutionLog>` containing logs of each success, ignore, or error event.
pub fn copy_directory_procedure(
	origin: &Path,
	relative_target: &Path,
	parent_path: &Path,
	file_or_dir_name: &OsStr,
	mut zip_writer: &mut Option<ZipWriter<File>>,
	filters: &BackupEntryFilters
) -> Vec<BackupExecutionLog> {
	match fs::read_dir(origin) {
		Ok(readable_dir) => {
			let new_path_segment_in_relative_target =
				PathBuf::from(relative_target).join(file_or_dir_name);

			let mut logs: Vec<BackupExecutionLog> = vec![];

			for entry in readable_dir {
				match entry {
					Ok(readable_entry) => {
						let entry_path = readable_entry.path();

						if entry_path.is_file() {
							if let Some(file_name) = entry_path.file_name() {
								let file_logs = copy_file_procedure(
									&entry_path,
									&new_path_segment_in_relative_target,
									parent_path,
									file_name,
									&mut zip_writer,
									&filters
								);

								if let Some(file_logs) = file_logs {
									logs.push(file_logs);
								}
							}
						} else if entry_path.is_dir() {
							let mut dir_logs = copy_directory_procedure(
								&entry_path,
								&new_path_segment_in_relative_target,
								parent_path,
								file_or_dir_name,
								&mut zip_writer,
								&filters
							);

							logs.append(&mut dir_logs);
						}
					}
					Err(_err) => {
						logs.push(
							BackupExecutionLog::ErrorCopying(
								format!(
									"An entry in {:?} is not readable. No further information is available",
									origin
								)
							)
						);
					}
				}
			}

			return logs;
		}
		Err(_err) => {
			vec![
				BackupExecutionLog::ErrorCopying(
					format!(
						"The directory at {:?} is not readable. Therefore, copying this directory is not possible.",
						origin
					)
				)
			]
		}
	}
}
