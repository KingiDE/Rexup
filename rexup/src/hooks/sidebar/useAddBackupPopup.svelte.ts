export const addBackupInput = $state({
	value: {
		name: "",
	},
});

export const triedToSubmit = $state({
	value: false,
});

const validInputs = $derived({
	value: addBackupInput.value.name !== "",
});

export function getValidInput() {
	return validInputs;
}

export function resetAddBackupInput() {
	addBackupInput.value.name = "";
}
