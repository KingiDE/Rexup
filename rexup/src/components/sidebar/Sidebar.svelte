<script lang="ts">
  import type { CurrentPopup, LocalStateBackup } from "../types";
  import AddBackupButton from "./AddBackupButton.svelte";
  import ExistingBackup from "./ExistingBackup.svelte";
  import ShowSettingsButton from "./ShowSettingsButton.svelte";

  let {
    backups,
    popup = $bindable(),
    selectBackup,
    currentBackup,
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
