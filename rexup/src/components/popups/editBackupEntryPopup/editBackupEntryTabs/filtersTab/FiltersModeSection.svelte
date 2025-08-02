<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import type { LocalStateBackupEntry } from "../../../../types";
  import Button from "../../../../ui/Button.svelte";
  import Slider from "../../../../ui/Slider.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="mt-2">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.filterMode
    .heading}
</div>
<p class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.filterMode
    .description}
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
        {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
          .filterMode.includeOption}
      {/snippet}
    </Button>
    <Button
      onClick={() => (entry.filters.mode = "Exclude")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
    >
      {#snippet text()}
        {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
          .filterMode.excludeOption}
      {/snippet}
    </Button>
  {/snippet}
</Slider>
