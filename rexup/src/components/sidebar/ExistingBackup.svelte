<script lang="ts">
import type { LocalStateBackup } from "../types";
import Button from "../ui/Button.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error.
let {
	backup,
	selectBackup,
}: {
	backup: LocalStateBackup;
	selectBackup: (backup: LocalStateBackup) => void;
} = $props();
</script>

<Button onClick={() => selectBackup(backup)} meaning="neutral">
  {#snippet text()}
    {backup.name}
  {/snippet}
</Button>
