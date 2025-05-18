<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";
  import PathSelectorPopup from "../../popups/PathSelectorPopup.svelte";
  import type { CurrentPopup, LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Input from "../../ui/Input.svelte";
  import Icon from "../../ui/Icon.svelte";

  let {
    currentBackup = $bindable(),
    popup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
    popup: CurrentPopup;
  } = $props();

  // When the user clicks "Select path", this function is passed to the PathSelectorPopup and will be called with the new location
  function setCurrentBackupLocation(location: string) {
    currentBackup.location = location;
    popup = null;
  }

  // Checks whether the user has write access to this location
  let hasWriteAccess = $state(true);

  // Cannot use dervied.by() because of await issues
  $effect(() => {
    async function sett() {
      hasWriteAccess = await invoke("has_write_access_to", {
        path: currentBackup.location,
      });
    }
    sett();
  });
</script>

<div class="mt-4">
  <div class="font-semibold">Backup-Location</div>
  <div class="opacity-75 max-w-[600px]">
    After your backup has been executed, it will be placed somewhere. This
    location can be configured here. To change it, simply click the
    "Edit"-button below and choose a diretory, the backup will be placed in.
  </div>
  <div class="mt-2 flex gap-2">
    <Input
      inputExtraCSS="min-w-[400px]"
      placeholder="Your desktop"
      getter={() =>
        currentBackup.location === null ? "" : currentBackup.location}
      setter={(newValue) => {
        currentBackup.location = newValue;
      }}
      disabled
    />
    <Button
      meaning="positive"
      onClick={() =>
        (popup = { variant: "select_backup_location", value: null })}
      extraCSS="py-1 w-20"
    >
      {#snippet text()}
        Edit
      {/snippet}
    </Button>
    <Button
      meaning="neutral"
      onClick={() => (currentBackup.location = null)}
      extraCSS="py-1 w-20"
      disabled={currentBackup.location === null}
    >
      {#snippet text()}
        Reset
      {/snippet}
    </Button>
  </div>
  <PathSelectorPopup bind:popup {setCurrentBackupLocation} />
  <div
    class={`mt-2 p-2 transition-[background] rounded-md w-[576px] ${hasWriteAccess ? "bg-green-700" : "bg-red-700"}`}
  >
    {#if hasWriteAccess}
      <div class="flex gap-2">
        <Icon
          width={24}
          height={24}
          name="checked"
          extraCSS="fill-gray-50 shrink-0"
        />
        Everything is fine! You have access to this location on your filesystem.
      </div>
    {:else}
      <div class="flex gap-2">
        <Icon
          width={24}
          height={24}
          name="close"
          extraCSS="fill-gray-50 shrink-0"
        />
        Something is not working! You don't seem to have access to this location
        on your filesystem. Please choose a different directory.
      </div>
    {/if}
  </div>
</div>
