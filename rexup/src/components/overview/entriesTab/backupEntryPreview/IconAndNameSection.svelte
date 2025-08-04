<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import { invoke } from "@tauri-apps/api/core";
  import Icon from "../../../ui/Icon.svelte";
  import { globalTexts } from "../../../../globalTexts";

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
      if (entry.origin.active_mode === "Commands") {
        entry.variant = null;
        previewIcon = "commands";
      } else {
        switch (
          await invoke("get_variant_of_path", {
            path: entry.origin.local_file_system,
          })
        ) {
          case "File":
            previewIcon = "file";
            entry.variant = "File";
            break;
          case "Directory":
            previewIcon = "directory";
            entry.variant = "Directory";
            break;
          default:
            previewIcon = "missing";
            entry.variant = null;
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
    {globalTexts.overview.entriesTab.backupEntryPreview.localFileSystemPreviewText(
      entry.variant,
    )}
  {:else}
    {globalTexts.overview.entriesTab.backupEntryPreview.commandPreviewText(
      entry.origin.commands.length,
    )}
  {/if}
</div>
