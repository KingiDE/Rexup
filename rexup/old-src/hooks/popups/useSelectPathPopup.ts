import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

type DirectoryEntry = {
	name: string;
	variant: "file" | "folder";
	is_hidden: boolean;
};

export default function useSelectFolderPopup(isShown: boolean) {
	// Path elements on top bar
	const [pathElements, setPathElements] = useState<
		Array<{
			pathValue: string;
			pathAfterClick: string;
			variant: "file" | "folder";
		}>
	>([
		{
			pathValue: "C:",
			pathAfterClick: "C:",
			variant: "folder",
		},
	]);

	// All entries the current folder has
	const [dirEntries, setDirEntries] = useState<Array<DirectoryEntry>>([]);

	// Update path when the path-elements are updated
	const [path, setPath] = useState("");
	useEffect(() => {
		const pathValues = pathElements
			.map((element) => element.pathValue)
			.join("\\");
		setPath(pathValues);
	}, [pathElements]);

	// Read the directories as soon as the path updates
	useEffect(() => {
		async function gett() {
			// Construct path to search from pathElements but leave out last element when its a file
			const newPath = pathElements
				.map((element, index) =>
					!(index === pathElements.length - 1 && element.variant === "file")
						? element.pathValue
						: null,
				)
				.join("\\");
			setDirEntries(
				(await invoke("read_contents_of", {
					path: newPath,
				})) as Array<DirectoryEntry>,
			);
		}
		gett();
	}, [path, isShown]);

	// Fetch and store all drive letters from A-Z (without C:) which actually do exist
	const [drives, setDrives] = useState<string[]>([]);
	useEffect(() => {
		async function gett() {
			setDrives(await invoke("get_remaining_drives"));
		}
		gett();
	}, []);

	// Update path by clicking on bookmark
	async function updatePath(value: "desktop" | "downloads" | "documents") {
		const newPath = (await invoke("get_user_path_to", { value })) as string;

		let cumulativePath = "";
		setPathElements(
			newPath.split("\\").map((singlePathComponent) => {
				cumulativePath += singlePathComponent + "\\";
				return {
					pathValue: singlePathComponent,
					variant: "folder",
					is_hidden: false,
					pathAfterClick: rmPossibleLastBackslash(cumulativePath),
				};
			}),
		);
	}

	// Append folder to the pathElements by clicking on a directory-entry
	function appendToPath(addedPathElement: DirectoryEntry) {
		// Remove the last element if it's a file
		const newPathElements = pathElements.filter(
			(element, index) =>
				!(index === pathElements.length - 1 && element.variant === "file"),
		);
		setPathElements([
			...newPathElements,
			{
				...addedPathElement,
				pathValue: addedPathElement.name,
				pathAfterClick: path + "\\" + addedPathElement.name,
			},
		]);
	}

	// Modify the pathElements by clicking on a top-bar-entry
	function modifyPath(newPath: string) {
		let cumulativePath = "";
		setPathElements(
			newPath.split("\\").map((singlePathComponent) => {
				cumulativePath += singlePathComponent + "\\";
				return {
					pathValue: singlePathComponent,
					variant: "folder",
					is_hidden: false,
					pathAfterClick: rmPossibleLastBackslash(cumulativePath),
				};
			}),
		);
	}

	function rmPossibleLastBackslash(value: string) {
		if (value.endsWith("\\")) {
			return value.slice(0, -1);
		} else {
			return value;
		}
	}

	function sortDirEntries(entries: Array<DirectoryEntry>) {
		return entries.sort((a, b) => {
			// First, sort alphabetically by name if not hidden
			if (a.is_hidden !== b.is_hidden) {
				return a.is_hidden ? 1 : -1; // hidden items come last
			}
			return a.name.localeCompare(b.name); // compare names alphabetically
		});
	}

	return {
		path,
		pathElements,
		drives,
		dirEntries,
		updatePath,
		appendToPath,
		modifyPath,
		setPathElements,
		sortDirEntries,
	};
}
