<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import { invoke } from "@tauri-apps/api/core";
  import Icon from "../../../ui/Icon.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  let previewIcon = $state<"file" | "directory" | "commands" | "missing">(
    "missing",
  );

  $effect(() => {
    async function doAsyncThing() {
      if (entry.origin.active_mode === "Commands")
        return (previewIcon = "commands");
      else {
        switch (
          await invoke("get_variant_of_path", {
            path: entry.origin.local_file_system,
          })
        ) {
          case "File":
            return (previewIcon = "file");
          case "Directory":
            return (previewIcon = "directory");
          default:
            return (previewIcon = "missing");
        }
      }
    }
    doAsyncThing();
  });
</script>

<div class="flex gap-4">
  <div class="w-6 h-6">
    <Icon name={previewIcon} extraCSS="fill-gray-50" />
  </div>
  {entry.name}
</div>
<div class="mt-1 opacity-75">
  {#if entry.origin.active_mode === "LocalFileSystem"}
    This backup entry currently copies a {entry.variant === "File"
      ? "file"
      : "directory"} at following location:
  {:else}
    This backup entry currently executes {entry.origin.commands.length === 1
      ? "a command"
      : `${entry.origin.commands.length} commands`}.
  {/if}
</div>
