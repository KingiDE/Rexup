<script lang="ts">
  import { popup } from "../../hooks/useHotkeyHandler.svelte";
  import {
    currentBackup,
    selectBackup,
  } from "../../hooks/useTwoColumns.svelte";
  import type { LocalStateBackup } from "../types";
  import Button from "../ui/Button.svelte";

  let {
    backup,
  }: {
    backup: LocalStateBackup;
  } = $props();
</script>

<Button
  onClick={() => selectBackup(backup)}
  meaning="neutral"
  extraRules={["no-bg"]}
  extraCSS={`pl-4 h-10 text-start ${popup.value === null ? "hover:bg-gray-500" : ""} ${backup.id === currentBackup.value?.id ? "bg-gray-500" : ""}`}
  disabled={popup.value !== null}
>
  {#snippet text()}
    {backup.name}
  {/snippet}
</Button>
