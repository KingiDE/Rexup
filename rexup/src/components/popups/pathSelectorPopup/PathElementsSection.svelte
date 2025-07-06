<script lang="ts">
  import { slicePathElements } from "../../../hooks/overview/usePathSelectorPopup";
  import type { PathElement } from "../../types";
  import Button from "../../ui/Button.svelte";

  let {
    pathElements = $bindable(),
    heading,
  }: {
    pathElements: Array<PathElement>;
    heading: string;
  } = $props();
</script>

<h2 class="font-poppins text-2xl font-bold">{heading}</h2>
<!-- Display the current path in form of blocks -->
<div class="mt-4 flex gap-1 items-center overflow-x-scroll pb-0.5">
  <div class="mr-1">Path</div>
  {#each pathElements as element, index}
    <!-- Don't render the last element when its a file -->
    {#if pathElements.length - 1 === index && element.variant === "File"}{:else}
      <Button
        onClick={() =>
          (pathElements = slicePathElements(pathElements, element.id))}
        meaning="neutral"
        extraCSS="py-1 whitespace-nowrap shrink-0"
      >
        {#snippet text()}
          {element.name}
        {/snippet}
      </Button>
    {/if}
  {/each}
</div>
