<script lang="ts">
  import { globalTexts } from "../../../globalTexts";
  import { popup } from "../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Slider from "../../ui/Slider.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<div class="grid mt-4">
  <div class="font-semibold">
    {globalTexts.overview.configurationTab.isZippedSection.label}
  </div>
  <div class="opacity-75 max-w-[700px]">
    {globalTexts.overview.configurationTab.isZippedSection.description}
  </div>
  <Slider
    extraCSS="mt-2 justify-self-start"
    sizeOfSingleElement={120}
    indexOfSelectedElement={currentBackup.is_zipped ? 1 : 0}
  >
    {#snippet elements()}
      <Button
        onClick={() => (currentBackup.is_zipped = false)}
        meaning="discrete-neutral"
        extraCSS="w-[120px] px-4 py-1"
        disabled={popup.value !== null}
      >
        {#snippet text()}
          {globalTexts.overview.configurationTab.isZippedSection
            .directoryOption}
        {/snippet}
      </Button>
      <Button
        onClick={() => (currentBackup.is_zipped = true)}
        meaning="discrete-neutral"
        extraCSS="w-[120px] px-4 py-1"
        disabled={popup.value !== null}
      >
        {#snippet text()}
          {globalTexts.overview.configurationTab.isZippedSection.zipFileOption}
        {/snippet}
      </Button>
    {/snippet}
  </Slider>
</div>
