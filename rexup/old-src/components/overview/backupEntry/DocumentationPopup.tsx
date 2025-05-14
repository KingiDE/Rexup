import type { MutableRefObject } from "react";
import type { LocalStateBackupEntry } from "../../../hooks/useCurrentSelectedBackup";
import { Description, Text, TextBlock } from "../../ui-lib/Texts";

export default function DocumentationPopup({
	documentationPopupRef,
	inputs,
	offset,
}: {
	documentationPopupRef: MutableRefObject<HTMLDivElement | null>;
	inputs: LocalStateBackupEntry;
	offset: string;
}) {
	function calculateDocsContent() {
		// Remove last potential "/" from the origin
		const prettifiedOrigin = prettifyPath(inputs.origin);
		const prettifiedTarget = removeFirstSlashWhenContainsMore(inputs.target);

		return (
			<>
				{inputs.variant === "folder" ? (
					<>
						The contents of the folder at{" "}
						<Description>
							{prettifiedOrigin === "" ? "[empty]" : prettifiedOrigin}
						</Description>{" "}
						are copied into the folder{" "}
						<Description>
							{prettifiedTarget === "" ? "[empty]" : prettifiedTarget}
						</Description>{" "}
						{inputs.target === "/" ? "(root) " : ""}
						inside the backup-folder.
					</>
				) : (
					<>
						The file <Description>{inputs.origin}</Description> is copied to{" "}
						<Description>
							{inputs.target +
								(inputs.target.endsWith("/") ? "" : "/") +
								inputs.origin.split("\\").at(-1)}
						</Description>
						.
					</>
				)}
			</>
		);
	}

	// Remove potential "\" when its the last character at a string
	function prettifyPath(value: string) {
		return value.endsWith("\\") ? value.slice(0, -1) : value;
	}

	function removeFirstSlashWhenContainsMore(value: string) {
		return value.startsWith("/") && value.length > 1 ? value.slice(1) : value;
	}

	return (
		<div
			ref={documentationPopupRef}
			className={`transition-[opacity] z-[1] absolute ${offset} px-3 py-2 outline-2 outline-gray-800 shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] rounded-md bg-gray-900 max-w-[460px]`}
		>
			<Text>
				<TextBlock>
					<span>Origin: </span>
					<Description>
						{inputs.origin === "" ? "[empty]" : inputs.origin}
					</Description>
				</TextBlock>
				<TextBlock>
					<span>Target: </span>
					<Description>
						{inputs.target === "" ? "[empty]" : inputs.target}
					</Description>
				</TextBlock>
				{calculateDocsContent()}
			</Text>
		</div>
	);
}
