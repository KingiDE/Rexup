import React, { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import {
	LocalStateBackupEntry,
	LocalStateBackupWithId
} from "../hooks/useCurrentSelectedBackup";
import { BackupsFile, ConfigFile, HistoryFile } from "../hooks/useStoredValues";
import useBackupsEntries from "../hooks/useBackupsEntries";
import { BackupEntry } from "./overview/BackupEntry";
import { AddBackupEntryForm } from "./overview/AddBackupEntryForm";
import NoBackupSelectedScreen from "./overview/NoBackupSelectedScreen";
import History from "./overview/HistoryLog";
import useExecuteBackup from "../hooks/overview/useExecuteBackup";
import useLogs from "../hooks/overview/useLogs";
import { HeadingII, HeadingIII, Text } from "./ui-lib/Texts";
import { SpacingLarge, SpacingSmall, SpacingXL } from "./ui-lib/Spacing";
import { CurrentPopup } from "../App";
import ExecutionLogsSection from "./overview/ExecutionLogsSection";
import ExecuteAndConfigureSection from "./overview/ExecuteAndConfigureSection";
import DeleteBackupEntryPoup from "./popups/DeleteBackupEntryPoup";

export default function Overview({
	currentSelectedBackup,
	storedHistory,
	storedConfig,
	storedBackups,
	setStoredHistory,
	setStoredBackups,
	setCurrentPopup,
	currentPopup
}: {
	currentSelectedBackup: LocalStateBackupWithId | null;
	storedHistory: HistoryFile | null;
	storedConfig: ConfigFile | null;
	storedBackups: BackupsFile | null;
	setStoredHistory: Dispatch<SetStateAction<HistoryFile | null>>;
	setStoredBackups: Dispatch<SetStateAction<BackupsFile | null>>;
	setCurrentPopup: React.Dispatch<React.SetStateAction<CurrentPopup>>;
	currentPopup: CurrentPopup;
}) {
	if (currentSelectedBackup === null) return <NoBackupSelectedScreen />;

	// Handles showing the add-backup-entry popup
	const [showAddBackupEntryPopup, setShowAddBackupEntryPopup] = useState(false);

	useEffect(() => {
		if (currentPopup !== null) {
			setShowAddBackupEntryPopup(false);
		}
	}, [currentPopup]);

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
		toggleIsEntryActive
	} = useBackupsEntries(
		currentSelectedBackup,
		storedBackups,
		setStoredBackups,
		setShowAddBackupEntryPopup
	);

	// Handles the logic when executing the backup
	const { addEntryToLogs, clearLogs, logs } = useLogs();
	const { executeBackup } = useExecuteBackup(
		currentSelectedBackup,
		addEntryToLogs,
		clearLogs,
		storedHistory,
		setStoredHistory
	);

	// Deletion of backup-entry is placed here due to fact that fade-out wouldn't work after the parent-html is already deleted
	const [backupToDelete, setBackupToDelete] = useState<
		[string, LocalStateBackupEntry] | null
	>(null);

	return (
		<div className="bg-gray-900 rounded-md p-4 h-full">
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
				backupToDelete={backupToDelete}
				setBackupToDelete={setBackupToDelete}
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
					{[...currentSelectedBackup[1].entries].map(folder => {
						return (
							<BackupEntry
								key={folder[0]}
								folderEntry={folder}
								removeEntry={backup => setBackupToDelete(backup)}
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
			{/* Add entry form */}
			<AddBackupEntryForm
				inputs={inputs}
				setInputs={setInputs}
				addNewEntry={addNewEntry}
				showAddBackupEntryPopup={showAddBackupEntryPopup}
				setShowAddBackupEntryPopup={setShowAddBackupEntryPopup}
			/>
		</div>
	);
}
