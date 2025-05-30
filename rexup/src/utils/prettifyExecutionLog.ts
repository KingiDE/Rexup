import type { BackupExecutionLog } from "../components/types";

export function prettifyExecutionLog(log: BackupExecutionLog) {
  if ("Finished" in log) {
    return `&#x1F3C1; ${log.Finished}`;
  }

  if ("Information" in log) {
    return `&#x2139; ${log.Information}`;
  }

  if ("ErrorCopying" in log) {
    return `&#x274C; ${log.ErrorCopying}.`;
  }

  if ("SuccessCopying" in log) {
    return `&#x2705; Copied the ${log.SuccessCopying.variant.toLocaleLowerCase()} 
			from <span class="px-1 bg-gray-800 rounded-md opacity-75">${log.SuccessCopying.from_path}</span> 
			to <span class="px-1 bg-gray-800 rounded-md opacity-75">${log.SuccessCopying.to_path}</span> 
			successfully.`;
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
    return `&#x1F6AB; Ignored coyping the file 
			from <span class="px-1 bg-gray-800 rounded-md opacity-75">${log.IgnoreCopying.to_path}</span>
			to <span class="px-1 bg-gray-800 rounded-md opacity-75">${log.IgnoreCopying.to_path}</span>
			because ${reason}.`;
  }
}
