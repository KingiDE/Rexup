export const addBackupEntryInput = $state({
	value: {
		name: "",
	},
});

export const triedToSubmit = $state({
	value: false,
});

const validInputs = $derived({
	value: addBackupEntryInput.value.name !== "",
});

export function getValidInput() {
	return validInputs;
}

export function resetAddBackupEntryInput() {
	addBackupEntryInput.value.name = "";
}
