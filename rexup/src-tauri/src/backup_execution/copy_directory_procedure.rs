use std::{ fs::{ self, File }, path::{ Path, PathBuf }, vec };

use zip::ZipWriter;

use crate::{ BackupEntryFilters, BackupExecutionLog };

use super::copy_file_procedure;

/// Calls either `copy_file_procedure` on files or `copy_directory_procedure` on directories recursively by reading all entries on the given `origin`.
/// The name of origin is pushed/joined to the `relative_target` which is passed to subsequent function calls.
///
/// ## Note:
/// Every `entry` that cannot be read is automatically skipped.
/// This means that `copy_file_procedure` or `copy_directory_procedure` is not called on this specific `entry` but a describing log is still added to the returned Vec<BackupExecutionLog>.
///
/// ## Returns:
/// This function returns an `Vec<BackupExecutionLog>` containing information about the backup-execution.
/// If the directory at the given `origin` cannot be read or the given `origin`'s `file_name` is `None`, the function returns an `Vec` with one `BackupExecutionLog`
/// that describes this occurence.
pub fn copy_directory_procedure(
	origin: &Path,
	relative_target: &Path,
	parent_path: &Path,
	mut zip_writer: &mut Option<ZipWriter<File>>,
	fiters: &BackupEntryFilters
) -> Vec<BackupExecutionLog> {
	match fs::read_dir(origin) {
		Ok(readable_dir) => {
			// Push the name of the current directory to the relative_target so the nested structure is kept in subsequent calls
			let origin_file_name = match origin.file_name() {
				Some(file_name) => file_name,
				None => {
					return vec![
						BackupExecutionLog::ErrorCopying(
							format!(
								"Couldn't get the origin's file_name of '{:?}'. Therefore, copying this directory is not possible.",
								origin
							)
						)
					];
				}
			};

			let new_path_segment_in_relative_target =
				PathBuf::from(relative_target).join(origin_file_name);

			let mut logs: Vec<BackupExecutionLog> = vec![];

			for entry in readable_dir {
				match entry {
					Ok(readable_entry) => {
						let entry_path = readable_entry.path();

						if entry_path.is_file() {
							let file_logs = copy_file_procedure(
								&entry_path,
								&new_path_segment_in_relative_target,
								parent_path,
								&mut zip_writer,
								&fiters
							);

							if let Some(file_logs) = file_logs {
								logs.push(file_logs);
							}
						} else if entry_path.is_dir() {
							let mut dir_logs = copy_directory_procedure(
								&entry_path,
								&new_path_segment_in_relative_target,
								parent_path,
								&mut zip_writer,
								&fiters
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
