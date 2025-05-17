<script lang="ts">
  import type { LocalStateBackup } from "../types";
  import { prettifyDate } from "../../utils/prettifyDate";

  let {
    currentBackup,
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<h3 class="mt-4 font-poppins text-xl font-bold">Logs</h3>
<!-- Execution-History -->
<div class="mt-2">
  <div class="font-semibold">Execution-History</div>
  <div class="opacity-75 max-w-[600px]">
    These logs keep track of when this backup was executed the last times.
  </div>
  {#if currentBackup.executions.length > 0}
    <ol class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px]">
      {#each currentBackup.executions as executionTime}
        <li>&bull; {prettifyDate(executionTime)}</li>
      {/each}
    </ol>
  {:else}
    <div
      class="mt-2 p-2 rounded-md bg-gray-900 w-[400px] h-10 grid items-center text-center"
    >
      Currently, this list is empty.
    </div>
  {/if}
</div>
<!-- Execution-Logs -->
<div class="mt-4">
  <div class="font-semibold">Execution-Logs</div>
  <div class="opacity-75 max-w-[600px]">
    The list below show details of the last backup-execution like errors while
    copying or ignore files.
  </div>
  {#if currentBackup.executions.length > 0}
    <ol class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px]">
      <!-- TODO: Display the execution-logs pretty -->
      <!-- {#each currentBackup.executions as executionTime}
        <li>&bull; {prettifyDate(executionTime)}</li>
      {/each} -->
    </ol>
  {:else}
    <div
      class="mt-2 p-2 rounded-md bg-gray-900 w-[400px] h-10 grid items-center text-center"
    >
      Currently, this list is empty.
    </div>
  {/if}
</div>
