<script lang="ts">
  import type { EditBackupEntryTab } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Slider from "../../ui/Slider.svelte";

  let {
    tab = $bindable(),
  }: {
    tab: EditBackupEntryTab;
  } = $props();

  function convertTabToIndex() {
    switch (tab) {
      case "overview":
        return 0;
      case "filters":
        return 1;
      case "destructive":
        return 2;
    }
  }
</script>

<Slider
  extraCSS="mt-2 justify-self-start"
  sizeOfSingleElement={140}
  indexOfSelectedElement={convertTabToIndex()}
>
  {#snippet elements()}
    <Button
      onClick={() => (tab = "overview")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
    >
      {#snippet text()}
        Overview
      {/snippet}
    </Button>
    <Button
      onClick={() => (tab = "filters")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
    >
      {#snippet text()}
        Filters
      {/snippet}
    </Button>
    <Button
      onClick={() => (tab = "destructive")}
      meaning="discrete-neutral"
      extraCSS="w-[140px] px-4 py-1"
    >
      {#snippet text()}
        Destructive
      {/snippet}
    </Button>
  {/snippet}
</Slider>
