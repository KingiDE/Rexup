<script lang="ts">
  import EditBackupEntryPopup from "../../../popups/EditBackupEntryPopup.svelte";
  import type { CurrentPopup, LocalStateBackupEntry } from "../../../types";
  import DisableAndEditSection from "./DisableAndEditSection.svelte";
  import IconAndNameSection from "./IconAndNameSection.svelte";
  import InputSection from "./InputSection.svelte";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();
</script>

<div class="bg-gray-900 p-4 rounded-md grid">
  <IconAndNameSection bind:entry />
  <InputSection {entry} />
  <DisableAndEditSection bind:entry bind:popup />
  <!-- Edit Backup-Entry Popup -->
  <EditBackupEntryPopup bind:entry bind:popup />
</div>
