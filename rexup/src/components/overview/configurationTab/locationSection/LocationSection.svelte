<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import PathSelectorPopup from "../../../popups/pathSelectorPopup/PathSelectorPopup.svelte";
  import type { CurrentPopup, LocalStateBackup } from "../../../types";
  import WriteAccessBox from "./WriteAccessBox.svelte";
  import BackupLocationInput from "./BackupLocationInput.svelte";

  let {
    currentBackup = $bindable(),
    popup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
    popup: CurrentPopup;
  } = $props();

  // When the user clicks "Select path", this function is passed to the PathSelectorPopup and will be called with the new location
  function setCurrentBackupPath(path: string) {
    currentBackup.location = path;
    popup = null;
  }

  // Checks whether the user has write access to this location
  let hasWriteAccess = $state(true);

  // Cannot use dervied.by() because of await issues
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
    "Edit"-button below and choose a diretory, the backup will be placed in.
  </div>
  <BackupLocationInput bind:popup bind:currentBackup />
  <PathSelectorPopup
    heading="Select backup location"
    bind:popup
    popupToShowUp="select_backup_location"
    setOuterPath={setCurrentBackupPath}
  />
  <WriteAccessBox {hasWriteAccess} />
</div>
