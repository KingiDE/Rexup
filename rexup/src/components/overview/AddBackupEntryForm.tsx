import type React from "react";
import type { CurrentPopup } from "../../App";
import type { LocalStateBackupEntry } from "../../hooks/useCurrentSelectedBackup";
import EditBackupEntryPopup from "../popups/EditBackupEntryPopup";
import Button from "../ui-lib/Buttons";

export function AddBackupEntryForm({
	inputs,
	setInputss,
	addNewEntry,
	currentPopup,
	setCurrentPopup,
}: {
	inputs: LocalStateBackupEntry;
	setInputss: React.Dispatch<React.SetStateAction<LocalStateBackupEntry>>;
	addNewEntry: () => void;
	currentPopup: CurrentPopup;
	setCurrentPopup: React.Dispatch<React.SetStateAction<CurrentPopup>>;
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
				onClick={() =>
					setCurrentPopup({ variant: "addbackupentry", value: null })
				}
			/>
			<EditBackupEntryPopup
				showPopupp={
					currentPopup !== null && currentPopup.variant === "addbackupentry"
				}
				hidePopup={() => setCurrentPopup(null)}
				folderEntry={["not used", inputs]}
				updateOriginOrTarget={(_id, field, value) => {
					setInputss((prevInputs) => {
						return { ...prevInputs, [field]: value };
					});
				}}
				updateEntryVariant={(_id, variant) => {
					setInputss((prevInputs) => {
						return { ...prevInputs, variant };
					});
				}}
				updateMaxSizeFilter={(_id, value) => {
					setInputss({
						...inputs,
						filters: {
							...inputs.filters,
							max_size_in_mb:
								value === ""
									? null
									: Number.isNaN(Number(value))
										? 0
										: Number(value),
						},
					});
				}}
				updateListFilter={(_id, filter, value) => {
					setInputss({
						...inputs,
						filters: { ...inputs.filters, [filter]: value },
					});
				}}
				addNewEntry={addNewEntry}
			/>
		</>
	);
}
