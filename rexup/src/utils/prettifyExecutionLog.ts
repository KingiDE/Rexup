import type { BackupExecutionLog } from "../components/types";

export function prettifyExecutionLog(log: BackupExecutionLog) {
	switch (log.variant) {
		case "information":
			// TODO: Use unicode value for emojis
			return `ℹ️ ${log.message}`;
		case "success_copying":
			return `✅ Copied the ${log.type} from ${log.fromPath} to ${log.toPath} successfully`;
		case "error_copying":
			return `🚨 Failed to copy the ${log.type} from ${log.fromPath} to ${log.toPath}`;
		case "ignore_copying":
			return `🚫 Ignored copying the ${log.type} from ${log.fromPath} to ${log.toPath}`;
	}
}
