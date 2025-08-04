use tauri::{ AppHandle, Emitter };

use crate::BackupExecutionLog;

/// Emits a backup execution log to the frontend via a Tauri event.
///
/// This function attempts to send a `Vec<BackupExecutionLog>` to the frontend using the
/// `"execute_backup"` event. If the event emission fails, it prints the provided error message
/// to the console.
///
/// # Arguments
/// * `app` - A reference to the Tauri `AppHandle`, used to emit the event.
/// * `log` - A `Vec<BackupExecutionLog>` entries containing information about the backup process.
/// * `error_message` - A string slice containing the error message to display if the emission fails.
///
/// # Notes
/// This function does not return a result. Instead it logs them to the console.
pub fn emit_to_frontend(app: &AppHandle, log: Vec<BackupExecutionLog>, error_message: &str) {
	if let Err(_err) = app.emit("execute_backup", vec![log]) {
		println!("{}", error_message);
	}
}
