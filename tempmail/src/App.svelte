<script lang="ts">
    import {} from 'svelte';

	import Router from "svelte-spa-router";
	import ModelView from './lib/Models/ModelView.svelte';
	import SideNav from "./lib/Navigation/SideNav.svelte";
	import TopNav from "./lib/Navigation/TopNav.svelte";
	import PermenentMailbox from "./lib/Pages/PermenentMailbox.svelte";
	import SingleUseMailbox from "./lib/Pages/SingleUseMailbox.svelte";
</script>

<main class="main_container">
	<ModelView />
	<SideNav />

	<div style="height: 100%; width: 100%; position: relative;">
		<TopNav />
        <PermenentMailbox />
	</div>
</main>

