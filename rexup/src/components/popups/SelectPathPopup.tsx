import type { Dispatch, SetStateAction } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import useSelectFolderPopup from "../../hooks/popups/useSelectPathPopup";
import Button from "../ui-lib/Buttons";
import Popup from "../ui-lib/Popup";
import { SpacingLarge, SpacingMedium, SpacingSmall } from "../ui-lib/Spacing";
import { HeadingIII, HighlightedTextBlock, TextBlock } from "../ui-lib/Texts";
import Bookmark from "./path-selector/Bookmark";
import FolderOrFile from "./path-selector/FolderOrFile";

export default function SelectFolderPopup({
	isShown,
	setFinalPath,
	setIsShown,
}: {
	isShown: boolean;
	setFinalPath: (path: string, variant: "file" | "folder") => void;
	setIsShown: Dispatch<SetStateAction<boolean>>;
}) {
	const {
		path,
		pathElements,
		dirEntries,
		drives,
		appendToPath,
		modifyPath,
		updatePath,
		setPathElements,
		sortDirEntries,
	} = useSelectFolderPopup(isShown);

	const { wrapper } = useFadeInOut(isShown);

	function localConfirm() {
		if (pathElements.at(-1) === undefined) return;

		setFinalPath(path, pathElements.at(-1)!.variant);
		setIsShown(false);
	}

	function localCancel() {
		setIsShown(false);
	}

	return (
		<Popup
			onCancelAction={localCancel}
			onConfirmAction={localConfirm}
			wrapperRef={wrapper}
		>
			<div className="flex flex-col content-start min-w-[600px] min-h-[400px]">
				<HeadingIII>Select path</HeadingIII>
				<SpacingMedium />
				<div className="flex gap-2 overflow-x-scroll pb-1">
					<HighlightedTextBlock>Path</HighlightedTextBlock>
					{pathElements
						// Dont render the last element when its a file
						.filter(
							(element, index) =>
								!(
									index === pathElements.length - 1 &&
									element.variant === "file"
								),
						)
						.map((entry) => (
							<Button
								key={entry.pathValue}
								meaning="neutral"
								onClick={() => modifyPath(entry.pathAfterClick)}
								text={entry.pathValue}
								variant="small"
							/>
						))}
				</div>
				<SpacingSmall />
				<div className="grid grid-cols-[150px_auto] grid-rows-1 gap-x-8">
					<div className="row-start-1 row-end-3 col-start-1 grid gap-2 self-start">
						<HighlightedTextBlock>Bookmarks:</HighlightedTextBlock>
						<Bookmark
							text="Desktop"
							onClick={() => updatePath("desktop")}
							type="bookmark"
						/>
						<Bookmark
							text="Downloads"
							onClick={() => updatePath("downloads")}
							type="bookmark"
						/>
						<Bookmark
							text="Documents"
							onClick={() => updatePath("documents")}
							type="bookmark"
						/>
						{drives.map((drive) => (
							<Bookmark
								key={drive}
								text={drive}
								onClick={() =>
									setPathElements([
										{
											pathAfterClick: drive,
											pathValue: drive,
											variant: "folder",
										},
									])
								}
								type="drive"
							/>
						))}
					</div>
					<div className="col-start-2">
						<HighlightedTextBlock>
							<SpacingSmall />
							<TextBlock>Folders in this directory:</TextBlock>
						</HighlightedTextBlock>
						<SpacingSmall />
						<div
							className={`h-[200px] grid gap-1 ${
								dirEntries.length !== 0 ? "content-start" : "content-center"
							} overflow-y-scroll pr-1`}
						>
							{dirEntries.length !== 0 ? (
								sortDirEntries(dirEntries).map((entry) => (
									<FolderOrFile
										key={entry.name}
										text={entry.name}
										onClick={() => appendToPath(entry)}
										variant={entry.variant}
										isHidden={entry.is_hidden}
										isHighlighted={entry.name === path.split("\\").at(-1)} // Highlight when the last element in pathElements has the same name as this entry
									/>
								))
							) : (
								<div className="text-center self-center">
									<HighlightedTextBlock>:/ </HighlightedTextBlock>
									<HighlightedTextBlock>
										There don't exist any entries in this folder
									</HighlightedTextBlock>
								</div>
							)}
						</div>
					</div>
				</div>
				<SpacingLarge />
				<div className="flex gap-4 mt-auto self-end">
					<Button text="Cancel" meaning="neutral" onClick={localCancel} />
					<Button text="Select" meaning="positive" onClick={localConfirm} />
				</div>
			</div>
		</Popup>
	);
}
