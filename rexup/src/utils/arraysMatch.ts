export function arraysMatchRealisticly(
	arr1: string[] | null,
	arr2: string[] | null
): boolean {
	if (arr1 === null) {
		if (arr2 !== null) {
			return false;
		} else {
			return true;
		}
	}

	if (arr2 === null) {
		if (arr1 !== null) {
			return false;
		} else {
			return true;
		}
	}

	// Check if arrays have the same length
	if (arr1.length !== arr2.length) {
		return false;
	}

	// Compare elements one by one
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true; // If no mismatches, return true
}
