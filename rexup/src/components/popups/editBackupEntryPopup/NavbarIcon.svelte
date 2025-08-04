<script lang="ts">
  import type { EditBackupEntryTab } from "../../types";
  import Button from "../../ui/Button.svelte";
  import Icon from "../../ui/Icon.svelte";
  import { icons } from "../../ui/icons";

  let {
    buttonText,
    iconName,
    tabValue,
    tab = $bindable(),
  }: {
    buttonText: string;
    iconName: keyof typeof icons;
    tabValue: EditBackupEntryTab;
    tab: string;
  } = $props();
</script>

<Button
  meaning="neutral"
  onClick={() => (tab = tabValue)}
  extraRules={["no-padding", "no-bg"]}
  extraCSS={`px-2 py-1 ${tabValue === tab ? "bg-gray-500" : ""}`}
>
  {#snippet text()}
    {buttonText}
  {/snippet}
  {#snippet icon()}
    <Icon name={iconName} width={24} height={24} extraCSS="fill-white" />
  {/snippet}
</Button>
