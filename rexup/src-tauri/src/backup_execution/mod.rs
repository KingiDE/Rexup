use tauri::AppHandle;
use std::{ fs::OpenOptions, vec };
use zip::ZipWriter;

use crate::{ global_texts, Backup, BackupExecutionLog };

mod create_backup_parent_directory;
mod copy_backup_entry;
mod emit;

use create_backup_parent_directory::create_backup_parent_directory;
use copy_backup_entry::copy_backup_entry;
use emit::emit_to_frontend;

/// Manages creating the backup parent directory as well as copying all the contained entries of the passed `backup`.
///
/// # Note
/// Instead of returning errors or one heavy success object, this function sends events to the frontend to display important information.
/// This way, it becomes like a "live-ticker" by regularly reporting finished entries in contrast of having to wait for the entire execution to finish and return all the
/// results afterwards.
///
/// # Returns
/// This function returns early but no value if some crucial error occurs.
///
/// These are the possible reasons of an early return:
/// - If the backup parent directory cannot be created
/// - If a `ZipWriter` needs to be created because of `is_zipped` being `true` and the creation fails
#[tauri::command]
pub fn execute_backup(app: AppHandle, backup: Backup) {
	let parent_path = match
		create_backup_parent_directory(backup.name, &backup.location, backup.is_zipped)
	{
		Some(path) => path,
		None => {
			emit_to_frontend(
				&app,
				vec![
					BackupExecutionLog::Information(global_texts::backup_parent_not_created(&backup.location))
				],
				"Couldn't send an event to the frontend when calling `create_backup_parent_directory` in `execute_backup`!"
			);
			return;
		}
	};

	let mut opt_zip_writer = None;

	if backup.is_zipped {
		// Create a ZipWriter
		let file = match OpenOptions::new().write(true).read(true).open(&parent_path) {
			Ok(file) => file,
			Err(_err) => {
				emit_to_frontend(
					&app,
					vec![BackupExecutionLog::Information(global_texts::ZIP_WRITER_NOT_CREATED.to_string())],
					"Couldn't send an event to the frontend when creating a zip writer in `execute_backup`!"
				);
				return;
			}
		};

		opt_zip_writer = Some(ZipWriter::new(file));
	}

	for backup_entry in backup.entries {
		// Directly send signal of skipped entry and continue
		if !backup_entry.is_active {
			emit_to_frontend(
				&app,
				vec![
					BackupExecutionLog::Information(global_texts::skipped_backup_entry(&backup_entry.name))
				],
				"Couldn't send an event to the frontend when skipping the execution of a backup-entry in `execute_backup`!"
			);
			continue;
		}

		let mut logs = vec![
			BackupExecutionLog::Information(global_texts::started_backup_entry(&backup_entry.name))
		];

		let mut entry_logs = copy_backup_entry(
			backup_entry.origin,
			backup_entry.target,
			backup_entry.rename_to,
			&parent_path,
			&mut opt_zip_writer,
			backup_entry.filters
		);

		logs.append(&mut entry_logs);

		logs.push(
			BackupExecutionLog::Information(global_texts::finished_backup_entry(&backup_entry.name))
		);

		emit_to_frontend(
			&app,
			logs,
			"Couldn't send an event to the frontend when finishing the execution of a backup-entry in `execute_backup`!"
		);
	}
}
