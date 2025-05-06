import { useEffect, useState } from "react";
import { arraysMatchRealisticly } from "../../utils/arraysMatch";

export default function useListFilter(
	folderEntryId: string,
	folderEntryFilterList: string[] | null,
	updateListFilter: (folderPairId: string, value: string[] | null) => void,
) {
	const [listOfValues, setListOfValues] = useState<string[] | null>(
		folderEntryFilterList,
	);

	useEffect(() => {
		// If all inputs are full, append one empty
		if (folderEntryFilterList === null) {
			setListOfValues([""]);
		} else if (listOfValues?.every((element) => element !== "")) {
			setListOfValues([...listOfValues, ""]);
		} else if (
			listOfValues &&
			listOfValues.filter((item) => item === "").length > 1
		) {
			const emptyCount = listOfValues.filter((item) => item === "").length;
			const newArray = [
				...listOfValues.filter((item) => item !== ""),
				"",
			].slice(0, emptyCount + 1);
			setListOfValues(newArray);
		}
	}, [folderEntryFilterList]);

	useEffect(() => {
		if (!listOfValues) return;

		const noEmpty = listOfValues.filter((element) => element !== "");

		if (noEmpty.length === 0) {
			updateListFilter(folderEntryId, null);
			return;
		}

		if (!arraysMatchRealisticly(noEmpty, folderEntryFilterList)) {
			updateListFilter(folderEntryId, noEmpty);
		}
	}, [listOfValues]);

	return {
		listOfValues,
		setListOfValues,
	};
}
