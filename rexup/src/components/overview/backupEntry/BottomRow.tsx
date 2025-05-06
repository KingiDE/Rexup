import type { LocalStateBackupEntry } from "../../../hooks/useCurrentSelectedBackup";
import Button from "../../ui-lib/Buttons";
import { HighlightedTextBlock, Text } from "../../ui-lib/Texts";

export default function BottomRow({
	folderEntry,
	toggleIsEntryActive,
	removeEntry,
	setShowEditBackupEntryPopup,
}: {
	folderEntry: [string, LocalStateBackupEntry];
	toggleIsEntryActive: (id: string) => void;
	removeEntry: (backupEntry: [string, LocalStateBackupEntry]) => void;
	setShowEditBackupEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	function calculateTextForFilters() {
		const parts = [];
		if (folderEntry[1].variant === "folder") {
			const max_size_in_mb = folderEntry[1].filters.max_size_in_mb;
			const included_file_types = folderEntry[1].filters.included_file_types;
			const included_file_names = folderEntry[1].filters.included_file_names;

			if (max_size_in_mb !== null) {
				parts.push(`max. ${max_size_in_mb}MB size`);
			}
			if (included_file_types !== null) {
				parts.push(
					`${included_file_types.length} file-type${included_file_types.length > 1 ? "s" : ""}`,
				);
			}
			if (included_file_names !== null) {
				parts.push(
					`${included_file_names.length} file-name${included_file_names?.length > 1 ? "s" : ""}`,
				);
			}
		}

		return parts.join(", ");
	}

	return (
		<div className="flex gap-2 items-center">
			{/* Filters */}
			<div className="flex mr-auto">
				{folderEntry[1].variant === "folder" ? (
					<>
						<HighlightedTextBlock>Filters:</HighlightedTextBlock>
						<span className="ml-1">
							<Text>{calculateTextForFilters()}</Text>
						</span>
					</>
				) : null}
			</div>
			{/* Enable/Disable-btn */}
			<div className="min-w-[120px] grid">
				<Button
					text={folderEntry[1].is_active ? "Enabled" : "Disabled"}
					icon={
						folderEntry[1].is_active ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
							>
								<path d="m9 16.2l-3.5-3.5a.984.984 0 0 0-1.4 0a.984.984 0 0 0 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0z" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
							>
								<path d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z" />
							</svg>
						)
					}
					meaning="neutral"
					variant="small"
					onClick={() => toggleIsEntryActive(folderEntry[0])}
					isHidden={!folderEntry[1].is_active}
				/>
			</div>
			{/* Delete-btn */}
			<Button
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
					>
						<path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" />
					</svg>
				}
				variant="small"
				meaning="negative"
				onClick={() => removeEntry(folderEntry)}
			/>
			{/* Edit-btn */}
			<Button
				text="Edit"
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						className="fill-gray-50"
					>
						<path d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
					</svg>
				}
				meaning="positive"
				variant="small"
				onClick={() => setShowEditBackupEntryPopup(true)}
				isHidden={false}
			/>
		</div>
	);
}
