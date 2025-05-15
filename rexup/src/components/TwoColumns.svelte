<script lang="ts">
import { invoke } from "@tauri-apps/api/core";
import { onMount } from "svelte";
import AddBackupPopup from "./popups/AddBackupPopup.svelte";
import SettingsPopup from "./popups/SettingsPopup.svelte";
import Sidebar from "./sidebar/Sidebar.svelte";
import type { CurrentPopup, LocalStateBackup } from "./types";
import Overview from "./overview/Overview.svelte";

let backups = $state<Array<LocalStateBackup>>([]);
let currentBackup = $state<LocalStateBackup | null>(null);

let popup = $state<CurrentPopup>(null);

function selectBackup(backup: LocalStateBackup) {
	currentBackup = backup;
}

// Adds backup to local state and write it in the backups-file
async function addBackup(name: string) {
	backups.push({
		id: Date.now().toString(),
		name: name,
		entries: [],
		is_zipped: false,
		// TODO: This probably needs to be some other safe value
		location: "",
	});

	popup = null;
}

onMount(async () => {
	const readData = (await invoke("read_backup_file")) as string;
	console.log(readData);
	// TODO: Validate read data
	backups = JSON.parse(readData);
});

$effect(() => {
	async function sett() {
		if (backups.length === 0) return;
		await invoke("write_backup_file", { value: backups });
	}
	sett();
});
</script>

<div class="p-2 font-inter bg-gray-900 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2">
  <Sidebar bind:popup {backups} {selectBackup} {currentBackup}/>
	<Overview bind:popup bind:currentBackup />
	<!-- All popups (they are placed "absolute") -->
	<AddBackupPopup bind:popup {addBackup}/>
	<SettingsPopup bind:popup/>
</div>
