<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Input from "../../../ui/Input.svelte";

  let {
    entry,
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<Input
  labelExtraCSS="mt-2"
  getter={() =>
    entry.origin.active_mode === "LocalFileSystem"
      ? entry.origin.local_file_system
      : entry.origin.commands[0]}
  setter={() => {}}
  disabled
/>
