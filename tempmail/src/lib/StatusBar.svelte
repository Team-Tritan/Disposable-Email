<script lang="ts">
	import { onMount } from "svelte";
	import { socketStatus } from "./stores/socket";

    onMount(() => {
        setTimeout(() => {
            socketStatus.update(e => ({ ...e, isConnected: true }));
        }, 2300);

        setTimeout(() => {
            socketStatus.update(e => ({ ...e, imapConnected: true }));
        }, 4300);
    })
</script>

<div class="{$socketStatus.isConnected && $socketStatus.imapConnected ? "status_bar_connected" : "status_bar"}">
	{$socketStatus.isConnected
		? $socketStatus.imapConnected
			? "Connected!"
			: "Handshaking with imap.."
		: "Connecting to the server..."}
</div>
