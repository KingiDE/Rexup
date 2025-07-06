<script lang="ts">
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
    disabled={popup.value !== null}
  />
</div>
