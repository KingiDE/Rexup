<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import {
    displayedFileNames,
    updateDisplayedNames,
  } from "../../../../../hooks/overview/useEditBackupEntryPopupFilters.svelte";
  import type { LocalStateBackupEntry } from "../../../../types";
  import Input from "../../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  // Detects when the backup entry changes:
  // The state holds the id of the entry inside the props. If not only one value but the entire backup entry changes, the id is different.
  // Then, this change is passed as a `false` to the `updateDisplayedNames` function which leads to a reset.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateDisplayedNames(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="mt-2">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.fileNames
    .heading}
</div>
<p class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.fileNames
    .description}
</p>
<div class="grid gap-2">
  {#if displayedFileNames.value !== null}
    {#each displayedFileNames.value as name, index}
      <Input
        inputExtraCSS={`w-full ${index === 0 ? "mt-1" : ""}`}
        placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
          .filtersTab.fileNames.placeholder}
        getter={() => name}
        setter={(newValue) => {
          if (displayedFileNames.value !== null) {
            displayedFileNames.value[index] = newValue;
          }
        }}
      />
    {/each}
  {:else}
    <Input
      inputExtraCSS="w-full mt-1"
      placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
        .filtersTab.fileNames.placeholder}
      getter={() => ""}
      setter={(newValue) => (displayedFileNames.value = [newValue])}
    />
  {/if}
</div>
