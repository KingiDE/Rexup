use std::fs;

/// Creates either a "normal" directory or a zip-file with the given `name` at the given `path`.
/// This depends on the value of is_zipped`, which if it's true makes the function create a zip-file.
///
/// ## Note:
/// The function will not overwrite an already existing zip-file or directory at the given `path` and instead return `None`.
///
/// ## Returns:
/// If the creation of the backup-parent-directory succeeds, the function will return `Some(String)` containing the path of the created directory or zip-file.
/// Otherwise the function returns `None`.
pub fn create_backup_parent_directory(
	name: String,
	location: Option<String>,
	is_zipped: bool
) -> Option<String> {
	let mut used_directory_path = match location {
		Some(path) => { path }
		// Use the user's desktop-path if there's no path set on the frontend
		// TODO: use some helper function from the "extra"-module
		None => { "C:/Users/Kingi/Desktop/".to_string() }
	};

	// Add the actual name to the path
	used_directory_path = format!("{}Backup {}", used_directory_path, name);

	if is_zipped {
		// Add the ".zip"-extension for zip-files
		used_directory_path = used_directory_path + ".zip";

		// If the path with .zip already exists, return None
		if std::path::Path::new(&used_directory_path).exists() {
			return None;
		}

		match fs::File::create(&used_directory_path) {
			Ok(_x) => { Some(used_directory_path.to_string()) }
			Err(_err) => { None }
		}
	} else {
		// If the path without .zip already exists, return None
		if std::path::Path::new(&used_directory_path).exists() {
			return None;
		}

		match fs::create_dir(&used_directory_path) {
			Ok(_x) => { Some(used_directory_path.to_string()) }
			Err(_err) => { None }
		}
	}
}
