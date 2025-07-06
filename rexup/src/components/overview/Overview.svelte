<script lang="ts">
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import ConfigurationTab from "./configurationTab/ConfigurationTab.svelte";
  import EntriesTab from "./entriesTab/EntriesTab.svelte";
  import LogsTab from "./LogsTab.svelte";
  import TabSwitcher from "./TabSwitcher.svelte";
  import {
    currentTab,
    executeBackup,
    isBackupExecuting,
  } from "../../hooks/overview/useExecuteBackup.svelte";
  import { currentBackup } from "../../hooks/useTwoColumns.svelte";
  import { popup } from "../../hooks/useHotkeyHandler.svelte";
</script>

<div
  class={`bg-gray-800 rounded-md p-4 h-full overflow-y-scroll flex flex-col`}
>
  {#if currentBackup.value === null}
    <div class="h-full grid place-content-center">
      <h2 class="font-poppins text-2xl font-bold text-center">
        There's no backup selected <span class="ml-2">:/</span>
      </h2>
      <p class="mt-2 text-center">
        Click on an existing backup or create one to edit it here.
      </p>
    </div>
  {:else}
    <h2 class="font-poppins text-2xl font-bold mb-2">
      Overview of Backup: "{currentBackup.value.name}"
    </h2>
    <TabSwitcher bind:currentTab={currentTab.value} />
    <Button
      meaning="positive"
      onClick={() => executeBackup(currentBackup.value)}
      extraCSS="mt-4 self-start px-8 overflow-visible"
      disabled={isBackupExecuting.value || popup.value !== null}
    >
      {#snippet text()}
        Execute backup
      {/snippet}
      {#snippet icon()}
        <Icon name="triangle" extraCSS="fill-gray-50 rotate-90" />
      {/snippet}
    </Button>
    <div class="mt-2 opacity-75">
      Switch to the Logs-Tab (if you haven't already) to see the progress of the
      backup-execution after you clicked the button above.
    </div>
    {#if currentTab.value === "entries"}
      <EntriesTab bind:currentBackup={currentBackup.value} />
    {:else if currentTab.value === "logs"}
      <LogsTab currentBackup={currentBackup.value} />
    {:else}
      <ConfigurationTab bind:currentBackup={currentBackup.value} />
    {/if}
  {/if}
</div>
