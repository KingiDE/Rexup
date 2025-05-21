use std::{ fs, path::PathBuf };

// If the size of the file at src can be retrieved and is greater than the passed maximum size, the function will return false - otherwiese true
pub fn does_possible_max_size_filter_apply(max_size_in_mb: Option<u32>, src: &PathBuf) -> bool {
	match max_size_in_mb {
		Some(filter_max_size) => {
			match fs::metadata(src) {
				Ok(file_metadata) => {
					// Convert bytes to MB (using a factor of 1024!)
					let size_in_mb = file_metadata.len() / (1024 * 1024);

					// Skip the current execution when the actual file size is too big
					if size_in_mb > filter_max_size.into() {
						return false;
					} else {
						return true;
					}
				}
				Err(_err) => {
					// If the file size can't be retrieved, just move on
					return true;
				}
			}
		}
		None => {
			return true;
		}
	}
}

// If the file name of the file at src can be retrieved and is not in the passed list of file names, the function will return false - otherwiese true
pub fn does_possible_file_name_filter_apply(
	included_file_names: &Option<Vec<String>>,
	src: &PathBuf
) -> bool {
	match included_file_names {
		Some(file_name_list) => {
			match src.file_stem() {
				Some(file_name) => {
					let actual_file_name = match file_name.to_str() {
						Some(name) => { name.to_owned() }
						None => {
							// If the file name can't be converted from OsStr to String, just move on
							return true;
						}
					};

					if file_name_list.contains(&actual_file_name) {
						return true;
					} else {
						return false;
					}
				}
				None => {
					// If the file name can't be retrieved, just move on
					return true;
				}
			}
		}
		None => {
			return true;
		}
	}
}

// If the file type/extension of the file at src can be retrieved and is not in the passed list of file types/extension, the function will return false - otherwiese true
pub fn does_possible_file_type_filter_apply(
	included_file_extensions: &Option<Vec<String>>,
	src: &PathBuf
) -> bool {
	match included_file_extensions {
		Some(file_extension_list) => {
			match src.extension() {
				Some(file_extension) => {
					let actual_file_extension = match file_extension.to_str() {
						Some(extension) => { extension.to_owned() }
						None => {
							// If the file type can't be converted from OsStr to String, just move on
							return true;
						}
					};

					if file_extension_list.contains(&actual_file_extension) {
						return true;
					} else {
						return false;
					}
				}
				None => {
					// If the file type can't be retrieved, just move on
					return true;
				}
			}
		}
		None => {
			return true;
		}
	}
}
