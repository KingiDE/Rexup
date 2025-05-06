import type { Dispatch, SetStateAction } from "react";
import type { BackupsFile } from "./useStoredValues";

export default function useBackupActions(
	storedBackups: BackupsFile | null,
	setStoredBackups: Dispatch<SetStateAction<BackupsFile | null>>,
) {
	function createBackup(name: string) {
		const newBackups = new Map(storedBackups);
		newBackups.set(new Date().getTime().toString(), {
			name: name,
			entries: new Map(),
			isZipped: false,
			location: "",
		});
		setStoredBackups(newBackups);
	}

	function renameBackup(backupId: string, value: string) {
		const newBackups = new Map(storedBackups);
		const old_backup_with_updated_name = newBackups.get(backupId);
		if (old_backup_with_updated_name === undefined) return;
		old_backup_with_updated_name.name = value;

		newBackups.set(backupId, old_backup_with_updated_name);
		setStoredBackups(newBackups);
	}

	function deleteBackup(id: string) {
		const newBackups = new Map(storedBackups);
		newBackups.delete(id);
		setStoredBackups(newBackups);
	}

	function toggleBackupZipping(backupId: string) {
		const newBackups = new Map(storedBackups);
		const old_backup_with_updated_zip = newBackups.get(backupId);
		if (old_backup_with_updated_zip === undefined) return;
		old_backup_with_updated_zip.isZipped =
			!old_backup_with_updated_zip.isZipped;

		newBackups.set(backupId, old_backup_with_updated_zip);
		setStoredBackups(newBackups);
	}

	function updateBackupLocation(backupId: string, value: string) {
		const newBackups = new Map(storedBackups);
		const old_backup_with_updated_location = newBackups.get(backupId);
		if (old_backup_with_updated_location === undefined) return;
		old_backup_with_updated_location.location = value;

		newBackups.set(backupId, old_backup_with_updated_location);
		setStoredBackups(newBackups);
	}

	return {
		createBackup,
		renameBackup,
		deleteBackup,
		toggleBackupZipping,
		updateBackupLocation,
	};
}
