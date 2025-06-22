use std::{ ffi::OsStr, fs, path::Path };

use crate::{ BackupEntryFilters, IgnoreFileReason };

/// Checks if a file should be excluded from the backup based on defined filters.
///
/// Evaluates file name, extension, and size filters. Returns a reason if the file is excluded.
///
/// # Arguments
/// * `file_path` - Full path to the file on disk.
/// * `file_name` - File name extracted from the path (used for name-based filters).
/// * `filters` - Struct containing inclusion and exclusion criteria.
///
/// # Returns
/// `Some(IgnoreFileReason)` if the file does not meet the filter criteria (e.g., wrong extension),
/// otherwise `None` indicating the file passes all filters.
///
/// # Note
/// This function does not mutate or read the file beyond checking metadata and path.
pub fn do_filters_apply(
	file_path: &Path,
	file_name: &OsStr,
	filters: &BackupEntryFilters
) -> Option<IgnoreFileReason> {
	let file_name_path = Path::new(file_name);

    if let Some(stem_osstr) = file_name_path.file_stem() {
        if let Some(stem_str) = stem_osstr.to_str() {
            if filters.included_file_names.len() > 0 && !filters.included_file_names.iter().any(|s| s == stem_str) {
				return Some(IgnoreFileReason::WrongName);
			}
        }
    }

    if let Some(ext_osstr) = file_name_path.extension() {
        if let Some(ext_str) = ext_osstr.to_str() {
			if filters.included_file_extensions.len() > 0 && !filters.included_file_extensions.iter().any(|s| s == ext_str) {
				return Some(IgnoreFileReason::WrongExtension);
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
				return Some(IgnoreFileReason::TooLargeSize);
			}
		}
	}

	None
}
