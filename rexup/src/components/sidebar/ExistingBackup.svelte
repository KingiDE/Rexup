<script lang="ts">
  import type { LocalStateBackup } from "../types";
  import Button from "../ui/Button.svelte";

  let {
    backup,
    selectBackup,
    currentBackup,
  }: {
    backup: LocalStateBackup;
    selectBackup: (backup: LocalStateBackup) => void;
    currentBackup: LocalStateBackup | null;
  } = $props();
</script>

<Button
  onClick={() => selectBackup(backup)}
  meaning="neutral"
  extraRules={["no-bg"]}
  extraCSS={`pl-4 h-10 text-start hover:bg-gray-500 ${backup.id === currentBackup?.id ? "bg-gray-500" : ""}`}
>
  {#snippet text()}
    {backup.name}
  {/snippet}
</Button>
