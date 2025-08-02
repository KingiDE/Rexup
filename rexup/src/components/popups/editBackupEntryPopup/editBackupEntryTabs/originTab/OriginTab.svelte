<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../../types";
  import { globalTexts } from "../../../../../globalTexts";
  import ModeSliderSection from "./ModeSliderSection.svelte";
  import ActualInputsSection from "./ActualInputsSection.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<!-- General explanation -->
<div class="font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.heading}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.originTab.description}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.assistanceReference}
</div>
<ModeSliderSection bind:entry />
<ActualInputsSection bind:entry />
