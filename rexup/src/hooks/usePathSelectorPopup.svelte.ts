import { invoke } from "@tauri-apps/api/core";
import type { DirecoryResult, PathElement } from "../components/types";

// Returns the pathElements in form of a string value
export function getPathString(pathElements: Array<PathElement>) {
	let path = "";

	for (const pathElement of pathElements) {
		path += `${pathElement.name}/`;
	}

	return path;
}

// Removes all elements from pathElements that come after the directory with the specified name
export function slicePathElements(
	pathElements: Array<PathElement>,
	id: string,
) {
	// The "filter" for "directory" is accepable becaue files are never listed in the top bar, so they cannot be clicked up there
	const indexOfDir = pathElements.findIndex((el) => el.id === id);

	if (indexOfDir !== -1 /* -1 means not found */) {
		return pathElements.slice(0, indexOfDir + 1);
	}

	return pathElements;
}

// Pushes the directory as a new element to the pathElements when a directory-result is clicked
export function pushDirectoryToPathElements(
	pathElements: Array<PathElement>,
	name: string,
	id: string,
) {
	pathElements.push({ name, variant: "Directory", id });
}

// Sets the path elements to the path to the users specific location
export async function updatePathElementsFromUserLocationTo(
	location: "desktop" | "downloads" | "documents" | "home",
) {
	const path = (await invoke("get_user_path_to", {
		location,
	})) as Array<Omit<PathElement, "variant">>;

	return path.map((el) => {
		return { id: el.id, name: el.name, variant: "Directory" } as PathElement;
	});
}

export async function read_contents_of_path(
	pathElements: Array<PathElement>,
	showFiles?: boolean,
) {
	// The "as" operator actually claims something wrong because in reality the variant field is "File" or "Directory" and will be changed later
	const blankResults = (await invoke("list_contents_of", {
		path: getPathString(pathElements),
		showFiles,
	})) as Array<DirecoryResult>;

	// Sort hidden results to the end
	return blankResults.sort((a, b) => {
		return Number(a.is_hidden) - Number(b.is_hidden);
	});
}
