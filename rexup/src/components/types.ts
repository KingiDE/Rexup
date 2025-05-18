export type CurrentPopup =
	| {
			variant: "add_backup";
			value: null;
	  }
	| {
			variant: "add_backup_entry";
			value: null;
	  }
	| {
			variant: "edit_backup_entry";
			value: LocalStateBackup;
	  }
	| {
			variant: "select_backup_location";
			value: null;
	  }
	| {
			variant: "settings";
			value: null;
	  }
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

export type BackupExecutionLog =
	| {
			variant: "information";
			message: string;
	  }
	| ({
			// Here, the "directory" or "file" is stored in the field "type" because the field "variant" is already used
			type: "file" | "directory";
			fromPath: string;
			toPath: string;
	  } & (
			| { variant: "success_copying" }
			| { variant: "error_copying" | "ignore_copying"; reason: string }
	  ));

export type LocalStateBackupEntry = {
	id: string;
	name: string;
	origin: string | null;
	target: string | null;
	is_active: boolean;
	// Used for visual indication as both directories and files can contain a "."
	variant: "file" | "directory" | null;
	filters: {
		max_size_in_mb: number | null;
		included_file_types: Array<string> | null;
		included_file_names: Array<string> | null;
	};
};

export type PathElement = {
	// The id id the entire path so the id becomes unique
	id: string;
	name: string;
	variant: "file" | "directory";
};

export type DirecoryResult = PathElement & { is_hidden: boolean };
