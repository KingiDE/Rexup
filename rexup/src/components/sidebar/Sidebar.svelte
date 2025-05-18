<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import AddBackupPopup from "../popups/AddBackupPopup.svelte";
  import SettingsPopup from "../popups/SettingsPopup.svelte";
  import type { CurrentPopup, LocalStateBackup } from "../types";
  import AddBackupButton from "./AddBackupButton.svelte";
  import ExistingBackup from "./ExistingBackup.svelte";
  import ShowSettingsButton from "./ShowSettingsButton.svelte";

  let {
    backups = $bindable(),
    popup = $bindable(),
    selectBackup,
    currentBackup = $bindable(),
  }: {
    backups: Array<LocalStateBackup>;
    popup: CurrentPopup;
    selectBackup: (backup: LocalStateBackup) => void;
    currentBackup: LocalStateBackup | null;
  } = $props();

  function setPopupToAddBackup() {
    popup = { variant: "add_backup", value: null };
  }

  function setPopupToSettings() {
    popup = { variant: "settings", value: null };
  }

  // Adds backup width the passed name to local state
  function addBackup(name: string) {
    backups.push({
      id: Date.now().toString(),
      name: name,
      entries: [],
      is_zipped: false,
      location: null,
      executions: [],
      logs_of_last_execution: [],
    });

    popup = null;
  }

  // Resets all local states to empty values and calls the Rust backend to delete the entire ".rexup"-directory recursively
  async function deleteAllData() {
    backups = [];
    currentBackup = null;
    popup = null;

    // Deletes all data after 1 second
    new Promise((_resolve) => {
      setTimeout(() => {
        invoke("delete_all_data");
      }, 1000);
    });
  }
</script>

<nav class="bg-gray-800 rounded-md p-4 flex flex-col">
  <h2 class="font-poppins text-2xl font-bold">Backups</h2>
  <div class="grid gap-2 my-4">
    {#each backups as backup}
      <ExistingBackup {backup} {selectBackup} {currentBackup} />
    {/each}
  </div>
  <AddBackupButton {setPopupToAddBackup} />
  <ShowSettingsButton {setPopupToSettings} />
</nav>
<AddBackupPopup bind:popup {addBackup} />
<SettingsPopup bind:popup {deleteAllData} />
