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

  // Controls if the EditBackupEntry-Popup is shown event if the global value is correct.
  // This avoid multiple EditBackupEntry-Popups from opening at the same time and overlapping.
  let showThisPopup = $state(false);

  function setEntryOriginPath(path: string) {
    entry.origin = path;
    popup = "edit_backup_entry";
  }

  // Shows a yellow outline around the preview-box if at least the origin or target is "" (an empty string)
  function showYellowOutline() {
    return entry.origin === "" || entry.target === "";
  }
</script>

<div
  class={`bg-gray-900 p-4 rounded-md grid transition-[opacity_outline] ${showYellowOutline() ? "outline-2 outline-yellow-500" : "outline-0"} ${entry.is_active ? "" : "opacity-50"}`}
>
  <IconAndNameSection bind:entry />
  <InputSection {entry} />
  <DisableAndEditSection bind:entry bind:popup bind:showThisPopup />
  <!-- Edit Backup-Entry Popup -->
  <EditBackupEntryPopup
    bind:entry
    bind:popup
    bind:showThisPopup
    {deleteBackupEntry}
  />
  <PathSelectorPopup
    heading="Select origin location"
    bind:popup
    popupToShowUp="select_backup_entry_origin_location"
    setOuterPath={setEntryOriginPath}
    showFiles
  />
</div>
