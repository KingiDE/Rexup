<script lang="ts">
  import type { EditBackupEntryTab } from "../../types";
  import Button from "../../ui/Button.svelte";

  let {
    tab = $bindable(),
  }: {
    tab: EditBackupEntryTab;
  } = $props();
</script>

<div
  class="relative isolate mt-2 inline-flex -outline-offset-1 outline-1 outline-gray-500 rounded-md w-[420px]"
>
  <div
    class={`-z-10 absolute h-full w-[140px] bg-gray-500 rounded-md transition-[left] ${tab === "overview" ? "left-0" : tab === "filters" ? "left-[140px]" : "left-[280px]"}`}
  ></div>
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
</div>
