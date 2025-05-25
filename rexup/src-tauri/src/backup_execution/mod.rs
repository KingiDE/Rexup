// use std::{ fs::{ self, File }, path::{ Path, PathBuf } };

// use serde::{ Deserialize, Serialize };

// use crate::FileOrDirectory;

// #[tauri::command]
// pub fn create_backup_parent_directory(
// 	name: String,
// 	location: Option<String>,
// 	is_zipped: bool
// ) -> Option<String> {
// 	let mut used_directory_path = match location {
// 		Some(path) => { path }
// 		// Use the user's desktop-path if there's no path set on the frontend
// 		// TODO: use some real helper function
// 		None => { "C:/Users/Kingi/Desktop/".to_string() }
// 	};

// 	// Add the actual name to the path
// 	used_directory_path = format!("{}Backup {}", used_directory_path, name);

// 	if is_zipped {
// 		// Add the ".zip"-extension for zip-files
// 		used_directory_path = used_directory_path + ".zip";

// 		// If the path with .zip already exists, return false
// 		if std::path::Path::new(&used_directory_path).exists() {
// 			false;
// 		}

// 		match fs::File::create(&used_directory_path) {
// 			Ok(_x) => { Some(used_directory_path.to_string()) }
// 			Err(_err) => { None }
// 		}
// 	} else {
// 		// If the path without .zip already exists, return false
// 		if std::path::Path::new(&used_directory_path).exists() {
// 			false;
// 		}

// 		match fs::create_dir(&used_directory_path) {
// 			Ok(_x) => { Some(used_directory_path.to_string()) }
// 			Err(_err) => { None }
// 		}
// 	}
// }

// struct CopyBackupEntrySuccess {
// 	variant: FileOrDirectory,
// 	ignored_files: Vec<IgnoredFiles>,
// }

// struct IgnoredFiles {
// 	file_path: PathBuf,
// 	reason: IgnoreFileReason,
// }

// enum IgnoreFileReason {
// 	WrongName,
// 	WrongExtension,
// 	TooLargeSize,
// }

// enum CopybackupEntryErrorReason {}

// #[derive(Debug, Serialize, Deserialize)]
// pub struct BackupEntryFilters {
// 	max_size_in_mb: Option<i32>,
// 	included_file_extensions: Option<Vec<String>>,
// 	included_file_names: Option<Vec<String>>,
// }

// // -> Result<CopyBackupEntrySuccess, CopybackupEntryErrorReason>

// #[tauri::command]
// pub fn copy_backup_entry(
// 	origin: String,
// 	target: String,
// 	parent_path: String,
// 	is_zipped: bool,
// 	filters: BackupEntryFilters
// ) {
// 	let origin = Path::new(&origin);
// 	let target = Path::new(&target);
// 	let parent_path = Path::new(&parent_path);

// 	println!("Origin: {:#?}", origin);
// 	println!("Target: {:#?}", target);
// 	println!("parent_path: {:#?}", parent_path);

// 	let mut location_to_write = Path::new(&parent_path);
// 	location_to_write.join(&target);

// 	println!("location_to_write: {:#?}", location_to_write);

// 	if origin.is_file() {
// 		if is_zipped {
// 		} else {
// 			// Because the parent-directory is already created, only the subdirectories in the backup-parent-directory need to be created

// 			// Then, the filename can be appended to this path and the original file-data can be copied
// 		}
// 	}
// }
