<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";
  import Slider from "../../../ui/Slider.svelte";
  import FileNamesSection from "./filtersTab/FileNamesSection.svelte";
  import PathElementsSection from "./filtersTab/PathElementsSection.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

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

<div class="h-full overflow-y-scroll pr-1.5 pb-[1px] grid">
  <div class="font-semibold">Filters:</div>
  <p class="opacity-75">
    Filters will only work if the origin points to a directory in the local
    file-system. If the path instead points to a file or the origin is a
    command/multiple ones that are executed, the filters won't apply.
  </p>
  <div class="mt-2">Maximum file size:</div>
  <p class="opacity-75">
    This filter describes the maximum file size in MB a file is allowed to have.
    If a file has a greater size, it will be ignored. This filter also applies
    to directories where it will check every file seperately and not the entire
    size of directory itself.
  </p>
  <Input
    inputExtraCSS="mt-1"
    getter={() =>
      entry.filters.max_size_in_mb === null
        ? ""
        : entry.filters.max_size_in_mb.toString()}
    setter={(newValue) =>
      (entry.filters.max_size_in_mb = convertStringToNumber(newValue))}
    placeholder="Maximum size"
    type="number"
  />
  <div class="mt-2">File names/Path elements mode:</div>
  <p class="opacity-75">
    Choose whether files matching the following two filters should or shouldn't
    be copied. This control has no effect on the "Maximum file size"-filter.
  </p>
  <Slider
    extraCSS="mt-1 justify-self-start"
    indexOfSelectedElement={entry.filters.mode === "Include" ? 0 : 1}
    sizeOfSingleElement={140}
  >
    {#snippet elements()}
      <Button
        onClick={() => (entry.filters.mode = "Include")}
        meaning="discrete-neutral"
        extraCSS="w-[140px] px-4 py-1"
      >
        {#snippet text()}
          Include
        {/snippet}
      </Button>
      <Button
        onClick={() => (entry.filters.mode = "Exclude")}
        meaning="discrete-neutral"
        extraCSS="w-[140px] px-4 py-1"
      >
        {#snippet text()}
          Exclude
        {/snippet}
      </Button>
    {/snippet}
  </Slider>
  <FileNamesSection bind:entry />
  <PathElementsSection bind:entry />
</div>
