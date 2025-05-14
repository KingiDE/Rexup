import type {
	BackupFolderFile,
	BackupsFile,
} from "../../hooks/useStoredValues";

export function convertBackupsJSONToJS(value: string) {
	let asJS;

	try {
		asJS = JSON.parse(value);
	} catch (_e) {
		asJS = [];
	}

	// Check whether structure is correct
	if (asJS === null || typeof asJS !== "object" || !Array.isArray(asJS)) {
		return new Map<
			string,
			{
				name: string;
				isZipped: boolean;
				location: string;
				entries: Map<string, BackupFolderFile>;
			}
		>();
	}

	const newBackups: BackupsFile = new Map<
		string,
		{
			name: string;
			isZipped: boolean;
			location: string;
			entries: Map<string, BackupFolderFile>;
		}
	>();

	asJS.map(
		(entry: {
			id: string;
			backup: {
				name: string;
				is_zipped: boolean;
				entries: Array<[string, BackupFolderFile]>;
			};
		}) => {
			// Check whether all fields are present
			if (
				entry !== null &&
				typeof entry === "object" &&
				"id" in entry &&
				typeof entry.id === "string" &&
				"backup" in entry &&
				entry.backup !== null &&
				"name" in entry.backup &&
				typeof entry.backup.name === "string" &&
				"is_zipped" in entry.backup &&
				typeof entry.backup.is_zipped === "boolean" &&
				"location" in entry.backup &&
				typeof entry.backup.location === "string" &&
				"entries" in entry.backup &&
				typeof entry.backup.entries !== null &&
				typeof entry.backup.entries === "object" &&
				Array.isArray(entry.backup.entries)
			) {
				const newEntries: Map<string, BackupFolderFile> = new Map<
					string,
					BackupFolderFile
				>();

				entry.backup.entries.map((folder: [string, BackupFolderFile]) => {
					if (
						typeof folder[0] === "string" &&
						"origin" in folder[1] &&
						typeof folder[1].origin === "string" &&
						"target" in folder[1] &&
						typeof folder[1].target === "string" &&
						"is_active" in folder[1] &&
						typeof folder[1].is_active === "boolean" &&
						"variant" in folder[1] &&
						typeof folder[1].variant === "string"
					) {
						// If entry is file, ignore possible filters

						// If filters exist correctly, proceed, else: do nothing
						if (
							// Filter for correct "filters"
							"filters" in folder[1] &&
							typeof folder[1].filters === "object" &&
							// Filter for correct "max_size_in_mb"
							"max_size_in_mb" in folder[1].filters &&
							(typeof folder[1].filters.max_size_in_mb === "number" ||
								folder[1].filters.max_size_in_mb === null) &&
							// Filter for correct "included_file_types"
							"included_file_types" in folder[1].filters &&
							((typeof folder[1].filters.included_file_types === "object" &&
								Array.isArray(folder[1].filters.included_file_types) &&
								folder[1].filters.included_file_types.every(
									(item) => typeof item === "string",
								)) ||
								folder[1].filters.included_file_types === null) &&
							// Filter for correct "included_file_names"
							"included_file_names" in folder[1].filters &&
							((typeof folder[1].filters.included_file_names === "object" &&
								Array.isArray(folder[1].filters.included_file_names) &&
								folder[1].filters.included_file_names.every(
									(item) => typeof item === "string",
								)) ||
								folder[1].filters.included_file_names === null)
						) {
							newEntries.set(folder[1].origin + folder[1].target, {
								variant: folder[1].variant,
								origin: folder[1].origin,
								target: folder[1].target,
								is_active: folder[1].is_active,
								filters: {
									max_size_in_mb: folder[1].filters.max_size_in_mb,
									included_file_types: folder[1].filters.included_file_types,
									included_file_names: folder[1].filters.included_file_names,
								},
							});
						}
					}
				});

				newBackups.set(entry.id, {
					name: entry.backup.name,
					isZipped: entry.backup.is_zipped,
					location: entry.backup.location,
					entries: newEntries,
				});
			}
		},
	);

	return newBackups;
}
