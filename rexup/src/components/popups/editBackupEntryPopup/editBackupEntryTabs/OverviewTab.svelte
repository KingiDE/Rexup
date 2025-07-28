<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Input from "../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  let correctDescription = $derived.by(() => {
    if (entry.variant === "File") {
      return "file";
    } else if (entry.variant === "Directory") {
      return "directory";
    }
  });
</script>

<div class="font-semibold">Name:</div>
<Input
  getter={() => entry.name}
  setter={(newValue) => {
    entry.name = newValue;
  }}
/>
<div class="mt-2 font-semibold">Explanation:</div>
{#if entry.origin.active_mode === "LocalFileSystem"}
  <p class="mt-1">
    Currently, you have the <span class="px-1 py-0.5 bg-gray-900 rounded-md"
      >LocalFileSystem-Mode</span
    > enabled. This means that this backup entry copies files and directories from
    your machine into the backup.
  </p>
  {#if entry.variant === null}
    <p class="mt-1">
      Because there's no file or origin selected that should be copied, no more
      detailed explanation can be generated.
    </p>
  {:else}
    <p class="mt-1">
      In this case, the {correctDescription} located at
      <span class="px-1 py-0.5 bg-gray-900 rounded-md"
        >{entry.origin.local_file_system}</span
      >
      on your machine will be copied {correctDescription === "file"
        ? "to"
        : "into"}
      <span class="px-1 py-0.5 bg-gray-900 rounded-md"
        >{entry.target === "" || entry.target === "/"
          ? "/"
          : entry.target}</span
      >
      {entry.target === "" || entry.target === "/" ? "(= root)" : ""} inside the
      backup directory.
    </p>
    {#if entry.rename_to !== ""}
      <p class="mt-1">
        Additionally it will be renamed to <span
          class="px-1 py-0.5 bg-gray-900 rounded-md">{entry.rename_to}</span
        > after it has been placed in this directory.
      </p>
    {/if}
  {/if}
{:else if entry.origin.active_mode === "Commands"}
  <p class="mt-1">
    Currently, you have the <span class="px-1 py-0.5 bg-gray-900 rounded-md"
      >Commands-Mode</span
    > enabled. This means that this backup entry executes the specified commands
    inside the backup at the target location.
  </p>
{/if}
