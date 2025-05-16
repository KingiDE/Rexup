<script lang="ts">
  import type { CurrentOverviewTab } from "../types";
  import Button from "../ui/Button.svelte";

  let {
    currentTab = $bindable(),
  }: {
    currentTab: CurrentOverviewTab;
  } = $props();
</script>

<div
  class="relative isolate mt-2 inline-flex -outline-offset-1 outline-1 outline-gray-500 rounded-md w-[420px]"
>
  <div
    class={`-z-10 absolute h-full w-[140px] bg-gray-500 rounded-md transition-[left] ${currentTab === "entries" ? "left-0" : currentTab === "logs" ? "left-[140px]" : "left-[280px]"}`}
  ></div>
  <Button
    onClick={() => (currentTab = "entries")}
    meaning="discrete-neutral"
    extraCSS="w-[140px] px-4 py-1"
  >
    {#snippet text()}
      Entries
    {/snippet}
  </Button>
  <Button
    onClick={() => (currentTab = "logs")}
    meaning="discrete-neutral"
    extraCSS="w-[140px] px-4 py-1"
  >
    {#snippet text()}
      Logs
    {/snippet}
  </Button>
  <Button
    onClick={() => (currentTab = "configuration")}
    meaning="discrete-neutral"
    extraCSS="w-[140px] px-4 py-1"
  >
    {#snippet text()}
      Configuration
    {/snippet}
  </Button>
</div>
