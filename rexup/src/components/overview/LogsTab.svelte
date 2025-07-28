<script lang="ts">
  import type { LocalStateBackup } from "../types";
  import { prettifyDate } from "../../utils/prettifyDate";
  import { showBackupExecutionHistory } from "../../hooks/sidebar/useSettingsPopup.svelte";

  let {
    currentBackup,
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<h3 class="my-2 font-poppins text-xl font-bold">Logs</h3>
<!-- Execution-History -->
{#if showBackupExecutionHistory.value}
  <div class="mt-2">
    <div class="font-semibold">Execution-History</div>
    <div class="opacity-75 max-w-[600px]">
      These logs keep track of when this backup was executed the last times.
    </div>
    {#if currentBackup.executions.length > 0}
      <ol
        class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px] max-h-[200px] overflow-y-scroll"
      >
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
{/if}
<!-- Execution-Logs -->
<div class="mt-2">
  <div class="font-semibold">Execution-Logs</div>
  <div class="opacity-75 max-w-[600px]">
    The list below shows details of the last backup-execution like errors that
    occured during copying files.
  </div>
  {#if currentBackup.logs_of_last_execution.length > 0}
    <ol class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px]">
      {#each currentBackup.logs_of_last_execution as executionLog}
        {#if "Finished" in executionLog}
          <li>&#x1F3C1; {executionLog.Finished}</li>
        {:else if "Information" in executionLog}
          <li>&#x2139; {executionLog.Information}</li>
        {:else if "ErrorCopying" in executionLog}
          <li>&#x274C; {executionLog.ErrorCopying}</li>
        {:else if "SuccessExecutingCommand" in executionLog}
          <li>
            &#x2705; Executed the command
            <span class="px-1 bg-gray-800 rounded-md opacity-75"
              >{executionLog.SuccessExecutingCommand.command}</span
            >
            in
            <span class="px-1 bg-gray-800 rounded-md opacity-75"
              >{executionLog.SuccessExecutingCommand.to_path}</span
            >
            successfully.
          </li>
        {:else if "SuccessCopyingFileOrDirectory" in executionLog}
          <li>
            &#x2705; Copied the {executionLog.SuccessCopyingFileOrDirectory.variant.toLocaleLowerCase()}
            from
            <span class="px-1 bg-gray-800 rounded-md opacity-75"
              >{executionLog.SuccessCopyingFileOrDirectory.from_path}</span
            >
            to
            <span class="px-1 bg-gray-800 rounded-md opacity-75"
              >{executionLog.SuccessCopyingFileOrDirectory.to_path}</span
            >
            successfully.
          </li>
        {:else if "IgnoreCopyingFile" in executionLog}
          {#if executionLog.IgnoreCopyingFile.reason === "TooLargeSize"}
            <li>
              &#x1F6AB; Ignored copying the file from <span
                class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.from_path}</span
              >
              to
              <span class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.to_path}</span
              >
              because the file is too large.
            </li>
          {:else if executionLog.IgnoreCopyingFile.reason === "WrongName"}
            <li>
              &#x1F6AB; Ignored copying the file from <span
                class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.from_path}</span
              >
              to
              <span class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.to_path}</span
              >
              because the file has the wrong name.
            </li>
          {:else if executionLog.IgnoreCopyingFile.reason === "WrongPathElements"}
            <li>
              &#x1F6AB; Ignored copying the file from <span
                class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.from_path}</span
              >
              to
              <span class="px-1 bg-gray-800 rounded-md opacity-75"
                >{executionLog.IgnoreCopyingFile.to_path}</span
              >
              because the file has the wrong path elements.
            </li>
          {/if}
        {/if}
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
