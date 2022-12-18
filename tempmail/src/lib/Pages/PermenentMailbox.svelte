<script lang="ts">
	import { onMount } from "svelte";
	import { models } from "../stores/models";
	import { onDestroy } from "svelte";
	import { GeneratePerminentMailbox, mailbox } from "../stores/mailbox";
	import StatusBar from "../StatusBar.svelte";
	import TopLoader from "../TopLoader.svelte";
	import Mailview from "../Message/Mailview.svelte";
	import MailboxContainer from "../Mailbox/MailboxContainer.svelte";

	let interval;
	let loading = 0;

	const refreshMailbox = () => {
		loading = 30;

		fetch(`http://localhost:4000/api/mailbox`, {
			method: "GET",
			headers: {
				authorization: `${btoa(
					`${$mailbox.email}:${$mailbox.password}`
				)}`,
			},
		})
			.then(async (res) => {
				let body = await res.json();

				mailbox.update((i) => ({ ...i, inbox: body.messages }));

				loading = 100;
			})
			.catch((err) => {
				console.log(err);

				loading = 100;
			});
	};

    const setRefreshTimeout = () => {
        if(interval)
            clearInterval(interval);

        interval = setInterval(() => {
            refreshMailbox();
        }, 5000);
    }

    $: $mailbox.email, setRefreshTimeout();

	onMount(() => {
		GeneratePerminentMailbox();
	});

	onDestroy(() => clearInterval(interval));
</script>

<TopLoader progress={loading} />

<StatusBar />
<div class="inbox_container">
	{#if $mailbox.currentlySelectedEmail !== null}
		<Mailview />
	{:else if $mailbox.inbox.length == 0}
		<!-- <PlaceholderMessage /> -->
	{:else}
		<MailboxContainer />
	{/if}
</div>
