<script lang="ts">
import type { CurrentPopup } from "../types";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error.
let {
	popup = $bindable(),
}: {
	popup: CurrentPopup;
} = $props();
</script>