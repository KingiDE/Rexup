<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import {
    displayedPathElements,
    updateDisplayedPathElements,
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
  // Then, this change is passed as a `false` to the `updateDisplayedPathElements` function which leads to a reset.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateDisplayedPathElements(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="mt-2">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.pathElements
    .heading}
</div>
<p class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.pathElements
    .description}
</p>
<div class="grid gap-2">
  {#if displayedPathElements.value !== null}
    {#each displayedPathElements.value as name, index}
      <Input
        inputExtraCSS={`w-full ${index === 0 ? "mt-1" : ""}`}
        placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
          .filtersTab.pathElements.placeholder}
        getter={() => name}
        setter={(newValue) => {
          if (displayedPathElements.value !== null) {
            displayedPathElements.value[index] = newValue;
          }
        }}
      />
    {/each}
  {:else}
    <Input
      inputExtraCSS="w-full mt-1"
      placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup
        .filtersTab.pathElements.placeholder}
      getter={() => ""}
      setter={(newValue) => (displayedPathElements.value = [newValue])}
    />
  {/if}
</div>
