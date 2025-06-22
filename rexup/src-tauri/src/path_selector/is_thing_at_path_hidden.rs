#[cfg(target_family = "windows")]
use std::path::Path;

/// Determines whether the file or directory at the specified `path` is considered **hidden**.
///
/// A file or directory is considered hidden if it has either the
/// `FILE_ATTRIBUTE_HIDDEN` (`0x2`) or `FILE_ATTRIBUTE_SYSTEM` (`0x4`) attribute set.
/// This behavior matches what Windows Explorer typically treats as hidden.
/// The function uses `std::os::windows::fs::MetadataExt` to access raw file attributes.
///
/// # Parameters
/// - `path`: A reference to a `Path` pointing to the file or directory to be checked.
///
/// # Returns
/// - `true` if the file/directory is hidden according to OS-specific rules.
/// - `false` otherwise, or if metadata cannot be retrieved (e.g., invalid path).
///
/// # Notes
/// - Files marked as `System` (even without `Hidden`) are treated as hidden.
#[cfg(target_family = "windows")]
pub fn is_thing_at_path_hidden(path: &Path) -> bool {
	use std::os::windows::fs::MetadataExt;

	match path.metadata() {
		Ok(metadata) => (metadata.file_attributes() & (0x2 | 0x4)) != 0,
		Err(_err) => false,
	}
}

/// Determines whether a file or directory at the given `path` is considered **hidden** on Unix-like systems.
///
/// A file or directory is treated as hidden if:
/// - Its name begins with a dot (`.`), per Unix/POSIX convention.
/// - The current process **cannot read** the file or directory due to insufficient permissions.
///   This includes cases where the item exists but is not accessible by the calling user.
///
/// # Parameters
/// - `path`: A reference to a `Path` that points to the file or directory to evaluate.
///
/// # Returns
/// - `true` if the file or directory is hidden:
///     - Name starts with `.` (e.g., `.bashrc`, `.config`)
///     - OR the process lacks read permissions (access denied)
/// - `false` otherwise.
///
/// # Notes
/// - This function does not use extended attributes like `chflags hidden`.
/// - If the path does not exist, or if metadata cannot be read, it returns `false`.
#[cfg(target_family = "unix")]
pub fn is_thing_at_path_hidden(path: &std::path::Path) -> bool {
	use std::os::unix::fs::PermissionsExt;

	// Check if the file/directory name starts with a dot
	let is_name_hidden = path
		.file_name()
		.map(|name| name.to_string_lossy().starts_with('.'))
		.unwrap_or(false);

	if is_name_hidden {
		return true;
	}

	// Check if the path is readable (has read permission)
	match std::fs::metadata(path) {
		Ok(metadata) => {
			let permissions = metadata.permissions();
			// File is considered readable if the user has read bits (0o400)
			let is_readable = (permissions.mode() & 0o444) != 0;

			return !is_readable;
		}
		// If we can't read metadata, assume no access
		Err(_) => {
			return false;
		},
	};
}
