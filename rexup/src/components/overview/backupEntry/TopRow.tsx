import useShowDocumentationPopup from "../../../hooks/overview/backupEntry/useShowDocumentationPopup";
import { LocalStateBackupEntry } from "../../../hooks/useCurrentSelectedBackup";
import { HighlightedText, Text } from "../../ui-lib/Texts";
import DocumentationPopup from "./DocumentationPopup";

export default function TopRow({
  folderEntry,
}: {
  folderEntry: [string, LocalStateBackupEntry];
}) {
  // Controls whether to show the documentation-popup
  const { showDocumentation, hideDocumentation, documentationPopupRef } =
    useShowDocumentationPopup();

  return (
    <div className="flex gap-2 items-center">
      {/* Folder or file icon */}
      {folderEntry[1].variant === "folder" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="fill-yellow-500"
        >
          <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="fill-gray-50"
        >
          <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm7 7V3.5L18.5 9z" />
        </svg>
      )}
      {/* Information icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`transition-[fill] hover:cursor-pointer fill-gray-50`}
        onMouseEnter={showDocumentation}
        onMouseLeave={hideDocumentation}
      >
        <path d="M12 16.5q.214 0 .357-.144T12.5 16v-4.5q0-.213-.144-.356T11.999 11t-.356.144t-.143.356V16q0 .213.144.356t.357.144M12 9.577q.262 0 .439-.177t.176-.438t-.177-.439T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709" />
      </svg>
      {/* Documentation Popup */}
      <DocumentationPopup
        documentationPopupRef={documentationPopupRef}
        inputs={folderEntry[1]}
        offset="left-8 bottom-[84px]"
      />
      {/* Origin and target short-display */}
      <div className="min-w-[200px]">
        <HighlightedText>Origin: </HighlightedText>
        <Text
          color={folderEntry[1].origin === "" ? "text-yellow-500" : undefined}
        >
          {folderEntry[1].origin === ""
            ? "[empty]"
            : folderEntry[1].origin.split("\\").at(-1)}
        </Text>
      </div>
      <div className="min-w-[200px]">
        <HighlightedText>Target: </HighlightedText>
        <Text
          color={folderEntry[1].target === "" ? "text-yellow-500" : undefined}
        >
          {folderEntry[1].target === ""
            ? "[empty]"
            : folderEntry[1].target.split("\\").at(-1)}
        </Text>
      </div>
    </div>
  );
}
