import React from "react";
import Button from "../ui-lib/Buttons";
import EditBackupEntryPopup from "../popups/EditBackupEntryPopup";
import { LocalStateBackupEntry } from "../../hooks/useCurrentSelectedBackup";

export function AddBackupEntryForm({
	inputs,
	setInputs,
	addNewEntry,
	showAddBackupEntryPopup,
	setShowAddBackupEntryPopup
}: {
	inputs: LocalStateBackupEntry;
	setInputs: React.Dispatch<React.SetStateAction<LocalStateBackupEntry>>;
	addNewEntry: () => void;
	showAddBackupEntryPopup: boolean;
	setShowAddBackupEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	return (
		<>
			<Button
				meaning="neutral"
				text="Add entry"
				variant="small"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						className="fill-gray-50"
					>
						<path d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z" />
					</svg>
				}
				onClick={() => setShowAddBackupEntryPopup(true)}
			/>
			<EditBackupEntryPopup
				showEditBackupEntryPopup={showAddBackupEntryPopup}
				setShowEditBackupEntryPopup={setShowAddBackupEntryPopup}
				folderEntry={["not used", inputs]}
				updateOriginOrTarget={(_id, field, value) => {
					setInputs({ ...inputs, [field]: value });
				}}
				updateEntryVariant={(_id, variant) => {
					setInputs({ ...inputs, origin: "", target: "", variant: variant });
				}}
				updateMaxSizeFilter={(_id, value) => {
					setInputs({
						...inputs,
						filters: {
							...inputs.filters,
							max_size_in_mb:
								value === "" ? null : isNaN(Number(value)) ? 0 : Number(value)
						}
					});
				}}
				updateListFilter={(_id, filter, value) => {
					setInputs({
						...inputs,
						filters: { ...inputs.filters, [filter]: value }
					});
				}}
				addNewEntry={addNewEntry}
			/>
		</>
	);
}
