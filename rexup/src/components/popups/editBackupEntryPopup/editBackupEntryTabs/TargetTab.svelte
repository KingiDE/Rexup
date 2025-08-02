<script lang="ts">
  import { globalTexts } from "../../../../globalTexts";
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.target
    .heading}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.target
    .description}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.assistanceReference}
</div>
<div class="mt-1 flex gap-2">
  <Input
    labelExtraCSS="grow"
    placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab
      .placeholder}
    getter={() => entry.target}
    setter={(newValue) => {
      entry.target = newValue;
    }}
  />
  <Button
    meaning="neutral"
    onClick={() => (entry.target = "")}
    extraCSS="py-1 w-20"
    disabled={entry.target === ""}
  >
    {#snippet text()}
      {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.reset}
    {/snippet}
  </Button>
</div>
<div class="mt-2 font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.rename
    .heading}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.rename
    .description}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.assistanceReference}
</div>
<div class="mt-1 flex gap-2">
  <Input
    labelExtraCSS="grow"
    placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab
      .placeholder}
    getter={() => entry.rename_to}
    setter={(newValue) => {
      entry.rename_to = newValue;
    }}
  />
  <Button
    meaning="neutral"
    onClick={() => (entry.rename_to = "")}
    extraCSS="py-1 w-20"
    disabled={entry.rename_to === ""}
  >
    {#snippet text()}
      {globalTexts.overview.entriesTab.editBackupEntryPopup.targetTab.reset}
    {/snippet}
  </Button>
</div>
