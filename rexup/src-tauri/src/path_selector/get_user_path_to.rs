use serde::{ Deserialize, Serialize };

use crate::FileOrDirectory;
use crate::path_selector::PathElement;

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
/// This function abstracts away the platform-specific details of user directories
/// and provides a consistent structure across different operating systems.
///
/// Internally, it calls `get_os_specific_path()` to construct the path based on the
/// current operating system:
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
	get_os_specific_path(location)
}

/// Helper function that returns the path to a user's OS-specific directory-`location` in form of `PathElements` on Windows.
#[cfg(target_family = "windows")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement {
			id: "C:/".to_string(),
			name: "C:".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: "C:/Users/".to_string(),
			name: "Users".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: format!("C:/Users/{}/", &username),
			name: username.clone(),
			variant: FileOrDirectory::Directory,
		}
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Downloads/", &username),
				name: "Downloads".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Documents/", &username),
				name: "Documents".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("C:/Users/{}/Desktop/", &username),
				name: "Desktop".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}

/// Helper function that returns the path to a user's OS-specific directory-`location` in form of `PathElements` on Linux.
#[cfg(target_family = "unix")]
fn get_os_specific_path(location: UserLocation) -> Vec<PathElement> {
	let username = whoami::username();

	let mut base_path = vec![
		PathElement { id: "/".to_string(), name: "/".to_string(), variant: FileOrDirectory::Directory },
		PathElement {
			id: "/home/".to_string(),
			name: "home".to_string(),
			variant: FileOrDirectory::Directory,
		},
		PathElement {
			id: format!("/home/{}/", &username),
			name: username.clone(),
			variant: FileOrDirectory::Directory,
		}
	];

	match location {
		UserLocation::Downloads => {
			base_path.push(PathElement {
				id: format!("/home/{}/Downloads/", &username),
				name: "Downloads".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Documents => {
			base_path.push(PathElement {
				id: format!("/home/{}/Documents/", &username),
				name: "Documents".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		UserLocation::Desktop => {
			base_path.push(PathElement {
				id: format!("/home/{}/Desktop/", &username),
				name: "Desktop".to_string(),
				variant: FileOrDirectory::Directory,
			});
		}
		// Append nothing if the value is "Home"
		_ => {}
	}

	base_path
}
