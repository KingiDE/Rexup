use std::fs;
use std::os::windows::prelude::*;
use serde::{ Deserialize, Serialize };

//
// SECTION: Provides funtionality for the path-selector-ui to work properly on the frontend
//

// Returns the correct path to the location on the user's os by giving the
// fitting keyword
#[tauri::command]
pub fn get_user_path_to(value: String) -> String {
	match value.as_str() {
		"downloads" => {
			return format!("C:\\Users\\{}\\Downloads", whoami::username());
		}
		"documents" => {
			return format!("C:\\Users\\{}\\Documents", whoami::username());
		}
		"desktop" | _ => {
			return format!("C:\\Users\\{}\\Desktop", whoami::username());
		}
	}
}

#[derive(Serialize, Deserialize)]
pub struct DirectoryContent {
	name: String,
	variant: String,
	is_hidden: bool,
}

// Returns the name of all directories (not recursively) inside a directory
#[tauri::command]
pub fn read_contents_of(mut path: String) -> Vec<DirectoryContent> {
	path += "\\";

	match fs::read_dir(&path) {
		Ok(entries) => {
			let needed_dir_entries = entries.filter_map(|entry| { entry.ok() }); // keep valid Ok()s

			let mut structured_entries: Vec<DirectoryContent> = Vec::new();

			for entry in needed_dir_entries {
				// Convert &OsStr to String
				let entry_name = entry
					.path()
					.file_name()
					.and_then(|os_str| os_str.to_str())
					.map(|s| s.to_string());

				match entry_name {
					Some(entry_name) => {
						let entry_type = if entry.path().is_dir() { "folder" } else { "file" };

						let attributes = entry.path().metadata().unwrap().file_attributes();
						let is_hidden = (attributes & 2) != 0;

						structured_entries.push(DirectoryContent {
							name: entry_name,
							variant: entry_type.to_owned(),
							is_hidden,
						});
					}
					None => {}
				}
			}

			structured_entries
		}
		Err(_err) => { Vec::new() }
	}
}

// Retuns letters of drives from D-Z that actually do exist
#[tauri::command]
pub fn get_remaining_drives() -> Vec<String> {
	const DRIVE_LETTERS_TO_CHECK: [&str; 26] = [
		"A:",
		"B:",
		"C:",
		"D:",
		"E:",
		"F:",
		"G:",
		"H:",
		"I:",
		"J:",
		"K:",
		"L:",
		"M:",
		"N:",
		"O:",
		"P:",
		"Q:",
		"R:",
		"S:",
		"T:",
		"U:",
		"V:",
		"W:",
		"X:",
		"Y:",
		"Z:",
	];
	let mut existing_drive_letters = Vec::new();

	for letter in DRIVE_LETTERS_TO_CHECK {
		match fs::read_dir(letter) {
			Ok(_read_dir) => {
				existing_drive_letters.push(letter.to_owned());
			}
			Err(_err) => {}
		}
	}

	existing_drive_letters
}
