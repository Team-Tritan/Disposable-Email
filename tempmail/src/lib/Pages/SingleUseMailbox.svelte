<script lang="ts">
	import Placeholder from "../PlaceholderMessage.svelte";
	import MailContainer from "../Mailbox/MailboxContainer.svelte";
	import StatusBar from "../StatusBar.svelte";
	import Mailview from "../Message/Mailview.svelte";

    import { models } from '../stores/models';
    import { mailbox } from '../stores/mailbox';
    import { onMount } from 'svelte';
    import { io } from '../webSocketConnection';
	import { socketStatus } from "../stores/socket";


    onMount(() => {
        let socket = io();

        socket.on("connect", () => {
            socketStatus.update((e) => ({ ...e, isConnected: true }));
        });

        socket.on("imapConnected", (email, password) => {
			socketStatus.update((e) => ({ ...e, imapConnected: true }));

            mailbox.update((i) => ({
                ...i,
                email: email,
                password: password
            }));
		});

		socket.on("messageReceived", (e) => {
			mailbox.update((i) => ({ ...i, inbox: [...i.inbox, { ...e }] }));
		});
    
        setInterval(() => {
			if (!$socketStatus.imapConnected) return;

			socket.emit("refresh");
		}, 5000);
    });
</script>

<StatusBar />
<div class="inbox_container">
	{#if $models.mailView !== null}
		<Mailview />
	{:else if $mailbox.inbox.length == 0}
		<Placeholder />
	{:else}
		<MailContainer />
	{/if}
</div>
