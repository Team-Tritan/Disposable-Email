<script lang="ts">
    import { models } from "../stores/models";
</script>

<div class="modal_background">
    {#if $models.currentModel}
        <svelte:component this={$models.currentModel} />
    {/if}
</div>