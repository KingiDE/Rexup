<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import type { LocalStateBackupEntry } from "../../../../types";
  import FileNamesSection from "./FileNamesSection.svelte";
  import FiltersModeSection from "./FiltersModeSection.svelte";
  import MaxSizeSection from "./MaxSizeSection.svelte";
  import PathElementsSection from "./PathElementsSection.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="h-full overflow-y-scroll pr-1.5 pb-[1px] grid">
  <!-- General explanation of filters -->
  <div class="font-semibold">
    {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab.heading}
  </div>
  <p class="opacity-75">
    {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
      .description}
  </p>
  <MaxSizeSection bind:entry />
  <FiltersModeSection bind:entry />
  <FileNamesSection bind:entry />
  <PathElementsSection bind:entry />
</div>
