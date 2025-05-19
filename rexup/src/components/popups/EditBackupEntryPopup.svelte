<script lang="ts">
  import { fade } from "svelte/transition";
  import type { CurrentPopup, LocalStateBackupEntry } from "../types";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import Input from "../ui/Input.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      popup = null;
    }
  });
</script>

{#if popup !== null && popup === "edit_backup_entry"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Edit Backup-Entry</h2>
    <p class="mt-4">
      Edit this backup-entry by modifying the origin-path and the target-path,
      which is the relative path inside the created backup-directory.
      Additionally, you can enable filters.
    </p>
    <div class="mt-2">
      <div class="font-semibold">Origin:</div>
      <div class="flex gap-2">
        <Input
          inputExtraCSS="min-w-[400px]"
          placeholder="Unset (Click 'Edit' below to edit the path)"
          getter={() => (entry.origin === null ? "" : entry.origin)}
          setter={() => {}}
          disabled
        />
        <Button
          meaning="positive"
          onClick={() => (popup = "select_backup_location")}
          extraCSS="py-1 w-20"
        >
          {#snippet text()}
            Edit
          {/snippet}
        </Button>
        <Button
          meaning="neutral"
          onClick={() => (entry.origin = null)}
          extraCSS="py-1 w-20"
          disabled={entry.origin === null}
        >
          {#snippet text()}
            Reset
          {/snippet}
        </Button>
      </div>
    </div>
    <div class="mt-2">
      <div class="font-semibold">Target:</div>
      <div class="flex gap-2">
        <Input
          inputExtraCSS="min-w-[400px]"
          placeholder="Unset (Click 'Edit' below to edit the path)"
          getter={() => (entry.target === null ? "" : entry.target)}
          setter={() => {}}
          disabled
        />
        <Button
          meaning="positive"
          onClick={() => (popup = "select_backup_location")}
          extraCSS="py-1 w-20"
        >
          {#snippet text()}
            Edit
          {/snippet}
        </Button>
        <Button
          meaning="neutral"
          onClick={() => (entry.target = null)}
          extraCSS="py-1 w-20"
          disabled={entry.target === null}
        >
          {#snippet text()}
            Reset
          {/snippet}
        </Button>
      </div>
    </div>
  </div>
{/if}
