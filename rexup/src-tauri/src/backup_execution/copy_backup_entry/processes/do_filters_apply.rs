use std::{ ffi::OsStr, fs, path::Path };

use crate::{ BackupEntryFilters, BackupEntryFiltersMode, IgnoreFileReason };

/// Checks if a file should be excluded from the backup based on defined filters.
/// Evaluates the file name, path elements and the maximum file size.
///
/// # Arguments
/// * `file_path` - Full path to the file.
/// * `filters` - Backup entry filters (like allowed names, path elements and size limits) applied before copying.
///
/// # Returns
/// `Some(IgnoreFileReason)` if the file does not meet the filter criteria (e.g., wrong name),
/// otherwise `None` indicating the file passes all filters.
pub fn do_filters_apply(
	file_path: &Path,
	filters: &BackupEntryFilters
) -> Option<IgnoreFileReason> {
	// If the metadata of the file at the given `file_path` can be obtained, the `filters.max_size_in_mb` is `Some(...)` and
	// the actual file size is greater than the allowed size, the function returns `Some(IgnoreFileReason::TooLargeSize)`.
	if let Some(max_size_in_mb) = filters.max_size_in_mb {
		if let Ok(metadata) = fs::metadata(file_path) {
			let actual_size_in_bytes = metadata.len() as u32;
			let filter_size_in_bytes = max_size_in_mb * 1024 * 1024;

			if actual_size_in_bytes > filter_size_in_bytes {
				return Some(IgnoreFileReason::TooLargeSize);
			}
		}
	}

	// If `filters.path_elements` is longer than zero elements, the filter counts as enabled.
	if filters.path_elements.len() > 0 {
		let mut is_included = false;

		filters.path_elements.iter().for_each(|path_element| {
			if file_path.components().any(|component| component.as_os_str() == OsStr::new(path_element)) {
				is_included = true;
			}
		});

		match filters.mode {
			BackupEntryFiltersMode::Include => {
				if !is_included {
					return Some(IgnoreFileReason::WrongPathElements);
				}
			}
			BackupEntryFiltersMode::Exclude => {
				if is_included {
					return Some(IgnoreFileReason::WrongPathElements);
				}
			}
		}
	}

	// If `filters.file_names` is longer than zero elements, the filter counts as enabled.
	if filters.file_names.len() > 0 {
		let mut is_included = false;

		if let Some(name_of_existing_file) = file_path.file_name() {
			filters.file_names.iter().for_each(|file_name| {
				if OsStr::new(file_name) == name_of_existing_file {
					is_included = true;
				}
			});
		}

		match filters.mode {
			BackupEntryFiltersMode::Include => {
				if !is_included {
					return Some(IgnoreFileReason::WrongName);
				}
			}
			BackupEntryFiltersMode::Exclude => {
				if is_included {
					return Some(IgnoreFileReason::WrongName);
				}
			}
		}
	}

	None
}
