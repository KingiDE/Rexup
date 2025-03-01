import Button from "../../ui-lib/Buttons";

export default function Bookmark({
  text,
  onClick,
  type,
}: {
  text: string;
  onClick: () => void;
  type: "bookmark" | "drive";
}) {
  return (
    <Button
      meaning="neutral"
      icon={
        type === "bookmark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M16 3a1 1 0 0 1 .117 1.993L16 5v4.764l1.894 3.789a1 1 0 0 1 .1.331L18 14v2a1 1 0 0 1-.883.993L17 17h-4v4a1 1 0 0 1-1.993.117L11 21v-4H7a1 1 0 0 1-.993-.883L6 16v-2a1 1 0 0 1 .06-.34l.046-.107L8 9.762V5a1 1 0 0 1-.117-1.993L8 3z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path d="M5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16h14q.825 0 1.413.588T21 18t-.587 1.413T19 20zM5 8q-.825 0-1.412-.587T3 6t.588-1.412T5 4h14q.825 0 1.413.588T21 6t-.587 1.413T19 8zm0 6q-.825 0-1.412-.587T3 12t.588-1.412T5 10h14q.825 0 1.413.588T21 12t-.587 1.413T19 14zm1-7q.425 0 .713-.288T7 6t-.288-.712T6 5t-.712.288T5 6t.288.713T6 7m0 6q.425 0 .713-.288T7 12t-.288-.712T6 11t-.712.288T5 12t.288.713T6 13m0 6q.425 0 .713-.288T7 18t-.288-.712T6 17t-.712.288T5 18t.288.713T6 19" />
          </svg>
        )
      }
      onClick={onClick}
      text={text}
      variant="small"
    />
  );
}
