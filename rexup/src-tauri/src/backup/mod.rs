use std::{ fs::{ self, File }, path::PathBuf };

//
// Section: Create the parent folder of the backup like "Backup {backup_name} {date} {time}"
//
use chrono::{ Datelike, Local, Timelike };

pub mod copy_utils;
use copy_utils::add_zero_in_front;

// Create the parent folder of the backup like "Backup {backup_name} {date} {time}"
#[derive(Serialize)]
pub enum CreateBackupParentResult {
	ParentFolderPath(String),
	Error,
}

#[tauri::command]
pub fn create_backup_parent_folder(
	backup_name: String,
	is_zipped: bool,
	input_backup_location: String
) -> CreateBackupParentResult {
	// Constructs the backup's name
	let now = Local::now();
	let date = format!(
		"{}.{}.{}",
		add_zero_in_front(now.day()),
		add_zero_in_front(now.month()),
		now.year()
	);
	let time = format!("{}.{}", add_zero_in_front(now.hour()), add_zero_in_front(now.minute()));

	let backup_name = format!("Backup {backup_name} {date} {time}");

	// If input_backup_location is empty default to the user's desktop directory
	let mut folder_path = if input_backup_location == "" {
		format!("C:\\Users\\{}\\Desktop", whoami::username())
	} else {
		input_backup_location
	};

	// Construct path by appending the backup_name to the folder_path
	folder_path += "/";
	folder_path += &backup_name;

	// Append ".zip" when its a zip-folder and create the file
	// else: create folder without ".zip" ending
	if is_zipped {
		folder_path += ".zip";
		let zip_file = match File::create(&folder_path) {
			Ok(x) => { x }
			Err(_err) => {
				return CreateBackupParentResult::Error;
			}
		};
		ZipWriter::new(zip_file);

		CreateBackupParentResult::ParentFolderPath(folder_path)
	} else {
		match fs::create_dir(&folder_path) {
			Ok(_x) => { CreateBackupParentResult::ParentFolderPath(folder_path) }
			Err(_err) => { CreateBackupParentResult::Error }
		}
	}
}

//
// Section: Copy the origin to target
//
use serde::{ Deserialize, Serialize };

mod copy_file_procedure;
use copy_file_procedure::copy_file_procedure;

mod copy_folder_procedure;
use copy_folder_procedure::copy_folder_procedure;
use zip::ZipWriter;

use crate::storage::BackupsFileFilters;

mod filter_utils;

#[derive(Debug, Serialize, Deserialize)]
pub struct FolderPair {
	origin: String,
	target: String,
	filters: BackupsFileFilters,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CopyOriginToTargetResult {
	skipped_files: Vec<String>,
	successful_copies: Vec<StrippedFolderPair>,
	failed_copies: Vec<StrippedFolderPair>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StrippedFolderPair {
	origin: String,
	target: String,
}

// Copy the origin to target
#[tauri::command]
pub fn copy_origin_to_target(
	all_backup_entries: Vec<FolderPair>,
	backup_parent_folder_path: String,
	is_zipped: bool
) -> Option<CopyOriginToTargetResult> {
	// Construct a zip_writer that is only Some() when is_zipped is true
	let mut zip_writer: Option<ZipWriter<File>> = None;

	// Also create parent-folder here to have access (?)
	if is_zipped {
		let zip_file = match File::create(PathBuf::from(&backup_parent_folder_path)) {
			Ok(x) => { x }
			Err(_err) => {
				return None;
			}
		};
		zip_writer = Some(ZipWriter::new(zip_file));
	}

	let mut skipped_files: Vec<String> = Vec::new();
	let mut successful_copies: Vec<StrippedFolderPair> = Vec::new();
	let mut failed_copies: Vec<StrippedFolderPair> = Vec::new();

	for single_entry in all_backup_entries {
		let src = PathBuf::from(&single_entry.origin);
		let mut target = PathBuf::from(&single_entry.target);

		// Removes leading "/" from target-input in case there is one
		if target.starts_with("/") {
			match target.strip_prefix("/") {
				Ok(x) => {
					target = x.to_path_buf();
				}
				Err(_err) => {
					continue;
				}
			};
		}

		// Convert backup_parent_folder_path to PathBuf
		let backup_parent_folder_path = PathBuf::from(&backup_parent_folder_path);

		// Starts seperate funtions depending on whether the src is a file or directory
		if src.is_file() {
			if copy_file_procedure(&src, &target, &backup_parent_folder_path, &mut zip_writer) {
				successful_copies.push(StrippedFolderPair {
					origin: src.to_str().expect("Error").to_string(),
					target: target.to_str().expect("Error").to_string(),
				});
			} else {
				failed_copies.push(StrippedFolderPair {
					origin: src.to_str().expect("Error").to_string(),
					target: target.to_str().expect("Error").to_string(),
				});
			}
		} else {
			match
				copy_folder_procedure(
					&src,
					&target,
					&backup_parent_folder_path,
					&mut zip_writer,
					&single_entry.filters
				)
			{
				Some(file_list) => {
					successful_copies.push(StrippedFolderPair {
						origin: src.to_str().expect("Error").to_string(),
						target: target.to_str().expect("Error").to_string(),
					});
					skipped_files.extend(file_list);
				}
				None => {
					failed_copies.push(StrippedFolderPair {
						origin: src.to_str().expect("Error").to_string(),
						target: target.to_str().expect("Error").to_string(),
					});
				}
			}
		}
	}

	Some(CopyOriginToTargetResult { skipped_files, successful_copies, failed_copies })
}
