<script lang="ts">
  import { fade } from "svelte/transition";
  import type { LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";

  let {
    currentBackup,
    deleteCurrentBackup,
  }: {
    currentBackup: LocalStateBackup;
    deleteCurrentBackup: (backupToDelete: LocalStateBackup) => void;
  } = $props();

  let hasTriedToDeleteBackup = $state(false);
</script>

<div class="mt-4">
  <div class="font-semibold">Delete Backup</div>
  <div class="opacity-75 max-w-[600px]">
    To delete your backup, click the "Delete this backup"-button below. This
    will remove the entire backup structure from you disk but NOT the backups
    that were created from it.
  </div>
  <div class="flex gap-4">
    <Button
      onClick={() => (hasTriedToDeleteBackup = true)}
      meaning="negative"
      extraCSS="mt-2 px-4"
    >
      {#snippet text()}
        Delete this backup
      {/snippet}
      {#snippet icon()}
        <Icon width={24} height={24} name="delete" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    {#if hasTriedToDeleteBackup}
      <div transition:fade={{ duration: 100 }}>
        <Button
          onClick={() => deleteCurrentBackup(currentBackup)}
          meaning="negative"
          extraCSS="mt-2 px-4"
        >
          {#snippet text()}
            REALLY delete?
          {/snippet}
        </Button>
      </div>
    {/if}
  </div>
</div>
