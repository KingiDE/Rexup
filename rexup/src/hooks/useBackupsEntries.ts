import { Dispatch, SetStateAction, useState } from "react";
import {
	LocalStateBackupEntry,
	LocalStateBackupWithId
} from "./useCurrentSelectedBackup";
import { BackupsFile } from "./useStoredValues";
import { CurrentPopup } from "../App";

export default function useBackupsEntries(
	currentSelectedBackup: LocalStateBackupWithId,
	storedBackups: BackupsFile | null,
	setStoredBackups: Dispatch<SetStateAction<BackupsFile | null>>,
	setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>,
) {
	const [inputs, setInputs] = useState<LocalStateBackupEntry>({
		origin: "",
		target: "",
		variant: "file",
		filters: {
			included_file_names: null,
			included_file_types: null,
			max_size_in_mb: null
		},
		is_active: true
	});

	function addNewEntry() {
		if (storedBackups === null) return;

		// Refuse empty inputs
		if (inputs.origin === "" || inputs.target === "") return;

		// Find the selected backup inside of all stored backups
		const newStoredBackups = new Map(storedBackups);
		const newNeededBackup = newStoredBackups.get(currentSelectedBackup[0]);

		if (newNeededBackup === undefined) return;

		// Push a new folder to the folder field of the selected backup
		newNeededBackup.entries.set(new Date().getTime().toString(), {
			origin: inputs.origin,
			target: inputs.target,
			is_active: true,
			variant: inputs.variant,
			filters: {
				included_file_names: inputs.filters.included_file_names,
				included_file_types: inputs.filters.included_file_types,
				max_size_in_mb: inputs.filters.max_size_in_mb
			}
		});

		// Apply states
		setStoredBackups(newStoredBackups);

		// Clear inputs
		setInputs({
			origin: "",
			target: "",
			variant: "file",
			filters: {
				included_file_names: null,
				included_file_types: null,
				max_size_in_mb: null
			},
			is_active: true
		});

		setCurrentPopup(null);
	}

	function deleteBackupEntry(backupEntryId: string) {
		if (currentSelectedBackup === null) return;

		const newStoredBackups = new Map(storedBackups);
		newStoredBackups
			.get(currentSelectedBackup[0])
			?.entries.delete(backupEntryId);
		setStoredBackups(newStoredBackups);
	}

	function searchForNeededBackup(folderPairId: string) {
		if (currentSelectedBackup === null) return null;

		const newStoredBackups = new Map(storedBackups);
		const neededBackup = newStoredBackups.get(currentSelectedBackup[0]);

		if (
			neededBackup === undefined ||
			neededBackup.entries.get(folderPairId) === undefined
		) {
			return null;
		}

		return {
			newStoredBackups,
			neededBackup
		};
	}

	function updateOriginOrTarget(
		folderPairId: string,
		field: "origin" | "target",
		value: string
	) {
		const possibleNeededbackup = searchForNeededBackup(folderPairId);

		if (possibleNeededbackup !== null) {
			possibleNeededbackup.neededBackup.entries.get(folderPairId)![field] =
				value;
			setStoredBackups(possibleNeededbackup.newStoredBackups);
		}
	}

	function toggleIsEntryActive(folderPairId: string) {
		const possibleNeededbackup = searchForNeededBackup(folderPairId);

		if (possibleNeededbackup !== null) {
			possibleNeededbackup.neededBackup.entries.get(folderPairId)!.is_active =
				!possibleNeededbackup.neededBackup.entries.get(folderPairId)!.is_active;

			setStoredBackups(possibleNeededbackup.newStoredBackups);
		}
	}

	function updateEntryVariant(
		folderPairId: string,
		variant: "file" | "folder"
	) {
		const possibleNeededbackup = searchForNeededBackup(folderPairId);

		if (possibleNeededbackup !== null) {
			// Reset target if variant changed 
			if(possibleNeededbackup.neededBackup.entries.get(folderPairId)!.variant !== variant) {
				possibleNeededbackup.neededBackup.entries.get(folderPairId)!.target = "";
			}

			possibleNeededbackup.neededBackup.entries.get(folderPairId)!.variant =
			variant;

			setStoredBackups(possibleNeededbackup.newStoredBackups);
		}
	}

	function updateMaxSizeFilter(folderPairId: string, value: string) {
		const possibleNeededbackup = searchForNeededBackup(folderPairId);

		if (possibleNeededbackup !== null) {
			if (value === "") {
				possibleNeededbackup.neededBackup.entries.get(
					folderPairId
				)!.filters.max_size_in_mb = null;
			} else {
				const valueAsNumber = Number(value);

				if (!isNaN(valueAsNumber)) {
					possibleNeededbackup.neededBackup.entries.get(
						folderPairId
					)!.filters.max_size_in_mb = valueAsNumber;
				}
			}

			setStoredBackups(possibleNeededbackup.newStoredBackups);
		}
	}

	function updateListFilter(
		folderPairId: string,
		filter: "included_file_names" | "included_file_types",
		value: string[] | null
	) {
		const possibleNeededbackup = searchForNeededBackup(folderPairId);

		if (possibleNeededbackup !== null) {
			possibleNeededbackup.neededBackup.entries.get(folderPairId)!.filters[
				filter
			] = value;
			setStoredBackups(possibleNeededbackup.newStoredBackups);
		}
	}

	return {
		inputs,
		setInputs,
		addNewEntry,
		deleteBackupEntry,
		updateOriginOrTarget,
		updateEntryVariant,
		updateMaxSizeFilter,
		updateListFilter,
		toggleIsEntryActive
	};
}
