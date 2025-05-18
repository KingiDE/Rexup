<script lang="ts">
  import type { CurrentPopup, LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import AddBackupEntryPopup from "../../popups/AddBackupEntryPopup.svelte";
  import BackupEntryPreview from "./BackupEntryPreview.svelte";

  let {
    popup = $bindable(),
    currentBackup = $bindable(),
  }: {
    popup: CurrentPopup;
    currentBackup: LocalStateBackup;
  } = $props();

  function setPopupToAddBackupEntry() {
    popup = { variant: "add_backup_entry", value: null };
  }

  function addBackupEntry(name: string) {
    currentBackup.entries.push({
      id: Date.now().toString(),
      name,
      origin: null,
      target: null,
      variant: null,
      is_active: true,
      filters: {
        included_file_names: null,
        included_file_types: null,
        max_size_in_mb: null,
      },
    });

    popup = null;
  }
</script>

<h3 class="mt-4 font-poppins text-xl font-bold">Entries</h3>
<!-- Same width as AddBackupButton on the sidebar -->
<div class="grid gap-2-mt-2">
  {#each currentBackup.entries as _entry, index}
    <BackupEntryPreview bind:entry={currentBackup.entries[index]} bind:popup />
  {/each}
</div>
<Button
  onClick={setPopupToAddBackupEntry}
  meaning="neutral"
  extraCSS={"mt-2 w-[268px]"}
>
  {#snippet text()}
    Create Backup-Entry
  {/snippet}
  {#snippet icon()}
    <Icon width={24} height={24} name="add" extraCSS="fill-gray-50" />
  {/snippet}
</Button>
<AddBackupEntryPopup bind:popup {addBackupEntry} />
