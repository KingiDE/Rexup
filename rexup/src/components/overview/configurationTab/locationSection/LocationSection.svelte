<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import PathSelectorPopup from "../../../popups/pathSelectorPopup/PathSelectorPopup.svelte";
  import type { LocalStateBackup } from "../../../types";
  import WriteAccessBox from "./WriteAccessBox.svelte";
  import BackupLocationInput from "./BackupLocationInput.svelte";
  import { closePopup } from "../../../../hooks/useHotkeyHandler.svelte";
  import { globalTexts } from "../../../../globalTexts";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();

  // When the user clicks "Select path", this function is called with the updated location
  function setCurrentBackupPath(path: string) {
    currentBackup.location = path;
    closePopup();
  }

  // Checks whether the user has write access to this location
  let hasWriteAccess = $state(true);

  // Cannot use dervied.by() because of await issues; calls the backend whenever currentBackup.location changes
  $effect(() => {
    async function doAsyncThing() {
      if (currentBackup.location === null) return;

      hasWriteAccess = await invoke("has_write_access_to", {
        path: currentBackup.location,
      });
    }
    doAsyncThing();
  });
</script>

<div class="mt-4">
  <div class="font-semibold">
    {globalTexts.overview.configurationTab.locationSection.label}
  </div>
  <div class="opacity-75 max-w-[700px]">
    {globalTexts.overview.configurationTab.locationSection.description}
  </div>
  <BackupLocationInput bind:currentBackup />
  <PathSelectorPopup
    heading={globalTexts.overview.configurationTab.locationSection
      .pathSelectorHeading}
    popupToShowUp="select_backup_location"
    setOuterPath={setCurrentBackupPath}
  />
  <WriteAccessBox {hasWriteAccess} />
</div>
