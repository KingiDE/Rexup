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

  // Shows a yellow outline around the preview-box if at least the origin or target is "" (an empty string)
  function showYellowOutline() {
    return entry.origin === "" || entry.target === "";
  }
</script>

<div
  class={`bg-gray-900 p-4 rounded-md grid transition-[opacity_outline] ${showYellowOutline() ? "-outline-offset-2 outline-2 outline-yellow-500" : "outline-0"} ${entry.is_active ? "" : "opacity-50"}`}
>
  <IconAndNameSection bind:entry />
  <InputSection {entry} />
  <DisableAndEditSection bind:entry />
</div>
