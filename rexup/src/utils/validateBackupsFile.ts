import type {
	BackupExecutionLog,
	LocalStateBackup,
	LocalStateBackupEntry,
} from "../components/types";

export function validateBackupsFile(readData: string) {
	try {
		const parsed = JSON.parse(readData);
		if (Array.isArray(parsed) && parsed.every(isLocalStateBackup)) {
			return parsed;
		}
	} catch (err) {
		console.error("The backups file couldn't be parsed!");
	}
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
		typeof obj.location === "string" &&
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
		obj.origin !== null &&
		typeof obj.origin === "object" &&
		"active_mode" in obj.origin &&
		(obj.origin.active_mode === "Commands" ||
			obj.origin.active_mode === "LocalFileSystem") &&
		"commands" in obj.origin &&
		Array.isArray(obj.origin.commands) &&
		obj.origin.commands.every((el) => typeof el === "string") &&
		"local_file_system" in obj.origin &&
		typeof obj.origin.local_file_system === "string" &&
		"target" in obj &&
		typeof obj.target === "string" &&
		"rename_to" in obj &&
		typeof obj.rename_to === "string" &&
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
		"mode" in obj.filters &&
		(obj.filters.mode === "Include" || obj.filters.mode === "Exclude") &&
		"path_elements" in obj.filters &&
		Array.isArray(obj.filters.path_elements) &&
		obj.filters.path_elements.every((t: unknown) => typeof t === "string") &&
		"file_names" in obj.filters &&
		Array.isArray(obj.filters.file_names) &&
		obj.filters.file_names.every((t: unknown) => typeof t === "string")
	);
}

// Checks if an object matches the BackupExecutionLog structure.
function isBackupExecutionLog(obj: unknown): obj is BackupExecutionLog {
	if (
		typeof obj === "object" &&
		obj !== null &&
		"Finished" in obj &&
		typeof obj.Finished === "string"
	)
		return true;

	if (
		typeof obj === "object" &&
		obj !== null &&
		"Information" in obj &&
		typeof obj.Information === "string"
	)
		return true;

	if (
		typeof obj === "object" &&
		obj !== null &&
		"ErrorCopying" in obj &&
		typeof obj.ErrorCopying === "string"
	)
		return true;

	if (
		typeof obj === "object" &&
		obj !== null &&
		"SuccessExecutingCommand" in obj &&
		obj.SuccessExecutingCommand !== null &&
		typeof obj.SuccessExecutingCommand === "object" &&
		"command" in obj.SuccessExecutingCommand &&
		typeof obj.SuccessExecutingCommand.command === "string" &&
		"to_path" in obj.SuccessExecutingCommand &&
		typeof obj.SuccessExecutingCommand.to_path === "string"
	)
		return true;

	if (
		typeof obj === "object" &&
		obj !== null &&
		"SuccessCopyingFileOrDirectory" in obj &&
		obj.SuccessCopyingFileOrDirectory !== null &&
		typeof obj.SuccessCopyingFileOrDirectory === "object" &&
		"variant" in obj.SuccessCopyingFileOrDirectory &&
		(obj.SuccessCopyingFileOrDirectory.variant === "File" ||
			obj.SuccessCopyingFileOrDirectory.variant === "Directory") &&
		"from_path" in obj.SuccessCopyingFileOrDirectory &&
		typeof obj.SuccessCopyingFileOrDirectory.from_path === "string" &&
		"to_path" in obj.SuccessCopyingFileOrDirectory &&
		typeof obj.SuccessCopyingFileOrDirectory.to_path === "string"
	)
		return true;

	if (
		typeof obj === "object" &&
		obj !== null &&
		"IgnoreCopyingFile" in obj &&
		obj.IgnoreCopyingFile !== null &&
		typeof obj.IgnoreCopyingFile === "object" &&
		"reason" in obj.IgnoreCopyingFile &&
		(obj.IgnoreCopyingFile.reason === "WrongPathElements" ||
			obj.IgnoreCopyingFile.reason === "WrongName" ||
			obj.IgnoreCopyingFile.reason === "TooLargeSize") &&
		"from_path" in obj.IgnoreCopyingFile &&
		typeof obj.IgnoreCopyingFile.from_path === "string" &&
		"to_path" in obj.IgnoreCopyingFile &&
		typeof obj.IgnoreCopyingFile.to_path === "string"
	)
		return true;

	return true;
}
