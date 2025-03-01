import { HistoryFile } from "../../hooks/useStoredValues";

export function convertHistoryJSONToJS(value: string) {
  let asJS;

  try {
    asJS = JSON.parse(value);
  } catch (_e) {
    asJS = [];
  }

  // Check whether structure is correct, if not: return empty map
  if (asJS === null || typeof asJS !== "object" || !Array.isArray(asJS)) {
    return new Map<number, string>();
  }

  const newHistory: HistoryFile = new Map<number, string>();

  asJS.map((entry) => {
    // Check whether all fields are present
    if (
      entry !== null &&
      typeof entry === "object" &&
      "id" in entry &&
      typeof entry.id === "string" &&
      "time" in entry &&
      typeof entry.time === "number"
    ) {
      newHistory.set(entry.time, entry.id);
    }
  });

  return newHistory;
}
