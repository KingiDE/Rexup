<script lang="ts">
  import { fade } from "svelte/transition";
  import type { LocalStateBackupEntry } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";

  let {
    entry,
    deleteBackupEntry,
  }: {
    entry: LocalStateBackupEntry;
    deleteBackupEntry: (backupToDelete: LocalStateBackupEntry) => void;
  } = $props();

  let hasTriedToDeleteBackupEntry = $state(false);
</script>

<div class="mt-4">
  <div class="font-semibold">Delete Backup-Entry</div>
  <div class="opacity-75 max-w-[600px]">
    To delete your backup-entry, click the "Delete this backup-entry"-button
    below. This will remove the entire backup-entry structure from you disk but
    NOT the backups that were created from it.
  </div>
  <div class="flex gap-4">
    <Button
      onClick={() => (hasTriedToDeleteBackupEntry = true)}
      meaning="negative"
      extraCSS="mt-2"
    >
      {#snippet text()}
        Delete this backup-entry
      {/snippet}
      {#snippet icon()}
        <Icon width={24} height={24} name="delete" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    {#if hasTriedToDeleteBackupEntry}
      <div transition:fade={{ duration: 100 }}>
        <Button
          onClick={() => deleteBackupEntry(entry)}
          meaning="negative"
          extraCSS="mt-2"
        >
          {#snippet text()}
            REALLY delete?
          {/snippet}
        </Button>
      </div>
    {/if}
  </div>
</div>
