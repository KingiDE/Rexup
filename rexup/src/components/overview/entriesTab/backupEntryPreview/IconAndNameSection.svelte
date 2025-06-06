<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import { invoke } from "@tauri-apps/api/core";
  import Icon from "../../../ui/Icon.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  // Checks the variant ("File" or "Directory") of the entry.origin whenever it changes
  $effect(() => {
    async function doAsyncThing() {
      if (entry.origin === null) return;

      entry.variant = await invoke("get_variant_of_path", {
        path: entry.origin,
      });
    }
    doAsyncThing();
  });
</script>

<div class="flex gap-4">
  <div class="w-6 h-6">
    <Icon
      width={24}
      height={24}
      name={entry.variant === "File"
        ? "file"
        : entry.variant === "Directory"
          ? "directory"
          : "missing"}
      extraCSS="fill-gray-50"
    />
  </div>
  {entry.name}
</div>
