<script lang="ts">
  import type { CurrentPopup, LocalStateBackup } from "../types";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import ConfigurationTab from "./configurationTab/ConfigurationTab.svelte";
  import EntriesTab from "./entriesTab/EntriesTab.svelte";
  import LogsTab from "./LogsTab.svelte";
  import TabSwitcher from "./TabSwitcher.svelte";
  import {
    closePopupsOnCurrentTabChange,
    currentTab,
    executeBackup,
    isBackupExecuting,
  } from "../../hooks/useExecuteBackup.svelte";

  let {
    currentBackup = $bindable(),
    popup = $bindable(),
    deleteCurrentBackup,
  }: {
    currentBackup: LocalStateBackup | null;
    popup: CurrentPopup;
    deleteCurrentBackup: (backupToDelete: LocalStateBackup) => void;
  } = $props();

  // Closes all popups when the currentTab changes
  $effect(() => {
    const newPopupvalue = closePopupsOnCurrentTabChange();

    if (newPopupvalue === null) {
      popup = newPopupvalue;
    }
  });
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
    <TabSwitcher bind:currentTab={currentTab.value} />
    <Button
      meaning="positive"
      onClick={() => executeBackup(currentBackup)}
      extraCSS="mt-4 justify-self-start px-8"
      disabled={isBackupExecuting.value}
    >
      {#snippet text()}
        Execute backup
      {/snippet}
      {#snippet icon()}
        <Icon
          width={24}
          height={24}
          name="triangle"
          extraCSS="fill-gray-50 rotate-90"
        />
      {/snippet}
    </Button>
    <div class="mt-2 opacity-75">
      Switch to the logs tab (if you haven't already) to see the progress of the
      backup-execution after you clicked the button above.
    </div>
    {#if currentTab.value === "entries"}
      <EntriesTab bind:popup bind:currentBackup />
    {:else if currentTab.value === "logs"}
      <LogsTab {currentBackup} />
    {:else}
      <ConfigurationTab bind:currentBackup bind:popup {deleteCurrentBackup} />
    {/if}
  {/if}
</div>
