<script lang="ts">
  import type { CurrentPopup, LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
    showThisPopup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
    showThisPopup: boolean;
  } = $props();
</script>

<div class="mt-2 flex gap-4 justify-end">
  <Button
    meaning="neutral"
    onClick={() => (entry.is_active = !entry.is_active)}
    extraCSS={`py-1 w-[100px] justify-self-end`}
  >
    {#snippet text()}
      {entry.is_active ? "Enabled" : "Disabled"}
    {/snippet}
  </Button>
  <Button
    meaning="positive"
    onClick={() => {
      if (popup !== "edit_backup_entry") {
        popup = "edit_backup_entry";
        showThisPopup = true;
      }
    }}
    extraCSS="py-1 w-[100px] justify-self-end"
  >
    {#snippet text()}
      Edit
    {/snippet}
  </Button>
</div>
