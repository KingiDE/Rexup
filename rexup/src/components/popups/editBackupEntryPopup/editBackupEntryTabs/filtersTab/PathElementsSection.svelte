<script lang="ts">
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

  // Detects when the backup entry changes
  // It holds the id of the entry inside the props. If not only one value but the entire backup changes, the id will be different.
  // Then, this will be passed as a reset to the `updateEntryOrigin` function.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateDisplayedPathElements(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="mt-2">Path elements:</div>
<p class="opacity-75">
  This filter lists the elements that a file has to have in its full path to be
  copied (or not). If the input-field is empty, the filter will be inactive.
</p>
<div class="grid gap-2">
  {#if displayedPathElements.value !== null}
    {#each displayedPathElements.value as name, index}
      <Input
        inputExtraCSS={`w-full ${index === 0 ? "mt-1" : ""}`}
        placeholder="Path element"
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
      placeholder="Path element"
      getter={() => ""}
      setter={(newValue) => (displayedPathElements.value = [newValue])}
    />
  {/if}
</div>
