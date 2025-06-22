use std::{ fs::File, path::{ Path, PathBuf } };
use zip::ZipWriter;

use crate::{
	backup_execution::procedures::{ copy_file_procedure, copy_directory_procedure },
	BackupEntryFilters,
	BackupExecutionLog,
	FileOrDirectory,
};

/// Copies a file or directory from the `origin` to a `target` within a backup context.
///
/// This function determines whether the given origin is a file or a directory and delegates the copying
/// to either `copy_file_procedure` or `copy_directory_procedure`. It also handles path resolution and
/// error logging.
///
/// # Arguments
/// * `origin` - A `String` representing the full path of the file or directory to copy.
/// * `target` - A `String` representing the relative path where the file or directory should be placed in the backup.
/// * `parent_path` - The base path of the backup (e.g., root of zip or folder destination).
/// * `zip_writer` - A mutable reference to an optional `ZipWriter`, used if writing into a zip archive.
/// * `filters` - Backup entry filters (like allowed extensions, size limits) applied before copying.
///
/// # Returns
/// An `Vec<BackupExecutionLog>`:
/// * `vec![...]` - A list of logs related to the copying process.
pub fn copy_backup_entry(
	origin: String,
	target: String,
	parent_path: &PathBuf,
	mut zip_writer: &mut Option<ZipWriter<File>>,
	filters: BackupEntryFilters
) -> Vec<BackupExecutionLog> {
	// The location of the original file or directory
	// Example: "C:/Users/{username}/Downloads/file_to_copy.txt" or "C:/Users/{username}/Downloads/directory_to_copy"
	let origin_path = Path::new(&origin);

	// The relative path inside the parent-directory
	// Example: "someSubdir/anotherDir" (Note: the prefix "/" gets removed below)
	let mut corrected_relative_target = Path::new(&target);

	if corrected_relative_target.starts_with("/") {
		match corrected_relative_target.strip_prefix("/") {
			Ok(path) => {
				corrected_relative_target = path;
			}
			Err(_err) => {
				return vec![
					BackupExecutionLog::ErrorCopying(
						format!("Couldn't strip the target's prefix of '{}'. Therefore, copying backup-entry is not possible.", target)
					)
				];
			}
		};
	}

	// The path to the parent-directory that already contains the name of the backup
	// Example: "C:/Users/{username}/Desktop/Backup Main" with the potential ".zip" extension
	let parent_path = Path::new(&parent_path);

	// Get the file_name of the file that should be copied
	let file_or_dir_name = match origin_path.file_name() {
		Some(name) => { name }
		None => {
			return vec![
				BackupExecutionLog::ErrorCopying(
					format!(
						"Couldn't get the origin's file_name of '{:?}'. Therefore, copying this file is not possible.",
						origin
					)
				)
			];
		}
	};

	if origin_path.is_file() {
		match
			copy_file_procedure(
				origin_path,
				corrected_relative_target,
				parent_path,
				file_or_dir_name,
				&mut zip_writer,
				&filters
			)
		{
			Some(log) => vec![log],
			None => {
				vec![BackupExecutionLog::SuccessCopying {
					to_path: corrected_relative_target.join(file_or_dir_name).to_string_lossy().to_string(),
					from_path: origin,
					variant: FileOrDirectory::File,
				}]
			}
		}
	} else if origin_path.is_dir() {
		let mut logs = copy_directory_procedure(
			origin_path,
			corrected_relative_target,
			parent_path,
			file_or_dir_name,
			&mut zip_writer,
			&filters
		);

		logs.push(BackupExecutionLog::SuccessCopying {
			to_path: corrected_relative_target.join(file_or_dir_name).to_string_lossy().to_string(),
			from_path: origin,
			variant: FileOrDirectory::Directory,
		});

		logs
	} else {
		return vec![
			BackupExecutionLog::ErrorCopying(
				format!(
					"The location at '{:?}' doesn't exist and could therefore not be copied.",
					origin_path
				)
			)
		];
	}
}
