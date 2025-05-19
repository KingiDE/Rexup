<script lang="ts">
  import { fade } from "svelte/transition";
  import type { CurrentPopup, LocalStateBackupEntry } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import EditBackupEntryPathSection from "./EditBackupEntryPathSection.svelte";
  import Input from "../../ui/Input.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popup = null;
    }
  });
</script>

{#if popup !== null && popup === "edit_backup_entry"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Edit Backup-Entry</h2>
    <p class="mt-4">
      Edit this backup-entry by modifying the origin-path and the target-path,
      which is the relative path inside the created backup-directory.
      Additionally, you can enable filters.
    </p>
    <div class="mt-2 font-semibold">Name:</div>
    <Input
      getter={() => entry.name}
      setter={(newValue) => {
        entry.name = newValue;
      }}
    />
    <EditBackupEntryPathSection bind:popup bind:entry />
    <div class="mt-2 font-semibold">Filters:</div>
    <p class="opacity-75">
      Note that these filters will only work if the origin-path points to a
      directory and not a file.
    </p>
  </div>
{/if}
