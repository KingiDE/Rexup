export function updateDisplayedNames(fileNamesToDisplay: Array<string>) {
	const amountOfEmptyElements = fileNamesToDisplay.filter(
		(el: string) => el === "",
	).length;

	if (amountOfEmptyElements > 1) {
		// Mutates the original array instead of copying; this way it works
		for(let i = fileNamesToDisplay.length - 1; i >= 0; i--) {
			if(fileNamesToDisplay[i] === "") {
				fileNamesToDisplay.splice(i, 1);
			}
		};
	} else if (amountOfEmptyElements < 1) {
		fileNamesToDisplay.push("");
	}

	return fileNamesToDisplay;
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
		(el: string) => el === "",
	).length;

	const filterWithoutEmptyElements = fileExtensionsToDisplay.value.filter(
		(el: string) => el !== "",
	);

	if (amountOfEmptyElements > 1) {
		fileExtensionsToDisplay.value = [...filterWithoutEmptyElements, ""];
	} else if (amountOfEmptyElements < 1) {
		fileExtensionsToDisplay.value.push("");
	}

	return filterWithoutEmptyElements;
}

