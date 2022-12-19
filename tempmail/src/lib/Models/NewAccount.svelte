<script lang="ts">
	import IoMdLogIn from "svelte-icons/io/IoMdLogIn.svelte";
	import IoMdCheckmark from "svelte-icons/io/IoMdCheckmark.svelte";
	import { notifications } from "../stores/notifications";
	import { fade } from "svelte/transition";
	import { models } from "../stores/models";
	import { mailbox, SaveAddress } from "../stores/mailbox";
	import { clickOutside } from "../clickOutside";
	const usernameRegex = /^([A-Za-z0-9_-]+)$/;

	let loading = false;

	let data = {
		username: "",
		password: "",
	};

	let errors = {
		username: "",
		password: "",
	};

	const submit = async (e) => {
		e.preventDefault();
		loading = true;

		const result = await fetch(`http://localhost:4000/api/mailbox`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then(async (res) => await res.json())
			.catch((err) => null);

		if (result.error) {
			if (result.validation_field)
				errors[result.validation_field] = result.message;

			loading = false;
			return;
		}

		notifications.update((e) => [
			...e,
			{
				value: `Switched account to: ${data.username}`,
				timeout: 2000,
				icon: IoMdCheckmark,
			},
		]);

		models.update(() => ({ currentModel: null }));

		mailbox.update((e) => ({
			...e,
			email: result.email,
			password: result.password,
		}));

		SaveAddress({
			encryptAccount: false,
			username: result.email,
			password: result.password,
		});

		loading = false;
	};

	$: data.username,
		!usernameRegex.test(data.username)
			? (errors.username = "Invalid username")
			: (errors.username = "");

	$: data.password,
		data.password == ""
			? (errors.password = "Please enter a password!")
			: (errors.password = "");
</script>

<div
	use:clickOutside
	on:click_outside={() =>
		models.update((i) => ({
			currentModel: null,
		}))}
	in:fade={{ duration: 150 }}
	out:fade={{ duration: 100 }}
	class="modal_inner sign_up_model"
>
	<div class="icon mx-auto login_icon">
		<IoMdLogIn />
	</div>
	<h1 class="mx-auto" style="margin-top: 15px; font-size: 1.4rem;">
		Create a new account
	</h1>
	<p class="create_tagline">
		This will create an anonymous email with your choice of username and
		password.
	</p>
	<form on:submit={submit} class="login_form">
		<div class="input_container">
			<p>Username</p>
			<input
				disabled={loading}
				bind:value={data.username}
				placeholder="Username"
				class="form_input"
			/>
			<p style="margin-top: 2px; font-weight: 500; color: #df5a5a;">
				{errors.username ? errors.username : ""}
			</p>
		</div>

		<div class="input_container">
			<p>Password</p>
			<input
				disabled={loading}
				bind:value={data.password}
				placeholder="Password"
				class="form_input"
				type="password"
			/>
			<p style="margin-top: 2px; font-weight: 500; color: #df5a5a;">
				{errors.password ? errors.password : ""}
			</p>
		</div>

		<div>
			<button class="big_button {loading ? 'darken_bg' : ''}">
				Create
			</button>
		</div>
	</form>
</div>
