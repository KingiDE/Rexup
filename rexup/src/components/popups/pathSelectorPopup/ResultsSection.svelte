<script lang="ts">
  import {
    pushDirectoryToPathElements,
    replaceLastPathElement,
  } from "../../../hooks/overview/usePathSelectorPopup";
  import type { DirectoryContent, PathElement } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";

  let {
    pathElements = $bindable(),
    directoryResults,
    showFiles,
  }: {
    pathElements: Array<PathElement>;
    directoryResults: Array<DirectoryContent>;
    showFiles?: boolean;
  } = $props();

  let shownResults = $derived.by(() => {
    if (showFiles !== true)
      return directoryResults.filter((el) => el.variant !== "File");
    return directoryResults;
  });
</script>

<div class="overflow-hidden">
  <div>Directories in this directory:</div>
  <div
    class={`mt-1 grid gap-1 h-full overflow-y-scroll pr-1 ${shownResults.length === 0 ? "content-center" : "content-start"}`}
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
            extraRules={["no-outline"]}
            meaning="neutral"
            extraCSS={`text-start py-1 h-8 ${result.is_hidden ? "opacity-50" : ""} outline -outline-offset-1 ${result.id === pathElements.at(-1)?.id ? "outline-gray-50" : "outline-gray-500"}`}
          >
            {#snippet text()}
              {result.name}
            {/snippet}
            {#snippet icon()}
              <Icon name="file" extraCSS="fill-gray-50" />
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
              <Icon name="directory" extraCSS="fill-gray-50" />
            {/snippet}
          </Button>
        {/if}
      {/each}
    {/if}
  </div>
</div>
