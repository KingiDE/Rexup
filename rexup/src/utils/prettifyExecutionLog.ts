import type { BackupExecutionLog } from "../components/types";

export function prettifyExecutionLog(log: BackupExecutionLog) {
	if ("Finished" in log) {
		return `&#x1F3C1; ${log.Finished}`;
	}

	if ("Information" in log) {
		return `&#x2139;&#xFE0F; ${log.Information}`;
	}

	if ("ErrorCopying" in log) {
		return `&#x26A0;&#xFE0F; ${log.ErrorCopying}.`;
	}

	if ("SuccessCopying" in log) {
		return `&#x2705; Copied the ${log.SuccessCopying.variant.toLocaleLowerCase()} from ${log.SuccessCopying.from_path} to ${log.SuccessCopying.to_path} successfully.`;
	}

	if ("IgnoreCopying" in log) {
		let reason = "";

		switch (log.IgnoreCopying.reason) {
			case "TooLargeSize": {
				reason = "the file is too large";
				break;
			}
			case "WrongName": {
				reason = "the file has the wrong name";
				break;
			}
			case "WrongExtension": {
				reason = "the file has the wrong extension";
				break;
			}
		}
		return `&#x2705; Ignored coyping the file from ${log.IgnoreCopying.from_path} to ${log.IgnoreCopying.to_path} because ${reason}.`;
	}
}
