<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    loadAndSetData,
    showBackupExecutionHistory,
    toggleShowBackupExecutionHistory,
  } from "../../hooks/sidebar/useSettingsPopup.svelte";
  import Button from "../ui/Button.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import Icon from "../ui/Icon.svelte";
  import { closePopup, popup } from "../../hooks/useHotkeyHandler.svelte";
  import { deleteAllData } from "../../hooks/sidebar/useSidebar.svelte";

  onMount(() => {
    loadAndSetData();
  });
</script>

{#if popup.value === "settings"}
  <div
    transition:fade={{ duration: 100 }}
    class={`w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        closePopup();
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Settings</h2>
    <div class="mt-4">
      <Checkbox
        value={showBackupExecutionHistory.value}
        onClick={toggleShowBackupExecutionHistory}
        label="Show backup execution history"
      />
      <div class="opacity-75">
        Enable or disable the appearence of the execution-history at the top of
        an backup overview.
      </div>
    </div>
    <div class="mt-4">
      Delete all of your data
      <div class="opacity-75">
        This includes your config-file, the recorded backup execution-history
        and the backup structure(s) but NOT the actual backups that were created
        themselves.
      </div>
      <Button meaning="negative" onClick={deleteAllData} extraCSS="mt-2 px-4">
        {#snippet text()}
          Delete all data
        {/snippet}
        {#snippet icon()}
          <Icon name="delete" extraCSS="fill-gray-50" />
        {/snippet}
      </Button>
    </div>
  </div>
{/if}
