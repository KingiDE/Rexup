<script lang="ts">
  import EditBackupEntryPopup from "../../../popups/editBackupEntryPopup/EditBackupEntryPopup.svelte";
  import PathSelectorPopup from "../../../popups/pathSelectorPopup/PathSelectorPopup.svelte";
  import type { CurrentPopup, LocalStateBackupEntry } from "../../../types";
  import DisableAndEditSection from "./DisableAndEditSection.svelte";
  import IconAndNameSection from "./IconAndNameSection.svelte";
  import InputSection from "./InputSection.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
    deleteBackupEntry,
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
    deleteBackupEntry: (backupToDelete: LocalStateBackupEntry) => void;
  } = $props();

  function setEntryOriginPath(path: string) {
    entry.origin = path;
    popup = "edit_backup_entry";
  }
</script>

<div
  class={`bg-gray-900 p-4 rounded-md grid transition-[opacity] ${entry.is_active ? "" : "opacity-50"}`}
>
  <IconAndNameSection bind:entry />
  <InputSection {entry} />
  <DisableAndEditSection bind:entry bind:popup />
  <!-- Edit Backup-Entry Popup -->
  <EditBackupEntryPopup bind:entry bind:popup {deleteBackupEntry} />
  <PathSelectorPopup
    heading="Select origin location"
    bind:popup
    popupToShowUp="select_backup_entry_origin_location"
    setOuterPath={setEntryOriginPath}
    showFiles
  />
</div>
