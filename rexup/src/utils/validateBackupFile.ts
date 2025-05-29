import type {
	BackupExecutionLog,
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
		obj.executions.every((x: unknown) => typeof x === "string") &&
		"logs_of_last_execution" in obj &&
		Array.isArray(obj.logs_of_last_execution) &&
		obj.logs_of_last_execution.every(isBackupExecutionLog)
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
		typeof obj.origin === "string" &&
		"target" in obj &&
		typeof obj.target === "string" &&
		"is_active" in obj &&
		typeof obj.is_active === "boolean" &&
		"variant" in obj &&
		(obj.variant === "File" ||
			obj.variant === "Directory" ||
			obj.variant === null) &&
		"filters" in obj &&
		typeof obj.filters === "object" &&
		obj.filters !== null &&
		"max_size_in_mb" in obj.filters &&
		(typeof obj.filters.max_size_in_mb === "number" ||
			obj.filters.max_size_in_mb === null) &&
		"included_file_extensions" in obj.filters &&
		(obj.filters.included_file_extensions === null ||
			(Array.isArray(obj.filters.included_file_extensions) &&
				obj.filters.included_file_extensions.every(
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

// Checks if an object matches the BackupExecutionLog structure.
function isBackupExecutionLog(obj: unknown): obj is BackupExecutionLog {
	if (
		typeof obj === "object" &&
		obj !== null && "Information" in obj && typeof obj.Information === "string"
	) return true;

	if (
		typeof obj === "object" &&
		obj !== null && "Finished" in obj && typeof obj.Finished === "string"
	) return true;

	if (
		typeof obj === "object" &&
		obj !== null && "ErrorCopying" in obj &&
		typeof obj.ErrorCopying === "string"
	) return true;

	if (
		typeof obj === "object" &&
		obj !== null && "SuccessCopying" in obj && obj.SuccessCopying !== null &&
		typeof obj.SuccessCopying === "object" && "variant" in obj.SuccessCopying &&
		(obj.SuccessCopying.variant === "File" ||
			obj.SuccessCopying.variant === "Directory") &&
		"from_path" in obj.SuccessCopying &&
		typeof obj.SuccessCopying.from_path === "string" &&
		"to_path" in obj.SuccessCopying &&
		typeof obj.SuccessCopying.to_path === "string"
	) return true;

if (
		typeof obj === "object" &&
		obj !== null && "IgnoreCopying" in obj && obj.IgnoreCopying !== null &&
		typeof obj.IgnoreCopying === "object" && "reason" in obj.IgnoreCopying &&
		(obj.IgnoreCopying.reason === "WrongName" ||
			obj.IgnoreCopying.reason === "WrongExtension" ||
			obj.IgnoreCopying.reason === "TooLargeSize"
		) &&
		"from_path" in obj.IgnoreCopying &&
		typeof obj.IgnoreCopying.from_path === "string" &&
		"to_path" in obj.IgnoreCopying &&
		typeof obj.IgnoreCopying.to_path === "string"
	) return true;

	return true;
}
