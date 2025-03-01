import { Dispatch, SetStateAction, useState } from "react";
import { SpacingMedium, SpacingSmall } from "../ui-lib/Spacing";
import { Description, HeadingIII, HighlightedTextBlock } from "../ui-lib/Texts";
import Window from "../ui-lib/Window";
import CheckboxEntry from "../ui-lib/CheckboxEntry";
import { LocalStateBackupWithId } from "../../hooks/useCurrentSelectedBackup";
import { CurrentPopup } from "../../App";
import Inputs from "../ui-lib/Inputs";
import Button from "../ui-lib/Buttons";
import SelectFolderPopup from "./SelectPathPopup";

export default function ConfigureBackupPopup({
  setCurrentPopup,
  currentPopup,
  toggleBackupZipping,
  updateBackupLocation,
}: {
  currentPopup: CurrentPopup;
  setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
  currentSelectedBackup: LocalStateBackupWithId | null;
  toggleBackupZipping: (backupId: string) => void;
  updateBackupLocation: (backupId: string, value: string) => void;
}) {
  const [isShown, setIsShown] = useState(false);

  return (
    <Window
      currentPopup={currentPopup}
      setCurrentPopup={setCurrentPopup}
      neededPopup="configurebackup"
    >
      <HeadingIII>Configure Backup</HeadingIII>
      <SpacingMedium />
      <CheckboxEntry
        title="Zip folder after execution"
        description="Enable or disable the zipping of the created backup after the execution of the backup."
        onClick={() =>
          toggleBackupZipping(
            currentPopup && currentPopup.value ? currentPopup.value[0] : "",
          )
        }
        value={
          currentPopup && currentPopup.value
            ? currentPopup.value[1].isZipped
            : false
        }
      />
      <SpacingSmall />
      <HighlightedTextBlock>
        Configure the path of the created backup
      </HighlightedTextBlock>
      <Description>
        The backup will be created inside the given directory. Note that the
        creation will fail if you don't have access to write at this location.
      </Description>
      <SpacingSmall />
      <div className="flex gap-2">
        <Inputs
          value={
            currentPopup && currentPopup.value
              ? currentPopup.value[1].location
              : ""
          }
          onChange={() => {}}
          placeholder="Your desktop"
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
          onClick={() =>
            updateBackupLocation(
              currentPopup && currentPopup.value ? currentPopup.value[0] : "",
              "",
            )
          }
        />
        <Button
          text="Edit"
          meaning="neutral"
          variant="small"
          onClick={() => setIsShown(true)}
        />
      </div>
      <SelectFolderPopup
        isShown={isShown}
        setIsShown={setIsShown}
        setFinalPath={(path) => {
          updateBackupLocation(
            currentPopup && currentPopup.value ? currentPopup.value[0] : "",
            path,
          );
        }}
        variant="folder"
      />
    </Window>
  );
}
