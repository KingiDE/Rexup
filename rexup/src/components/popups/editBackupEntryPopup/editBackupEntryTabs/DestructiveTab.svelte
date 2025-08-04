<script lang="ts">
  import { fade } from "svelte/transition";
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Icon from "../../../ui/Icon.svelte";
  import { deleteBackupEntry } from "../../../../hooks/overview/useEntriesTab.svelte";
  import { globalTexts } from "../../../../globalTexts";

  let {
    entry,
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  let hasTriedToDeleteBackupEntry = $state(false);
</script>

<div class="font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.destructiveTab.heading}
</div>
<div class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.destructiveTab
    .description}
</div>
<div class="flex gap-4">
  <Button
    onClick={() => (hasTriedToDeleteBackupEntry = true)}
    meaning="negative"
    extraCSS="mt-2 px-4"
  >
    {#snippet text()}
      {globalTexts.overview.entriesTab.editBackupEntryPopup.destructiveTab
        .delete}
    {/snippet}
    {#snippet icon()}
      <Icon name="delete" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  {#if hasTriedToDeleteBackupEntry}
    <div transition:fade={{ duration: 100 }}>
      <Button
        onClick={() => deleteBackupEntry(entry)}
        meaning="negative"
        extraCSS="mt-2 px-4"
      >
        {#snippet text()}
          {globalTexts.overview.entriesTab.editBackupEntryPopup.destructiveTab
            .reallyDelete}
        {/snippet}
      </Button>
    </div>
  {/if}
</div>
