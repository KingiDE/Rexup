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

export function updateDisplayedExtensions(fileExtensionsToDisplay: Array<string>) {
	const amountOfEmptyElements = fileExtensionsToDisplay.filter(
		(el: string) => el === "",
	).length;

	if (amountOfEmptyElements > 1) {
		// Mutates the original array instead of copying; this way it works
		for(let i = fileExtensionsToDisplay.length - 1; i >= 0; i--) {
			if(fileExtensionsToDisplay[i] === "") {
				fileExtensionsToDisplay.splice(i, 1);
			}
		};
	} else if (amountOfEmptyElements < 1) {
		fileExtensionsToDisplay.push("");
	}

	return fileExtensionsToDisplay;
}