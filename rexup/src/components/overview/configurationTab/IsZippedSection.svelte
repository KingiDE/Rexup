<script lang="ts">
  import type { LocalStateBackup } from "../../types";
  import Button from "../../ui/Button.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<div class="mt-4">
  <div class="font-semibold">Output-Variant</div>
  <div class="opacity-75 max-w-[600px]">
    Your backup can either be a simple directory containing files or it can be a
    Zip-Folder. Zip-Folders have the advantage of being smaller and easier to
    transfer between devices. On the other hand, Zip-Folders need to be
    extracted if you want to work with the files inside them.
  </div>
  <div
    class="relative isolate mt-2 inline-flex -outline-offset-1 outline-1 outline-gray-500 rounded-md"
  >
    <div
      class={`-z-10 absolute h-full w-[120px] bg-gray-500 rounded-md transition-[left] ${currentBackup.is_zipped ? "left-[120px]" : "left-0"}`}
    ></div>
    <Button
      onClick={() => (currentBackup.is_zipped = false)}
      meaning="discrete-neutral"
      extraCSS="w-[120px] px-4 py-1"
    >
      {#snippet text()}
        Directory
      {/snippet}
    </Button>
    <Button
      onClick={() => (currentBackup.is_zipped = true)}
      meaning="discrete-neutral"
      extraCSS="w-[120px] px-4 py-1"
    >
      {#snippet text()}
        Zip-Folder
      {/snippet}
    </Button>
  </div>
</div>
