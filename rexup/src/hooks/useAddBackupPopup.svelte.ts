export const addBackupInputs = $state({
	value: {
		name: "",
	},
});

const validInputs = $derived({
	value: addBackupInputs.value.name !== "",
});

export function getValidInputs() {
	return validInputs;
}

export function resetAddBackupInputs() {
	addBackupInputs.value.name = "";
}
