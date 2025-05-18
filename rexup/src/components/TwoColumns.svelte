<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import AddBackupPopup from "./popups/AddBackupPopup.svelte";
  import SettingsPopup from "./popups/SettingsPopup.svelte";
  import Sidebar from "./sidebar/Sidebar.svelte";
  import type { CurrentPopup, LocalStateBackup } from "./types";
  import Overview from "./overview/Overview.svelte";

  let backups = $state<Array<LocalStateBackup>>([]);
  $inspect(backups);
  let currentBackup = $state<LocalStateBackup | null>(null);

  let popup = $state<CurrentPopup>(null);
  $inspect(popup);

  function selectBackup(backup: LocalStateBackup) {
    currentBackup = backup;
  }

  // Adds backup width the passed name to local state
  function addBackup(name: string) {
    backups.push({
      id: Date.now().toString(),
      name: name,
      entries: [],
      is_zipped: false,
      // TODO: This probably needs to be some other safe value
      location: "",
      executions: [],
      logs_of_last_execution: [],
    });

    popup = null;
  }

  // Deletes the passed backup fron the local state
  function deleteCurrentBackup(backupToDelete: LocalStateBackup) {
    backups = backups.filter((el) => el.id !== backupToDelete.id);
    currentBackup = null;
  }

  // Resets all local states to empy values and calls the Rust backend to delete the entire ".rexup"-directory recursively
  async function deleteAllData() {
    backups = [];
    currentBackup = null;
    popup = null;

    // TODO: Check if "await" is really necessary
    await invoke("delete_all_data");
  }

  onMount(async () => {
    const readData = (await invoke("read_backup_file")) as string;
    // TODO: Validate read data
    backups = JSON.parse(readData);
  });

  $effect(() => {
    async function sett() {
      await invoke("write_backup_file", { value: backups });
    }
    sett();
  });
</script>

<div
  class="p-2 font-inter bg-gray-900 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2"
>
  <Sidebar bind:popup {backups} {selectBackup} {currentBackup} />
  <Overview bind:popup bind:currentBackup {deleteCurrentBackup} />
  <!-- All popups (they are placed "fixed") -->
  <AddBackupPopup bind:popup {addBackup} />
  <SettingsPopup bind:popup {deleteAllData} />
</div>
