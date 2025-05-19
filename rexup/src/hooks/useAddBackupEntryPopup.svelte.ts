// @ts-ignore: TypeScript doesn't recognize the $state rune
export const addBackupEntryInput = $state({
	value: {
		name: "",
	},
});

// @ts-ignore: TypeScript doesn't recognize the $derived rune
const validInputs = $derived({
	value: addBackupEntryInput.value.name !== "",
});

export function getValidInput() {
	return validInputs;
}

export function resetAddBackupEntryInput() {
	addBackupEntryInput.value.name = "";
}
