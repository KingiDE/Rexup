import Button from "../../ui-lib/Buttons";

export default function FolderOrFile({
	text,
	onClick,
	variant,
	isHidden,
	isHighlighted
}: {
	text: string;
	onClick: () => void;
	variant: "folder" | "file";
	isHidden: boolean;
	isHighlighted: boolean;
}) {
	return (
		<div
			className={`h-7 overflow-hidden grid rounded-md -outline-offset-1 outline-1 ${isHighlighted ? "outline-gray-50" : "outline-gray-700"}`}
		>
			<Button
				meaning="neutral"
				icon={
					variant === "folder" ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							className="fill-yellow-500"
						>
							<path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h6l2 2h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
						>
							<path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm7 7V3.5L18.5 9z" />
						</svg>
					)
				}
				onClick={onClick}
				text={text}
				variant="small"
				isHidden={isHidden}
			/>
		</div>
	);
}
