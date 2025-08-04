<script lang="ts">
  import { popup } from "../../hooks/useHotkeyHandler.svelte";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
</script>

<div class="mt-auto self-end">
  <Button
    onClick={() => (popup.value = "settings")}
    meaning="neutral"
    extraCSS="mt-4"
    disabled={popup.value !== null}
  >
    {#snippet icon()}
      <Icon name="settings" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
</div>
