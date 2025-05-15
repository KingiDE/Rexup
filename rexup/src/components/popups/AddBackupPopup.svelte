<script lang="ts">
import { fade } from "svelte/transition";
import {
	addBackupInputs,
	getValidInputs,
	resetAddBackupInputs,
} from "../../hooks/useAddBackupPopup.svelte";
import type { CurrentPopup } from "../types";
import Button from "../ui/Button.svelte";
import Icon from "../ui/Icon.svelte";
import Input from "../ui/Input.svelte";

// biome-ignore lint/style/useConst: Const-Props will throw an Svelte error
let {
	popup = $bindable(),
	addBackup,
}: {
	popup: CurrentPopup;
	addBackup: (name: string) => void;
} = $props();
</script>

{#if popup !== null && popup.variant === "add_backup"}
  <div
    transition:fade={{ duration: 100 }}
    class={`grid w-[600px] z-10 shadow-lg bg-gray-800 fixed left-1/2 top-1/2 -translate-1/2 outline-1 outline-gray-500 rounded-md p-4 overflow-y-scroll`}
  >
    <Button
      meaning="neutral"
      onClick={() => {
        popup = null;
      }}
      extraCSS="absolute top-4 right-4 "
    >
      {#snippet icon()}
        <Icon name="close" width={24} height={24} extraCSS="fill-gray-50"/>
      {/snippet}
    </Button>
    <h2 class="font-poppins text-2xl font-bold">Create Backup</h2>
    <p class="mt-4">
      Create a new backup that is added to the list on the sidebar. Please enter a name to proceed.  
    </p>
    <Input inputExtraCSS="mt-2" getter={() => addBackupInputs.value.name} setter={(newValue: string) => { addBackupInputs.value.name = newValue; }} placeholder="A fantastic name"/>
    <Button meaning="positive" onClick={() => {
      addBackup(addBackupInputs.value.name);
      resetAddBackupInputs();
    }} extraCSS="mt-4 px-8 justify-self-end" disabled={!getValidInputs().value}>
      {#snippet text()}
			Create
      {/snippet}
    </Button>
  </div>
{/if}