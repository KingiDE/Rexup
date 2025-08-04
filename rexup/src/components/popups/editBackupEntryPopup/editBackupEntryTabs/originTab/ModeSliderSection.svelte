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

<div class="mt-2 font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.mode.heading}
</div>
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
        {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.mode
          .localFileSystemOption}
      {/snippet}
    </Button>
    <Button
      onClick={() => (entry.origin.active_mode = "Commands")}
      meaning="discrete-neutral"
      extraCSS="w-[180px] px-4 py-1"
    >
      {#snippet text()}
        {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.mode
          .commandsOption}
      {/snippet}
    </Button>
  {/snippet}
</Slider>
