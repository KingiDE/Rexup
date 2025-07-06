<script lang="ts">
  import type { LocalStateBackup } from "../../types";
  import NameSection from "./NameSection.svelte";
  import IsZippedSection from "./IsZippedSection.svelte";
  import DestructiveSection from "./DestructiveSection.svelte";
  import LocationSection from "./locationSection/LocationSection.svelte";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<h3 class="mt-2 font-poppins text-xl font-bold">Configuration</h3>
<NameSection bind:currentBackup />
<IsZippedSection bind:currentBackup />
<LocationSection bind:currentBackup />
<DestructiveSection {currentBackup} />
