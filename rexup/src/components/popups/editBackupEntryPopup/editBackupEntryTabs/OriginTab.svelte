<script lang="ts">
  import { popup } from "../../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";
  import Slider from "../../../ui/Slider.svelte";
  import {
    updateEntryOrigin,
    displayedCommandList,
    displayedLocalFileSystemPath,
  } from "../../../../hooks/overview/useEditBackupEntryPopupOrigin.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  // Detects when the backup entry changes
  // It holds the id of the entry inside the props. If not only one value but the entire backup changes, the id will be different.
  // Then, this will be passed as a reset to the `updateEntryOrigin` function.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateEntryOrigin(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="font-semibold">Origin:</div>
<div class="opacity-75">
  Here you can select the resource to copy. It can either be a file or directory
  on your local machine or commands that e.g. clone a Git-Repository and install
  the dependencies.
</div>
<div class="opacity-75">
  For further assistance, switch to the Overview-Tab that explains the
  copy-process in detail.
</div>
<div class="mt-2 font-semibold">Mode:</div>
<Slider
  extraCSS="justify-self-start"
  sizeOfSingleElement={180}
  indexOfSelectedElement={entry.origin.active_mode === "LocalFileSystem"
    ? 0
    : 1}
>
  {#snippet elements()}
    <Button
      onClick={() => (entry.origin.active_mode = "LocalFileSystem")}
      meaning="discrete-neutral"
      extraCSS="w-[180px] px-4 py-1"
    >
      {#snippet text()}
        Local File-System
      {/snippet}
    </Button>
    <Button
      onClick={() => (entry.origin.active_mode = "Commands")}
      meaning="discrete-neutral"
      extraCSS="w-[180px] px-4 py-1"
    >
      {#snippet text()}
        Commands
      {/snippet}
    </Button>
  {/snippet}
</Slider>
<div class="mt-2 font-semibold">Value:</div>
<div class="relative h-[280px] overflow-hidden">
  <!-- Local File-System -->
  <div
    class={`flex gap-2 w-full absolute transition-[right] ${entry.origin.active_mode === "LocalFileSystem" ? "right-0" : "right-full"}`}
  >
    <Input
      labelExtraCSS="grow"
      placeholder="Unset"
      getter={() =>
        displayedLocalFileSystemPath.value === null
          ? ""
          : displayedLocalFileSystemPath.value}
      setter={() => {}}
      disabled
      alwaysReadable
    />
    <Button
      meaning="positive"
      onClick={() => (popup.value = "select_backup_entry_origin_location")}
      extraCSS="py-1 w-20"
    >
      {#snippet text()}
        Edit
      {/snippet}
    </Button>
    <Button
      meaning="neutral"
      onClick={() => {
        // Also update the displayedLocalFileSystemPath
        displayedLocalFileSystemPath.value = "";

        entry.origin.local_file_system = "";
      }}
      extraCSS="py-1 w-20"
      disabled={entry.origin.local_file_system === ""}
    >
      {#snippet text()}
        Reset
      {/snippet}
    </Button>
  </div>
  <!-- Command list -->
  <div
    class={`grid gap-2 content-start w-full h-full overflow-y-scroll pr-1.5 pb-[1px] absolute transition-[left] ${entry.origin.active_mode === "Commands" ? "left-0" : "left-full"}`}
  >
    {#if displayedCommandList.value !== null}
      {#each displayedCommandList.value as cmd, index}
        <Input
          inputExtraCSS="w-full"
          placeholder="Command to execute"
          getter={() => cmd}
          setter={(newValue) => {
            if (displayedCommandList.value !== null) {
              displayedCommandList.value[index] = newValue;
            }
          }}
        />
      {/each}
    {:else}
      <Input
        inputExtraCSS="w-full"
        placeholder="Command to execute"
        getter={() => ""}
        setter={(newValue) => (displayedCommandList.value = [newValue])}
      />
    {/if}
  </div>
</div>
