<script lang="ts">
	import { mailbox } from "../stores/mailbox";
	import { io } from "../webSocketConnection";
	import IoMdArrowBack from "svelte-icons/io/IoMdArrowBack.svelte";
	import IoMdMail from "svelte-icons/io/IoMdMail.svelte";
	import TopLoader from "../TopLoader.svelte";

	let currentMail = $mailbox.inbox.find((i) => i.id == $mailbox.currentlySelectedEmail);
	let bodyIframe;
	let loading = 0;

	const goBack = () => {
		mailbox.update((e) => ({ ...e, currentlySelectedEmail: null }));
	};

	console.log(currentMail);

	const onFrameLoad = (e) => {
		let doc = bodyIframe.contentDocument;

		doc.body.innerHTML =
			doc.body.innerHTML +
			`
        <style>
            @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

            * {
                font-family: "IBM Plex Sans";
            }

            body {
                background-color: #2b2d2a;    
                color: white;
            }

            a {
                text-decoration: underline;
                color: lightblue;
            }
        </style>
        `;
	};

	const fetchAttachment = (id) => {
		loading = 20;

		let socket = io();

		socket.emit("fetchAttachment", currentMail.id, id);

		loading = 30;

		socket.on(`${id}_inc`, function (e) {
			loading = 100;

			var link = document.createElement("a");

			link.href = `data:application/octet-stream;base64,${e}`;
			link.download = "file";
			link.click();

			socket.removeListener(`${id}_inc`);
		});
	};
</script>

<TopLoader progress={loading} />

<div class="mailview_container">
	<div>
		<div style="cursor: pointer;" class="flex" on:click={goBack}>
			<div
				style="height: 20px; display: flex; margin-top: auto; width: fit-content; margin-bottom: auto; margin-right: 7px;"
			>
				<IoMdArrowBack />
			</div>
			<p class="my-auto" style="margin-left: 2px;">Back</p>
		</div>
	</div>

	<div class="mailview_inner">
		<div>
			<h1 class="email_subject">{currentMail.subject}</h1>
		</div>

		<div class="mailview_content">
			<div class="sender flex">
				<div class="sender_profile my-auto" />
				<div class="my-auto">
					<h1>{currentMail.from.split("<")[0]}</h1>
					<p class="flex">
						<span
							class="my-auto"
							style="height: 18px; margin-right: 9px;"
						>
							<IoMdMail />
						</span>
						<span class="my-auto" style="font-size: 0.9rem"
							>{currentMail.from
								.split("<")[1]
								.replace("<", "")
								.replace(">", "")}</span
						>
					</p>
				</div>
			</div>

			<iframe
				class="mail_iframe"
				bind:this={bodyIframe}
				on:load={onFrameLoad}
				srcdoc={currentMail.body}
				title="mail contnet"
			/>

			{#if currentMail.attachments.length > 0}
				<div>
					<p style="margin-top: 10px;">Attachments</p>
					<div class="flex">
						{#each currentMail.attachments as attachment}
							<div
								on:click={() => fetchAttachment(attachment.id)}
								on:keydown={() => {}}
								on:keydown={() => {}}
								style="min-width: 250px; width: fit-content; background-color: #2b2d2a; border-radius: 10px; margin-top: 5px; padding: 10px; margin-right: 10px;"
							>
								{attachment.name}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
