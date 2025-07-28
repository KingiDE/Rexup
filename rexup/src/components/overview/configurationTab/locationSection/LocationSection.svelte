<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import PathSelectorPopup from "../../../popups/pathSelectorPopup/PathSelectorPopup.svelte";
  import type { LocalStateBackup } from "../../../types";
  import WriteAccessBox from "./WriteAccessBox.svelte";
  import BackupLocationInput from "./BackupLocationInput.svelte";
  import { closePopup } from "../../../../hooks/useHotkeyHandler.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();

  // When the user clicks "Select path", this function is passed to the PathSelectorPopup and will be called with the new location
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
  <div class="font-semibold">Backup-Location</div>
  <div class="opacity-75 max-w-[600px]">
    After your backup has been executed, it will be placed somewhere. This
    location can be configured here. To change it, simply click the
    "Edit"-button below and choose a directory, the backup will be placed in.
  </div>
  <BackupLocationInput bind:currentBackup />
  <PathSelectorPopup
    heading="Select backup location"
    popupToShowUp="select_backup_location"
    setOuterPath={setCurrentBackupPath}
  />
  <WriteAccessBox {hasWriteAccess} />
</div>
