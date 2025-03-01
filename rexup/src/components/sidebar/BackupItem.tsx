import { Dispatch, SetStateAction } from "react";
import { LocalStateBackupWithId } from "../../hooks/useCurrentSelectedBackup";
import Button from "../ui-lib/Buttons";
import { CurrentPopup } from "../../App";

export function BackupItem({
  backup,
  initiateDeleteBackup,
  initiateRenameBackup,
  setCurrentSelectedBackup,
}: {
  backup: LocalStateBackupWithId;
  initiateDeleteBackup: (id: LocalStateBackupWithId) => void;
  initiateRenameBackup: (backup: LocalStateBackupWithId) => void;
  setCurrentSelectedBackup: Dispatch<
    SetStateAction<LocalStateBackupWithId | null>
  >;
}) {
  return (
    <li
      className="rounded-md hover:bg-gray-800 pl-3 pr-2 py-2 transition-[background] flex items-center gap-2 cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) setCurrentSelectedBackup(backup);
      }}
    >
      {backup[1].name}
      <div className="ml-auto flex gap-2 items-center">
        <Button
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="fill-gray-50"
            >
              <path d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z" />
            </svg>
          }
          onClick={() => initiateRenameBackup(backup)}
          meaning="neutral"
          variant="small"
        />
        <Button
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
          onClick={() => initiateDeleteBackup(backup)}
          meaning="neutral"
          variant="small"
        />
      </div>
    </li>
  );
}

export function AddBackup({
  setCurrentPopup,
}: {
  setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
}) {
  return (
    <Button
      text="Add backup"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="fill-gray-50"
        >
          <path d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z" />
        </svg>
      }
      onClick={() => setCurrentPopup({ variant: "addbackup", value: null })}
      meaning="neutral"
    />
  );
}
