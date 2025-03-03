import { useState } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import { LocalStateBackupEntry } from "../../hooks/useCurrentSelectedBackup";
import Button from "../ui-lib/Buttons";
import { HeadingIII, HighlightedTextBlock, TextBlock } from "../ui-lib/Texts";
import Inputs from "../ui-lib/Inputs";
import { SpacingMedium, SpacingSmall } from "../ui-lib/Spacing";
import SelectFolderPopup from "./SelectPathPopup";
import DocumentationPopup from "../overview/backupEntry/DocumentationPopup";
import useShowDocumentationPopup from "../../hooks/overview/backupEntry/useShowDocumentationPopup";
import ListFilters from "./edit-backup-entry/ListFilters";

export default function EditBackupEntryPopup({
	showPopup,
	hidePopup,
	folderEntry,
	updateOriginOrTarget,
	updateEntryVariant,
	updateMaxSizeFilter,
	updateListFilter,
	addNewEntry
}: {
	showPopup: boolean;
	hidePopup: () => void;
	folderEntry: [string, LocalStateBackupEntry];
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
	// Only is needed in Create-Entry-Popup
	addNewEntry?: () => void;
}) {
	const { wrapper } = useFadeInOut(showPopup);

	function updateOriginPath(path: string) {
		updateOriginOrTarget(folderEntry[0], "origin", path);
	}

	function updateTargetPath(path: string) {
		updateOriginOrTarget(folderEntry[0], "target", path);
	}

	const [showEditPathWindow, setShowEditPathWindow] = useState(false);

	// Controls whether to show the documentation-popup
	const { showDocumentation, hideDocumentation, documentationPopupRef } =
		useShowDocumentationPopup();

	return (
		<div
			ref={wrapper}
			className="hidden z-[1] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-8 py-6 max-w-[550px] outline-2 outline-gray-800 shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
			onKeyDown={async e => {
				switch (e.key) {
					case "Escape":
						hidePopup();
						break;
				}
			}}
			tabIndex={0}
		>
			<div className="absolute top-4 right-4">
				<Button
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								className="fill-gray-50"
								d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
							/>
						</svg>
					}
					onClick={() => hidePopup()}
					meaning="neutral"
				></Button>
			</div>
			<HeadingIII>{addNewEntry ? "Add" : "Edit"} Backup-Entry</HeadingIII>
			<SpacingMedium />
			{/* Change variant */}
			<HighlightedTextBlock>Change variant:</HighlightedTextBlock>
			<div className="flex gap-2 relative isolate">
				<div
					className={`rounded-md bg-gray-800 absolute h-full w-[80px] -z-10 transition-[left] ${
						folderEntry[1].variant === "folder" ? "left-[88px]" : "left-0"
					}`}
				></div>
				<div
					className="cursor-pointer my-[2px] text-center basis-[80px]"
					onClick={() => updateEntryVariant(folderEntry[0], "file")}
				>
					File
				</div>
				<div
					className="cursor-pointer my-[2px] text-center basis-[80px]"
					onClick={() => updateEntryVariant(folderEntry[0], "folder")}
				>
					Folder
				</div>
			</div>
			<SpacingSmall />
			{/* Modify origin path */}
			<HighlightedTextBlock>Origin path:</HighlightedTextBlock>
			<div className="flex gap-2">
				<Inputs
					value={folderEntry[1].origin}
					onChange={() => {}}
					placeholder="Origin path"
				/>
				<Button
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path d="M8 19q-.425 0-.712-.288T7 18t.288-.712T8 17h6.1q1.575 0 2.738-1T18 13.5T16.838 11T14.1 10H7.8l1.9 1.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275L4.7 9.7q-.15-.15-.213-.325T4.426 9t.063-.375T4.7 8.3l3.6-3.6q.275-.275.7-.275t.7.275t.275.7t-.275.7L7.8 8h6.3q2.425 0 4.163 1.575T20 13.5t-1.737 3.925T14.1 19z" />
						</svg>
					}
					meaning="neutral"
					variant="small"
					onClick={() => updateOriginPath("")}
				/>
				<Button
					text="Edit"
					meaning="neutral"
					variant="small"
					onClick={() => setShowEditPathWindow(true)}
				/>
				<SelectFolderPopup
					isShown={showEditPathWindow}
					setIsShown={setShowEditPathWindow}
					setFinalPath={path => {
						updateOriginPath(path);
					}}
					variant={folderEntry[1].variant}
				/>
			</div>
			<SpacingSmall />
			<HighlightedTextBlock>Target path:</HighlightedTextBlock>
			{/* Modify target path */}
			<div className="relative flex gap-2">
				<Inputs
					value={folderEntry[1].target}
					onChange={e => updateTargetPath(e.target.value)}
					placeholder="Target path"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					className={`transition-[fill] hover:cursor-pointer fill-gray-50`}
					onMouseEnter={showDocumentation}
					onMouseLeave={hideDocumentation}
				>
					<path d="M12 16.5q.214 0 .357-.144T12.5 16v-4.5q0-.213-.144-.356T11.999 11t-.356.144t-.143.356V16q0 .213.144.356t.357.144M12 9.577q.262 0 .439-.177t.176-.438t-.177-.439T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709" />
				</svg>
				{/* Documentation Popup */}
				<DocumentationPopup
					documentationPopupRef={documentationPopupRef}
					inputs={folderEntry[1]}
					offset="-top-[132px] left-0"
				/>
			</div>
			<SpacingSmall />
			{/* Filter section (hidden if variant is file) */}
			<div
				className={`transition-opacity ${
					folderEntry[1].variant === "folder" ? "opacity-100" : "opacity-50"
				}`}
			>
				<HighlightedTextBlock>Filters:</HighlightedTextBlock>
				{/* Max file size filter */}
				<div>
					<TextBlock>Maximum file size in MB:</TextBlock>
					<Inputs
						disabled={folderEntry[1].variant === "file"}
						value={
							folderEntry[1].filters.max_size_in_mb === null
								? ""
								: folderEntry[1].filters.max_size_in_mb.toString()
						}
						onChange={e => updateMaxSizeFilter(folderEntry[0], e.target.value)}
						placeholder="Leave empty to disable filter"
						type="number"
					/>
				</div>
				{/* File names filter */}
				<ListFilters
					text="Included file names:"
					folderEntryId={folderEntry[0]}
					folderEntryFilterList={folderEntry[1].filters.included_file_names}
					updateListFilter={(id, value) =>
						updateListFilter(id, "included_file_names", value)
					}
				/>
				{/* File types filter */}
				<ListFilters
					text="Included file types:"
					folderEntryId={folderEntry[0]}
					folderEntryFilterList={folderEntry[1].filters.included_file_types}
					updateListFilter={(id, value) =>
						updateListFilter(id, "included_file_types", value)
					}
				/>
			</div>
			{/* Add-btn is only shown if there's an addNewEntry function passed as argument */}
			{addNewEntry && (
				<>
					<SpacingMedium />
					<Button meaning="positive" text="Add" onClick={addNewEntry} />
				</>
			)}
		</div>
	);
}
