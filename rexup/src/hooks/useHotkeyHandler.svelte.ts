// Is placed inside the TwoColumn (= root) component.

import type { CurrentPopup } from "../components/types";
import { addBackupInput } from "./sidebar/useAddBackupPopup.svelte";
import { addBackup } from "./sidebar/useSidebar.svelte";
import { addBackupEntryInput } from "./overview/useAddBackupEntryPopup.svelte";
import { addBackupEntry } from "./overview/useEntriesTab.svelte";

// Everytime a hotkey is pressed, the handler will go down the hierarchy and chooses the correct function to call.
export function initializeHotkeys() {
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			if (popup.value === "select_backup_entry_origin_location") {
				popup.value = "edit_backup_entry";
			} else {
				closePopup();
			}
		}

		if (e.key === "Enter") {
			// For the AddBackupPopup
			if (popup.value === "add_backup") {
				addBackup(addBackupInput.value.name);
			}

			// For the AddBackupEntryPopup
			if (popup.value === "add_backup_entry") {
				addBackupEntry(addBackupEntryInput.value.name);
			}
		}
	});
}

// Stores the current popup that is shown in the UI
export const popup = $state<{ value: CurrentPopup }>({ value: null });

export function closePopup() {
	popup.value = null;
}
