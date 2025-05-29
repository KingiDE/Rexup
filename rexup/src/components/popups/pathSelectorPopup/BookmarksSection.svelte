<script lang="ts">
  import { updatePathElementsFromUserLocationTo } from "../../../hooks/usePathSelectorPopup";
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

  let drives = $state([]);

  onMount(async () => {
    drives = await invoke("get_remaining_drives");
  });
</script>

<div
  class="row-start-1 row-end-3 col-start-1 grid gap-1 content-start self-start h-[300px] overflow-y-scroll"
>
  <div>Bookmarks:</div>
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Home"))}
    meaning="neutral"
    extraCSS="py-1"
  >
    {#snippet text()}
      Home
    {/snippet}
    {#snippet icon()}
      <Icon width={24} height={24} name="home" extraCSS="fill-gray-50" />
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
      Desktop
    {/snippet}
    {#snippet icon()}
      <Icon width={24} height={24} name="pin" extraCSS="fill-gray-50" />
    {/snippet}
  </Button>
  <Button
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Downloads"))}
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
    onClick={async () =>
      (pathElements = await updatePathElementsFromUserLocationTo("Documents"))}
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
  <!-- List drives -->
  {#each drives as drive}
    <Button
      onClick={async () =>
        (pathElements = [{ id: drive, name: drive, variant: "Directory" }])}
      meaning="neutral"
      extraCSS="py-1"
    >
      {#snippet text()}
        {drive}
      {/snippet}
      {#snippet icon()}
        <Icon width={24} height={24} name="drive" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
  {/each}
</div>
