<script lang="ts">
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

  // Detects when the backup entry changes
  // It holds the id of the entry inside the props. If not only one value but the entire backup changes, the id will be different.
  // Then, this will be passed as a reset to the `updateEntryOrigin` function.
  let previousId = $state<string | null>(null);

  $effect(() => {
    updateDisplayedNames(previousId !== entry.id, entry);
    previousId = entry.id;
  });
</script>

<div class="mt-2">File names:</div>
<p class="opacity-75">
  This filter lists the names a file is allowed to have to be copied (or not).
  If the input-field is empty, the filter will be inactive.
</p>
<div class="grid gap-2">
  {#if displayedFileNames.value !== null}
    {#each displayedFileNames.value as name, index}
      <Input
        inputExtraCSS={`w-full ${index === 0 ? "mt-1" : ""}`}
        placeholder="File name"
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
      placeholder="File name"
      getter={() => ""}
      setter={(newValue) => (displayedFileNames.value = [newValue])}
    />
  {/if}
</div>
