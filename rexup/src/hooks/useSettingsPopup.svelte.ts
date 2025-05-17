import { invoke } from "@tauri-apps/api/core";

export const showBackupExecutionHistory = $state({ value: false });

// Read the config-file from the backend
export async function loadAndSetData() {
	const readData = await invoke("read_config_file");

	if (typeof readData !== "string") {
		console.error("Could not read the config file on the frontend!");
		return;
	}

	const convertedData = JSON.parse(readData);

	if (
		"show_backup_execution_history" in convertedData &&
		typeof convertedData.show_backup_execution_history === "boolean"
	) {
		showBackupExecutionHistory.value =
			convertedData.show_backup_execution_history;
	}
}

// Toggle the state of showBackupExecutionHistory in the local state as well as in the config-file
export async function toggleShowBackupExecutionHistory() {
	await invoke("write_config_file", {
		value: {
			show_backup_execution_history: !showBackupExecutionHistory.value,
		},
	});
	showBackupExecutionHistory.value = !showBackupExecutionHistory.value;
}
