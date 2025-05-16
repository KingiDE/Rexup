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
