<script lang="ts">
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
  <div class="font-semibold">Output-Variant</div>
  <div class="opacity-75 max-w-[600px]">
    Your backup can either be a simple directory containing files or it can be a
    Zip-Folder. Zip-Folders have the advantage of being smaller and easier to
    transfer between devices. On the other hand, Zip-Folders need to be
    extracted if you want to work with the files inside them.
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
          Directory
        {/snippet}
      </Button>
      <Button
        onClick={() => (currentBackup.is_zipped = true)}
        meaning="discrete-neutral"
        extraCSS="w-[120px] px-4 py-1"
        disabled={popup.value !== null}
      >
        {#snippet text()}
          Zip-Folder
        {/snippet}
      </Button>
    {/snippet}
  </Slider>
</div>
