//! Contains extra functions that aren't part of a larger module.

use std::{ fs::{ self, OpenOptions }, time::{ UNIX_EPOCH, SystemTime }, path::{ Path, PathBuf } };
use crate::FileOrDirectory;

/// Checks if the user can write to the given path by creating uniquely named file there and deleting it right after.
/// The function returns true if this test succeeds, otherwise the function returns false.
#[tauri::command]
pub fn has_write_access_to(path: String) -> bool {
	let path = Path::new(&path);

	let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_nanos();
	let test_file = path.join(format!(".perm_test_{}", timestamp));

	match OpenOptions::new().write(true).create_new(true).open(&test_file) {
		Ok(_) => {
			let _ = fs::remove_file(&test_file);
			true
		}
		Err(_) => false,
	}
}

/// Deletes all stored data of Rexup by deleting the parent-directory.
#[tauri::command]
pub fn delete_all_data() {
	match fs::remove_dir_all(&get_parent_directory()) {
		Ok(_nothing) => {}
		Err(_err) => {}
	}
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

/// Checks the variant of the "thing" at the given path.
/// If the path is a file, the function returns `Some(FileOrDirectory::File)`, if the path is a directory, the function returns `Some(FileOrDirectory::Directory)`.
/// Else the function returns `None`.
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
