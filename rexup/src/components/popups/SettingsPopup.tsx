import { Dispatch, SetStateAction } from "react";
import { ConfigFile, HistoryFile } from "../../hooks/useStoredValues";
import Window from "../ui-lib/Window";
import {
  Description,
  DescriptionBlock,
  HeadingII,
  HighlightedTextBlock,
  Text,
} from "../ui-lib/Texts";
import Button from "../ui-lib/Buttons";
import { SpacingLarge, SpacingMedium, SpacingSmall } from "../ui-lib/Spacing";
import CheckboxEntry from "../ui-lib/CheckboxEntry";
import { CurrentPopup } from "../../App";

export default function Settings({
  setCurrentPopup,
  storedConfig,
  setStoredConfig,
  setStoredHistory,
  currentPopup,
}: {
  setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
  storedConfig: ConfigFile | null;
  setStoredConfig: Dispatch<SetStateAction<ConfigFile | null>>;
  setStoredHistory: Dispatch<SetStateAction<HistoryFile | null>>;
  currentPopup: CurrentPopup;
}) {
  // Deletes the backup execution-history
  function deleteBackupExecutionHistory() {
    setStoredHistory(new Map());
  }

  function togglePropertyInConfig(property: keyof ConfigFile) {
    if (storedConfig === null) return;
    const newConfig = { ...storedConfig };
    newConfig[property] = !storedConfig[property];
    setStoredConfig(newConfig);
  }

  return (
    <Window
      currentPopup={currentPopup}
      setCurrentPopup={setCurrentPopup}
      neededPopup="settings"
    >
      <HeadingII>Settings:</HeadingII>
      <SpacingMedium />
      <CheckboxEntry
        title="Show edit-warning"
        description="Enable or disable the appearence of the warning when editing an
          exisiting backup."
        onClick={() => togglePropertyInConfig("show_edit_warning")}
        value={storedConfig?.show_edit_warning ? true : false}
      />
      <SpacingSmall />
      <CheckboxEntry
        title="Show history"
        description="Enable or disable the appearence of the history at the top of an
          backup."
        onClick={() => togglePropertyInConfig("show_history")}
        value={storedConfig?.show_history ? true : false}
      />
      <SpacingSmall />
      <div>
        <HighlightedTextBlock>
          Delete backup execution history
        </HighlightedTextBlock>
        <Description>
          This button deletes the entire contents of the backup-history-file
          that recorded all executions of backups. This action CANNOT BE UNDONE!
        </Description>
        <SpacingSmall />
        <Button
          text="Delete history"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="fill-gray-50"
            >
              <path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" />
            </svg>
          }
          onClick={deleteBackupExecutionHistory}
          meaning="negative"
        />
      </div>
      <SpacingLarge />
      <HeadingII>Credits:</HeadingII>
      <SpacingMedium />
      <Text>
        KingiDE <Description>(Lead Developer)</Description>
      </Text>
      <DescriptionBlock>
        Version: 1.0.0 (released on: 08.12.2024)
      </DescriptionBlock>
    </Window>
  );
}
