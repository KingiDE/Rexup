<script lang="ts">
  import { globalTexts } from "../../../../../globalTexts";
  import type { LocalStateBackupEntry } from "../../../../types";
  import Input from "../../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();

  function convertStringToNumber(value: string) {
    const possibleConvertedNumber = Number(value);

    if (Number.isNaN(possibleConvertedNumber)) {
      return null;
    } else if (possibleConvertedNumber === 0) {
      return null;
    }
    return possibleConvertedNumber;
  }
</script>

<div class="mt-2">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
    .maximumFileSize.heading}
</div>
<p class="opacity-75">
  {globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
    .maximumFileSize.description}
</p>
<Input
  inputExtraCSS="mt-1"
  getter={() =>
    entry.filters.max_size_in_mb === null
      ? ""
      : entry.filters.max_size_in_mb.toString()}
  setter={(newValue) =>
    (entry.filters.max_size_in_mb = convertStringToNumber(newValue))}
  placeholder={globalTexts.overview.entriesTab.editBackupEntryPopup.filtersTab
    .maximumFileSize.placeholder}
  type="number"
/>
