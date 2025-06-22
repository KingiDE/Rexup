<script lang="ts">
  import type { CurrentPopup, LocalStateBackupEntry } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Input from "../../ui/Input.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();
</script>

<div class="mt-2 font-semibold">Name:</div>
<Input
  getter={() => entry.name}
  setter={(newValue) => {
    entry.name = newValue;
  }}
/>
<div class="mt-2 font-semibold">Explanation:</div>
<p>
  The target-path is the relative location of the backup resource (file or
  directory) inside the backup-parent-directory.
</p>
{#if entry.variant !== null && entry.origin !== null && entry.target !== null && entry.target !== ""}
  <p>
    In this case, the {entry.variant === "File" ? "file" : "directory"} located at
    <span class="px-1 py-0.5 bg-gray-900 rounded-md">{entry.origin}</span>
    will be copied {entry.variant === "File" ? "to" : "into"}
    <span class="px-1 py-0.5 bg-gray-900 rounded-md">{entry.target}</span>
    {entry.target === "/" ? "(= root)" : ""} inside the backup-directory.
  </p>
{:else}
  <p>
    Because the entry has no origin and target at the moment, an explanation is
    currently not possible.
  </p>
{/if}
<div class="mt-2">
  <div class="font-semibold">Origin:</div>
  <div class="flex gap-2">
    <Input
      labelExtraCSS="grow"
      placeholder="Unset"
      getter={() => entry.origin}
      setter={() => {}}
      disabled
    />
    <Button
      meaning="positive"
      onClick={() => (popup = "select_backup_entry_origin_location")}
      extraCSS="py-1 w-20"
    >
      {#snippet text()}
        Edit
      {/snippet}
    </Button>
    <Button
      meaning="neutral"
      onClick={() => (entry.origin = "")}
      extraCSS="py-1 w-20"
      disabled={entry.origin === null}
    >
      {#snippet text()}
        Reset
      {/snippet}
    </Button>
  </div>
</div>
<div class="mt-2">
  <div class="font-semibold">Target:</div>
  <div class="flex gap-2">
    <Input
      labelExtraCSS="grow"
      placeholder="Unset"
      getter={() => entry.target}
      setter={(newValue) => {
        entry.target = newValue;
      }}
    />
    <Button
      meaning="neutral"
      onClick={() => (entry.target = "")}
      extraCSS="py-1 w-20"
      disabled={entry.target === null}
    >
      {#snippet text()}
        Reset
      {/snippet}
    </Button>
  </div>
</div>
