<script lang="ts">
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";

  let {
    setPopupToAddBackup,
  }: {
    setPopupToAddBackup: () => void;
  } = $props();
</script>

<Button
  onClick={setPopupToAddBackup}
  meaning="neutral"
  extraCSS="overflow-visible"
>
  {#snippet text()}
    Create backup
  {/snippet}
  {#snippet icon()}
    <Icon width={24} height={24} name="add" extraCSS="fill-gray-50" />
  {/snippet}
</Button>
