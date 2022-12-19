<script lang="ts">
	import { notifications } from "../stores/notifications";
	import Notification from "./Notification.svelte";
</script>

<div class="notification_container">
	{#each $notifications as notification, i}
		<Notification 
			value={notification.value}
			timeout={notification.timeout}
			icon={notification.icon}
			index={i}
		/>
	{/each}
</div>
