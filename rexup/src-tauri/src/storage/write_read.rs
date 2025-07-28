use core::str;
use std::{ fs, path::{ Path, PathBuf } };

/// Safely reads the contents of a file from the given path.
///
/// Attempts to read the file into bytes, then convert the bytes to a UTF-8 string.
/// If any step fails, returns `None`.
///
/// # Parameters
///
/// - `path`: A reference to the `Path` of the file to read.
///
/// # Returns
///
/// `Some(String)` if the file is read and parsed successfully, otherwise `None`.
pub fn safely_read_file(path: &Path) -> Option<String> {
	if let Ok(file_data) = fs::read(&path) {
		if let Ok(converted_bytes) = str::from_utf8(&file_data) {
			return Some(converted_bytes.to_owned());
		}
	}

	None
}

/// Safely writes a string to a file at the specified path.
///
/// Ensures that the parent directories exist before writing. If writing is successful,
/// returns `true`. Otherwise, returns `false`.
///
/// # Parameters
///
/// - `path`: A reference to the `Path` where the data should be written.
/// - `data`: The `String` content to be written to the file.
///
/// # Returns
///
/// `true` if the file was written successfully, otherwise `false`.
pub fn safely_write_file(path: &Path, data: String) -> bool {
	let mut path_without_file = PathBuf::from(path);
	path_without_file.pop();

	let _ = fs::create_dir_all(path_without_file);

	!fs::write(&path, &data).is_err()
}
