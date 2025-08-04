use std::fs;
use std::process::Command;
use std::{ fs::File, path::Path };

use chrono::Utc;
use zip::ZipWriter;

use crate::backup_execution::copy_backup_entry::processes::{
	copy_directory_process,
	copy_file_process,
};
use crate::path_utils::get_desktop_path;
use crate::{ global_texts, BackupExecutionLog };

/// Handles copying of an backup entry that runs commands.
///
/// # Arguments
/// * `commands` - A `Vec<String>` of commands that are executed
/// * `parent_path` - Path to the root of the backup location.
/// * `zip_writer` - Zip writer that allows writing to the zip file the backup consists of.
/// * `corrected_relative_target` - Path within the backup destination relative to the backup root but without the file or directory name.
///
/// # Returns
/// An `Vec<BackupExecutionLog>`:
/// * `vec![...]` - A list of logs related to the copying process.
pub fn copy_commands(
	commands: Vec<String>,
	parent_path: &Path,
	zip_writer: &mut Option<ZipWriter<File>>,
	corrected_relative_target: &Path
) -> Vec<BackupExecutionLog> {
	match zip_writer {
		Some(_writer) => {
			// Create a temporary directory on the user's desktop
			let parent_path = get_desktop_path();

			let directory_of_commands = parent_path.join(
				&format!("temp_rexup_{}", Utc::now().timestamp_millis())
			);

			if let Err(_err) = fs::create_dir(&directory_of_commands) {
				return vec![
					BackupExecutionLog::ErrorCopying(global_texts::TEMP_DIR_NOT_CREATED.to_string())
				];
			}

			// Execute all commands in that freshly created directory
			let mut logs = execute_all_commands(
				commands,
				&directory_of_commands,
				corrected_relative_target
			);

			// Copy the entire contents of the temporary directory into the backup parent
			if let Ok(readable_dir) = fs::read_dir(&directory_of_commands) {
				for entry in readable_dir {
					if let Ok(entry) = entry {
						if entry.path().is_file() {
							copy_file_process(
								&entry.path(),
								&parent_path,
								zip_writer,
								corrected_relative_target,
								&entry.file_name(),
								None
							);
						} else if entry.path().is_dir() {
							copy_directory_process(
								&entry.path(),
								&parent_path,
								zip_writer,
								corrected_relative_target,
								&entry.file_name(),
								None
							);
						}
					}
				}
			}

			// Delete the temporary directory on the desktop
			if let Err(_err) = fs::remove_dir_all(directory_of_commands) {
				logs.push(BackupExecutionLog::Information(global_texts::TEMP_DIR_NOT_DELETED.to_string()));
			}

			logs
		}
		None => {
			let parent_directory_and_relative_target = parent_path.join(corrected_relative_target);

			// Create the required subdirectories in the backup parent directory
			if let Err(_err) = fs::create_dir_all(&parent_directory_and_relative_target) {
				return vec![
					BackupExecutionLog::ErrorCopying(
						global_texts::subdirectories_for_commands_in_backup_parent_not_created(
							corrected_relative_target,
							&commands
						)
					)
				];
			}

			execute_all_commands(
				commands,
				&parent_directory_and_relative_target,
				corrected_relative_target
			)
		}
	}
}

/// Executes all passed `String`s in `commands` at `parent_directory_and_relative_target`.
///
/// # Arguments
/// * `commands` - The list of commands that are executed
/// * `parent_directory_and_relative_target` - A `Path` where the commands should be executed.
/// * `corrected_relative_target` - A `Path` that is only used in the logs to describe the location when a command fails.
///
/// # Returns
/// An `Vec<BackupExecutionLog>`:
/// * `vec![...]` - A list of logs related to the copying process.
fn execute_all_commands(
	commands: Vec<String>,
	parent_directory_and_relative_target: &Path,
	corrected_relative_target: &Path
) -> Vec<BackupExecutionLog> {
	let mut logs = vec![];

	for command in commands {
		let shell_command = if cfg!(target_family = "windows") { "powershell" } else { "sh" };

		// If the execution succeeded and the status indicates a successful execution, add a `BackupExecutionLog::SuccessExecutingCommand` log and continue with the next iteration.
		if
			let Ok(status) = Command::new(shell_command)
				.current_dir(&parent_directory_and_relative_target)
				.args(&["-c", &command])
				.status()
		{
			if status.success() {
				logs.push(BackupExecutionLog::SuccessExecutingCommand {
					command: command.clone(),
					to_path: parent_directory_and_relative_target.to_string_lossy().to_string(),
				});
				continue;
			}
		}

		logs.push(
			BackupExecutionLog::ErrorCopying(
				global_texts::commands_in_backup_parent_not_executed(corrected_relative_target, &command)
			)
		);
	}

	logs
}
