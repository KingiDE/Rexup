use std::{ fs::{ self, File }, path::PathBuf };

use zip::ZipWriter;

use crate::storage::BackupsFileFilters;

use super::{
	copy_utils::{ copy_file_safely, zip_file_safely },
	filter_utils::{
		does_possible_file_name_filter_apply,
		does_possible_file_type_filter_apply,
		does_possible_max_size_filter_apply,
	},
};

// If the funtion returns Some, the proccess was successful, else it failed
pub fn copy_folder_procedure(
	input_src: &PathBuf, // safely is a folder and not a file
	input_target: &PathBuf,
	backup_parent_folder_path: &PathBuf,
	zip_writer: &mut Option<ZipWriter<File>>,
	filters: &BackupsFileFilters
) -> Option<Vec<String>> {
	// Creates an instance of the target path without any filenames appended (at this line it's only the backup parent path)
	// and append the old target-path to the new one
	let mut target_path_without_filename = backup_parent_folder_path.clone();
	target_path_without_filename.push(input_target);

	let mut list_of_skipped_files = Vec::new();

	if
		loop_over_all_files_and_copy(
			input_src,
			&target_path_without_filename,
			zip_writer,
			backup_parent_folder_path,
			filters,
			&mut list_of_skipped_files
		)
	{
		Some(list_of_skipped_files)
	} else {
		None
	}
}

// This function copies all files in a directory and calls itself recursively for all contained dirs
// The return value (boolean) marks whether everything was successful
fn loop_over_all_files_and_copy(
	src: &PathBuf,
	target_path_without_filename: &PathBuf,
	zip_writer: &mut Option<ZipWriter<File>>,
	backup_parent_folder_path: &PathBuf,
	filters: &BackupsFileFilters,
	list_of_skipped_files: &mut Vec<String>
) -> bool {
	// Store all entries of the current directory
	let dir_entries = match fs::read_dir(src) {
		Ok(entries) => { entries }
		Err(_err) => {
			return false;
		}
	};

	for entry in dir_entries {
		match entry {
			Ok(entry) => {
				// If entry is file:
				if entry.path().is_file() {
					// Appends file name to src and calls copy
					let mut origin_with_filename = src.clone();
					origin_with_filename.push(entry.file_name());

					// Validate whether all filters, if they exist, apply.

					// Skip the current execution when the actual file size is greater than the allowed one
					if !does_possible_max_size_filter_apply(filters.max_size_in_mb, &origin_with_filename) {
						match &origin_with_filename.as_os_str().to_str() {
							Some(as_slice) => {
								list_of_skipped_files.push(as_slice.to_string());
							}
							None => {}
						}
						continue;
					}

					// The same goes for file-names and -types
					if
						!does_possible_file_name_filter_apply(
							&filters.included_file_names,
							&origin_with_filename
						)
					{
						match &origin_with_filename.as_os_str().to_str() {
							Some(as_slice) => {
								list_of_skipped_files.push(as_slice.to_string());
							}
							None => {}
						}
						continue;
					}

					if
						!does_possible_file_type_filter_apply(
							&filters.included_file_types,
							&origin_with_filename
						)
					{
						match &origin_with_filename.as_os_str().to_str() {
							Some(as_slice) => {
								list_of_skipped_files.push(as_slice.to_string());
							}
							None => {}
						}
						continue;
					}

					match zip_writer {
						Some(zip_writer) => {
							zip_file_safely(
								&origin_with_filename,
								backup_parent_folder_path,
								target_path_without_filename,
								&entry.file_name().into(),
								zip_writer
							);
						}
						None => {
							if
								!copy_file_safely(
									&origin_with_filename,
									&target_path_without_filename,
									&entry.file_name().into()
								)
							{
								return false;
							}
						}
					}
				} else if entry.path().is_dir() {
					// If entry is folder:
					// Appends the folder name to the src and the target and calls itself again
					let mut new_src = src.clone();
					new_src.push(entry.file_name());

					let mut new_target_path_without_filename = target_path_without_filename.clone();
					new_target_path_without_filename.push(entry.file_name());

					if
						!loop_over_all_files_and_copy(
							&new_src,
							&new_target_path_without_filename,
							zip_writer,
							backup_parent_folder_path,
							filters,
							list_of_skipped_files
						)
					{
						return false;
					}
				}
			}
			Err(_err) => {
				return false;
			}
		}
	}

	return true;
}
