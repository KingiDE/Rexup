<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addBackupEntryInput,
    getValidInput,
    resetAddBackupEntryInput,
    triedToSubmit,
  } from "../../hooks/overview/useAddBackupEntryPopup.svelte";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import Input from "../ui/Input.svelte";
  import { closePopup, popup } from "../../hooks/useHotkeyHandler.svelte";
  import { addBackupEntry } from "../../hooks/overview/useEntriesTab.svelte";
  import { globalTexts } from "../../globalTexts";
</script>

{#if popup.value === "add_backup_entry"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        closePopup();
        resetAddBackupEntryInput();
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">
      {globalTexts.overview.entriesTab.addBackupEntryPopup.heading}
    </h2>
    <p class="mt-4">
      {globalTexts.overview.entriesTab.addBackupEntryPopup.description}
    </p>
    <Input
      inputExtraCSS={`mt-2 ${!getValidInput().value && triedToSubmit.value ? "outline outline-red-500" : ""}`}
      getter={() => addBackupEntryInput.value.name}
      setter={(newValue: string) => {
        addBackupEntryInput.value.name = newValue;
      }}
      placeholder={globalTexts.overview.entriesTab.addBackupEntryPopup
        .placeholder}
    />
    <Button
      meaning="positive"
      onClick={() => {
        addBackupEntry(addBackupEntryInput.value.name);
      }}
      extraCSS="mt-4 px-8 justify-self-end"
      disabled={!getValidInput().value}
    >
      {#snippet text()}
        {globalTexts.overview.entriesTab.addBackupEntryPopup.confirm}
      {/snippet}
    </Button>
  </div>
{/if}
