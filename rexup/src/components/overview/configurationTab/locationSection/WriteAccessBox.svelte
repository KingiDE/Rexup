<script lang="ts">
  import { globalTexts } from "../../../../globalTexts";
  import Icon from "../../../ui/Icon.svelte";

  let {
    hasWriteAccess,
  }: {
    hasWriteAccess: boolean;
  } = $props();
</script>

<div
  class={`mt-2 p-2 transition-[background] rounded-md w-[576px] ${hasWriteAccess ? "bg-green-700" : "bg-red-700"}`}
>
  {#if hasWriteAccess}
    <div class="flex gap-2">
      <Icon name="checked" extraCSS="fill-gray-50 shrink-0" />
      {globalTexts.overview.configurationTab.locationSection.accessGranted}
    </div>
  {:else}
    <div class="flex gap-2">
      <Icon name="close" extraCSS="fill-gray-50 shrink-0" />
      {globalTexts.overview.configurationTab.locationSection.accessProhibited}
    </div>
  {/if}
</div>
