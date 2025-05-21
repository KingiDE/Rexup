<script lang="ts">
  import type { CurrentPopup, LocalStateBackupEntry } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Input from "../../ui/Input.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();
</script>

<div class="mt-2 font-semibold">Name:</div>
<Input
  getter={() => entry.name}
  setter={(newValue) => {
    entry.name = newValue;
  }}
/>
<div class="mt-2">
  <div class="font-semibold">Origin:</div>
  <div class="flex gap-2">
    <Input
      labelExtraCSS="grow"
      placeholder="Unset"
      getter={() => (entry.origin === null ? "" : entry.origin)}
      setter={() => {}}
      disabled
    />
    <Button
      meaning="positive"
      onClick={() => (popup = "select_backup_entry_origin_location")}
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
      labelExtraCSS="grow"
      placeholder="Unset"
      getter={() => (entry.target === null ? "" : entry.target)}
      setter={(newValue) => {
        entry.target = newValue;
      }}
    />
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
