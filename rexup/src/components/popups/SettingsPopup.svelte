<script lang="ts">
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import {
	deleteAllData,
	loadAndSetData,
	showBackupExecutionHistory,
	toggleShowBackupExecutionHistory,
} from "../../hooks/useSettingsPopup.svelte";
import type { CurrentPopup } from "../types";
import Button from "../ui/Button.svelte";
import Checkbox from "../ui/Checkbox.svelte";
import Icon from "../ui/Icon.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error
let {
	popup = $bindable(),
}: {
	popup: CurrentPopup;
} = $props();

onMount(() => {
	loadAndSetData();
});
</script>

{#if popup !== null && popup.variant === "settings"}
  <div
    transition:fade={{ duration: 100 }}
    class={`w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4 overflow-y-scroll`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50"/>
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Settings</h2>
    <div class="mt-4">
      <Checkbox value={showBackupExecutionHistory.value} onClick={toggleShowBackupExecutionHistory} label="Show backup execution history"/>
      <div class="opacity-75">
        Enable or disable the appearence of the execution-history at the top of an backup overview.
      </div>
    </div>
    <div class="mt-4">
      Delete all of your data
      <div class="opacity-75">
        This includes your config-file, the recorded backup ececution-history and the backup structure but NOT the actual backups itself.
      </div>
      <Button meaning="negative" onClick={deleteAllData} extraCSS="mt-2">
        {#snippet text()}
          Delete all data
        {/snippet}
        {#snippet icon()}
          <Icon width={24} height={24} name="delete" extraCSS="fill-gray-50"/>
        {/snippet}
      </Button>
    </div>
  </div>
{/if}
