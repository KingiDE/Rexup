use std::{ ffi::OsString, fs::File, path::Path };

use zip::ZipWriter;

use crate::{
	backup_execution::copy_backup_entry::processes::{ copy_directory_process, copy_file_process },
	global_texts,
	BackupEntryFilters,
	BackupExecutionLog,
	FileOrDirectory,
};

/// Handles copying of an backup entry that backups files on the local file system.
///
/// # Arguments
/// * `origin` - Path to the source file or directory.
/// * `parent_path` - Path to the root of the backup location.
/// * `zip_writer` - Zip writer that allows writing to the zip file the backup consists of.
/// * `corrected_relative_target` - Path within the backup destination relative to the backup root but without the file or directory name.
/// * `rename_to` - Updated name of the file or directory to be copied.
/// * `filters` - Backup entry filters (like allowed names, path elements and size limits) applied before copying.
///
/// # Returns
/// An `Vec<BackupExecutionLog>`:
/// * `vec![...]` - A list of logs related to the copying process.
pub fn copy_local_file_system(
	origin: String,
	parent_path: &Path,
	zip_writer: &mut Option<ZipWriter<File>>,
	corrected_relative_target: &Path,
	rename_to: String,
	filters: &BackupEntryFilters
) -> Vec<BackupExecutionLog> {
	// The location of the original file or directory
	// Example: "C:/Users/{username}/Downloads/file_to_copy.txt" or "C:/Users/{username}/Downloads/directory_to_copy"
	let origin_path = Path::new(&origin);

	// Get the name of the file or directory that should be copied
	let file_or_dir_name = match origin_path.file_name() {
		Some(name) => { name }
		None => {
			return vec![
				BackupExecutionLog::ErrorCopying(global_texts::origin_name_not_found(origin_path))
			];
		}
	};

	// Stores the `renamed_file_or_dir_name` that is updated if `rename_to` is not empty
	let renamed_file_or_dir_name;

	if rename_to.is_empty() {
		// If `rename_to` is empty, simply use the already given `file_or_dir_name`
		renamed_file_or_dir_name = OsString::from(file_or_dir_name);
	} else {
		match origin_path.extension() {
			Some(extension) => {
				// If the original file name (at this point we know that this is a file) already had an extension,
				// keep it and update the file-stem by setting the file name which itself.
				// consists of `rename_to` and the already existing extension.
				renamed_file_or_dir_name = OsString::from(
					format!("{}.{}", rename_to, extension.to_string_lossy())
				);
			}
			None => {
				// If the original file name had no extension, simply update the file-stem using `set_file_name`
				renamed_file_or_dir_name = OsString::from(rename_to);
			}
		}
	}

	if origin_path.is_file() {
		match
			copy_file_process(
				origin_path,
				parent_path,
				zip_writer,
				corrected_relative_target,
				&renamed_file_or_dir_name,
				Some(&filters)
			)
		{
			Some(log) => vec![log],
			None => {
				vec![BackupExecutionLog::SuccessCopyingFileOrDirectory {
					to_path: corrected_relative_target
						.join(renamed_file_or_dir_name)
						.to_string_lossy()
						.to_string(),
					from_path: origin_path.to_string_lossy().to_string(),
					variant: FileOrDirectory::File,
				}]
			}
		}
	} else if origin_path.is_dir() {
		let mut logs = copy_directory_process(
			origin_path,
			parent_path,
			zip_writer,
			corrected_relative_target,
			&renamed_file_or_dir_name,
			Some(&filters)
		);

		logs.push(BackupExecutionLog::SuccessCopyingFileOrDirectory {
			to_path: corrected_relative_target
				.join(renamed_file_or_dir_name)
				.to_string_lossy()
				.to_string(),
			from_path: origin_path.to_string_lossy().to_string(),
			variant: FileOrDirectory::Directory,
		});

		logs
	} else {
		return vec![BackupExecutionLog::ErrorCopying(global_texts::origin_not_found(origin_path))];
	}
}
