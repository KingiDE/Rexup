<script lang="ts">
import type { CurrentPopup, LocalStateBackup } from "../types";
import ConfigurationSection from "./ConfigurationSection.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error
let {
	currentBackup = $bindable(),
	popup = $bindable(),
}: {
	currentBackup: LocalStateBackup | null;
	popup: CurrentPopup;
} = $props();

const expandedSections = $state({
	configuration: false,
	history: false,
	entries: false,
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
    <ConfigurationSection bind:currentBackup isConfigureSectionExpanded={expandedSections.configuration}/>

    <!-- Execution-History -->
    <h3 class="mt-4 font-poppins text-xl font-bold">Execution-History</h3>

    <!-- Entries -->
    <h3 class="mt-4 font-poppins text-xl font-bold">Entries</h3>

    <!-- Destructive Actions -->
    <h3 class="mt-4 font-poppins text-xl font-bold">Destructive Actions</h3>
  {/if}
</div>
