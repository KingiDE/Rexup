import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { convertBackupsJSONToJS } from "../utils/app/convertBackupsJSONToJS";
import { convertHistoryJSONToJS } from "../utils/app/convertHistoryJSONToJS";
import { convertConfigJSONToJS } from "../utils/app/convertConfigJSONToJS";

export type ConfigFile = {
	show_edit_warning: boolean;
	show_history: boolean;
};

// time of execution in ms: number, id of backup: string
export type HistoryFile = Map<number, string>;

export type BackupsFile = Map<
	string, // time of creation in ms
	{
		name: string;
		entries: Map<string, BackupFolderFile>;
		isZipped: boolean;
		location: string;
	}
>;

export type BackupFolderFile = {
	origin: string;
	target: string;
	is_active: boolean;
	variant: "folder" | "file";
	filters: {
		max_size_in_mb: number | null;
		included_file_types: Array<string> | null;
		included_file_names: Array<string> | null;
	};
};

export default function useStoredValues() {
	const [storedConfig, setStoredConfig] = useState<ConfigFile | null>(null);
	const [storedHistory, setStoredHistory] = useState<HistoryFile | null>(null);
	const [storedBackups, setStoredBackups] = useState<BackupsFile | null>(null);

	useEffect(() => {
		if (storedConfig === null) return;
		invoke("write_config_file", {
			value: storedConfig
		});
	}, [storedConfig]);

	useEffect(() => {
		if (storedHistory === null) return;
		invoke("write_history_file", {
			value: [...storedHistory]
		});
	}, [storedHistory]);

	useEffect(() => {
		if (storedBackups === null) return;
		const newStoredBackups: Array<
			[
				string,
				{
					name: string;
					entries: Array<[string, BackupFolderFile]>;
					is_zipped: boolean;
					location: string;
				}
			]
		> = [];
		[...storedBackups].map(storedBackup => {
			newStoredBackups.push([
				storedBackup[0],
				{
					name: storedBackup[1].name,
					entries: Array.from(storedBackup[1].entries),
					is_zipped: storedBackup[1].isZipped,
					location: storedBackup[1].location
				}
			]);
		});

		invoke("write_backup_file", {
			value: newStoredBackups
		});
	}, [storedBackups]);

	useEffect(() => {
		async function readStoredValues() {
			const config_values = (await invoke("read_config_file")) as string;
			setStoredConfig(convertConfigJSONToJS(config_values));

			const history_values = (await invoke("read_history_file")) as string;
			setStoredHistory(convertHistoryJSONToJS(history_values));

			const backups_values = (await invoke("read_backup_file")) as string;
			setStoredBackups(convertBackupsJSONToJS(backups_values));
		}
		readStoredValues();
	}, []);

	return {
		storedConfig,
		storedHistory,
		storedBackups,
		setStoredConfig,
		setStoredHistory,
		setStoredBackups
	};
}
