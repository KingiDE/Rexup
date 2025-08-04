<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import DisableAndEditSection from "./DisableAndEditSection.svelte";
  import IconAndNameSection from "./IconAndNameSection.svelte";
  import InputSection from "./InputSection.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  function showYellowOutline() {
    if (
      entry.origin.active_mode === "Commands" &&
      entry.origin.commands.length === 0
    )
      return true;

    if (
      entry.origin.active_mode === "LocalFileSystem" &&
      entry.origin.local_file_system === ""
    )
      return true;

    return false;
  }
</script>

<div
  class={`min-w-[500px] w-full max-w-[min(700px,_100%)]  bg-gray-900 p-4 rounded-md grid transition-[opacity,_outline] outline-2 -outline-offset-2 
    ${showYellowOutline() ? "outline-yellow-500" : "outline-transparent"} ${entry.is_active ? "" : "opacity-50"}
  `}
>
  <IconAndNameSection bind:entry />
  <InputSection {entry} />
  <DisableAndEditSection bind:entry />
</div>
