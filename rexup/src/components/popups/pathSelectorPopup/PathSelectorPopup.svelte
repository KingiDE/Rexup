<script lang="ts">
  import { fade } from "svelte/transition";
  import type {
    CurrentPopup,
    DirectoryContent,
    PathElement,
  } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import { onMount } from "svelte";
  import {
    getPathString,
    read_contents_of_path,
    updatePathElementsFromUserLocationTo,
  } from "../../../hooks/usePathSelectorPopup";
  import PathElementsSection from "./PathElementsSection.svelte";
  import BookmarksSection from "./BookmarksSection.svelte";
  import ResultsSection from "./ResultsSection.svelte";

  let {
    popup = $bindable(),
    setOuterPath,
    showFiles,
    popupToShowUp,
    heading,
  }: {
    popup: CurrentPopup;
    setOuterPath: (location: string) => void;
    showFiles?: boolean;
    popupToShowUp:
      | "select_backup_location"
      | "select_backup_entry_origin_location";
    heading: string;
  } = $props();

  // Keeps track of the current path that is selected at the top bar
  let pathElements = $state<Array<PathElement>>([]);
  // $inspect(pathElements);

  // Holds the results of files and direcotires in the current path
  let directoryResults = $state<Array<DirectoryContent>>([]);

  // When the user clicks "Select path", this function combines all path elements and call the function passed through props with it
  function selectPath() {
    setOuterPath(getPathString(pathElements));
  }

  // Loads the user's desktop-path into local state
  onMount(async () => {
    pathElements = await updatePathElementsFromUserLocationTo("Desktop");
  });

  // Updates the directory-results when the pathElement changes
  $effect(() => {
    async function doAsyncThing() {
      // It the last element of pathElements is a file, remove it
      const pathToSearch = pathElements.filter((el, index) => {
        return el.variant === "File" && pathElements.length - 1 === index
          ? false
          : true;
      });
      directoryResults = await read_contents_of_path(pathToSearch);
    }
    doAsyncThing();
  });
</script>

{#if popup === popupToShowUp}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <!-- Display the current path in form of block at the top bar -->
    <PathElementsSection bind:pathElements {heading} />
    <!-- Display the bookmars, all drives and the directories in the current one -->
    <div class="mt-2 grid grid-cols-[150px_auto] grid-flow-row gap-x-8">
      <BookmarksSection bind:pathElements />
      <ResultsSection bind:pathElements {showFiles} {directoryResults} />
    </div>
    <Button
      onClick={selectPath}
      meaning="positive"
      extraCSS="mt-4 px-8 justify-self-end"
    >
      {#snippet text()}
        Select path
      {/snippet}
    </Button>
  </div>
{/if}
