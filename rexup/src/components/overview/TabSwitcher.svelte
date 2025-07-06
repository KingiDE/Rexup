<script lang="ts">
  import { popup } from "../../hooks/useHotkeyHandler.svelte";
  import type { CurrentOverviewTab } from "../types";
  import Button from "../ui/Button.svelte";
  import Slider from "../ui/Slider.svelte";

  let {
    currentTab = $bindable(),
  }: {
    currentTab: CurrentOverviewTab;
  } = $props();

  function convertCurrentTabToIndex(tab: CurrentOverviewTab): number {
    switch (tab) {
      case "entries":
        return 0;
      case "logs":
        return 1;
      case "configuration":
        return 2;
    }
  }
</script>

<Slider
  extraCSS="self-start mt-2"
  sizeOfSingleElement={140}
  indexOfSelectedElement={convertCurrentTabToIndex(currentTab)}
>
  {#snippet elements()}
    <Button
      onClick={() => (currentTab = "entries")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
      disabled={popup.value !== null}
    >
      {#snippet text()}
        Entries
      {/snippet}
    </Button>
    <Button
      onClick={() => (currentTab = "logs")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
      disabled={popup.value !== null}
    >
      {#snippet text()}
        Logs
      {/snippet}
    </Button>
    <Button
      onClick={() => (currentTab = "configuration")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
      disabled={popup.value !== null}
    >
      {#snippet text()}
        Configuration
      {/snippet}
    </Button>
  {/snippet}
</Slider>
