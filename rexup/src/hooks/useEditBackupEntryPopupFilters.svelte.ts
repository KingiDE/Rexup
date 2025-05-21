// @ts-ignore: TypeScript doesn't recognize the $state rune
const fileNamesToDisplay = $state<{ value: Array<string> }>({
	value: [],
});

export function loadFileNamesToDisplay(
	included_file_names: Array<string> | null,
) {
	if (included_file_names !== null)
		fileNamesToDisplay.value = [...included_file_names, ""];
}

export function getEntryStateAndFileNamesToDisplay() {
	const amountOfEmptyElements = fileNamesToDisplay.value.filter(
		(el) => el === "",
	).length;

	const filterWithoutEmptyElements = fileNamesToDisplay.value.filter(
		(el) => el !== "",
	);

	if (amountOfEmptyElements > 1) {
		fileNamesToDisplay.value = [...filterWithoutEmptyElements, ""];
	} else if (amountOfEmptyElements < 1) {
		fileNamesToDisplay.value.push("");
	}

	return filterWithoutEmptyElements;
}

// @ts-ignore: TypeScript doesn't recognize the $state rune
const fileExtensionsToDisplay = $state<{ value: Array<string> }>({
	value: [],
});

export function loadFileExtensionsToDisplay(
	included_file_names: Array<string> | null,
) {
	if (included_file_names !== null)
		fileExtensionsToDisplay.value = [...included_file_names, ""];
}

export function getEntryStateAndFileExtensionsToDisplay() {
	const amountOfEmptyElements = fileExtensionsToDisplay.value.filter(
		(el) => el === "",
	).length;

	const filterWithoutEmptyElements = fileExtensionsToDisplay.value.filter(
		(el) => el !== "",
	);

	if (amountOfEmptyElements > 1) {
		fileExtensionsToDisplay.value = [...filterWithoutEmptyElements, ""];
	} else if (amountOfEmptyElements < 1) {
		fileExtensionsToDisplay.value.push("");
	}

	return filterWithoutEmptyElements;
}
