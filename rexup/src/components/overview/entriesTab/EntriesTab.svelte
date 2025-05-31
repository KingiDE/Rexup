<script lang="ts">
  import type {
    CurrentPopup,
    LocalStateBackup,
    LocalStateBackupEntry,
  } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import AddBackupEntryPopup from "../../popups/AddBackupEntryPopup.svelte";
  import BackupEntryPreview from "./backupEntryPreview/BackupEntryPreview.svelte";
  import EditBackupEntryPopup from "../../popups/editBackupEntryPopup/EditBackupEntryPopup.svelte";
  import PathSelectorPopup from "../../popups/pathSelectorPopup/PathSelectorPopup.svelte";

  let {
    popup = $bindable(),
    currentBackup = $bindable(),
  }: {
    popup: CurrentPopup;
    currentBackup: LocalStateBackup;
  } = $props();

  let currentBackupEntry = $state<LocalStateBackupEntry | null>(null);

  function selectThisBackupEntry(entry: LocalStateBackupEntry) {
    currentBackupEntry = entry;
  }

  function setEntryOriginPath(path: string) {
    if (currentBackupEntry === null) return;

    currentBackupEntry.origin = path;
    popup = "edit_backup_entry";
  }

  function setPopupToAddBackupEntry() {
    popup = "add_backup_entry";
  }

  function addBackupEntry(name: string) {
    currentBackup.entries.push({
      id: Date.now().toString(),
      name,
      origin: "",
      target: "/",
      variant: null,
      is_active: true,
      filters: {
        included_file_names: null,
        included_file_extensions: null,
        max_size_in_mb: null,
      },
    });

    popup = null;
  }

  function deleteBackupEntry() {
    currentBackup.entries = currentBackup.entries.filter(
      (el) => el.id !== currentBackup.id,
    );

    popup = null;
  }
</script>

<h3 class="mt-2 font-poppins text-xl font-bold">Entries</h3>
<!-- Same width as AddBackupButton on the sidebar -->
<div class="grid gap-4 mt-2 justify-items-start">
  {#each currentBackup.entries as _entry, index}
    <BackupEntryPreview
      bind:entry={currentBackup.entries[index]}
      bind:popup
      {selectThisBackupEntry}
    />
  {/each}
</div>
<Button
  onClick={setPopupToAddBackupEntry}
  meaning="neutral"
  extraCSS="mt-2 w-[268px] overflow-visible"
>
  {#snippet text()}
    Create Backup-Entry
  {/snippet}
  {#snippet icon()}
    <Icon width={24} height={24} name="add" extraCSS="fill-gray-50" />
  {/snippet}
</Button>
<AddBackupEntryPopup bind:popup {addBackupEntry} />
<!-- EditBackupEntryPopup with PathSelectorPopup -->
<EditBackupEntryPopup
  bind:entry={currentBackupEntry}
  bind:popup
  {deleteBackupEntry}
/>
<PathSelectorPopup
  heading="Select origin location"
  bind:popup
  popupToShowUp="select_backup_entry_origin_location"
  setOuterPath={setEntryOriginPath}
  showFiles
/>
