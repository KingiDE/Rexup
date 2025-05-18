<script lang="ts">
  import { fade } from "svelte/transition";
  import type { CurrentPopup, DirecoryResult, PathElement } from "../types";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import { onMount } from "svelte";
  import {
    getPathString,
    pushDirectoryToPathElements,
    read_contents_of_path,
    slicePathElements,
    updatePathElementsFromUserLocationTo,
  } from "../../hooks/usePathSlectorPopup.svelte";

  let {
    popup = $bindable(),
    setCurrentBackupLocation,
    showFiles,
  }: {
    popup: CurrentPopup;
    setCurrentBackupLocation: (location: string) => void;
    showFiles?: boolean;
  } = $props();

  // Keeps track of the current path that is selected at the top bar
  let pathElements = $state<Array<PathElement>>([]);

  // Holds the results of files and direcotires in the current path
  let directoryResults = $state<Array<DirecoryResult>>([]);

  // When the user clicks "Select path", this function combines all path elements and call the function passed through props with it
  function selectPath() {
    setCurrentBackupLocation(getPathString(pathElements));
  }

  // Loads the user's desktop-path into local state
  onMount(async () => {
    pathElements = await updatePathElementsFromUserLocationTo("desktop");
  });

  // Updates the directory-results when the pathElement changes
  $effect(() => {
    async function sett() {
      directoryResults = await read_contents_of_path(pathElements, showFiles);
    }
    sett();
  });
</script>

{#if popup !== null && popup.variant === "select_backup_location"}
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
    <h2 class="font-poppins text-2xl font-bold">Select backup location</h2>
    <!-- Display the current path in form of blocks -->
    <div class="mt-4 flex gap-1 items-center overflow-x-scroll pb-0.5">
      <div class="mr-1">Path</div>
      {#each pathElements as element, index}
        <!-- Don't render the last element when its a file -->
        {#if pathElements.length - 1 === index && element.variant === "file"}{:else}
          <Button
            onClick={() =>
              (pathElements = slicePathElements(pathElements, element.name))}
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
    <!-- Display the bookmars, all drives and the directories in the current one -->
    <div class="mt-2 grid grid-cols-[150px_auto] grid-rows-1 gap-x-8">
      <div class="row-start-1 row-end-3 col-start-1 grid gap-1 self-start">
        <div>Bookmarks:</div>
        <Button
          onClick={() => updatePathElementsFromUserLocationTo("desktop")}
          meaning="neutral"
          extraCSS="py-1"
        >
          {#snippet text()}
            Desktop
          {/snippet}
          {#snippet icon()}
            <Icon width={24} height={24} name="pin" extraCSS="fill-gray-50" />
          {/snippet}
        </Button>
        <Button
          onClick={() => updatePathElementsFromUserLocationTo("downloads")}
          meaning="neutral"
          extraCSS="py-1"
        >
          {#snippet text()}
            Downloads
          {/snippet}
          {#snippet icon()}
            <Icon width={24} height={24} name="pin" extraCSS="fill-gray-50" />
          {/snippet}
        </Button>
        <Button
          onClick={() => updatePathElementsFromUserLocationTo("documents")}
          meaning="neutral"
          extraCSS="py-1"
        >
          {#snippet text()}
            Documents
          {/snippet}
          {#snippet icon()}
            <Icon width={24} height={24} name="pin" extraCSS="fill-gray-50" />
          {/snippet}
        </Button>
        <!-- // TODO: Add drives -->
        <!-- {drives.map((drive) => (
							<Bookmark
								key={drive}
								text={drive}
								onClick={() =>
									setPathElements([
										{
											pathAfterClick: drive,
											pathValue: drive,
											variant: "folder",
										},
									])
								}
								type="drive"
							/>
						))} -->
      </div>
      <div class="col-start-2">
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
