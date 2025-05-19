<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import { invoke } from "@tauri-apps/api/core";
  import Icon from "../../../ui/Icon.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  // Check the variant ("File" or "Directory") of the entry.origin everytime it changes
  $effect(() => {
    async function doAsyncThing() {
      entry.variant = await invoke("get_variant_of_path", {
        path: entry.origin,
      });
    }
    doAsyncThing();
  });
</script>

<div class="flex gap-4">
  <div class="w-6 h-6">
    {#if entry.variant !== null}
      <Icon
        width={24}
        height={24}
        name={entry.variant === "File" ? "file" : "directory"}
        extraCSS="fill-gray-50"
      />
    {/if}
  </div>
  {entry.name}
</div>
