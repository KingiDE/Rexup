mod copy_local_file_system;
mod copy_commands;
mod processes;

use std::{ fs::File, path::{ Path, PathBuf }, vec };
use zip::ZipWriter;

use crate::{
	global_texts,
	BackupEntryFilters,
	BackupEntryOrigin,
	BackupEntryOriginMode,
	BackupExecutionLog,
};

/// Copies a file or directory from the `origin` to a `target` within a backup context.
///
/// This function determines whether the active mode is a file or directory on the local file system or a list of commands and delegates the copying process
/// to either `copy_local_file_system` or `copy_commands`.
///
/// # Arguments
/// * `origin` - A struct containing multiple fields:
/// 	- `local_file_system` - A `String` that acts like a path to a resource on the local file system.
/// 	- `commands` - A `Vec<String>` of commands that are executed.
/// 	- `active_mode` - A `BackupEntryOriginMode` that decides which of the two other fields () are actually used.
/// * `target` - A `String` representing the relative path where the file or directory should be placed in the backup root.
/// * `parent_path` - The base path of the backup.
/// * `zip_writer` - A mutable reference to an optional `ZipWriter`, used if writing into a zip archive.
/// * `filters` - Backup entry filters (like allowed names, path elements and size limits) applied before copying.
///
/// # Returns
/// An `Vec<BackupExecutionLog>`:
/// * `vec![...]` - A list of logs related to the copying process.
pub fn copy_backup_entry(
	origin: BackupEntryOrigin,
	target: String,
	rename_to: String,
	parent_path: &PathBuf,
	zip_writer: &mut Option<ZipWriter<File>>,
	filters: BackupEntryFilters
) -> Vec<BackupExecutionLog> {
	// The path to the parent directory that already contains the name of the backup
	// Example: "C:/Users/{username}/Desktop/Backup Main" with the potential ".zip" extension
	let parent_path = Path::new(&parent_path);

	// The relative path inside the parent directory
	// Example: "someSubdir/anotherDir" (Note: the prefix "/" gets removed below)
	let mut corrected_relative_target = Path::new(&target);

	if corrected_relative_target.starts_with("/") {
		match corrected_relative_target.strip_prefix("/") {
			Ok(path) => {
				corrected_relative_target = path;
			}
			Err(_err) => {
				return vec![BackupExecutionLog::ErrorCopying(global_texts::prefix_not_stripped(&target))];
			}
		};
	}

	match origin.active_mode {
		BackupEntryOriginMode::Commands => {
			copy_commands::copy_commands(
				origin.commands,
				parent_path,
				zip_writer,
				corrected_relative_target
			)
		}
		BackupEntryOriginMode::LocalFileSystem => {
			copy_local_file_system::copy_local_file_system(
				origin.local_file_system,
				parent_path,
				zip_writer,
				corrected_relative_target,
				rename_to,
				&filters
			)
		}
	}
}
