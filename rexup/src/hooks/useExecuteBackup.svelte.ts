import { invoke } from "@tauri-apps/api/core";
import type { CurrentOverviewTab, LocalStateBackup } from "../components/types";

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

	// Call the backup-execution on the backend
	await invoke("execute_backup", currentBackup);

	// When execution is successfully finished:
	currentBackup.executions.push(Date.now().toString());
	currentBackup.logs_of_last_execution.push({
		variant: "finished",
		message: "Finished the backup-execution successfully.",
	});
	isBackupExecuting.value = false;
}
