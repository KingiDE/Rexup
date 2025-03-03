import { useEffect, useState } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import Popup from "../ui-lib/Popup";
import { DescriptionBlock, HeadingIII } from "../ui-lib/Texts";
import Button from "../ui-lib/Buttons";
import Inputs from "../ui-lib/Inputs";
import { SpacingLarge, SpacingSmall } from "../ui-lib/Spacing";
import { CurrentPopup } from "../../App";

export default function RenameBackupPopup({
	localRenameBackup,
	onCancel,
	currentPopup
}: {
	localRenameBackup: (backupId: string, value: string) => void;
	onCancel: () => void;
	currentPopup: CurrentPopup;
}) {
	useEffect(() => {
		if (
			currentPopup &&
			currentPopup.value &&
			currentPopup.variant === "renamebackup"
		) {
			setInput(currentPopup.value[1].name);
			setInvalidInput(currentPopup.value[1].name === "");
		}
	}, [currentPopup]);

	const { wrapper } = useFadeInOut(
		currentPopup !== null && currentPopup.variant === "renamebackup"
	);

	const [input, setInput] = useState(
		currentPopup &&
			currentPopup.value &&
			currentPopup.variant === "renamebackup"
			? currentPopup.value[1].name
			: ""
	);

	const [invalidInput, setInvalidInput] = useState(
		(currentPopup &&
		currentPopup.value &&
		currentPopup.variant === "renamebackup"
			? currentPopup.value[1].name
			: "") === ""
	);
	const [triedToSubmit, setTriedToSubmit] = useState(false);

	useEffect(() => {
		setInvalidInput(input === "");
	}, [input]);

	// Can both be executed by hotkeying or clicking the btn
	async function executeRenameBackup() {
		if (
			invalidInput ||
			currentPopup === null ||
			currentPopup.variant !== "renamebackup"
		)
			return;
		setTriedToSubmit(true);
		localRenameBackup(currentPopup.value[0], input);
	}

	async function executeCancelBackup() {
		onCancel();
	}

	return (
		<Popup
			wrapperRef={wrapper}
			onConfirmAction={executeRenameBackup}
			onCancelAction={executeCancelBackup}
		>
			<HeadingIII>Rename Backup</HeadingIII>
			<DescriptionBlock>
				Rename the current selected backup. Type the new name of the backup into
				the input field and press 'Confirm' to create it.
			</DescriptionBlock>
			<SpacingSmall />
			<Inputs
				onChange={e => setInput(e.target.value)}
				value={input}
				placeholder="New Backup Name"
				invalidInputs={invalidInput && triedToSubmit}
			/>
			<SpacingLarge />
			<div className="flex gap-4">
				<Button text="Cancel" meaning="neutral" onClick={executeCancelBackup} />
				<div className={`${invalidInput ? "opacity-50" : ""}`}>
					<Button
						text="Rename"
						meaning="positive"
						onClick={executeRenameBackup}
						disabled={invalidInput}
					/>
				</div>
			</div>
		</Popup>
	);
}
