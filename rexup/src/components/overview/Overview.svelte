<script lang="ts">
  import type {
    CurrentOverviewTab,
    CurrentPopup,
    LocalStateBackup,
  } from "../types";
  import ConfigurationSection from "./ConfigurationSection.svelte";
  import TabSwitcher from "./TabSwitcher.svelte";

  let {
    currentBackup = $bindable(),
    popup = $bindable(),
  }: {
    currentBackup: LocalStateBackup | null;
    popup: CurrentPopup;
  } = $props();

  let currentTab = $state<CurrentOverviewTab>("entries");

  // TODO: Implement the function that deletes a backup
  function deleteBackup() {}
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
      <h3 class="mt-4 font-poppins text-xl font-bold">
        Execution-History + Execution-Logs
      </h3>
    {:else}
      <ConfigurationSection bind:currentBackup {deleteBackup} />
    {/if}
  {/if}
</div>
