<script lang="ts">
  import {
    pushDirectoryToPathElements,
    replaceLastPathElement,
  } from "../../../hooks/usePathSelectorPopup";
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

  let shownResults = $derived.by(() => {
    // false or undefined
    if (!showFiles)
      return directoryResults.filter((el) => el.variant !== "File");
    return directoryResults;
  });
</script>

<div>
  <div>Directories in this directory:</div>
  <div
    class={`mt-1 h-[200px] grid gap-1 overflow-y-scroll pr-1 ${shownResults.length === 0 ? "content-center" : "content-start"}`}
  >
    {#if shownResults.length === 0}
      <div class="text-center self-center">
        <div class="font-bold">:/</div>
        <div class="font-bold">
          There don't exist any entries in this directory
        </div>
      </div>
    {:else}
      {#each shownResults as result}
        <!-- The height of the Button is set because otherwise they are squished vertically -->
        {#if result.variant === "File" && showFiles}
          <Button
            onClick={() => {
              // If the last element is already a file, replace it
              if (pathElements.at(-1)?.variant === "File") {
                replaceLastPathElement(pathElements, result.name, result.id);
              } else {
                pushDirectoryToPathElements(
                  pathElements,
                  result.name,
                  result.id,
                  result.variant,
                );
              }
            }}
            meaning="neutral"
            extraRules={["no-outline"]}
            extraCSS={`text-start py-1 h-8 ${result.is_hidden ? "opacity-50" : ""} ${result.id === pathElements.at(-1)?.id ? "outline-gray-50" : "outline-gray-500"}`}
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
        {:else if result.variant === "Directory"}
          <Button
            onClick={() =>
              pushDirectoryToPathElements(
                pathElements,
                result.name,
                result.id,
                result.variant,
              )}
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
