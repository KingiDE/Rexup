<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import Sidebar from "./sidebar/Sidebar.svelte";
  import type { CurrentPopup, LocalStateBackup } from "./types";
  import Overview from "./overview/Overview.svelte";
  import { validateBackupFile } from "../utils/validateBackupFile";

  let backups = $state<Array<LocalStateBackup> | null>(null);
  let currentBackup = $state<LocalStateBackup | null>(null);

  let popup = $state<CurrentPopup>(null);

  function selectBackup(backup: LocalStateBackup) {
    currentBackup = backup;
  }

  // Deletes the passed backup fron the local state
  function deleteCurrentBackup(backupToDelete: LocalStateBackup) {
    if (backups !== null) {
      backups = backups.filter((el) => el.id !== backupToDelete.id);
      currentBackup = null;
    }
  }

  onMount(async () => {
    const readData = (await invoke("read_backup_file")) as string;
    backups = validateBackupFile(readData);
  });

  $effect(() => {
    async function doAsyncThing() {
      if (backups !== null) invoke("write_backup_file", { value: backups });
    }
    doAsyncThing();
  });
</script>

{#if backups !== null}
  <div
    class="p-2 font-inter bg-gray-900 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2"
  >
    <Sidebar bind:popup bind:backups {selectBackup} bind:currentBackup />
    <Overview bind:popup bind:currentBackup {deleteCurrentBackup} />
  </div>
{/if}
