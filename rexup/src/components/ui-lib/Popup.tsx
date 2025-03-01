import React from "react";
// DOESNT:
// Doesn't manage fade-in-and-out itself
//
// DOES:
// Provide prestyled <div>
// Provide hotkey-execution for close and confirm
export default function Popup({
  wrapperRef,
  onConfirmAction,
  onCancelAction,
  children,
}: {
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  onConfirmAction: () => void;
  onCancelAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={wrapperRef}
      className="hidden z-[1] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-8 py-6 max-w-[650px] outline outline-2 outline-gray-800 shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]"
      onKeyDown={(e) => {
        switch (e.key) {
          case "Enter":
            onConfirmAction();
            break;
          case "Escape":
            onCancelAction();
            break;
        }
      }}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
