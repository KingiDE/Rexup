import { Dispatch, SetStateAction } from "react";
import useFadeIn from "../../hooks/popups/useFadeInOut";
import { LocalStateBackupEntry } from "../../hooks/useCurrentSelectedBackup";
import Popup from "../ui-lib/Popup";
import { DescriptionBlock, HeadingIII } from "../ui-lib/Texts";
import { SpacingSmall } from "../ui-lib/Spacing";
import Button from "../ui-lib/Buttons";

export default function DeleteBackupEntryPoup({
	backupToDelete,
	setBackupToDelete,
	deleteBackupEntry
}: {
	backupToDelete: [string, LocalStateBackupEntry] | null;
	setBackupToDelete: Dispatch<
		SetStateAction<[string, LocalStateBackupEntry] | null>
	>;
	deleteBackupEntry: (id: string) => void;
}) {
	const { wrapper, fadeOut } = useFadeIn(backupToDelete !== null);

	function executeCancelDeletion() {
		setBackupToDelete(null);
		fadeOut();
	}

	function localDeleteBackupEntry() {
		if (!backupToDelete) return;

		deleteBackupEntry(backupToDelete[0]);
		setBackupToDelete(null);
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
