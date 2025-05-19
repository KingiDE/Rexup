<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addBackupEntryInput,
    getValidInput,
    resetAddBackupEntryInput,
  } from "../../hooks/useAddBackupEntryPopup.svelte";
  import type { CurrentPopup } from "../types";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import Input from "../ui/Input.svelte";

  let {
    popup = $bindable(),
    addBackupEntry,
  }: {
    popup: CurrentPopup;
    addBackupEntry: (name: string) => void;
  } = $props();

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && getValidInput().value) {
      addBackupEntry(addBackupEntryInput.value.name);
      resetAddBackupEntryInput();
    } else if (e.key === "Escape") {
      popup = null;
      resetAddBackupEntryInput();
    }
  });
</script>

{#if popup !== null && popup === "add_backup_entry"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
        resetAddBackupEntryInput();
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Create Backup-Entry</h2>
    <p class="mt-4">
      Create a new backup-entry that is added to the list on the overview-tab.
      Please enter a name to proceed.
    </p>
    <Input
      inputExtraCSS="mt-2"
      getter={() => addBackupEntryInput.value.name}
      setter={(newValue: string) => {
        addBackupEntryInput.value.name = newValue;
      }}
      placeholder="A fantastic name"
    />
    <Button
      meaning="positive"
      onClick={() => {
        addBackupEntry(addBackupEntryInput.value.name);
        resetAddBackupEntryInput();
      }}
      extraCSS="mt-4 px-8 justify-self-end"
      disabled={!getValidInput().value}
    >
      {#snippet text()}
        Create
      {/snippet}
    </Button>
  </div>
{/if}
