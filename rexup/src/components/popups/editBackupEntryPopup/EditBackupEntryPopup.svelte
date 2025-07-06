<script lang="ts">
  import { fade } from "svelte/transition";
  import type { EditBackupEntryTab } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import EditBackupEntryTabSwitcher from "./EditBackupEntryTabSwitcher.svelte";
  import EditBackupEntryOverviewSection from "./EditBackupEntryOverviewSection.svelte";
  import EditBackupEntryFiltersSection from "./EditBackupEntryFiltersSection.svelte";
  import EditBackupEntryDestructiveSection from "./EditBackupEntryDestructiveSection.svelte";
  import { closePopup, popup } from "../../../hooks/useHotkeyHandler.svelte";
  import { currentBackupEntry } from "../../../hooks/overview/useEntriesTab.svelte";

  let tab = $state<EditBackupEntryTab>("overview");
</script>

{#if popup.value === "edit_backup_entry" && currentBackupEntry.value !== null}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] min-h-[550px] content-start z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        closePopup();
        tab = "overview";
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Edit Backup-Entry</h2>
    <p class="mt-4">
      Edit this backup-entry by modifying the origin-path and the target-path,
      which is the relative path inside the created backup-directory.
      Additionally, you can enable filters.
    </p>
    <EditBackupEntryTabSwitcher bind:tab />
    {#if tab === "overview"}
      <EditBackupEntryOverviewSection bind:entry={currentBackupEntry.value} />
    {:else if tab === "filters"}
      <EditBackupEntryFiltersSection bind:entry={currentBackupEntry.value} />
    {:else}
      <EditBackupEntryDestructiveSection entry={currentBackupEntry.value} />
    {/if}
  </div>
{/if}
