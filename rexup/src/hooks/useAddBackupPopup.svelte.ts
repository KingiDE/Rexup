export const addBackupInput = $state({
	value: {
		name: "",
	},
});

const validInputs = $derived({
	value: addBackupInput.value.name !== "",
});

export function getValidInput() {
	return validInputs;
}

export function resetAddBackupInputs() {
	addBackupInput.value.name = "";
}
