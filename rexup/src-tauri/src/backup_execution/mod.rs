use tauri::{ AppHandle, Emitter };

use std::{ fs::{ File, OpenOptions }, path::Path };

use zip::ZipWriter;

mod copy_file_procedure;
mod copy_directory_procedure;
mod create_backup_parent_directory;

use copy_file_procedure::copy_file_procedure;
use copy_directory_procedure::copy_directory_procedure;
use create_backup_parent_directory::create_backup_parent_directory;

use crate::{ Backup, BackupEntryFilters, BackupExecutionLog, FileOrDirectory };

/// Manages creating the backup-parent-directory as well as copying all the contained `entries` of the given `backup`.
///
/// ## Note:
/// Instead of returning errors or one long success-object, this function will actually send events to the frontend to display important information.
/// This way, it becomes like a "live-ticker" by regularly reporting finished entries in contrast of having to wait for the entire execution to finish and return all the
/// results afterwards.
///
/// ## Returns:
/// This function returns early but no value if some crucial error occurs.
///
/// These are the possible reasons of an early return:
/// - If the backup-parent-directory cannot be created
/// - If a `ZipWriter` needs to be created because of `is_zipped` being `true` and the creation fails
// TODO: Switch to backup as argument
#[tauri::command]
pub fn execute_backup(app: AppHandle, backup: Backup) {
	let parent_path = match
		create_backup_parent_directory(backup.name, backup.location, backup.is_zipped)
	{
		Some(path) => path,
		None => {
			match
				app.emit(
					"execute_backup",
					vec![
						BackupExecutionLog::Information(
							"Couldn't create the backup-parent-directory so the backup cannot be executed.".to_string()
						)
					]
				)
			{
				Ok(_nothing) => {}
				Err(_err) => {
					println!(
						"Couldn't send an event to the frontend when calling `create_backup_parent_directory` in `execute_backup`!"
					);
				}
			}
			return;
		}
	};

	let mut zip_writer: Option<ZipWriter<File>> = None;

	if backup.is_zipped {
		// Create a ZipWriter
		let file = match OpenOptions::new().write(true).read(true).open(&parent_path) {
			Ok(file) => file,
			Err(_err) => {
				match
					app.emit(
						"execute_backup",
						vec![
							BackupExecutionLog::Information(
								"Couldn't create the zip-writer so the backup cannot be executed.".to_string()
							)
						]
					)
				{
					Ok(_nothing) => {}
					Err(_err) => {
						println!(
							"Couldn't send an event to the frontend when creating a zip-writer in `execute_backup`!"
						);
					}
				}
				return;
			}
		};

		zip_writer = Some(ZipWriter::new(file));
	}

	for backup_entry in backup.entries {
		let mut logs = vec![
			BackupExecutionLog::Information(format!("Started the execution of {}", backup_entry.name))
		];

		if
			let Some(mut entry_logs) = copy_backup_entry(
				backup_entry.origin,
				backup_entry.target,
				&parent_path,
				&mut zip_writer,
				backup_entry.filters
			)
		{
			logs.append(&mut entry_logs);
		}

		logs.push(
			BackupExecutionLog::Information(format!("Finished the execution of {}", backup_entry.name))
		);

		match app.emit("execute_backup", logs) {
			Ok(_nothing) => {}
			Err(_err) => {
				println!(
					"Couldn't send an event to the frontend when finishing the execution of a backup-entry in `execute_backup`!"
				);
			}
		}
	}
}

/// Manages copying the given `backup_entry` by calling either `copy_file_procedure` and `copy_directory_procedure`.
///
/// ## Returns:
/// This function returns an `Option<Vec<BackupExecutionLog>>` that may include a `Vec<BackupExecutionLog>`.
/// If the given `target` starts with an "/" and this prefix cannot be removed, the function returns `None`.
pub fn copy_backup_entry(
	origin: String,
	target: String,
	parent_path: &str,
	mut zip_writer: &mut Option<ZipWriter<File>>,
	filters: BackupEntryFilters
) -> Option<Vec<BackupExecutionLog>> {
	// The location of the original file or directory
	// Example: "C:/Users/{username}/Downloads/file_to_copy.txt" or "C:/Users/{username}/Downloads/directory_to_copy"
	let origin_path = Path::new(&origin);

	// The relative path inside the parent-directory
	// Example: "someSubdir/anotherDir" (Note: the prefix "/" gets removed below)
	let relative_target = match Path::new(&target).strip_prefix("/") {
		Ok(path) => { path }
		Err(_err) => {
			return None;
		}
	};

	// The path to the parent-directory that already contains the name of the backup
	// Example: "C:/Users/{username}/Desktop/Backup Main" with the potential ".zip" extension
	let parent_path = Path::new(&parent_path);

	if origin_path.is_file() {
		match copy_file_procedure(origin_path, relative_target, parent_path, &mut zip_writer, &filters) {
			Some(log) => { Some(vec![log]) }
			None => {
				Some(
					vec![BackupExecutionLog::SuccessCopying {
						to_path: relative_target.join(origin_path).to_string_lossy().to_string(),
						from_path: origin,
						variant: FileOrDirectory::File,
					}]
				)
			}
		}
	} else if origin_path.is_dir() {
		Some(
			copy_directory_procedure(origin_path, relative_target, parent_path, &mut zip_writer, &filters)
		)
	} else {
		return Some(
			vec![
				BackupExecutionLog::ErrorCopying(
					format!(
						"The location at '{:?}' doesn't exist and could therefore not be copied.",
						origin_path
					)
				)
			]
		);
	}
}
