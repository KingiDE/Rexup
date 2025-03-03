import { Dispatch, SetStateAction, useEffect } from "react";
import { LocalStateBackupWithId } from "../useCurrentSelectedBackup";
import { HistoryFile } from "../useStoredValues";
import { LogMessage } from "./useLogs";
import { convertMilisIntoReadable } from "../../utils/overview/convertMilisIntoReadable";
import { invoke } from "@tauri-apps/api/core";

export default function useExecutebackups(
	backup: LocalStateBackupWithId,
	addEntryToLogs: ({ type, value }: LogMessage) => void,
	clearLogs: () => void,
	storedHistory: HistoryFile | null,
	setStoredHistory: Dispatch<SetStateAction<HistoryFile | null>>
) {
	// Clear logs as soon as the selectedBackup changes
	useEffect(() => {
		clearLogs();
	}, [backup])

	async function executeBackup() {
		// Clear the logs on start
		clearLogs();

		// Track starting time
		const startTime = Date.now();

		// Create backup-parent folder
		const backup_parent_folder_path = (await invoke(
			"create_backup_parent_folder",
			{
				backupName: backup[1].name,
				isZipped: backup[1].isZipped,
				inputBackupLocation: backup[1].location
			}
		)) as { ParentFolderPath: string } | { Error: boolean };

		if ("Error" in backup_parent_folder_path) {
			addEntryToLogs({
				type: "error",
				value: `Failed to create the backup-parent folder.`
			});
			return;
		} else {
			addEntryToLogs({
				type: "success",
				value: `Successfully created the backup-parent folder.`
			});
		}

		// Return when the value isn't ok for some reason
		if (
			!(
				"ParentFolderPath" in backup_parent_folder_path &&
				typeof backup_parent_folder_path.ParentFolderPath === "string"
			)
		) {
			return;
		}

		// Only take active folder entries
		const activeFolders: Array<{
			origin: string;
			target: string;
			filters: {
				max_size_in_mb: number | null;
				included_file_types: Array<string> | null;
				included_file_names: Array<string> | null;
			};
		}> = [];
		[...backup[1].entries].map(entry => {
			if (entry[1].is_active) {
				activeFolders.push({
					origin: entry[1].origin,
					target: entry[1].target,
					filters: entry[1].filters
				});
			}
		});

		addEntryToLogs({ type: "info", value: "Started to copy the folders." });

		// for (const activeFolder of activeFolders) {
		// Call execution for all remaining items
		const executionResult = (await invoke("copy_origin_to_target", {
			allBackupEntries: activeFolders,
			backupParentFolderPath: backup_parent_folder_path.ParentFolderPath,
			isZipped: backup[1].isZipped
		})) as null | {
			skipped_files: string[];
			successful_copies: {
				origin: string;
				target: string;
			}[];
			failed_copies: {
				origin: string;
				target: string;
			}[];
		};

		// If execution failed
		if (executionResult === null) {
			addEntryToLogs({
				type: "error",
				value: `Failed backup execution.`
			});
		} else {
			for (const skippedFile of executionResult.skipped_files) {
				addEntryToLogs({
					type: "skip",
					value: `Skipped file ${skippedFile}'.`
				});
			}

			for (const failedCopy of executionResult.failed_copies) {
				addEntryToLogs({
					type: "error",
					value: `Failed to copy '${failedCopy.origin}' to '${failedCopy.target}'.`
				});
			}

			for (const successfulCopy of executionResult.successful_copies) {
				addEntryToLogs({
					type: "success",
					value: `Successfully copied '${successfulCopy.origin}' to '${successfulCopy.target}'.`
				});
			}
		}

		// Add entry to history
		const newHistory = new Map(storedHistory);
		newHistory.set(new Date().getTime(), backup[0]); // = backupId
		setStoredHistory(newHistory);

		addEntryToLogs({ type: "info", value: "Add new entry to history." });
		addEntryToLogs({
			type: "finish",
			value: `Finished the backup-execution in ${convertMilisIntoReadable(
				Date.now() - startTime
			)}.`
		});
	}

	return {
		executeBackup
	};
}
