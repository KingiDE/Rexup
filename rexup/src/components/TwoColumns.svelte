<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";
  import Sidebar from "./sidebar/Sidebar.svelte";
  import Overview from "./overview/Overview.svelte";
  import { validateBackupsFile } from "../utils/validateBackupsFile";
  import { initializeHotkeys } from "../hooks/useHotkeyHandler.svelte";
  import {
    backups,
    triggerWriteBackupsFile,
  } from "../hooks/useTwoColumns.svelte";

  onMount(async () => {
    initializeHotkeys();

    const readData = (await invoke("read_backups_file")) as string;
    backups.value = validateBackupsFile(readData);
  });

  $effect(() => {
    triggerWriteBackupsFile();
  });
</script>

{#if backups.value !== null}
  <div
    class="p-2 font-inter bg-gray-900 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2"
  >
    <Sidebar bind:backups={backups.value} />
    <Overview />
  </div>
{/if}
