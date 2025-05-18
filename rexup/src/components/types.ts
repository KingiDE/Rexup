export type CurrentPopup =
	| {
			variant: "add_backup";
			value: null;
	  }
	| {
			variant: "edit_backup";
			value: LocalStateBackup;
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
			variant: "delete_backup_entry";
			value: LocalStateBackupEntry;
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
	location: string;
	// Stores the execution times in miliseconds after 1. January 1970 by calling "date.getTime()"
	executions: Array<number>;
	logs_of_last_execution: Array<BackupExecutionLog>;
};

export type BackupExecutionLog =
	| {
			variant: "information";
			message: string;
	  }
	| {
			variant: "success_copying";
			// Here, the "directory" or "file" is stored in the field "type" because the field "variant" is already used
			type: "file" | "directory";
			fromPath: string;
			toPath: string;
	  }
	| {
			variant: "error_copying" | "ignore_copying";
			// Here, the "directory" or "file" is stored in the field "type" because the field "variant" is already used
			type: "file" | "directory";
			fromPath: string;
			toPath: string;
			reason: string;
	  };

export type LocalStateBackupEntry = {
	id: string;
	origin: string;
	target: string;
	is_active: boolean;
	variant: "file" | "directory";
	filters: {
		max_size_in_mb: number | null;
		included_file_types: Array<string> | null;
		included_file_names: Array<string> | null;
	};
};

export type PathElement = {
	name: string;
	variant: "file" | "directory";
};

export type DirecoryResult = {
	name: string;
	is_hidden: boolean;
	variant: "file" | "directory";
};
