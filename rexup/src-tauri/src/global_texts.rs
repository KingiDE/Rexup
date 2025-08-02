//! Contains texts that are displayed to the user in the application. Therefore, it is collected in one place to gain an overview.
//! Currently, there are only texts for `BackupExecutionLog::ErrorCopying` and `BackupExecutionLog::Information` placed in this module.

use std::{ io::Error, path::{ Path, PathBuf } };

pub fn backup_parent_not_created(path: &str) -> String {
	// Replaces and empty path with user friendly text which is better than just displaying an empty path if the backup location is not modified.
	let real_path: String;

	if path.is_empty() {
		real_path = "your desktop".to_string();
	} else {
		real_path = format!("\"{path:?}\"");
	}

	format!(
		"Can't create the backup parent directory at \"{real_path}\" so the backup can't be executed."
	)
}

pub const ZIP_WRITER_NOT_CREATED: &str =
	"Can't create the zip writer so the backup can't be executed.";

pub fn skipped_backup_entry(name: &str) -> String {
	format!("Skipped execution of entry \"{name}\" because it's disabled.")
}

pub fn started_backup_entry(name: &str) -> String {
	format!("Started execution of entry \"{name}\".")
}

pub fn finished_backup_entry(name: &str) -> String {
	format!("Finished execution of entry \"{name}\".")
}

pub const TEMP_DIR_NOT_CREATED: &str =
	"Can't create a temporary directory to store the results of the executed commands before copying them into the zip file. Therefore, the execution of this backup entry has been cancelled.";

pub const TEMP_DIR_NOT_DELETED: &str =
	"Can't delete the temporary desktop on the user's desktop after zipping all the files.";

pub fn subdirectories_for_commands_in_backup_parent_not_created(
	relative_target: &Path,
	commands: &Vec<String>
) -> String {
	format!(
		"The subdirectories at \"{relative_target:?}\" inside the backup parent directory can't be created. Therefore, the command(s) \"{commands:?}\" can't be executed."
	)
}

pub fn subdirectories_for_file_in_backup_parent_not_created(
	relative_target: &Path,
	origin: &Path
) -> String {
	format!(
		"The subdirectories at \"{relative_target:?}\" inside the backup parent directory can't be created. Therefore, the file at \"{origin:?}\" can't be copied."
	)
}

pub fn commands_in_backup_parent_not_executed(
	corrected_relative_target: &Path,
	command: &str
) -> String {
	format!(
		"The command \"{command}\" at \"{corrected_relative_target:?}\" inside the backup parent directory couldn't be executed. Therefore, its skipped."
	)
}

pub fn origin_name_not_found(origin: &Path) -> String {
	format!(
		"Can't get the origin's file or directory name of \"{origin:?}\". Therefore, copying this file or directory is not possible."
	)
}

pub fn origin_not_found(origin: &Path) -> String {
	format!("The location at \"{origin:?}\" doesn't exist and therefore can't be copied.")
}

pub fn prefix_not_stripped(target: &str) -> String {
	format!(
		"Can't strip the leading \"/\" of \"{target}\". Therefore, copying this backup entry is not possible."
	)
}

pub fn file_not_copied(origin: &Path, target: PathBuf) -> String {
	format!(
		"The file at \"{origin:?}\" can't be be written to \"{target:?}\". Therefore, this file can't be copied."
	)
}

pub fn file_not_read(path: &Path) -> String {
	format!("The file at \"{path:?}\" can't be be read and therefore can't be copied.")
}

pub fn directory_not_read(path: &Path) -> String {
	format!(
		"The directory at \"{path:?}\" can't be read. Therefore, copying this directory is not possible."
	)
}

pub fn entry_not_read(error: Error, path: &Path) -> String {
	format!(
		"An entry \"{error:?}\" in \"{path:?}\" can't be read. Therefore, reading and possibly copying this entry is not possible."
	)
}

pub fn file_in_zip_writer_not_started(
	relative_target_and_file_name: &PathBuf,
	origin: &Path
) -> String {
	format!(
		"The zip writer can't start a new file at \"{relative_target_and_file_name:?}\". Therefore, the file at \"{origin:?}\" can't be copied."
	)
}

pub fn file_in_zip_writer_not_written_to(
	relative_target_and_file_name: &PathBuf,
	origin: &Path
) -> String {
	format!(
		"The zip writer can't write to the file at \"{relative_target_and_file_name:?}\" inside the zip file. Therefore, this file at \"{origin:?}\" can't be copied."
	)
}
