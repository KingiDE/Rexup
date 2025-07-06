<script lang="ts">
  import { popup } from "../../hooks/useHotkeyHandler.svelte";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
</script>

<Button
  onClick={() => (popup.value = "add_backup")}
  meaning="neutral"
  extraCSS="overflow-visible"
  disabled={popup.value !== null}
>
  {#snippet text()}
    Create backup
  {/snippet}
  {#snippet icon()}
    <Icon name="add" extraCSS="fill-gray-50" />
  {/snippet}
</Button>
