import { useState } from "react";

export type LocalStateBackupWithId = [string, LocalStateBackup]; // string is the id of the backup

export type LocalStateBackup = {
	name: string;
	entries: Map<string, LocalStateBackupEntry>;
	isZipped: boolean;
	location: string;
};

export type LocalStateBackupEntry = {
	origin: string;
	target: string;
	is_active: boolean;
	variant: "file" | "folder";
	filters: {
		max_size_in_mb: number | null;
		included_file_types: Array<string> | null;
		included_file_names: Array<string> | null;
	};
};

export default function useCurrentSelectedBackup() {
	const [currentSelectedBackup, setCurrentSelectedBackup] =
		useState<null | LocalStateBackupWithId>(null);

	return {
		currentSelectedBackup,
		setCurrentSelectedBackup,
	};
}
