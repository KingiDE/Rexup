import { useEffect, useState } from "react";

export default function useInvalidInputs({
	origin,
	target
}: {
	origin: string;
	target: string;
}) {
	const [pureInvalidInputs, setPureInvalidInputs] = useState(false);

	useEffect(() => {
		setPureInvalidInputs(origin === "" || target === "");
	}, [origin, target]);

	return {
		pureInvalidInputs
	};
}
