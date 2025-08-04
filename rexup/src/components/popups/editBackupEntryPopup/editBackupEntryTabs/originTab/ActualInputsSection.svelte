<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import { popup } from "../../../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackupEntry } from "../../../../types";
  import Button from "../../../../ui/Button.svelte";
  import Input from "../../../../ui/Input.svelte";
  import {
    updateEntryOrigin,
    displayedCommandList,
    displayedLocalFileSystemPath,
  } from "../../../../../hooks/overview/useEditBackupEntryPopupOrigin.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  // Detects when the backup entry changes:
  // The state holds the id of the entry inside the props. If not only one value but the entire backup entry changes, the id is different.
  // Then, this change is passed as a `false` to the `updateEntryOrigin` function which leads to a reset.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateEntryOrigin(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="mt-2 font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.actualInput
    .heading}
</div>
<div class="relative h-[280px] overflow-hidden">
  <!-- Local File-System -->
  <div
    class={`flex gap-2 w-full absolute transition-[right] ${entry.origin.active_mode === "LocalFileSystem" ? "right-0" : "right-full"}`}
  >
    <Input
      labelExtraCSS="grow"
      placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
        .originTab.actualInput.localFileSystem.placeholder}
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
        {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab
          .actualInput.localFileSystem.edit}
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
        {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab
          .actualInput.localFileSystem.reset}
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
          placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
            .originTab.actualInput.commandListPlaceholder}
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
        placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
          .originTab.actualInput.commandListPlaceholder}
        getter={() => ""}
        setter={(newValue) => (displayedCommandList.value = [newValue])}
      />
    {/if}
  </div>
</div>
