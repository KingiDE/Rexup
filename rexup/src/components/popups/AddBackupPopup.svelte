<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    addBackupInput,
    getValidInput,
    resetAddBackupInput,
    triedToSubmit,
  } from "../../hooks/sidebar/useAddBackupPopup.svelte";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import Input from "../ui/Input.svelte";
  import { closePopup, popup } from "../../hooks/useHotkeyHandler.svelte";
  import { addBackup } from "../../hooks/sidebar/useSidebar.svelte";
  import { globalTexts } from "../../globalTexts";
</script>

{#if popup.value === "add_backup"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        closePopup();
        resetAddBackupInput();
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" extraCSS="fill-gray-50" />
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">
      {globalTexts.sidebar.addBackupPopup.heading}
    </h2>
    <p class="mt-4">
      {globalTexts.sidebar.addBackupPopup.description}
    </p>
    <Input
      inputExtraCSS={`mt-2 ${!getValidInput().value && triedToSubmit.value ? "outline outline-red-500" : ""}`}
      getter={() => addBackupInput.value.name}
      setter={(newValue: string) => {
        addBackupInput.value.name = newValue;
      }}
      placeholder={globalTexts.sidebar.addBackupPopup.placeholder}
    />
    <Button
      meaning="positive"
      onClick={() => {
        addBackup(addBackupInput.value.name);
      }}
      extraCSS="mt-4 px-8 justify-self-end"
      disabled={!getValidInput().value}
    >
      {#snippet text()}
        {globalTexts.sidebar.addBackupPopup.confirm}
      {/snippet}
    </Button>
  </div>
{/if}
