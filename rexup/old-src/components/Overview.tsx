import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CurrentPopup } from "../App";
import useExecuteBackup from "../hooks/overview/useExecuteBackup";
import useLogs from "../hooks/overview/useLogs";
import useBackupsEntries from "../hooks/useBackupsEntries";
import type { LocalStateBackupWithId } from "../hooks/useCurrentSelectedBackup";
import type {
	BackupsFile,
	ConfigFile,
	HistoryFile,
} from "../hooks/useStoredValues";
import { AddBackupEntryForm } from "./overview/AddBackupEntryForm";
import { BackupEntry } from "./overview/BackupEntry";
import ExecuteAndConfigureSection from "./overview/ExecuteAndConfigureSection";
import ExecutionLogsSection from "./overview/ExecutionLogsSection";
import History from "./overview/HistoryLog";
import NoBackupSelectedScreen from "./overview/NoBackupSelectedScreen";
import DeleteBackupEntryPoup from "./popups/DeleteBackupEntryPoup";
import { SpacingLarge, SpacingSmall, SpacingXL } from "./ui-lib/Spacing";
import { HeadingII, HeadingIII, Text } from "./ui-lib/Texts";

export default function Overview({
	currentSelectedBackup,
	storedHistory,
	storedConfig,
	storedBackups,
	setStoredHistory,
	setStoredBackups,
	currentPopup,
	setCurrentPopup,
}: {
	currentSelectedBackup: LocalStateBackupWithId | null;
	storedHistory: HistoryFile | null;
	storedConfig: ConfigFile | null;
	storedBackups: BackupsFile | null;
	setStoredHistory: Dispatch<SetStateAction<HistoryFile | null>>;
	setStoredBackups: Dispatch<SetStateAction<BackupsFile | null>>;
	currentPopup: CurrentPopup;
	setCurrentPopup: React.Dispatch<React.SetStateAction<CurrentPopup>>;
}) {
	if (currentSelectedBackup === null) return <NoBackupSelectedScreen />;

	// Handles adding new, modifying new or existing folderEntries and deleting them
	const {
		addNewEntry,
		deleteBackupEntry,
		inputs,
		setInputs,
		updateOriginOrTarget,
		updateEntryVariant,
		updateMaxSizeFilter,
		updateListFilter,
		toggleIsEntryActive,
	} = useBackupsEntries(
		currentSelectedBackup,
		storedBackups,
		setStoredBackups,
		setCurrentPopup,
	);

	// Handles the logic when executing the backup
	const { addEntryToLogs, clearLogs, logs } = useLogs();
	const { executeBackup } = useExecuteBackup(
		currentSelectedBackup,
		addEntryToLogs,
		clearLogs,
		storedHistory,
		setStoredHistory,
	);

	return (
		<div className="bg-gray-900 rounded-md p-4 min-h-full">
			{/* Header */}
			<HeadingII>
				Overview of Backup: "{currentSelectedBackup[1].name}"
			</HeadingII>
			<SpacingXL />
			{/* Execute and configure */}
			<ExecuteAndConfigureSection
				setCurrentPopup={setCurrentPopup}
				currentSelectedBackup={currentSelectedBackup}
				executeBackup={executeBackup}
			/>
			<SpacingLarge />
			{/* Execution logs */}
			<ExecutionLogsSection logs={logs} />
			<SpacingLarge />
			{/* History */}
			{storedConfig?.show_history ? (
				<>
					<HeadingIII>History:</HeadingIII>
					<History
						storedHistory={storedHistory}
						currentSelectedBackup={currentSelectedBackup}
					/>
				</>
			) : null}
			<SpacingLarge />
			{/* Backup-Entry delete popup */}
			<DeleteBackupEntryPoup
				currentPopup={currentPopup}
				setCurrentPopup={setCurrentPopup}
				deleteBackupEntry={deleteBackupEntry}
			/>
			{/* Contents */}
			<div className="flex items-end gap-4">
				<HeadingIII>Content:</HeadingIII>
				{storedConfig?.show_edit_warning ? (
					<div className="self-end flex gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							className="fill-yellow-400"
						>
							<path d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15" />
						</svg>
						<Text>Only edit the backup if you know what you're doing!</Text>
					</div>
				) : null}
			</div>
			{/* List all existing folders */}
			<SpacingSmall />
			{currentSelectedBackup[1].entries.size > 0 ? (
				<div className="inline-grid gap-2">
					{[...currentSelectedBackup[1].entries].map((folder) => {
						return (
							<BackupEntry
								key={folder[0]}
								folderEntry={folder}
								removeEntry={(backupEntry) => {
									setCurrentPopup({
										variant: "removebackupentry",
										value: backupEntry,
									});
								}}
								updateOriginOrTarget={updateOriginOrTarget}
								updateEntryVariant={updateEntryVariant}
								updateMaxSizeFilter={updateMaxSizeFilter}
								updateListFilter={updateListFilter}
								toggleIsEntryActive={toggleIsEntryActive}
								currentPopup={currentPopup}
							/>
						);
					})}
				</div>
			) : null}
			<SpacingSmall />
			{/* Add entry form + button */}
			<AddBackupEntryForm
				inputs={inputs}
				setInputs={setInputs}
				addNewEntry={addNewEntry}
				currentPopup={currentPopup}
				setCurrentPopup={setCurrentPopup}
			/>
		</div>
	);
}
