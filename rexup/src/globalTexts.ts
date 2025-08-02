import type { FileOrDirectory } from "./components/types";

// Is used to enhance the displayed quality of paths in the frontend.
// It needs to be rendered as HTML to take effect.
function wrapInMonospaceBox(value: string) {
	return `<span class="bg-gray-800 rounded-md px-1 opacity-75">${value}</span>`;
}

export const globalTexts = {
	sidebar: {
		heading: "Backups",
		addBackup: "Create backup",
		addBackupPopup: {
			heading: "Create backup",
			description:
				"Create a new backup, that is added to the list on the sidebar. Please enter a name to proceed.",
			placeholder: "A fantastic name",
			confirm: "Create",
		},
		settingsPopup: {
			heading: "Settings",
			toggleDisplayHistoryLabel: "Show backup execution history",
			toggleDisplayHistoryDescription:
				"Enable or disable the appearance of the execution history.",
			deleteAllDataLabel: "Delete all your data",
			deleteAllDataDescription:
				"This includes your config file, the recorded history of backup executions and the structure of backups but NOT the actual backups that were created.",
			deleteAllDataButton: "Delete all data",
		},
	},
	overview: {
		pathSelectorPopup: {
			pathElementsHeading: "Path",
			bookmarks: {
				heading: "Bookmarks:",
				home: "Home",
				desktop: "Desktop",
				downloads: "Downloads",
				documents: "Desktop",
			},
			results: {
				heading: "Nested directories in the current directory:",
				noResults: {
					info: "There aren't any entries in this directory",
					infoEmoji: ":/",
				},
			},
			selectPathConfirm: "Select path",
		},
		noBackupSelected: {
			heading: "There's no backup selected",
			headingEmoji: ":/",
			description:
				"Click on an existing backup or create one to edit it in here.",
		},
		backupOverview: {
			heading: (name: string) => {
				return `Overview of backup "${name}"`;
			},
			executeBackup: "Execute backup",
			switchToLogTabHint:
				"After you clicked the button above, switch to the Logs tab (if you haven't already) to stay informed about the progress of the backup execution.",
			tabSwitcher: {
				entries: "Entries",
				logs: "Logs",
				configuration: "Configuration",
			},
		},
		listIcon: "\u{2022}", // U+2022 or "•"
		configurationTab: {
			heading: "Configuration",
			nameSection: {
				label: "Backup name",
				description: "Adjust the name display in the sidebar.",
				placeholder: "A creative name",
			},
			isZippedSection: {
				label: "Output variant",
				description:
					"Your backup can either be a simple folder containing nested folders or files or it can be a zip file. Zip files have the advantage of being smaller and easier to transfer between devices. On the other hand, zip files need to be extracted if you want to work with the contained data.",
				directoryOption: "Folder",
				zipFileOption: "Zip file",
			},
			locationSection: {
				label: "Backup location",
				description:
					'After your backup has been executed, its placed somewhere. This location can be configured here. To change it, simply click the "Edit" button below and choose a directory the backup is placed into.',
				inputPlaceholder: "Your desktop",
				pathSelectorHeading: "Select backup location",
				editInput: "Edit",
				resetInput: "Reset",
				accessGranted:
					"Everything is fine! You have access to this location on your file system.",
				accessProhibited:
					"Something is not working! You don't seem to have access to this location on your file system. Please choose a different directory for the backup to work properly.",
			},
			destructiveSection: {
				label: "Delete backup",
				description:
					'To delete this backup, click the "Delete this backup" button below. This deletes the entire backup structure but NOT the actual backups themselves.',
				delete: "Delete this backup",
				reallyDelete: "REALLY delete this backup?",
			},
		},
		logsTab: {
			heading: "Logs",
			emptyList: "Currently, this list is empty.",
			executionHistory: {
				label: "Execution history",
				description:
					"These logs keep track of the most recent backup executions.",
			},
			executionLogs: {
				label: "Execution logs",
				description:
					"The list below displays details of the last backup execution like errors and ignored files.",
				icons: {
					finished: "\u{1F3C1}", // U+1F3C1 or "🏁"
					information: "\u{2139}", // U+2139 or "ℹ️"
					error: "\u{274C}", // U+274C or "❌"
					success: "\u{2705}", // U+2705 or "✅"
					ignore: "\u{1F6AB}", // U+1F6AB or "🚫"
				},
				successfullCommandLog: (command: string, toPath: string) => {
					return `Executed the command ${wrapInMonospaceBox(command)} at ${wrapInMonospaceBox(toPath)} successfully.`;
				},
				successfullLocalFileSystemLog: (
					variant: FileOrDirectory,
					fromPath: string,
					toPath: string,
				) => {
					return `Copied the ${variant.toLocaleLowerCase()} from ${wrapInMonospaceBox(fromPath)} to ${wrapInMonospaceBox(toPath)} successfully.`;
				},
				ignoreFileLog: (fromPath: string, toPath: string, reason: string) => {
					return `Ignored copying the file from ${wrapInMonospaceBox(fromPath)} to ${wrapInMonospaceBox(toPath)} because the file ${reason}.`;
				},
				ignoreReasons: {
					tooLarge: "is too large",
					wrongName: "has the wrong name",
					wrongPathElements: "has the wrong path elements",
				},
			},
		},
		entriesTab: {
			heading: "Entries",
			createBackupEntry: "Create backup entry",
			pathSelectorHeading: "Select origin location",
			backupEntryPreview: {
				entryEnabled: "Enabled",
				entryDisabled: "Disabled",
				edit: "Edit",
				localFileSystemPreviewText: (variant: FileOrDirectory | null) => {
					return `This backup entry currently copies a ${variant === null ? "unknown thing" : variant.toLocaleLowerCase()} at following location:`;
				},
				commandPreviewText: (length: number) => {
					return `This backup entry currently executes ${length === 1 ? "one command" : `${length} commands`}.`;
				},
			},
			addBackupEntryPopup: {
				heading: "Create backup entry",
				description:
					"Create a new backup entry that is added to the list on the Overview tab. Please enter a name to proceed.",
				placeholder: "A fantastic name",
				confirm: "Create",
			},
			editBackupEntryPopup: {
				heading: "Edit backup entry",
				navbarIcons: {
					overview: "Overview",
					origin: "Origin",
					target: "Target",
					filters: "Filters",
					destructive: "Destructive",
				},
				assistanceReference:
					"For further assistance, switch to the Overview tab, which explains the copy process in detail.",
				destructiveTab: {
					heading: "Delete backup entry",
					description:
						'To delete this backup entry, click the "Delete this backup entry" button below. This deletes the entire backup entry structure but NOT the actual backups themselves.',
					delete: "Delete this backup entry",
					reallyDelete: "REALLY delete this backup entry?",
				},
				overviewTab: {
					nameLabel: "Name:",
					explanationLabel: "Explanation:",
					localFileSystemMode: {
						description:
							'Currently, the "LocalFileSystem" mode is enabled. This means that this backup entry copies files and directories from your device into the backup.',
						noOrigin:
							"Because there's no file or directory selected, a more detailed explanation can't be generated.",
						detailedExplanation: (
							variant: FileOrDirectory,
							origin: string,
							target: string,
						) => {
							return `In this case, the ${variant.toLocaleLowerCase()} located at ${wrapInMonospaceBox(origin)} on your device is copied into ${target === "" || target === "/" ? "the root directory" : `${wrapInMonospaceBox(target)}`} of the backup.`;
						},
						renameExplanation: (renameTo: string) => {
							return `Additionally, it will be renamed to ${wrapInMonospaceBox(renameTo)} after it has been placed in this directory.`;
						},
						filterExplanation: (
							countOfActiveFilters: number,
							filtersInPretty: string,
						) => {
							return `Furthermore, ${countOfActiveFilters === 1 ? "one filter" : `${countOfActiveFilters} filters`} (${filtersInPretty}) ${countOfActiveFilters > 1 ? "are" : "is"} active which may ${countOfActiveFilters > 1 ? "prevent" : "prevents"} files from being copied. Switch to the Filters tab to see the precise settings.`;
						},
						filterAbbreviations: {
							maximumFileSize: "maximum size",
							fileNames: "file names",
							pathElements: "path elements",
						},
					},
					commandsMode: {
						description:
							'Currently, the "Commands" mode is enabled. This means that this backup entry executes the specified commands inside the backup at the target location.',
						noCommands:
							"Because there aren't any commands that should be executed, a more detailed explanation can't be generated.",
						detailedExplanation: (count: number, target: string) => {
							return `In this case, the following ${count === 1 ? "one command is" : `${count} commands are`} executed at "${target}":`;
						},
					},
				},
				originTab: {
					heading: "Origin:",
					description:
						"Here you can select the resource to copy. It can either be a file or directory on your local device or a list of commands that e.g. clone Git repositories.",
					mode: {
						heading: "Mode:",
						localFileSystemOption: "Local file system",
						commandsOption: "Commands",
					},
					actualInput: {
						heading: "Value:",
						localFileSystem: {
							placeholder: "Unset",
							edit: "Edit",
							reset: "Reset",
						},
						commandListPlaceholder: "Command to execute",
					},
				},
				targetTab: {
					placeholder: "Unset",
					reset: "Reset",
					target: {
						heading: "Target:",
						description:
							'Here you can select the location of the copied resource relative to the directory or zip file that has been created. If the input field is empty, the resource is placed in the root directory (= "/").',
					},
					rename: {
						heading: "Rename to:",
						description:
							"Here you can pick the new name of the copied resource. If the input field is empty, the resource isn't renamed and keeps its original name. Note that the rename functionality only works on files and directories that are stored on your local file system.",
					},
				},
				filtersTab: {
					heading: "Filters:",
					description:
						"Filters only work if the origin points to a file or directory in the local file system.",
					maximumFileSize: {
						heading: "Maximum file size:",
						description:
							"This filter describes the maximum file size in MB a file is allowed to have. If a file has a greater size, it's ignored. This filter also applies to directories where every file is checked seperately.",
						placeholder: "Maximum size",
					},
					filterMode: {
						heading: "File names/Path elements mode:",
						description:
							'Choose whether files matching the following two filters should or shouldn\'t be included in the backup. This control has no effect on the "Maximum file size" filter.',
						includeOption: "Include",
						excludeOption: "Exclude",
					},
					fileNames: {
						heading: "File names:",
						description:
							"This filter lists the names a file is allowed or disallowed to have to be copied. If the input field is empty, the filter is inactive.",
						placeholder: "File name",
					},
					pathElements: {
						heading: "Path elements:",
						description:
							"This filter lists the elements a file is allowed or disallowed to have in its path to be copied. If the input field is empty, the filter is inactive.",
						placeholder: "Path element",
					},
				},
			},
		},
	},
};
