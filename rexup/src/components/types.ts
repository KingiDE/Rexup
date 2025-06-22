export type CurrentPopup =
	| "add_backup"
	| "add_backup_entry"
	| "edit_backup_entry"
	| "select_backup_entry_origin_location"
	| "select_backup_location"
	| "settings"
	| null;

export type CurrentOverviewTab = "entries" | "logs" | "configuration";

export type EditBackupEntryTab = "overview" | "filters" | "destructive";

//
// Types, the backend also has:
//

// A utility type; the values start with a captial letter because they are returned by a Rust enum
export type FileOrDirectory = "File" | "Directory";

// The structure a loaded backup has
export type LocalStateBackup = {
	id: string;
	name: string;
	entries: Array<LocalStateBackupEntry>;
	is_zipped: boolean;
	location: string | null;
	// Stores the execution times in miliseconds after 1. January 1970 by calling "Date.getTime()"
	executions: Array<string>;
	logs_of_last_execution: Array<BackupExecutionLog>;
};

// The structure a loaded backup-entry has
export type LocalStateBackupEntry = {
	id: string;
	name: string;
	origin: string;
	target: string;
	is_active: boolean;
	// Used for visual indication as both directories and files can contain a "."
	variant: FileOrDirectory | null;
	filters: LocalStateBackupFilters;
};

// The filters each backup-entry has
type LocalStateBackupFilters = {
	max_size_in_mb: number | null;
	included_file_extensions: Array<string>;
	included_file_names: Array<string>;
};

// The structure a backup-execution log has, that is shown in its specific tab inside the overview
export type BackupExecutionLog =
	| { Finished: string }
	| { Information: string }
	| { ErrorCopying: string }
	| {
			SuccessCopying: {
				variant: FileOrDirectory;
				from_path: string;
				to_path: string;
			};
	  }
	| {
			IgnoreCopying: {
				from_path: string;
				to_path: string;
				reason: IgnoreFileReason;
			};
	  };

// The reasons a file is ignored and not copied
export type IgnoreFileReason = "WrongName" | "WrongExtension" | "TooLargeSize";

// The blocks at the top bar in the PathSelector that indicate directories
export type PathElement = {
	// The id is the entire path of the directory or file so the id becomes unique
	id: string;
	name: string;
	variant: FileOrDirectory;
};

// The results that show up in the PathSelector
export type DirectoryContent = PathElement & { is_hidden: boolean };

// The values that return the path to the user's specific location on his file-system
export type UserLocation = "Desktop" | "Downloads" | "Documents" | "Home";
