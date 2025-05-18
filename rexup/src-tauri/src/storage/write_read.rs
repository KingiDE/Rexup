use serde::{ Deserialize, Serialize };
use core::str;
use std::{ fs::{ self, File }, path::PathBuf };

// Expected argument from the frontend when saving the config-file
#[derive(Deserialize, Serialize, Debug)]
pub struct Config {
	show_backup_execution_history: bool,
}

// Expected argument from the frontend when saving a backup
#[derive(Debug, Serialize, Deserialize)]
pub struct Backup {
	id: String,
	name: String,
	entries: Vec<BackupEntry>,
	is_zipped: bool,
	location: Option<String>,
	executions: Vec<String>,
	logs_of_last_execution: Vec<BackupExecutionLog>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BackupExecutionLog {
	Information(String),
	SuccessCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
	},
	ErrorCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
		reason: String,
	},
	IgnoreCopying {
		variant: FileOrDirectory,
		from_path: String,
		to_path: String,
		reason: String,
	},
}

#[derive(Debug, Serialize, Deserialize)]
pub enum FileOrDirectory {
	File,
	Directory,
}

// Expected argument from the frontend when saving a folderPair
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntry {
	id: String,
	name: String,
	variant: Option<FileOrDirectory>,
	origin: Option<String>,
	target: Option<String>,
	is_active: bool,
	filters: BackupEntryFilters,
}

// Stores filters that every BackupEntry has
#[derive(Debug, Serialize, Deserialize)]
pub struct BackupEntryFilters {
	pub max_size_in_mb: Option<u32>,
	pub included_file_types: Option<Vec<String>>,
	pub included_file_names: Option<Vec<String>>,
}

//
// SECTION: Write to a file, log a message to the console when erroring and returing a variant of the `ReadFileError` enum
//
pub enum ReadFileError {
	UnableToReadExistingFile,
	UnableToFindFile,
	UnableToCreateFile,
	UnableToCreatePath,
	UnableToConvertIntoUTF8,
}

pub fn safely_read_file(path: FileVariants) -> Result<String, ReadFileError> {
	let path = convert_enum_to_path(path);

	let data;

	if path.exists() {
		match fs::read(&path) {
			Ok(file_data) => {
				data = file_data;
			}
			Err(_err) => {
				println!("Error: The backend was unable to read the existing file: {:#?}", &path);
				return Err(ReadFileError::UnableToReadExistingFile);
			}
		}
	} else {
		let mut path_without_file = path.clone();
		path_without_file.pop();

		match fs::create_dir_all(path_without_file) {
			Ok(_nothing) => {}
			Err(_err) => {
				println!(
					"Error: The backend was unable to create the path to the not existing file: {:#?}",
					&path
				);
				return Err(ReadFileError::UnableToCreatePath);
			}
		}

		match File::create(&path) {
			Ok(_file) => {
				println!("Error: The backend was unable to find the file: {:#?}", &path);
				return Err(ReadFileError::UnableToFindFile);
			}
			Err(_err) => {
				println!("Error: The backend was unable to create the file: {:#?}", &path);
				return Err(ReadFileError::UnableToCreateFile);
			}
		};
	}

	match str::from_utf8(&data) {
		Ok(converted_bytes) => { Ok(converted_bytes.to_owned()) }
		Err(_err) => { Err(ReadFileError::UnableToConvertIntoUTF8) }
	}
}

// Write to a file and log a message to the console when erroring
pub fn safely_write_file(path: FileVariants, data: String) {
	let path = convert_enum_to_path(path);

	match fs::write(&path, data) {
		Ok(_nothing) => {}
		Err(_err) => {
			println!("Error: Could not write new data to file: {:#?}", &path);
		}
	};
}

//
// SECTION: Convert the `FileVariants` enum to an usable `PathBuf`; currently only Windows support
//
pub enum FileVariants {
	Config,
	Backups,
}

fn convert_enum_to_path(path_enum: FileVariants) -> PathBuf {
	match path_enum {
		FileVariants::Config =>
			PathBuf::from(
				format!("C:\\Users\\{}\\AppData\\Roaming\\.rexup\\config.json", whoami::username())
			),
		FileVariants::Backups =>
			PathBuf::from(
				format!("C:\\Users\\{}\\AppData\\Roaming\\.rexup\\backups.json", whoami::username())
			),
	}
}
