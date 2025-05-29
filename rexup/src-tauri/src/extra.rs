//! Contains extra functions that aren't part of a larger module.

use std::{ fs::{ self, OpenOptions }, time::{ UNIX_EPOCH, SystemTime }, path::{ Path, PathBuf } };
use crate::FileOrDirectory;

/// Checks if the user can write to the given `path` by creating uniquely named file at that `path` and deleting it right after.
///
/// ## Returns:
/// If the file can be created and deleted the function returns `true`, otherwise it returns `false`.
#[tauri::command]
pub fn has_write_access_to(path: String) -> bool {
	let path = Path::new(&path);

	let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
	let test_file = path.join(format!(".perm_test_{}", timestamp));

	match OpenOptions::new().write(true).create_new(true).open(&test_file) {
		Ok(_) => {
			match fs::remove_file(&test_file) {
				Ok(_nothing) => true,
				Err(_err) => false,
			}
		}
		Err(_) => false,
	}
}

/// Deletes all of Rexup's stored data by deleting its parent-directory.
///
/// ## Returns:
/// The function returns nothing, even if the deletion of the directory fails.
#[tauri::command]
pub fn delete_all_data() {
	let _ = fs::remove_dir_all(&get_parent_directory());
}

/// Helper function that returns the correct parent-directory on Windows.
#[cfg(target_family = "windows")]
fn get_parent_directory() -> PathBuf {
	PathBuf::from(format!("C:/Users/{}/AppData/Roaming/.rexup", whoami::username()))
}

/// Helper function that returns the correct parent-directory on Linux.
#[cfg(target_family = "unix")]
fn get_parent_directory() -> PathBuf {
	PathBuf::from(format!("/home/{}/.rexup", whoami::username()))
}

/// Checks the variant of the "thing" at the given `path`.
///
/// ## Returns:
/// If the `path` is a file, the function returns `Some(FileOrDirectory::File)`, if the `path` is a directory, the function returns `Some(FileOrDirectory::Directory)`.
/// Otherwise the function returns `None`.
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
