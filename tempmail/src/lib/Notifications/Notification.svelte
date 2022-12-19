<script lang="ts">
	import { notifications } from "../stores/notifications";
	import { fade, fly } from 'svelte/transition';

	export let value = "";
	export let icon = null;
	export let timeout = 0;
	export let index = 0;

	const notificationTimeout = () => {
		setTimeout(() => {
			notifications.update(i => {
				i.splice(index, 1);
				return i;
			})
		}, timeout);
	};

	$: timeout, notificationTimeout(); 
</script>

<div in:fly="{{ y: -100, duration: 500 }}" out:fade class="notification">
	<h1 style="display: flex;">
		{#if icon}
			<div style="margin-right: 5px; color: #27975a;" class="icon">
				<svelte:component this={icon} />
			</div>
		{/if}
		{value}
	</h1>
</div>
