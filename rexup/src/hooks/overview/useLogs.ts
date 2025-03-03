import { useState } from "react";

export type LogMessage = {
	type: "info" | "error" | "success" | "finish" | "skip";
	value: string;
};

export default function useLogs() {
	const [logs, setLogs] = useState<Array<LogMessage>>([]);

	function clearLogs() {
		setLogs([]);
	}

	function addEntryToLogs({ type, value }: LogMessage) {
		setLogs(logs => [
			...logs,
			{
				type,
				value
			}
		]);
	}

	return {
		addEntryToLogs,
		clearLogs,
		logs
	};
}
