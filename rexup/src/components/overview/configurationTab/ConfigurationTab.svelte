<script lang="ts">
  import type { LocalStateBackup } from "../../types";
  import NameSection from "./NameSection.svelte";
  import IsZippedSection from "./IsZippedSection.svelte";
  import DestructiveSection from "./DestructiveSection.svelte";
  import LocationSection from "./locationSection/LocationSection.svelte";
  import { globalTexts } from "../../../globalTexts";

  let {
    currentBackup = $bindable(),
  }: {
    currentBackup: LocalStateBackup;
  } = $props();
</script>

<h3 class="mt-2 font-poppins text-xl font-bold">
  {globalTexts.overview.configurationTab.heading}
</h3>
<NameSection bind:currentBackup />
<IsZippedSection bind:currentBackup />
<LocationSection bind:currentBackup />
<DestructiveSection {currentBackup} />
