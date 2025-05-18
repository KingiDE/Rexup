<script lang="ts">
  import { pushDirectoryToPathElements } from "../../../hooks/usePathSlectorPopup.svelte";
  import type { DirecoryResult, PathElement } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";

  let {
    pathElements = $bindable(),
    directoryResults,
    showFiles,
  }: {
    pathElements: Array<PathElement>;
    directoryResults: Array<DirecoryResult>;
    showFiles?: boolean;
  } = $props();
</script>

<div>
  <div>Directories in this directory:</div>
  <div
    class={`mt-1 h-[200px] grid gap-1 overflow-y-scroll pr-1 ${directoryResults.length === 0 ? "content-center" : "content-start"}`}
  >
    {#if directoryResults.length === 0}
      <div class="text-center self-center">
        <div class="font-bold">:/</div>
        <div class="font-bold">
          There don't exist any entries in this folder
        </div>
      </div>
    {:else}
      {#each directoryResults as result}
        <!-- The height of the Button is set because otherwise they are squished vertically -->
        {#if result.variant === "file" && showFiles}
          <Button
            onClick={() =>
              pushDirectoryToPathElements(pathElements, result.name)}
            meaning="neutral"
            extraCSS={`text-start py-1 h-8 ${result.is_hidden ? "opacity-50" : ""}`}
          >
            {#snippet text()}
              {result.name}
            {/snippet}
            {#snippet icon()}
              <Icon
                width={24}
                height={24}
                name="file"
                extraCSS="fill-gray-50"
              />
            {/snippet}
          </Button>
        {:else if result.variant === "directory"}
          <Button
            onClick={() =>
              pushDirectoryToPathElements(pathElements, result.name)}
            meaning="neutral"
            extraCSS={`text-start py-1 h-8 ${result.is_hidden ? "opacity-50" : ""}`}
          >
            {#snippet text()}
              {result.name}
            {/snippet}
            {#snippet icon()}
              <Icon
                width={24}
                height={24}
                name="directory"
                extraCSS="fill-gray-50"
              />
            {/snippet}
          </Button>
        {/if}
      {/each}
    {/if}
  </div>
</div>
