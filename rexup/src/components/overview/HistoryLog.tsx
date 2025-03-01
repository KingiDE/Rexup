import { LocalStateBackupWithId } from "../../hooks/useCurrentSelectedBackup";
import { HistoryFile } from "../../hooks/useStoredValues";
import { SpacingSmall } from "../ui-lib/Spacing";
import { Description } from "../ui-lib/Texts";

export default function History({
  storedHistory,
  currentSelectedBackup,
}: {
  storedHistory: HistoryFile | null;
  currentSelectedBackup: LocalStateBackupWithId | null;
}) {
  function getRelevantHistory() {
    if (storedHistory === null || currentSelectedBackup === null) return [];
    // Take only the elements which have the right id
    const relevantEntries = [...storedHistory].filter(
      (el) => el[1] === currentSelectedBackup[0],
    );

    // sort from highest to lowest number (= latest to oldest)
    relevantEntries.sort((a, b) => b[0] - a[0]);
    return relevantEntries.slice(0, 3);
  }

  if (currentSelectedBackup === null) return;

  return (
    <>
      <SpacingSmall />
      <ol>
        {getRelevantHistory().length !== 0 ? (
          getRelevantHistory().map((entry, index) => {
            if (entry[1] !== currentSelectedBackup[0] || index > 2) return;
            const date = new Date(entry[0]);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Month start at 0 (= January)
            const year = date.getFullYear();

            const hours = date.getHours();
            const minutes =
              date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes();
            return (
              <li className="flex gap-1" key={entry[0]}>
                <span className="opacity-50">{"\u2022"}</span>
                <div className="min-w-16 mr-1">
                  {day + "." + month + "." + year}
                </div>
                <div>{hours + ":" + minutes}</div>
              </li>
            );
          })
        ) : (
          <Description>
            There aren't any records of this backup being executed :/
          </Description>
        )}
      </ol>
    </>
  );
}
