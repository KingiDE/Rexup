<script lang="ts">
  import type {
    CurrentOverviewTab,
    CurrentPopup,
    LocalStateBackup,
  } from "../types";
  import ConfigurationTab from "./configurationTab/ConfigurationTab.svelte";
  import LogsTab from "./LogsTab.svelte";
  import TabSwitcher from "./TabSwitcher.svelte";

  let {
    currentBackup = $bindable(),
    popup = $bindable(),
    deleteCurrentBackup,
  }: {
    currentBackup: LocalStateBackup | null;
    popup: CurrentPopup;
    deleteCurrentBackup: (backupToDelete: LocalStateBackup) => void;
  } = $props();

  let currentTab = $state<CurrentOverviewTab>("entries");
</script>

<div
  class={`bg-gray-800 rounded-md p-4 grid ${currentBackup === null ? "" : "content-start"}`}
>
  {#if currentBackup === null}
    <h2 class="font-poppins text-2xl font-bold self-end text-center">
      There's no backup selected <span class="ml-2">:/</span>
    </h2>
    <p class="mt-2 self-start text-center">
      Click on an existing backup or create one to edit it here.
    </p>
  {:else}
    <h2 class="font-poppins text-2xl font-bold mb-2">
      Overview of Backup: "{currentBackup.name}"
    </h2>
    <TabSwitcher bind:currentTab />
    {#if currentTab === "entries"}
      <h3 class="mt-4 font-poppins text-xl font-bold">Entries</h3>
    {:else if currentTab === "logs"}
      <LogsTab {currentBackup} />
    {:else}
      <ConfigurationTab bind:currentBackup bind:popup {deleteCurrentBackup} />
    {/if}
  {/if}
</div>
