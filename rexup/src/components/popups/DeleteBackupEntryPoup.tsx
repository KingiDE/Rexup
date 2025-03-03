import { Dispatch, SetStateAction } from "react";
import useFadeIn from "../../hooks/popups/useFadeInOut";
import Popup from "../ui-lib/Popup";
import { DescriptionBlock, HeadingIII } from "../ui-lib/Texts";
import { SpacingSmall } from "../ui-lib/Spacing";
import Button from "../ui-lib/Buttons";
import { CurrentPopup } from "../../App";

export default function DeleteBackupEntryPoup({
	currentPopup,
	setCurrentPopup,
	deleteBackupEntry
}: {
	currentPopup: CurrentPopup;
	setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
	deleteBackupEntry: (id: string) => void;
}) {
	const { wrapper, fadeOut } = useFadeIn(
		currentPopup !== null && currentPopup.variant === "removebackupentry"
	);

	// Cancel deletion
	function executeCancelDeletion() {
		setCurrentPopup(null);
		fadeOut();
	}

	// Confirm deletion
	function localDeleteBackupEntry() {
		if (currentPopup === null || currentPopup.variant !== "removebackupentry")
			return;

		deleteBackupEntry(currentPopup.value[0]);
		setCurrentPopup(null);
	}

	return (
		<Popup
			wrapperRef={wrapper}
			onCancelAction={executeCancelDeletion}
			onConfirmAction={localDeleteBackupEntry}
		>
			<HeadingIII>Delete Backup Entry</HeadingIII>
			<DescriptionBlock>
				Carefully read this warning: Do you really want to delete this backup
				entry? This action cannot be undone.
			</DescriptionBlock>
			<SpacingSmall />
			<div className="flex gap-4 mt-8">
				<Button
					text="Cancel"
					onClick={executeCancelDeletion}
					meaning="neutral"
				/>
				<Button
					text="Delete"
					onClick={localDeleteBackupEntry}
					meaning="negative"
				/>
			</div>
		</Popup>
	);
}
