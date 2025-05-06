import useListFilter from "../../../hooks/popups/useListFilter";
import Inputs from "../../ui-lib/Inputs";
import { HighlightedTextBlock } from "../../ui-lib/Texts";

export default function ListFilters({
	text,
	folderEntryId,
	folderEntryFilterList,
	updateListFilter,
}: {
	text: string;
	folderEntryId: string;
	folderEntryFilterList: string[] | null;
	updateListFilter: (folderPairId: string, value: string[] | null) => void;
}) {
	const { listOfValues, setListOfValues } = useListFilter(
		folderEntryId,
		folderEntryFilterList,
		updateListFilter,
	);

	return (
		<div>
			<HighlightedTextBlock>{text}</HighlightedTextBlock>
			{listOfValues && (
				<div className="grid gap-2">
					{listOfValues.map((element, index) => {
						return (
							<Inputs
								key={index}
								value={element}
								onChange={(e) => {
									const newFileFilterName = [...listOfValues];
									newFileFilterName[index] = e.target.value;
									setListOfValues(newFileFilterName);
								}}
								placeholder={
									listOfValues.length === 1
										? "Leave empty to disable filter"
										: undefined
								}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
