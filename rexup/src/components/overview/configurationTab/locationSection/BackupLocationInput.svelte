<script lang="ts">
  import type { CurrentPopup, LocalStateBackup } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";

  let {
    popup = $bindable(),
    currentBackup = $bindable(),
  }: {
    popup: CurrentPopup;
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<div class="mt-2 flex gap-2">
  <Input
    inputExtraCSS="min-w-[400px]"
    placeholder="Your desktop"
    getter={() =>
      currentBackup.location === null ? "" : currentBackup.location}
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
    onClick={() => (currentBackup.location = null)}
    extraCSS="py-1 w-20"
    disabled={currentBackup.location === null}
  >
    {#snippet text()}
      Reset
    {/snippet}
  </Button>
</div>
