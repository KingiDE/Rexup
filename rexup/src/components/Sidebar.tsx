import type { Dispatch, SetStateAction } from "react";
import type { CurrentPopup } from "../App";
import type { LocalStateBackupWithId } from "../hooks/useCurrentSelectedBackup";
import type {
	BackupsFile,
	ConfigFile,
	HistoryFile,
} from "../hooks/useStoredValues";
import AddBackupDialog from "./popups/AddBackupPopup";
import ConfigureBackupPopup from "./popups/ConfigureBackupPopup";
import DeleteBackupWarning from "./popups/DeleteBackupPopup";
import RenameBackupPopup from "./popups/RenameBackupPopup";
import Settings from "./popups/SettingsPopup";
import { AddBackup, BackupItem } from "./sidebar/BackupItem";
import ShowSettingsButton from "./sidebar/ShowSettingsButton";
import { SpacingMedium } from "./ui-lib/Spacing";
import { HeadingII } from "./ui-lib/Texts";

export default function Sidebar({
	currentPopup,
	setCurrentPopup,
	currentSelectedBackup,
	setCurrentSelectedBackup,
	storedBackups,
	createBackup,
	renameBackup,
	deleteBackup,
	storedConfig,
	setStoredConfig,
	setStoredHistory,
	toggleBackupZipping,
	updateBackupLocation,
}: {
	currentPopup: CurrentPopup;
	setCurrentPopup: Dispatch<SetStateAction<CurrentPopup>>;
	currentSelectedBackup: LocalStateBackupWithId | null;
	setCurrentSelectedBackup: Dispatch<
		SetStateAction<LocalStateBackupWithId | null>
	>;
	storedBackups: BackupsFile | null;
	createBackup: (name: string) => void;
	renameBackup: (backupId: string, value: string) => void;
	deleteBackup: (id: string) => void;
	storedConfig: ConfigFile | null;
	setStoredConfig: Dispatch<SetStateAction<ConfigFile | null>>;
	setStoredHistory: Dispatch<SetStateAction<HistoryFile | null>>;
	toggleBackupZipping: (backupId: string) => void;
	updateBackupLocation: (backupId: string, value: string) => void;
}) {
	// Combines the executed functionality from the hotkey and button-click
	function localCreateBackup(name: string) {
		createBackup(name);
		setCurrentPopup(null);
	}

	function localRenameBackup(backupId: string, value: string) {
		renameBackup(backupId, value);
		setCurrentPopup(null);
	}

	function localDeleteBackup(backupId: string) {
		deleteBackup(backupId);
		setCurrentSelectedBackup(null);
		setCurrentPopup(null);
	}

	function initiateDeleteBackup(backup: LocalStateBackupWithId) {
		setCurrentPopup({ variant: "deletebackup", value: backup });
	}

	function initiateRenameBackup(backup: LocalStateBackupWithId) {
		setCurrentPopup({ variant: "renamebackup", value: backup });
	}

	return (
		<nav className="bg-gray-900 rounded-md p-4 flex flex-col">
			<HeadingII>Backups</HeadingII>
			<SpacingMedium />
			<ul className="grid gap-2">
				{storedBackups &&
					[...storedBackups].map((backup) => (
						<BackupItem
							key={backup[0]}
							backup={backup}
							initiateDeleteBackup={initiateDeleteBackup}
							initiateRenameBackup={initiateRenameBackup}
							setCurrentSelectedBackup={setCurrentSelectedBackup}
						/>
					))}
				<AddBackup setCurrentPopup={setCurrentPopup} />
			</ul>
			<AddBackupDialog
				onCancel={() => setCurrentPopup(null)}
				currentPopup={currentPopup}
				localCreateBackup={localCreateBackup}
			/>
			<DeleteBackupWarning
				setCurrentPopup={setCurrentPopup}
				localDeleteBackup={localDeleteBackup}
				currentSelectedBackup={currentSelectedBackup}
				currentPopup={currentPopup}
			/>
			<RenameBackupPopup
				localRenameBackup={localRenameBackup}
				currentPopup={currentPopup}
				onCancel={() => setCurrentPopup(null)}
			/>
			<Settings
				setCurrentPopup={setCurrentPopup}
				setStoredHistory={setStoredHistory}
				storedConfig={storedConfig}
				currentPopup={currentPopup}
				setStoredConfig={setStoredConfig}
			/>
			<ConfigureBackupPopup
				currentPopup={currentPopup}
				setCurrentPopup={setCurrentPopup}
				currentSelectedBackup={currentSelectedBackup}
				toggleBackupZipping={toggleBackupZipping}
				updateBackupLocation={updateBackupLocation}
			/>
			<ShowSettingsButton setCurrentPopup={setCurrentPopup} />
		</nav>
	);
}
