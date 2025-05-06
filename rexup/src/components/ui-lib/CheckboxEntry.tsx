import { Description, HighlightedTextBlock } from "./Texts";

export default function Checkbox({
	value,
	onClick,
	title,
	description,
}: {
	value: boolean;
	onClick: () => void;
	title: string;
	description: string;
}) {
	return (
		<div>
			<div className="flex gap-2 items-center">
				<button
					onClick={onClick}
					className={`cursor-pointer rounded-md h-5 w-5 relative outline-1 outline-gray-800 transition-[background] ${
						value ? "bg-sky-500" : "bg-none"
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						className={`fill-white transition-opacity ${value ? "opacity-100" : "opacity-0"} `}
					>
						<path d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
					</svg>
				</button>
				<HighlightedTextBlock>{title}</HighlightedTextBlock>
			</div>
			<Description>{description}</Description>
		</div>
	);
}
