<script lang="ts">
  import type { IgnoreFileReason, LocalStateBackup } from "../types";
  import { prettifyDate } from "../../utils/prettifyDate";
  import { showBackupExecutionHistory } from "../../hooks/sidebar/useSettingsPopup.svelte";
  import { globalTexts } from "../../globalTexts";

  let {
    currentBackup,
  }: {
    currentBackup: LocalStateBackup;
  } = $props();

  function convertReasonToUsableText(reason: IgnoreFileReason) {
    switch (reason) {
      case "TooLargeSize":
        return globalTexts.overview.logsTab.executionLogs.ignoreReasons
          .tooLarge;
      case "WrongName":
        return globalTexts.overview.logsTab.executionLogs.ignoreReasons
          .wrongName;
      case "WrongPathElements":
        return globalTexts.overview.logsTab.executionLogs.ignoreReasons
          .wrongPathElements;
    }
  }
</script>

<h3 class="mt-2 font-poppins text-xl font-bold">
  {globalTexts.overview.logsTab.heading}
</h3>
<!-- Execution-History -->
{#if showBackupExecutionHistory.value}
  <div class="mt-2">
    <div class="font-semibold">
      {globalTexts.overview.logsTab.executionHistory.label}
    </div>
    <div class="opacity-75 max-w-[700px]">
      {globalTexts.overview.logsTab.executionHistory.description}
    </div>
    {#if currentBackup.executions.length > 0}
      <ol
        class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px] max-h-[200px] overflow-y-scroll"
      >
        {#each currentBackup.executions as executionTime}
          <li>
            {globalTexts.overview.listIcon}
            {prettifyDate(executionTime)}
          </li>
        {/each}
      </ol>
    {:else}
      <div
        class="mt-2 p-2 rounded-md bg-gray-900 w-[400px] h-10 grid items-center text-center"
      >
        {globalTexts.overview.logsTab.emptyList}
      </div>
    {/if}
  </div>
{/if}
<!-- Execution-Logs -->
<div class="mt-2">
  <div class="font-semibold">
    {globalTexts.overview.logsTab.executionLogs.label}
  </div>
  <div class="opacity-75 max-w-[700px]">
    {globalTexts.overview.logsTab.executionLogs.description}
  </div>
  {#if currentBackup.logs_of_last_execution.length > 0}
    <ol class="mt-2 p-2 rounded-md bg-gray-900 inline-block min-w-[400px]">
      {#each currentBackup.logs_of_last_execution as executionLog}
        {#if "Finished" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.finished}
            {executionLog.Finished}
          </li>
        {:else if "Information" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.information}
            {executionLog.Information}
          </li>
        {:else if "ErrorCopying" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.error}
            {executionLog.ErrorCopying}
          </li>
        {:else if "SuccessExecutingCommand" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.success}
            {@html globalTexts.overview.logsTab.executionLogs.successfullCommandLog(
              executionLog.SuccessExecutingCommand.command,
              executionLog.SuccessExecutingCommand.to_path,
            )}
          </li>
        {:else if "SuccessCopyingFileOrDirectory" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.success}
            {@html globalTexts.overview.logsTab.executionLogs.successfullLocalFileSystemLog(
              executionLog.SuccessCopyingFileOrDirectory.variant,
              executionLog.SuccessCopyingFileOrDirectory.from_path,
              executionLog.SuccessCopyingFileOrDirectory.to_path,
            )}
          </li>
        {:else if "IgnoreCopyingFile" in executionLog}
          <li>
            {globalTexts.overview.logsTab.executionLogs.icons.ignore}
            {@html globalTexts.overview.logsTab.executionLogs.ignoreFileLog(
              executionLog.IgnoreCopyingFile.from_path,
              executionLog.IgnoreCopyingFile.to_path,
              convertReasonToUsableText(executionLog.IgnoreCopyingFile.reason),
            )}
          </li>
        {/if}
      {/each}
    </ol>
  {:else}
    <div
      class="mt-2 p-2 rounded-md bg-gray-900 w-[400px] h-10 grid items-center text-center"
    >
      {globalTexts.overview.logsTab.emptyList}
    </div>
  {/if}
</div>
