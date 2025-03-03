import { ConfigFile } from "../../hooks/useStoredValues";

export function convertConfigJSONToJS(value: string) {
	let asJS;

	const defaultConfig: ConfigFile = {
		show_edit_warning: true,
		show_history: true
	};

	try {
		asJS = JSON.parse(value);
	} catch (_e) {
		asJS = {};
	}

	// Check whether structure is correct
	if (asJS === null || typeof asJS !== "object") return defaultConfig;

	// Mutates the defaultConfig object
	if (
		"show_edit_warning" in asJS &&
		typeof asJS.show_edit_warning === "boolean"
	) {
		defaultConfig.show_edit_warning = asJS.show_edit_warning;
	}

	if ("show_history" in asJS && typeof asJS.show_history === "boolean") {
		defaultConfig.show_history = asJS.show_history;
	}

	return defaultConfig;
}
