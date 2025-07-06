<script lang="ts">
  import { selectThisBackupEntry } from "../../../../hooks/overview/useEntriesTab.svelte";
  import { popup } from "../../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="mt-2 flex gap-4 justify-end">
  <Button
    meaning="neutral"
    onClick={() => (entry.is_active = !entry.is_active)}
    extraCSS={`py-1 w-[100px] justify-self-end`}
    disabled={popup.value !== null}
  >
    {#snippet text()}
      {entry.is_active ? "Enabled" : "Disabled"}
    {/snippet}
  </Button>
  <Button
    meaning="positive"
    onClick={() => {
      popup.value = "edit_backup_entry";
      selectThisBackupEntry(entry);
    }}
    extraCSS="py-1 w-[100px] justify-self-end"
    disabled={popup.value !== null}
  >
    {#snippet text()}
      Edit
    {/snippet}
  </Button>
</div>
