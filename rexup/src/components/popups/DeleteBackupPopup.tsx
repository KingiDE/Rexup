import { Dispatch, SetStateAction } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import { LocalStateBackupWithId } from "../../hooks/useCurrentSelectedBackup";
import Popup from "../ui-lib/Popup";
import { DescriptionBlock, HeadingIII } from "../ui-lib/Texts";
import Button from "../ui-lib/Buttons";
import { SpacingSmall } from "../ui-lib/Spacing";
import { CurrentPopup } from "../../App";

export default function DeleteBackupWarning({
	localDeleteBackup,
	setCurrentPopup,
	currentPopup
}: {
	currentSelectedBackup: LocalStateBackupWithId | null;
	localDeleteBackup(backupId: string): void;
	setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
	currentPopup: CurrentPopup;
}) {
	async function executeCancelDeletion() {
		setCurrentPopup(null);
	}

	const { wrapper } = useFadeInOut(
		currentPopup !== null && currentPopup.variant === "deletebackup"
	);

	return (
		<Popup
			wrapperRef={wrapper}
			onConfirmAction={() =>
				localDeleteBackup(
					currentPopup && currentPopup.value ? currentPopup.value[0] : ""
				)
			}
			onCancelAction={executeCancelDeletion}
		>
			<HeadingIII>Delete Backup</HeadingIII>
			<DescriptionBlock>
				Carefully read this warning: Do you really want to delete the backup
				called "
				{currentPopup &&
				currentPopup.value &&
				currentPopup.variant === "deletebackup"
					? currentPopup.value[1].name
					: ""}
				"? This action cannot be undone.
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
					onClick={() =>
						localDeleteBackup(
							currentPopup && currentPopup.value ? currentPopup.value[0] : ""
						)
					}
					meaning="negative"
				/>
			</div>
		</Popup>
	);
}
