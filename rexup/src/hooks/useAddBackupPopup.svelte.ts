// @ts-ignore: TypeScript doesn't recognize the $state rune
export const addBackupInput = $state({
	value: {
		name: "",
	},
});

// @ts-ignore: TypeScript doesn't recognize the $derived rune
const validInputs = $derived({
	value: addBackupInput.value.name !== "",
});

export function getValidInput() {
	return validInputs;
}

export function resetAddBackupInput() {
	addBackupInput.value.name = "";
}
