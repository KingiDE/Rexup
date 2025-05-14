<script lang="ts">
import Button from "../ui/Button.svelte";
import Icon from "../ui/Icon.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error.
let {
	setPopupToSettings,
}: {
	setPopupToSettings: () => void;
} = $props();
</script>

<div class="mt-auto self-end">
  <Button onClick={setPopupToSettings} meaning="neutral">
    {#snippet icon()}
      <Icon width={24} height={24} name="settings" extraCSS="fill-gray-50"/>
    {/snippet}
  </Button>
</div>
