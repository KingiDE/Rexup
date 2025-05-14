<script lang="ts">
import Button from "../ui/Button.svelte";
import Icon from "../ui/Icon.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error.
let {
	setPopupToAddBackup,
}: {
	setPopupToAddBackup: () => void;
} = $props();
</script>

<Button onClick={setPopupToAddBackup} meaning="neutral">
  {#snippet text()}
    Add backup
  {/snippet}
  {#snippet icon()}
    <Icon width={24} height={24} name="add" extraCSS="fill-gray-50"/>
  {/snippet}
</Button>
