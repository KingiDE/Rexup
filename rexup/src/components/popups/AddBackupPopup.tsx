import { useEffect, useState } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import Popup from "../ui-lib/Popup";
import { DescriptionBlock, HeadingIII } from "../ui-lib/Texts";
import Button from "../ui-lib/Buttons";
import Inputs from "../ui-lib/Inputs";
import { SpacingLarge, SpacingSmall } from "../ui-lib/Spacing";
import { CurrentPopup } from "../../App";

export default function AddBackupDialog({
  localCreateBackup,
  onCancel,
  currentPopup,
}: {
  localCreateBackup: (name: string) => void;
  onCancel: () => void;
  currentPopup: CurrentPopup;
}) {
  const { wrapper } = useFadeInOut(
    currentPopup !== null && currentPopup.variant === "addbackup",
  );

  const [input, setInput] = useState("");

  const [invalidInput, setInvalidInput] = useState(true);
  const [triedToSubmit, setTriedToSubmit] = useState(false);

  useEffect(() => {
    setInvalidInput(input === "");
  }, [input]);

  // Can both be executed by hotkeying or clicking the btn
  async function executeCreateBackup() {
    if (invalidInput) return;
    setTriedToSubmit(true);
    localCreateBackup(input);
    setInput("");
  }

  async function executeCancelBackup() {
    onCancel();
  }

  return (
    <Popup
      wrapperRef={wrapper}
      onConfirmAction={executeCreateBackup}
      onCancelAction={executeCancelBackup}
    >
      <HeadingIII>Add Backup</HeadingIII>
      <DescriptionBlock>
        Add a new backup to the list of existing backups. Type the name of the
        backup into the input field and press 'Confirm' to create it.
      </DescriptionBlock>
      <SpacingSmall />
      <Inputs
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Backup Name"
        invalidInputs={invalidInput && triedToSubmit}
      />
      <SpacingLarge />
      <div className="flex gap-4">
        <Button text="Cancel" meaning="neutral" onClick={executeCancelBackup} />
        <div className={`${invalidInput ? "opacity-50" : ""}`}>
          <Button
            text="Create"
            meaning="positive"
            onClick={executeCreateBackup}
            disabled={invalidInput}
          />
        </div>
      </div>
    </Popup>
  );
}
