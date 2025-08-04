import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { BackupExecutionLog, LocalStateBackup } from "../components/types";

export const backups = $state<{ value: Array<LocalStateBackup> | null }>({
	value: null,
});
export const currentBackup = $state<{ value: LocalStateBackup | null }>({
	value: null,
});

export function selectBackup(backup: LocalStateBackup) {
	currentBackup.value = backup;
}

// Deletes the passed backup fron the local state
export function deleteCurrentBackup(backupToDelete: LocalStateBackup) {
	if (backups.value !== null) {
		backups.value = backups.value.filter((el) => el.id !== backupToDelete.id);
		currentBackup.value = null;
	}
}

// Is called when listening to events from the backend while executing the backup
listen<Array<BackupExecutionLog>>("execute_backup", (event) => {
	if (currentBackup.value === null) return;

	currentBackup.value.logs_of_last_execution =
		currentBackup.value.logs_of_last_execution.concat(...event.payload);
});

// Writes the current state of all backups to the "backups.json" file
export async function triggerWriteBackupsFile() {
	if (backups.value !== null) {
		const result = (await invoke("write_backups_file", {
			value: backups.value,
		})) as boolean;

		if (result === false) {
			console.error("The backups file couldn't be written!");
		}
	}
}
