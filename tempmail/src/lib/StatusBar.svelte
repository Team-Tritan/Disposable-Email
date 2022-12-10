<script lang="ts">
	import { socketStatus } from "./stores/socket";
</script>

<div class="{$socketStatus.isConnected && $socketStatus.imapConnected ? "status_bar_connected" : "status_bar"}">
	{$socketStatus.isConnected
		? $socketStatus.imapConnected
			? "Connected!"
			: "Handshaking with imap.."
		: "Connecting to the server..."}
</div>
