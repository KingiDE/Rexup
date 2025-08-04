<script lang="ts">
  import { fade } from "svelte/transition";
  import type { EditBackupEntryTab } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import { closePopup, popup } from "../../../hooks/useHotkeyHandler.svelte";
  import { currentBackupEntry } from "../../../hooks/overview/useEntriesTab.svelte";
  import NavbarIcon from "./NavbarIcon.svelte";
  import OverviewTab from "./editBackupEntryTabs/OverviewTab.svelte";
  import DestructiveTab from "./editBackupEntryTabs/DestructiveTab.svelte";
  import FiltersTab from "./editBackupEntryTabs/filtersTab/FiltersTab.svelte";
  import OriginTab from "./editBackupEntryTabs/originTab/OriginTab.svelte";
  import TargetTab from "./editBackupEntryTabs/TargetTab.svelte";
  import { globalTexts } from "../../../globalTexts";

  let tab = $state<EditBackupEntryTab>("overview");
</script>

{#if popup.value === "edit_backup_entry" && currentBackupEntry.value !== null}
  <div
    transition:fade={{ duration: 100 }}
    class={`w-[900px] h-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        closePopup();
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">
      {globalTexts.overview.entriesTab.editBackupEntryPopup.heading}
    </h2>
    <div class="mt-4 grid grid-cols-[250px_auto] gap-8">
      <nav class="grid gap-2 content-start">
        <NavbarIcon
          buttonText={globalTexts.overview.entriesTab.editBackupEntryPopup
            .navbarIcons.overview}
          iconName="edit"
          tabValue="overview"
          bind:tab
        />
        <NavbarIcon
          buttonText={globalTexts.overview.entriesTab.editBackupEntryPopup
            .navbarIcons.origin}
          iconName="file"
          tabValue="origin"
          bind:tab
        />
        <NavbarIcon
          buttonText={globalTexts.overview.entriesTab.editBackupEntryPopup
            .navbarIcons.target}
          iconName="drive"
          tabValue="target"
          bind:tab
        />
        <NavbarIcon
          buttonText={globalTexts.overview.entriesTab.editBackupEntryPopup
            .navbarIcons.filters}
          iconName="filter"
          tabValue="filters"
          bind:tab
        />
        <NavbarIcon
          buttonText={globalTexts.overview.entriesTab.editBackupEntryPopup
            .navbarIcons.destructive}
          iconName="delete"
          tabValue="destructive"
          bind:tab
        />
      </nav>
      <div class="h-[520px] grid content-start">
        {#if tab === "overview"}
          <OverviewTab bind:entry={currentBackupEntry.value} />
        {:else if tab === "origin"}
          <OriginTab bind:entry={currentBackupEntry.value} />
        {:else if tab === "target"}
          <TargetTab bind:entry={currentBackupEntry.value} />
        {:else if tab === "filters"}
          <FiltersTab bind:entry={currentBackupEntry.value} />
        {:else if tab === "destructive"}
          <DestructiveTab entry={currentBackupEntry.value} />
        {/if}
      </div>
    </div>
  </div>
{/if}
