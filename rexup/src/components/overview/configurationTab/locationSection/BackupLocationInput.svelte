<script lang="ts">
  import { popup } from "../../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackup } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<div class="mt-2 flex gap-2">
  <Input
    inputExtraCSS="min-w-[400px]"
    placeholder="Your desktop"
    getter={() => currentBackup.location}
    setter={() => {}}
    disabled
    alwaysReadable
  />
  <Button
    meaning="positive"
    onClick={() => (popup.value = "select_backup_location")}
    extraCSS="py-1 w-20"
    disabled={popup.value !== null}
  >
    {#snippet text()}
      Edit
    {/snippet}
  </Button>
  <Button
    meaning="neutral"
    onClick={() => (currentBackup.location = "")}
    extraCSS="py-1 w-20"
    disabled={currentBackup.location === "" || popup.value !== null}
  >
    {#snippet text()}
      Reset
    {/snippet}
  </Button>
</div>
