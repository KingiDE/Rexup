<script lang="ts">
  import { globalTexts } from "../../../globalTexts";
  import { updatePathElementsFromUserLocationTo } from "../../../hooks/overview/usePathSelectorPopup";
  import type { PathElement } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";

  let {
    pathElements = $bindable(),
  }: {
    pathElements: Array<PathElement>;
  } = $props();

  let drives = $state<Array<Array<PathElement>>>([]);

  onMount(async () => {
    drives = (await invoke("get_remaining_drives")) as Array<
      Array<PathElement>
    >;
  });
</script>

<div
  class="row-start-1 row-end-3 col-start-1 grid gap-1 content-start self-start h-full overflow-y-scroll"
>
  <div>{globalTexts.overview.pathSelectorPopup.bookmarks.heading}</div>
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Home"))}
    meaning="neutral"
    extraCSS="py-1"
  >
    {#snippet text()}
      {globalTexts.overview.pathSelectorPopup.bookmarks.home}
    {/snippet}
    {#snippet icon()}
      <Icon name="home" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  <!-- List bookmarks -->
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Desktop"))}
    meaning="neutral"
    extraCSS="py-1"
  >
    {#snippet text()}
      {globalTexts.overview.pathSelectorPopup.bookmarks.desktop}
    {/snippet}
    {#snippet icon()}
      <Icon name="pin" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Downloads"))}
    meaning="neutral"
    extraCSS="py-1"
  >
    {#snippet text()}
      {globalTexts.overview.pathSelectorPopup.bookmarks.downloads}
    {/snippet}
    {#snippet icon()}
      <Icon name="pin" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Documents"))}
    meaning="neutral"
    extraCSS="py-1"
  >
    {#snippet text()}
      {globalTexts.overview.pathSelectorPopup.bookmarks.documents}
    {/snippet}
    {#snippet icon()}
      <Icon name="pin" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  <!-- List drives -->
  {#each drives as drive}
    <Button
      onClick={async () => (pathElements = drive)}
      meaning="neutral"
      extraCSS="py-1"
    >
      {#snippet text()}
        {drive.at(-1)?.name}
      {/snippet}
      {#snippet icon()}
        <Icon name="drive" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
  {/each}
</div>
