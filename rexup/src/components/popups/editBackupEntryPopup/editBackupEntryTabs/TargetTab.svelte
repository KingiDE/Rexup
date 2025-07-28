<script lang="ts">
  import type { LocalStateBackupEntry } from "../../../types";
  import Button from "../../../ui/Button.svelte";
  import Input from "../../../ui/Input.svelte";

  let {
    entry = $bindable(),
  }: {
    entry: LocalStateBackupEntry;
  } = $props();
</script>

<div class="font-semibold">Target:</div>
<div class="opacity-75">
  Here you can select the location of the copied resource relative to the
  directory or zip-file that has been created. If the input-field is empty, the
  resource will be placed in the root-directory (= "/").
</div>
<div class="opacity-75">
  For further assistance, switch to the Overview-Tab that explains the
  copy-process in detail.
</div>
<div class="mt-1 flex gap-2">
  <Input
    labelExtraCSS="grow"
    placeholder="Unset"
    getter={() => entry.target}
    setter={(newValue) => {
      entry.target = newValue;
    }}
  />
  <Button
    meaning="neutral"
    onClick={() => (entry.target = "")}
    extraCSS="py-1 w-20"
    disabled={entry.target === ""}
  >
    {#snippet text()}
      Reset
    {/snippet}
  </Button>
</div>
<div class="mt-2 font-semibold">Rename to:</div>
<div class="opacity-75">
  Here you can pick the new name of the copied resource. If the input-field is
  empty, the resource won't be renamed and keeps it original name. Note that the
  rename-functionality only works on files and directories that are stored on
  your local file-system.
</div>
<div class="opacity-75">
  For further assistance, switch to the Overview-Tab that explains the
  copy-process in detail.
</div>
<div class="mt-1 flex gap-2">
  <Input
    labelExtraCSS="grow"
    placeholder="Unset"
    getter={() => entry.rename_to}
    setter={(newValue) => {
      entry.rename_to = newValue;
    }}
  />
  <Button
    meaning="neutral"
    onClick={() => (entry.rename_to = "")}
    extraCSS="py-1 w-20"
    disabled={entry.rename_to === ""}
  >
    {#snippet text()}
      Reset
    {/snippet}
  </Button>
</div>
