use crate::FileOrDirectory;
use std::path::Path;

/// Determines whether a given path points to a file or a directory.
///
/// This function checks the filesystem metadata of the provided path and returns
/// an appropriate `FileOrDirectory` enum variant indicating whether it is a file
/// or a directory. If the path does not exist or is neither a file nor a directory,
/// the function returns `None`.
///
/// # Parameters
/// - `path`: A `String` representing the absolute or relative file-system path to check.
///
/// # Returns
/// - `Some(FileOrDirectory::File)` if the path points to a regular file.
/// - `Some(FileOrDirectory::Directory)` if the path points to a directory.
/// - `None` if the path does not exist or is not a recognized file/directory.
///
/// # Notes
/// - If the path points to a symlink, the result reflects the target's type.
#[tauri::command]
pub fn get_variant_of_path(path: String) -> Option<FileOrDirectory> {
	let converted_path = Path::new(&path);

	if converted_path.is_file() {
		Some(FileOrDirectory::File)
	} else if converted_path.is_dir() {
		Some(FileOrDirectory::Directory)
	} else {
		None
	}
}
