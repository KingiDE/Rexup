<script lang="ts">
  import { globalTexts } from "../../../../globalTexts";
  import type { LocalStateBackupEntry } from "../../../types";
  import Input from "../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  function getCountOfActivatedFilters() {
    let activeCount = 0;

    if (entry.filters.max_size_in_mb !== null) activeCount++;
    if (entry.filters.file_names.length !== 0) activeCount++;
    if (entry.filters.path_elements.length !== 0) activeCount++;

    return activeCount;
  }

  function getActiveFiltersInPretty() {
    const filters = [];

    if (entry.filters.max_size_in_mb !== null)
      filters.push(
        globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
          .localFileSystemMode.filterAbbreviations.maximumFileSize,
      );
    if (entry.filters.file_names.length !== 0)
      filters.push(
        globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
          .localFileSystemMode.filterAbbreviations.fileNames,
      );
    if (entry.filters.path_elements.length !== 0)
      filters.push(
        globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
          .localFileSystemMode.filterAbbreviations.pathElements,
      );

    return filters.join(", ");
  }
</script>

<div class="font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab.nameLabel}
</div>
<Input
  getter={() => entry.name}
  setter={(newValue) => {
    entry.name = newValue;
  }}
/>
<div class="mt-2 font-semibold">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
    .explanationLabel}
</div>
<!-- LocalFileSystem explanation -->
{#if entry.origin.active_mode === "LocalFileSystem"}
  <p class="mt-1">
    {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
      .localFileSystemMode.description}
  </p>
  <div class="mt-1">
    {#if entry.variant === null}
      {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
        .localFileSystemMode.noOrigin}
    {:else}
      {@html globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab.localFileSystemMode.detailedExplanation(
        entry.variant,
        entry.origin.local_file_system,
        entry.target,
      )}
      {#if entry.rename_to !== ""}
        <div>
          {@html globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab.localFileSystemMode.renameExplanation(
            entry.rename_to,
          )}
        </div>
      {/if}
      {#if getCountOfActivatedFilters() > 0}
        <div>
          {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab.localFileSystemMode.filterExplanation(
            getCountOfActivatedFilters(),
            getActiveFiltersInPretty(),
          )}
        </div>
      {/if}
    {/if}
  </div>
  <!-- Commands explanation -->
{:else if entry.origin.active_mode === "Commands"}
  <p class="mt-1">
    {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
      .commandsMode.description}
  </p>
  <div class="mt-1">
    {#if entry.origin.commands.length === 0}
      {globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab
        .commandsMode.noCommands}
    {:else}
      {@html globalTexts.overview.entriesTab.editBackupEntryPopup.overviewTab.commandsMode.detailedExplanation(
        entry.origin.commands.length,
        entry.target,
      )}
      <ol>
        {#each entry.origin.commands as command}
          <li>{globalTexts.overview.listIcon} {command}</li>
        {/each}
      </ol>
    {/if}
  </div>
{/if}
