use std::path::Component;

use serde::{ Deserialize, Serialize };

use crate::FileOrDirectory;
use crate::path_selector::PathElement;
use crate::path_utils::get_home_path;

/// Stores all variants of locations the frontend might want to know.
#[derive(Debug, Serialize, Deserialize)]
pub enum UserLocation {
	Desktop,
	Downloads,
	Documents,
	Home,
}

/// Returns the full path to a user-specific directory (e.g., Desktop, Downloads, Documents)
/// as a sequence of `PathElement`s, which represent each component of the file path.
///
/// - **On Windows**: Builds a path starting from `C:/Users/{username}/` and appends
///   the selected subdirectory (e.g., `Downloads`).
/// - **On Unix/Linux**: Builds a path starting from `/home/{username}/` and appends
///   the appropriate subdirectory if requested.
///
/// # Parameters
/// - `location`: A variant of the `UserLocation` enum specifying which user directory
///   to retrieve. Valid options include:
///   - `UserLocation::Home`
///   - `UserLocation::Downloads`
///   - `UserLocation::Documents`
///   - `UserLocation::Desktop`
///
/// # Returns
/// A `Vec<PathElement>` representing the full hierarchical path to the requested directory.
/// Each `PathElement` includes:
/// - `id`: A string representing the full path up to that point.
/// - `name`: A user-friendly name of the directory.
/// - `variant`: Indicates the type (always `FileOrDirectory::Directory` here).
///
/// # Notes
/// - The returned path is **not** checked for existence; it simply reflects the expected
///   default structure based on conventional OS layouts.
#[tauri::command]
pub fn get_user_path_to(location: UserLocation) -> Vec<PathElement> {
	let mut base_path = Vec::new();
	let mut current_path = String::new();

	for (_i, part) in get_home_path().components().enumerate() {
		let part_as_string = part.as_os_str().to_string_lossy().to_string();

		// Skip current iteration because on Windows there comes an "\" after the drive letter
		if let Component::RootDir = part {
			continue;
		}

		current_path.push_str(&part_as_string);
		current_path.push('/');

		base_path.push(PathElement {
			id: current_path.clone(),
			name: part_as_string,
			variant: FileOrDirectory::Directory,
		});
	}

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: get_home_path().join("Downloads").to_string_lossy().to_string(),
				name: "Downloads".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: get_home_path().join("Documents").to_string_lossy().to_string(),
				name: "Documents".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: get_home_path().join("Desktop").to_string_lossy().to_string(),
				name: "Desktop".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		// Append nothing if the `location` is "UserLocation::Home"
		_ => {}
	}

	base_path
}
