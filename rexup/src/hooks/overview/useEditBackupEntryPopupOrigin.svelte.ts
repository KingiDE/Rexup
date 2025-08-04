import type { LocalStateBackupEntry } from "../../components/types";

// Instead of mutating the entriy.origin directly, we use a state variable to manage the command list.
// Then, after each change, we can update the entry.origin accordingly to remove the last "" that shouldn't be stored.
export const displayedCommandList = $state<{ value: Array<string> | null }>({
	value: null,
});

// The same goes for the selected local file-system path.
export const displayedLocalFileSystemPath = $state<{ value: string | null }>({
	value: null,
});

export function updateEntryOrigin(
	doReset: boolean,
	entry: LocalStateBackupEntry,
) {
	if (displayedCommandList.value === null || doReset) {
		displayedCommandList.value = entry.origin.commands;
	}

	if (displayedLocalFileSystemPath.value === null || doReset) {
		displayedLocalFileSystemPath.value = entry.origin.local_file_system;
	}

	if (entry.origin.active_mode === "Commands") {
		const amountOfEmptyElements = displayedCommandList.value.filter(
			(cmd) => cmd === "",
		).length;

		// If there is more than one empty element, update the entry.origin with the new command list that has no empty elements.
		// Then, push one empty item to the displayed command list.
		if (amountOfEmptyElements > 1) {
			displayedCommandList.value = displayedCommandList.value.filter(
				(cmd) => cmd !== "",
			);
			entry.origin.commands = displayedCommandList.value;
			displayedCommandList.value.push("");
		}

		// If there's no empty element, update the entry.origin with the new command list.
		// Then, push one empty item to the displayed command list.
		if (amountOfEmptyElements === 0) {
			entry.origin.commands = displayedCommandList.value;
			displayedCommandList.value.push("");
		}

		// If there's exactly one empty element, update entry.filters.origin with this exact list but without the empty element.
		if (amountOfEmptyElements === 1) {
			entry.origin.commands = displayedCommandList.value.filter(
				(cmd) => cmd !== "",
			);
		}
	}

	if (entry.origin.active_mode === "LocalFileSystem") {
		entry.origin.local_file_system = displayedLocalFileSystemPath.value;
	}
}
