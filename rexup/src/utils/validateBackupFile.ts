import type {
	LocalStateBackup,
	LocalStateBackupEntry,
} from "../components/types";

export function validateBackupFile(readData: string) {
	try {
		const parsed = JSON.parse(readData);
		if (Array.isArray(parsed) && parsed.every(isLocalStateBackup)) {
			return parsed;
		}
	} catch (err) {}
	return [];
}

// Validates if an object is a LocalStateBackup
function isLocalStateBackup(obj: unknown): obj is LocalStateBackup {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"id" in obj &&
		typeof obj.id === "string" &&
		"name" in obj &&
		typeof obj.name === "string" &&
		"entries" in obj &&
		Array.isArray(obj.entries) &&
		obj.entries.every(isLocalStateBackupEntry) &&
		"is_zipped" in obj &&
		typeof obj.is_zipped === "boolean" &&
		"location" in obj &&
		(typeof obj.location === "string" || obj.location === null) &&
		"executions" in obj &&
		Array.isArray(obj.executions) &&
		obj.executions.every((x: unknown) => typeof x === "number")
	);
}

// Checks if an object matches the LocalStateBackupEntry structure
function isLocalStateBackupEntry(obj: unknown): obj is LocalStateBackupEntry {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"id" in obj &&
		typeof obj.id === "string" &&
		"name" in obj &&
		typeof obj.name === "string" &&
		"origin" in obj &&
		(typeof obj.origin === "string" || obj.origin === null) &&
		"target" in obj &&
		(typeof obj.target === "string" || obj.target === null) &&
		"is_active" in obj &&
		typeof obj.is_active === "boolean" &&
		"variant" in obj &&
		(obj.variant === "file" ||
			obj.variant === "directory" ||
			obj.variant === null) &&
		"filters" in obj &&
		typeof obj.filters === "object" &&
		obj.filters !== null &&
		"max_size_in_mb" in obj.filters &&
		(typeof obj.filters.max_size_in_mb === "number" ||
			obj.filters.max_size_in_mb === null) &&
		"included_file_types" in obj.filters &&
		(obj.filters.included_file_types === null ||
			(Array.isArray(obj.filters.included_file_types) &&
				obj.filters.included_file_types.every(
					(t: unknown) => typeof t === "string",
				))) &&
		"included_file_names" in obj.filters &&
		(obj.filters.included_file_names === null ||
			(Array.isArray(obj.filters.included_file_names) &&
				obj.filters.included_file_names.every(
					(t: unknown) => typeof t === "string",
				)))
	);
}
