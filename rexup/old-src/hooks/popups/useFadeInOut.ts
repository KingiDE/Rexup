import { useEffect, useRef } from "react";

export default function useFadeIn(onWhat: boolean) {
	const wrapper = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (onWhat) {
			fadeIn();
		} else {
			fadeOut();
		}
	}, [onWhat]);

	function fadeIn() {
		if (!wrapper.current) return;
		wrapper.current.style.display = "grid";
		wrapper.current.focus();
		wrapper.current.animate([{ opacity: "1", display: "grid" }], {
			duration: 100,
			fill: "forwards",
		});
	}

	function fadeOut() {
		if (!wrapper.current) return;
		wrapper.current.style.display = "none";
		wrapper.current.animate([{ opacity: "0", display: "none" }], {
			duration: 100,
			fill: "forwards",
		});
	}

	return {
		wrapper,
		fadeOut,
	};
}
