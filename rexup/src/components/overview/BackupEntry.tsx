import { LocalStateBackupEntry } from "../../hooks/useCurrentSelectedBackup";
import { SpacingSmall } from "../ui-lib/Spacing";
import EditBackupEntryPopup from "../popups/EditBackupEntryPopup";
import { useEffect, useState } from "react";
import { CurrentPopup } from "../../App";
import BottomRow from "./backupEntry/BottomRow";
import TopRow from "./backupEntry/TopRow";

export function BackupEntry({
	folderEntry,
	removeEntry,
	updateOriginOrTarget,
	updateEntryVariant,
	updateMaxSizeFilter,
	updateListFilter,
	toggleIsEntryActive,
	currentPopup
}: {
	folderEntry: [string, LocalStateBackupEntry];
	removeEntry: (backup: [string, LocalStateBackupEntry]) => void;
	updateOriginOrTarget: (
		id: string,
		field: "origin" | "target",
		value: string
	) => void;
	updateEntryVariant: (
		folderPairId: string,
		variant: "file" | "folder"
	) => void;
	updateMaxSizeFilter: (folderPairId: string, value: string) => void;
	updateListFilter: (
		folderPairId: string,
		filter: "included_file_names" | "included_file_types",
		value: string[] | null
	) => void;
	toggleIsEntryActive: (id: string) => void;
	currentPopup: CurrentPopup;
}) {
	const [showEditBackupEntryPopup, setShowEditBackupEntryPopup] =
		useState(false);

	useEffect(() => {
		if (currentPopup !== null) {
			setShowEditBackupEntryPopup(false);
		}
	}, [currentPopup]);

	return (
		<div
			className={`relative rounded-md bg-gray-800 p-4 min-w-[400px] outline outline-2 -outline-offset-1 transition-[outline] ${folderEntry[1].origin === "" || folderEntry[1].target === "" ? "outline-yellow-500" : "outline-transparent"}`}
		>
			<EditBackupEntryPopup
				showPopup={showEditBackupEntryPopup}
				hidePopup={() => setShowEditBackupEntryPopup(false)}
				folderEntry={folderEntry}
				updateOriginOrTarget={updateOriginOrTarget}
				updateEntryVariant={updateEntryVariant}
				updateMaxSizeFilter={updateMaxSizeFilter}
				updateListFilter={updateListFilter}
			/>
			{/* Contains the entire top row: Documentation Popup, Origin in short form, Target in short form */}
			<TopRow folderEntry={folderEntry} />
			<SpacingSmall />
			{/* Contains the entire bottom row: Filters in short form, Disable, Delete, Edit */}
			<BottomRow
				folderEntry={folderEntry}
				removeEntry={removeEntry}
				setShowEditBackupEntryPopup={setShowEditBackupEntryPopup}
				toggleIsEntryActive={toggleIsEntryActive}
			/>
		</div>
	);
}
