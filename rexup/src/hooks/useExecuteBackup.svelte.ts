import { invoke } from "@tauri-apps/api/core";
import type { CurrentOverviewTab, LocalStateBackup } from "../components/types";
import type { FileOrDirectory } from "../components/types";

// @ts-ignore: TypeScript doesn't recognize the $state rune
export const currentTab = $state<{ value: CurrentOverviewTab }>({
	value: "entries",
});

// @ts-ignore: TypeScript doesn't recognize the $state rune
export const isBackupExecuting = $state({
	value: false,
});

export function closePopupsOnCurrentTabChange() {
	if (currentTab) return null;
}

export async function executeBackup(currentBackup: LocalStateBackup | null) {
	if (currentBackup === null) return;

	// Setup for starting the execution:
	isBackupExecuting.value = true;
	currentTab.value = "logs";
	// Reset last execution logs
	currentBackup.logs_of_last_execution = [];

	// Create backup-parent-directory
	const parentDirectoryPath = (await invoke("create_backup_parent_directory", {
		name: currentBackup.name,
		location: currentBackup.location,
		isZipped: currentBackup.is_zipped,
	})) as string | null;

	if (parentDirectoryPath === null) {
		isBackupExecuting.value = false;
		return;
	}

	currentBackup.logs_of_last_execution.push({
		variant: "information",
		message: `Created the backup-parent-directory in ${parentDirectoryPath}.`,
	});

	// Loop over all entries and let them be copied
	for (const entry of currentBackup.entries) {
		// Ignore disabled entries and those, that have their origin or target unset
		if (!entry.is_active) {
			currentBackup.logs_of_last_execution.push({
				variant: "information",
				message: `Didn't copy ${entry.name} because it's disabled.`,
			});
			continue;
		}

		if (entry.origin === null || entry.target === null) {
			currentBackup.logs_of_last_execution.push({
				variant: "information",
				message: `Didn't copy ${entry.name} because at least one of its paths is unset.`,
			});
			continue;
		}

		const copyEntry = (await invoke("copy_backup_entry", {
			origin: entry.origin,
			target: entry.target,
			parentPath: parentDirectoryPath,
			isZipped: currentBackup.is_zipped,
			filters: entry.filters,
		})) as FileOrDirectory | null;

		if (copyEntry == null) {
			currentBackup.logs_of_last_execution.push({
				variant: "error_copying",
				from_path: entry.origin,
				to_path: entry.target,
				entryName: entry.name,
				// TODO: Get access to reason of failure ("because ...")
				reason: `Couldn't copy the entry ${entry.name} `,
			});
		} else {
			currentBackup.logs_of_last_execution.push({
				variant: "success_copying",
				from_path: entry.origin,
				to_path: entry.target,
				type: copyEntry,
				entryName: entry.name,
			});
		}
	}

	// When execution is successfully finished:
	currentBackup.executions.push(Date.now().toString());
	currentBackup.logs_of_last_execution.push({
		variant: "finished",
		message: "Finished the backup-execution successfully.",
	});
	isBackupExecuting.value = false;
}
