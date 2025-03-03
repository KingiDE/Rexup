// Is a predefined button which every button used in this repo builds on.

import { HighlightedTextBlock, Text } from "./Texts";

type Props = {
	icon?: React.ReactNode;
	text?: string;
	variant?: "small";
	disabled?: boolean;
	isHidden?: boolean;
	meaning: "positive" | "negative" | "neutral";
	onClick: () => void;
};

function calculatePadding(props: Props) {
	// Only icon
	if (props.text === undefined && props.icon !== undefined) {
		return props.variant === "small" ? "p-[2px]" : "p-2";
	}
	// Both included
	return props.variant === "small" ? "py-[2px] px-3" : "px-4 py-2";
}

function calculateBackground(props: Props) {
	switch (props.meaning) {
		case "positive":
			return "bg-sky-600 hover:bg-sky-500 ";
		case "negative":
			return "bg-red-600 hover:bg-red-500";
		case "neutral":
			return "hover:bg-gray-700 outline outline-1 -outline-offset-1 outline-gray-700";
	}
}

export default function Button(props: Props) {
	return (
		<button
			disabled={props.disabled}
			onClick={props.onClick}
			className={`cursor-pointer text-gray-50 whitespace-nowrap ${calculatePadding(
				props
			)} ${calculateBackground(props)} rounded-md transition-[background] ${
				props.icon !== undefined && props.text !== undefined
					? "flex gap-2 items-center"
					: ""
			} ${
				props.disabled || props.isHidden ? "opacity-50" : ""
			} transition-[opacity]`}
		>
			<div className="fill-gray-50">{props.icon}</div>
			{props.meaning === "positive" ? (
				<HighlightedTextBlock>{props.text}</HighlightedTextBlock>
			) : (
				<Text>{props.text}</Text>
			)}
		</button>
	);
}
