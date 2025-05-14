<script lang="ts">
import { onMount } from "svelte";
import Sidebar from "./sidebar/Sidebar.svelte";
import type { CurrentPopup, LocalStateBackup } from "./types";
import SettingsPopup from "./popups/SettingsPopup.svelte";
import AddBackupPopup from "./popups/AddBackupPopup.svelte";

let backups = $state<Array<LocalStateBackup>>([]);
let currentBackup = $state<LocalStateBackup | null>(null);

// biome-ignore lint/style/useConst: State needs to be passed as bindable
let popup = $state<CurrentPopup>(null);

function selectBackup(backup: LocalStateBackup) {
	currentBackup = backup;
}

onMount(() => {
	backups = [
		{
			id: "someid",
			name: "Main Backup",
			entries: new Map(),
			isZipped: true,
			location: "C:/Somewhere",
		},
	];
});
</script>

<div class="p-2 font-inter bg-gray-900 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2">
  <Sidebar bind:popup {backups} {selectBackup}/>
	<AddBackupPopup bind:popup/>
	<SettingsPopup bind:popup/>
</div>
