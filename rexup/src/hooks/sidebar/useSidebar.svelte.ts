import { invoke } from "@tauri-apps/api/core";
import { closePopup } from "../useHotkeyHandler.svelte";
import { backups, currentBackup } from "../useTwoColumns.svelte";
import {
	getValidInput,
	resetAddBackupInput,
	triedToSubmit,
} from "./useAddBackupPopup.svelte";

// Adds a backup with the passed name to the local state
export function addBackup(name: string) {
	if (backups.value === null) return;

	if (!getValidInput().value) {
		triedToSubmit.value = true;
		return;
	}

	backups.value.push({
		id: Date.now().toString(),
		name: name,
		entries: [],
		is_zipped: false,
		location: "",
		executions: [],
		logs_of_last_execution: [],
	});

	triedToSubmit.value = false;
	resetAddBackupInput();
	closePopup();
}

// Resets all local states to empty values and calls the Rust backend to delete the entire "rexup"-directory recursively
export async function deleteAllData() {
	backups.value = [];
	currentBackup.value = null;
	closePopup();

	// Deletes all data after 1 second
	new Promise((_resolve) => {
		setTimeout(() => {
			invoke("delete_all_data");
		}, 1000);
	});
}
