<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Input from "../../../ui/Input.svelte";

  let {
    entry,
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="mt-2 flex gap-4">
  <div>
    <div class="font-semibold">Origin:</div>
    <Input
      inputExtraCSS="mt-1 min-w-[400px]"
      placeholder="Unset (Click 'Edit' below to open the popup)"
      getter={() => (entry.origin === null ? "" : entry.origin)}
      setter={() => {}}
      disabled
    />
  </div>
  <div>
    <div class="font-semibold">Target:</div>
    <Input
      inputExtraCSS="mt-1 min-w-[400px]"
      placeholder="Unset (Click 'Edit' below to open the popup)"
      getter={() => (entry.target === null ? "" : entry.target)}
      setter={() => {}}
      disabled
    />
  </div>
</div>
