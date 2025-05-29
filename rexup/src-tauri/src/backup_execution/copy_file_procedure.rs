use std::{ fs::{ self, File }, io::Write, path::Path };

use zip::{ write::SimpleFileOptions, ZipWriter };

use crate::{ BackupEntryFilters, BackupExecutionLog, IgnoreFileReason };

/// Copies a file from the given origin to...
///
/// If `zip_writer` is `Some(...)`: ...into the given `relative_target` inside the zip-file at the given `parent_path`. <br/>
/// If `zip_writer` is `None`: ...into the given `relative_target` inside the directory at the given `parent_path`.
///
/// In both cases the file_name from the origin is used.
///
/// ## Returns:
/// This function returns an `Option<BackupExecutionLog>` containing information about the backup-execution. Everytime the function returns a `Some(...)`,
/// it will include information about relevant errors. Only if everthing went fine, the function returns `None` although the function still returns `Some(...)`
/// if theoretically the file could be copied but the filters disallow it.
pub fn copy_file_procedure(
	origin: &Path,
	relative_target: &Path,
	parent_path: &Path,
	file_name: &str,
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

fn do_filters_apply(
	file_path: &Path,
	file_name: &str,
	filters: &BackupEntryFilters
) -> Option<IgnoreFileReason> {
	if let Some(file_names) = &filters.included_file_names {
		if !file_names.contains(&file_name.to_string()) {
			Some(IgnoreFileReason::WrongName);
		}
	}

	if let Some(file_extensions) = &filters.included_file_extensions {
		if let Some(file_name) = file_path.extension() {
			if let Some(file_name) = file_name.to_str() {
				if !file_extensions.contains(&file_name.to_string()) {
					Some(IgnoreFileReason::WrongExtension);
				}
			}
		}
	}

	// If the metadata of the file a the given `file_path` can be obtained, the max_size_in_mb is `Some(...)` and
	// the size is actual size is greater than the allowed size, the function returns `Some(IgnoreFileReason::TooLargeSize)`
	if let Some(max_size_in_mb) = filters.max_size_in_mb {
		if let Ok(metadata) = fs::metadata(file_path) {
			let actual_size_in_bytes = metadata.len() as u32;
			let filter_size_in_bytes = max_size_in_mb * 1024 * 1024;

			if actual_size_in_bytes > filter_size_in_bytes {
				Some(IgnoreFileReason::TooLargeSize);
			}
		}
	}

	None
}
