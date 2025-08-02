<script lang="ts">
  import { globalTexts } from "../../globalTexts";
  import AddBackupPopup from "../popups/AddBackupPopup.svelte";
  import SettingsPopup from "../popups/SettingsPopup.svelte";
  import type { LocalStateBackup } from "../types";
  import AddBackupButton from "./AddBackupButton.svelte";
  import ExistingBackup from "./ExistingBackup.svelte";
  import ShowSettingsButton from "./ShowSettingsButton.svelte";

  let {
    backups = $bindable(),
  }: {
    backups: Array<LocalStateBackup>;
  } = $props();
</script>

<nav class="bg-gray-800 rounded-md p-4 flex flex-col h-full overflow-y-hidden">
  <h2 class="font-poppins text-2xl font-bold mb-4">
    {globalTexts.sidebar.heading}
  </h2>
  {#if backups.length > 0}
    <div class="mb-4 grid gap-2 pr-1.5 overflow-y-scroll">
      {#each backups as backup}
        <ExistingBackup {backup} />
      {/each}
    </div>
  {/if}
  <AddBackupButton />
  <ShowSettingsButton />
  <!-- Popups -->
  <AddBackupPopup />
  <SettingsPopup />
</nav>
