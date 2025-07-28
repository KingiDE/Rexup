import { invoke } from "@tauri-apps/api/core";

export const showBackupExecutionHistory = $state({ value: false });

// Read the config-file from the backend
export async function loadAndSetData() {
	const readData = await invoke("read_config_file");

	if (typeof readData !== "string") {
		return;
	}

	let convertedData: unknown;

	try {
		convertedData = JSON.parse(readData);
	} catch (error) {
		console.error("The config-file couldn't be parsed!");
	}

	if (
		convertedData &&
		typeof convertedData === "object" &&
		"show_backup_execution_history" in convertedData &&
		typeof convertedData.show_backup_execution_history === "boolean"
	) {
		showBackupExecutionHistory.value =
			convertedData.show_backup_execution_history;
	}
}

// Toggles the state of showBackupExecutionHistory in the local state as well as in the config-file.
// It logs an error if the file could not be written.
export async function toggleShowBackupExecutionHistory() {
	showBackupExecutionHistory.value = !showBackupExecutionHistory.value;

	const result = (await invoke("write_config_file", {
		value: {
			show_backup_execution_history: !showBackupExecutionHistory.value,
		},
	})) as boolean;

	if (result === false) {
		console.error("The config-file couldn't be written!");
	}
}
