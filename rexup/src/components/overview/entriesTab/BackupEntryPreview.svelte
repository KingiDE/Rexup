<script lang="ts">
  import type { CurrentPopup, LocalStateBackupEntry } from "../../types";

  let {
    entry = $bindable(),
    popup = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
    popup: CurrentPopup;
  } = $props();
</script>

<div>{entry.name}</div>
