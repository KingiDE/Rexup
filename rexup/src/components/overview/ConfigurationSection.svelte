<script lang="ts">
  import type { LocalStateBackup } from "../types";
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import Input from "../ui/Input.svelte";

  let {
    currentBackup = $bindable(),
    isConfigureSectionExpanded,
  }: {
    currentBackup: LocalStateBackup;
    isConfigureSectionExpanded: boolean;
  } = $props();

  function toggleIsConfigureSectionExpanded() {
    isConfigureSectionExpanded = !isConfigureSectionExpanded;
  }
</script>

<div class="mt-4 flex gap-4">
  <Button
    onClick={toggleIsConfigureSectionExpanded}
    meaning="neutral"
    extraCSS={`transition-[opacity] px-1 py-1 ${isConfigureSectionExpanded ? "" : "opacity-50"}`}
  >
    {#snippet icon()}
      <Icon
        width={20}
        height={20}
        name="triangle"
        extraCSS={`fill-gray-50 transition-[rotate_scale] ${isConfigureSectionExpanded ? "rotate-180" : "rotate-90 scale-[0.8]"}`}
      />
    {/snippet}
  </Button>
  <h3 class="font-poppins text-xl font-bold">Configuration</h3>
</div>
<div
  class={`grid transition-[grid-template-rows] ${isConfigureSectionExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
>
  <!-- Inner wrapper for transitioning to auto to work -->
  <div class="overflow-hidden">
    <!-- name -->
    <div class="mt-2">
      <div class="font-semibold">Backup-Name</div>
      <div class="opacity-75 max-w-[600px]">
        Adjust the name that is used in the sidebar.
      </div>
      <Input
        inputExtraCSS="mt-2 max-w-[400px]"
        placeholder="A creative name"
        getter={() => currentBackup.name}
        setter={(newValue) => {
          currentBackup.name = newValue;
        }}
      />
    </div>
    <!-- is_zipped -->
    <div class="mt-4">
      <div class="font-semibold">Output-Variant</div>
      <div class="opacity-75 max-w-[600px]">
        Your backup can either be a simple directory containing files or it can
        be a Zip-Folder. Zip-Folders have the advantage of being smaller and
        easier to transfer between devices. On the other hand, Zip-Folders need
        to be extracted if you want to work with the files inside them.
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
    <!-- location -->
    <div class="mt-4">
      <div class="font-semibold">Backup-Location</div>
      <div class="opacity-75 max-w-[600px]">
        After your backup has been executed, it will be placed somewhere. This
        location can be configured here. To change it, simply click the
        "Edit"-button below and choose a diretory, the backup will be placed in.
      </div>
      <!-- TODO: Add Path-Selector -->
    </div>
  </div>
</div>
