export const addBackupEntryInput = $state({
	value: {
		name: "",
	},
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
