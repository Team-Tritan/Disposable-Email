<script lang="ts">
	import ModelView from './lib/Models/ModelView.svelte';
	import SideNav from "./lib/Navigation/SideNav.svelte";
	import TopNav from "./lib/Navigation/TopNav.svelte";
	import NotificationContainer from './lib/Notifications/NotificationContainer.svelte';
	import PermenentMailbox from "./lib/Pages/PermenentMailbox.svelte";
	import SingleUseMailbox from "./lib/Pages/SingleUseMailbox.svelte";
</script>

<main class="main_container">
	<NotificationContainer />
	<ModelView />
	<SideNav />

	<div style="height: 100%; width: 100%; position: relative;">
		<TopNav />
        <PermenentMailbox />
	</div>
</main>

