import { invoke } from "@tauri-apps/api/core";
import type {
	DirectoryContent,
	FileOrDirectory,
	PathElement,
	UserLocation,
} from "../../components/types";

// Returns the pathElements in form of a string value that can be displayed in an input-field
export function getPathString(pathElements: Array<PathElement>) {
	let path = "";

	for (const pathElement of pathElements) {
		// Don't add trailing slashes for files and the Linux root directory
		if (pathElement.variant === "File" || pathElement.name === "/") {
			path += `${pathElement.name}`;
		} else {
			path += `${pathElement.name}/`;
		}
	}

	return path;
}

// Removes all elements from pathElements that come after the directory with the specified id
export function slicePathElements(
	pathElements: Array<PathElement>,
	id: string,
) {
	// The "filter" for "directory" is accepable becaue files are never listed in the top bar, so they cannot be clicked up there
	const indexOfDir = pathElements.findIndex((el) => el.id === id);

	// -1 means not found
	if (indexOfDir === -1) {
		return pathElements;
	}

	return pathElements.slice(0, indexOfDir + 1);
}

// Pushes the directory as a new element to the pathElements when a directory-result is clicked
export function pushDirectoryToPathElements(
	pathElements: Array<PathElement>,
	name: string,
	id: string,
	variant: FileOrDirectory,
) {
	pathElements.push({ name, variant, id });
}

// Replaces the last element in pathElements with the new name and id
export function replaceLastPathElement(
	pathElements: Array<PathElement>,
	name: string,
	id: string,
	variant: FileOrDirectory,
) {
	const lastPathElement = pathElements.at(-1);

	if (lastPathElement !== undefined) {
		lastPathElement.id = id;
		lastPathElement.name = name;
		lastPathElement.variant = variant;
	}
}

// Sets the path elements to the path to the users specific location
export async function updatePathElementsFromUserLocationTo(
	location: UserLocation,
) {
	const path = (await invoke("get_user_path_to", {
		location,
	})) as Array<PathElement>;

	return path;
}

export async function read_contents_of_path(pathElements: Array<PathElement>) {
	const blankResults = (await invoke("list_contents_of", {
		path: getPathString(pathElements),
	})) as Array<DirectoryContent>;

	// Sort hidden results to the end
	return blankResults.sort((a, b) => {
		return Number(a.is_hidden) - Number(b.is_hidden);
	});
}
