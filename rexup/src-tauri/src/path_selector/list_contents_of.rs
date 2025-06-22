use serde::{ Deserialize, Serialize };
use std::fs;

use crate::FileOrDirectory;
use crate::path_selector::is_thing_at_path_hidden::is_thing_at_path_hidden;

/// Describes a "thing" inside a directory, either a file or another directory.
#[derive(Debug, Serialize, Deserialize)]
pub struct DirectoryContent {
	id: String,
	name: String,
	variant: FileOrDirectory,
	is_hidden: bool,
}

#[tauri::command]
pub fn list_contents_of(path: String) -> Vec<DirectoryContent> {
	let mut directories: Vec<DirectoryContent> = Vec::new();

	if let Ok(readable_dir) = fs::read_dir(path) {
		for entry in readable_dir {
			if let Ok(readable_entry) = entry {
				let path = readable_entry.path();

				if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
					if let Some(converted_path) = path.to_str() {
						let variant = if path.is_file() {
							FileOrDirectory::File
						} else {
							FileOrDirectory::Directory
						};

						directories.push(DirectoryContent {
							id: converted_path.to_string(),
							name: name.to_string(),
							is_hidden: is_thing_at_path_hidden(&path),
							variant,
						});
					}
				}
			}
		}
	}

	directories
}
