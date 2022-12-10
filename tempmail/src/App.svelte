<script lang="ts">
	import { inbox } from "./lib/stores/mailbox";
    import { socketStatus } from "./lib/stores/socket";
    import { models } from "./lib/stores/models";
	import { io } from "./lib/webSocketConnection";
	import { onMount } from "svelte";
	import IoIosLogOut from "svelte-icons/io/IoIosLogOut.svelte";
	import IoMdSave from "svelte-icons/io/IoMdSave.svelte";
	import IoMdMail from "svelte-icons/io/IoMdMail.svelte";
	import Placeholder from "./lib/PlaceholderMessage.svelte";
	import MailContainer from "./lib/Mailbox/MailboxContainer.svelte";
	import StatusBar from "./lib/StatusBar.svelte";
	import Mailview from "./lib/Message/Mailview.svelte";

	let inboxDetails = {
		email: null,
		password: null,
	};

	onMount(() => {
		io.on("connect", () => {
			socketStatus.update(e => ({ ...e, isConnected: true }))
		});

		io.on("imapConnected", (email, password) => {
			socketStatus.update(e => ({ ...e, imapConnected: true }))

			inboxDetails.email = email;
			inboxDetails.password = password;
		});

		setInterval(() => {
			if (!$socketStatus.imapConnected) return;

			io.emit("refresh");
		}, 5000);

		io.on("messageReceived", (e) => {
			inbox.update((i) => [...i, { ...e }]);
		});
	});

</script>

<main class="main_container">

    <div class="sidebar">
        <h1>Tritan Temp Mail</h1>   
        <div class="sidebar_links">
            <button class="sidebar_button">Inbox</button>
            <button class="sidebar_button">Permanent mailbox</button>
        </div>
        <div class="footer">
            <p>TOS - Privacy Policy</p>
            <p>abuse@tritan.dev</p>
        </div>
    </div>

    <div style="height: 100vh; width: 100%; position: relative;">
        <nav class="navbar_container">
            <div style="display: flex;">
                <div
                    style="height: 20px; margin-top: auto; margin-bottom: auto; margin-right: 7px;"
                >
                    <IoMdMail />
                </div>
                <h1>{inboxDetails.email ? inboxDetails.email : "loading.."}</h1>
            </div>
            <div class="right_sidebar">
                <div style="height: 25px;">
                    <IoMdSave />
                </div>
                <div style="height: 25px; margin-left: 10px;">
                    <IoIosLogOut />
                </div>
            </div>
        </nav>
        <StatusBar />
        <div class="inbox_container">
            {#if $models.mailView !== null}
                <Mailview />
            {:else}
                {#if $inbox.length == 0}
                    <Placeholder />
                {:else}
                    <MailContainer />
                {/if}
            {/if}
        </div>
    </div>
</main>
