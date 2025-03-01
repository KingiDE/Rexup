import { LogMessage } from "../../hooks/overview/useLogs";
import { Description, HeadingIII } from "../ui-lib/Texts";

export default function ExecutionLogsSection({ logs }: { logs: LogMessage[] }) {
  function getCorrectIcon(
    type: "info" | "error" | "success" | "finish" | "skip",
  ) {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      case "finish":
        return "🏁";
      case "skip":
        return "⏩";
    }
  }

  return (
    <>
      <HeadingIII>Execution logs:</HeadingIII>
      {logs.length !== 0 ? (
        <ul className="bg-gray-800 rounded-md p-2">
          {logs.map((log) => {
            return (
              <li key={log.value}>
                {getCorrectIcon(log.type)} {log.value}
              </li>
            );
          })}
        </ul>
      ) : (
        <Description>
          There aren't any logs of this backup being executed :/
        </Description>
      )}
    </>
  );
}
