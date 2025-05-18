<script lang="ts">
  import PathSelectorPopup from "../../popups/PathSelectorPopup.svelte";
  import type { CurrentPopup, LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Input from "../../ui/Input.svelte";

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
      getter={() => currentBackup.location}
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
      onClick={() => (currentBackup.location = "")}
      extraCSS="py-1 w-20"
    >
      {#snippet text()}
        Reset
      {/snippet}
    </Button>
  </div>
  <PathSelectorPopup bind:popup {setCurrentBackupLocation} />
</div>
