import type { BackupExecutionLog } from "../components/types";

export function prettifyExecutionLog(log: BackupExecutionLog) {
	switch (log.variant) {
		// For creating the backup-parent-directory and ignoring whole entries
		case "information":
			return `&#x2139;&#xFE0F; ${log.message}`;
		// When the backup finished successfully
		case "finished":
			return `&#x1F3C1; ${log.message}`;
		// When an entry was successfully copied
		case "success_copying":
			return `&#x2705; Copied the ${log.type.toLocaleLowerCase()} from ${log.from_path} to ${log.to_path} (Entry: ${log.entryName}) successfully.`;
		// When an entry was not successfully copied
		case "error_copying":
			return `&#x26A0;&#xFE0F; Failed to copy from ${log.from_path} to ${log.to_path} (Entry: ${log.entryName}) because ${log.reason}.`;
		// When a file was ignored while copying
		case "ignore_copying":
			return `&#x1F6AB; Ignored copying the ${log.type.toLocaleLowerCase()} from ${log.from_path} to ${log.to_path} (Entry: ${log.entryName}) because ${log.reason}.`;
	}
}
