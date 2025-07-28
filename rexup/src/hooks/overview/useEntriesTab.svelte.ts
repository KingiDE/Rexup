import type { LocalStateBackupEntry } from "../../components/types";
import {
	getValidInput,
	resetAddBackupEntryInput,
	triedToSubmit,
} from "./useAddBackupEntryPopup.svelte";
import { closePopup, popup } from "../useHotkeyHandler.svelte";
import { currentBackup } from "../useTwoColumns.svelte";
import { displayedLocalFileSystemPath } from "./useEditBackupEntryPopupOrigin.svelte";

export const currentBackupEntry = $state<{
	value: LocalStateBackupEntry | null;
}>({ value: null });

export function selectThisBackupEntry(entry: LocalStateBackupEntry) {
	currentBackupEntry.value = entry;
}

export function setEntryOriginPath(path: string) {
	if (currentBackupEntry.value === null) return;

	// Also update the displayedLocalFileSystemPath
	displayedLocalFileSystemPath.value = path;

	currentBackupEntry.value.origin.local_file_system = path;
	popup.value = "edit_backup_entry";
}

export function addBackupEntry(name: string) {
	if (currentBackup.value === null) return;

	if (!getValidInput().value) {
		triedToSubmit.value = true;
		return;
	}

	currentBackup.value.entries.push({
		id: Date.now().toString(),
		name,
		origin: {
			active_mode: "LocalFileSystem",
			commands: [],
			local_file_system: "",
		},
		target: "",
		rename_to: "",
		is_active: true,
		variant: null,
		filters: {
			max_size_in_mb: null,
			mode: "Include",
			file_names: [],
			path_elements: [],
		},
	});

	triedToSubmit.value = false;
	resetAddBackupEntryInput();
	closePopup();
}

export function deleteBackupEntry(entry: LocalStateBackupEntry) {
	if (currentBackup.value === null) return;

	currentBackup.value.entries = currentBackup.value.entries.filter(
		(el) => el.id !== entry.id,
	);

	closePopup();
}
