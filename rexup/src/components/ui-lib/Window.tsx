import React, { Dispatch, SetStateAction } from "react";
import useFadeInOut from "../../hooks/popups/useFadeInOut";
import Button from "./Buttons";
import { CurrentPopup } from "../../App";

// DOES:
// Manage fade-in-and-out itself
// Provide prestyled <div>
// Provide hotkey-execution only for close-event
// Provide x-btn on top right for close-event
export default function Window({
  children,
  currentPopup,
  neededPopup,
  setCurrentPopup,
}: {
  neededPopup:
    | "addbackup"
    | "deletebackup"
    | "renamebackup"
    | "configurebackup"
    | "editbackupentry"
    | "settings";
  children: React.ReactNode;
  currentPopup: CurrentPopup;
  setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
}) {
  const { wrapper } = useFadeInOut(
    currentPopup !== null && currentPopup.variant === neededPopup,
  );

  return (
    <div
      ref={wrapper}
      className="hidden z-[1] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-8 py-6 max-w-[550px] outline outline-2 outline-gray-800 shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
      onKeyDown={async (e) => {
        switch (e.key) {
          case "Escape":
            setCurrentPopup(null);
            break;
        }
      }}
      tabIndex={0}
    >
      <div className="absolute top-4 right-4">
        <Button
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                className="fill-gray-50"
                d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
              />
            </svg>
          }
          onClick={() => setCurrentPopup(null)}
          meaning="neutral"
        ></Button>
      </div>
      {children}
    </div>
  );
}
