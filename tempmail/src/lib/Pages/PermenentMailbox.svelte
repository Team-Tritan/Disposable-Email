<script lang="ts">
	import { onMount } from "svelte";
	import { models } from "../stores/models";
	import { onDestroy } from "svelte";
	import {
		FetchMailboxFromStorage,
		GeneratePerminentMailbox,
		mailbox,
		SetMailbox,
	} from "../stores/mailbox";
	import StatusBar from "../StatusBar.svelte";
	import TopLoader from "../TopLoader.svelte";
	import Mailview from "../Message/Mailview.svelte";
	import MailboxContainer from "../Mailbox/MailboxContainer.svelte";
	import { createUrlStore } from "../stores/url";
	import { SetConnected } from "../stores/socket";

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
		if (interval) clearInterval(interval);

		interval = setInterval(() => {
			refreshMailbox();
		}, 5000);
	};

	$: $mailbox.email, setRefreshTimeout();

	onMount(() => {
		// createUrlStore().subscribe((i) => {
		// 	let mailboxNumber = 0;

		// 	if (i.pathname.includes("/u") && i.pathname.split("/u")[1]) {
		// 		mailboxNumber = parseInt(i.pathname.split("/u")[1]);
		// 	}

		// 	const fromStorageMailbox = FetchMailboxFromStorage(mailboxNumber);

		// 	if (fromStorageMailbox) {
		// 		SetMailbox({
		// 			username: fromStorageMailbox.email,
		// 			password: fromStorageMailbox.password,
		// 			mailboxNumber: 0,
		// 		});
		// 	} else {
		// 		GeneratePerminentMailbox();
		// 	}
		//});

		const fromStorageMailbox = FetchMailboxFromStorage(0);

		if (fromStorageMailbox) {
			SetMailbox({
				username: fromStorageMailbox.email,
				password: fromStorageMailbox.password,
				mailboxNumber: 0,
			});

			refreshMailbox();	

			SetConnected();
		} else {
			GeneratePerminentMailbox();
		}
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
