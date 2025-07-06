<script lang="ts">
  import type { LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import AddBackupEntryPopup from "../../popups/AddBackupEntryPopup.svelte";
  import BackupEntryPreview from "./backupEntryPreview/BackupEntryPreview.svelte";
  import EditBackupEntryPopup from "../../popups/editBackupEntryPopup/EditBackupEntryPopup.svelte";
  import PathSelectorPopup from "../../popups/pathSelectorPopup/PathSelectorPopup.svelte";
  import { popup } from "../../../hooks/useHotkeyHandler.svelte";
  import { setEntryOriginPath } from "../../../hooks/overview/useEntriesTab.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<h3 class="mt-2 font-poppins text-xl font-bold">Entries</h3>
<div class="grid gap-4 mt-2 justify-items-start overflow-y-scroll">
  {#each currentBackup.entries as _entry, index}
    <BackupEntryPreview bind:entry={currentBackup.entries[index]} />
  {/each}
</div>
<!-- Always creates a margin-top of at least 16 pixels -->
<div class="mt-4"></div>
<!-- Same width as AddBackupButton on the sidebar -->
<Button
  onClick={() => (popup.value = "add_backup_entry")}
  meaning="neutral"
  extraCSS="mt-auto w-[268px] overflow-visible"
  disabled={popup.value !== null}
>
  {#snippet text()}
    Create Backup-Entry
  {/snippet}
  {#snippet icon()}
    <Icon name="add" extraCSS="fill-gray-50" />
  {/snippet}
</Button>
<!-- Popups -->
<AddBackupEntryPopup />
<EditBackupEntryPopup />
<PathSelectorPopup
  heading="Select origin location"
  popupToShowUp="select_backup_entry_origin_location"
  setOuterPath={setEntryOriginPath}
  showFiles
/>
