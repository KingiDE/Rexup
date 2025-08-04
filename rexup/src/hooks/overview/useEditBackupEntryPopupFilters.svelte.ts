import type { LocalStateBackupEntry } from "../../components/types";

export const displayedFileNames = $state<{ value: Array<string> | null }>({
	value: null,
});

export function updateDisplayedNames(
	doReset: boolean,
	entry: LocalStateBackupEntry,
) {
	// Load the file names from currentBackupEntry.value.filters.file_names and update the displayedFileNames.
	if (displayedFileNames.value === null || doReset) {
		displayedFileNames.value = [...entry.filters.file_names, ""];
	}

	const amountOfEmptyElements = displayedFileNames.value.filter(
		(cmd) => cmd === "",
	).length;

	// If there are more than one empty element, update entry.filters.file_names with the new file names list that has no empty elements.
	// Then, push one empty item to the displayed file names list.
	if (amountOfEmptyElements > 1) {
		displayedFileNames.value = displayedFileNames.value.filter(
			(cmd) => cmd !== "",
		);
		entry.filters.file_names = displayedFileNames.value;
		displayedFileNames.value.push("");
	}

	// If there's no empty element, update entry.filters.file_names with the new file names list.
	// Then, push one empty item to the displayed file names list.
	if (amountOfEmptyElements === 0) {
		entry.filters.file_names = displayedFileNames.value;
		displayedFileNames.value.push("");
	}

	// If there's exactly one empty element, update entry.filters.file_names with this exact list but without the empty element.
	if (amountOfEmptyElements === 1) {
		entry.filters.file_names = displayedFileNames.value.filter(
			(cmd) => cmd !== "",
		);
	}
}

export const displayedPathElements = $state<{ value: Array<string> | null }>({
	value: null,
});

export function updateDisplayedPathElements(
	doReset: boolean,
	entry: LocalStateBackupEntry,
) {
	// Load the file names from entry.filters.path_elements and update the displayedPathElements.
	if (displayedPathElements.value === null || doReset) {
		displayedPathElements.value = [...entry.filters.path_elements, ""];
	}

	const amountOfEmptyElements = displayedPathElements.value.filter(
		(cmd) => cmd === "",
	).length;

	// If there are more than one empty element, update entry.filters.path_elements with the new file names list that has no empty elements.
	// Then, push one empty item to the displayed file names list.
	if (amountOfEmptyElements > 1) {
		displayedPathElements.value = displayedPathElements.value.filter(
			(cmd) => cmd !== "",
		);
		entry.filters.path_elements = displayedPathElements.value;
		displayedPathElements.value.push("");
	}

	// If there's no empty element, update entry.filters.path_elements with the new file names list.
	// Then, push one empty item to the displayed file names list.
	if (amountOfEmptyElements === 0) {
		entry.filters.path_elements = displayedPathElements.value;
		displayedPathElements.value.push("");
	}

	// If there's exactly one empty element, update entry.filters.path_elements with this exact list but without the empty element.
	if (amountOfEmptyElements === 1) {
		entry.filters.path_elements = displayedPathElements.value.filter(
			(cmd) => cmd !== "",
		);
	}
}
