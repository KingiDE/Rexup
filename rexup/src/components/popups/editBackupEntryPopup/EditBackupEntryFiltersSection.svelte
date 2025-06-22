<script lang="ts">
  import { onMount } from "svelte";
  import type { LocalStateBackupEntry } from "../../types";
  import Input from "../../ui/Input.svelte";
  import {
    getEntryStateAndFileNamesToDisplay,
    getEntryStateAndFileExtensionsToDisplay,
    loadFileNamesToDisplay,
  } from "../../../hooks/useEditBackupEntryPopupFilters.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  let fileNamesToDisplay = $state<Array<string>>([""]);
  let fileExtensionsToDisplay = $state<Array<string>>([""]);

  onMount(() => {
    loadFileNamesToDisplay(fileNamesToDisplay);
    loadFileNamesToDisplay(fileExtensionsToDisplay);
  });

  $effect(() => {
    entry.filters.included_file_names = getEntryStateAndFileNamesToDisplay();
    entry.filters.included_file_extensions =
      getEntryStateAndFileExtensionsToDisplay();
  });

  function convertStringToNumber(value: string) {
    const possibleConvertedNumber = Number(value);

    if (Number.isNaN(possibleConvertedNumber)) {
      return null;
    } else if (possibleConvertedNumber === 0) {
      return null;
    }
    return possibleConvertedNumber;
  }
</script>

<div class="mt-2 font-semibold">Filters:</div>
<p class="opacity-75">
  Note that these filters will only work if the origin-path points to a
  directory and not a file. If you add any filenames or -extensions to this this
  list only files with these names or extensions will be backuped. All other
  files will be ignored and therefore not be in your final backup.
</p>
<div class="mt-2">Maximum file size:</div>
<Input
  getter={() =>
    entry.filters.max_size_in_mb === null
      ? ""
      : entry.filters.max_size_in_mb.toString()}
  setter={(newValue) =>
    (entry.filters.max_size_in_mb = convertStringToNumber(newValue))}
  placeholder="The maximum file size in MB (leave empty to disable this filter)"
  type="number"
/>
<div class="mt-2">File names:</div>
<div class="grid gap-2">
  {#each fileNamesToDisplay as fileName, index}
    <Input
      getter={() => fileName}
      setter={(newValue) => (fileNamesToDisplay[index] = newValue)}
      placeholder={`File name to include ${fileNamesToDisplay.length === 1 ? "(leave empty to disable this filter)" : ""}`}
    />
  {/each}
</div>
<div class="mt-2">File Extensions:</div>
<div class="grid gap-2">
  {#each fileExtensionsToDisplay as fileName, index}
    <Input
      getter={() => fileName}
      setter={(newValue) => (fileExtensionsToDisplay[index] = newValue)}
      placeholder={`File extension to include ${fileExtensionsToDisplay.length === 1 ? "(leave empty to disable this filter)" : ""}`}
    />
  {/each}
</div>
