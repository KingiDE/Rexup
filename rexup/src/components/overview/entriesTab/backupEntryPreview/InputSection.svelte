<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Input from "../../../ui/Input.svelte";

  let {
    entry,
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

    if (entry.filters.max_size_in_mb !== null) filters.push("maximum size");
    if (entry.filters.file_names.length !== 0) filters.push("file names");
    if (entry.filters.path_elements.length !== 0) filters.push("path elements");

    return filters.join(", ");
  }
</script>

<div class="mt-2 flex gap-2 items-center">
  <div class="font-semibold">
    {entry.origin.active_mode === "LocalFileSystem"
      ? "Origin"
      : "First Command"}:
  </div>
  <Input
    labelExtraCSS="flex-grow"
    getter={() =>
      entry.origin.active_mode === "LocalFileSystem"
        ? entry.origin.local_file_system
        : entry.origin.commands[0]}
    setter={() => {}}
    disabled
  />
</div>
{#if entry.origin.active_mode === "LocalFileSystem"}
  <div class="mt-1 opacity-75">
    {#if entry.filters.file_names.length !== 0 || entry.filters.path_elements.length !== 0 || entry.filters.max_size_in_mb !== null}
      <div>
        At the moment, there are {getCountOfActivatedFilters()} filters ({getActiveFiltersInPretty()})
        enabled with the mode being set to "{entry.filters.mode}".
      </div>
    {/if}
    {#if entry.rename_to !== ""}
      <div>
        The {entry.variant === "File" ? "file" : "directory"} will be renamed to
        "{entry.rename_to}" at the target location{entry.variant === "File"
          ? " while the file extension stays the same"
          : ""}.
      </div>
    {/if}
  </div>
{/if}
