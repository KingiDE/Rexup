<script lang="ts">
  import { globalTexts } from "../../../globalTexts";
  import { popup } from "../../../hooks/useHotkeyHandler.svelte";
  import type { LocalStateBackup } from "../../types";
  import Input from "../../ui/Input.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<div class="mt-2">
  <div class="font-semibold">
    {globalTexts.overview.configurationTab.nameSection.label}
  </div>
  <div class="opacity-75 max-w-[700px]">
    {globalTexts.overview.configurationTab.nameSection.description}
  </div>
  <Input
    inputExtraCSS="mt-2 max-w-[400px]"
    placeholder={globalTexts.overview.configurationTab.nameSection.placeholder}
    getter={() => currentBackup.name}
    setter={(newValue) => {
      currentBackup.name = newValue;
    }}
    disabled={popup.value !== null}
  />
</div>
