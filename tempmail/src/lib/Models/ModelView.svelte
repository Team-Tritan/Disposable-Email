<script lang="ts">
	import { models } from "../stores/models";
    import { fade } from 'svelte/transition';
</script>

{#if $models.currentModel}
	<div out:fade={{ duration: 100 }} class="modal_background">
		<svelte:component this={$models.currentModel} />
	</div>
{/if}
