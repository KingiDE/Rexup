export type CurrentPopup =
	| "add_backup"
	| "add_backup_entry"
	| "edit_backup_entry"
	| "select_backup_entry_origin_location"
	| "select_backup_location"
	| "settings"
	| null;

export type CurrentOverviewTab = "entries" | "logs" | "configuration";

export type LocalStateBackup = {
	id: string;
	name: string;
	entries: Array<LocalStateBackupEntry>;
	is_zipped: boolean;
	location: string | null;
	// Stores the execution times in miliseconds after 1. January 1970 by calling "date.getTime()"
	executions: Array<number>;
	logs_of_last_execution: Array<BackupExecutionLog>;
};

export type LocalStateBackupEntry = {
	id: string;
	name: string;
	origin: string | null;
	target: string | null;
	is_active: boolean;
	// Used for visual indication as both directories and files can contain a "."
	variant: FileOrDirectory | null;
	filters: {
		max_size_in_mb: number | null;
		included_file_types: Array<string> | null;
		included_file_names: Array<string> | null;
	};
};

export type BackupExecutionLog =
	| {
			variant: "information";
			message: string;
	  }
	| ({
			// Here, the "Directory" or "File" is stored in the field "type" because the field "variant" is already used
			type: FileOrDirectory;
			from_path: string;
			to_path: string;
	  } & (
			| { variant: "success_copying" }
			| { variant: "error_copying" | "ignore_copying"; reason: string }
	  ));

// The blocks at the top bar in the PathSelector
export type PathElement = {
	// The id is the entire path so the id becomes unique
	id: string;
	name: string;
	variant: FileOrDirectory;
};

// The results that show up in the PathSelector
export type DirecoryResult = PathElement & { is_hidden: boolean };

// A utility type; the values start with a captial letter because they returned by a Rust enum
type FileOrDirectory = "File" | "Directory";
