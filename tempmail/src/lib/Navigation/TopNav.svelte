<script lang="ts">
	import IoIosLogOut from "svelte-icons/io/IoIosLogOut.svelte";
	import FaUserPlus from "svelte-icons/fa/FaUserPlus.svelte";
	import IoMdMail from "svelte-icons/io/IoMdMail.svelte";
	import IoMdSave from "svelte-icons/io/IoMdSave.svelte";
	import FaSignInAlt from "svelte-icons/fa/FaSignInAlt.svelte";
	import FaTrashAlt from "svelte-icons/fa/FaTrashAlt.svelte";

	import { clickOutside } from "../clickOutside";
	import { models, ShowModel } from "../stores/models";

	import { fade, fly, scale } from "svelte/transition";

	import {
		FetchMailboxs,
		GeneratePerminentMailbox,
		mailbox,
		SetMailbox,
	} from "../stores/mailbox";
	import NewAccount from "../Models/NewAccount.svelte";
	import { AddNotification, notifications } from "../stores/notifications";
	import IoMdCheckmark from "svelte-icons/io/IoMdCheckmark.svelte";

	let showDropdown = false;
	let accounts = FetchMailboxs();

	let dropdownAction = (func: any) => {
		showDropdown = false;
		func();
	};
</script>

<nav class="navbar_container">
	<div style="display: flex;" class="my-auto">
		<div
			style="height: 20px; margin-top: auto; margin-bottom: auto; margin-right: 7px;"
		>
			<IoMdMail />
		</div>
		<h1>{$mailbox.email ? $mailbox.email : "loading.."}</h1>
	</div>
	<div class="right_sidebar my-auto">
		<div
			use:clickOutside
			on:click_outside={() => {
				showDropdown = false;
			}}
			class="avatar"
		>
			<span
				on:keypress={() => {}}
				on:click={() => (showDropdown = !showDropdown)}
				class="my-auto mx-auto"
				style="cursor: pointer; font-size: 0.9rem">TS</span
			>

			{#if showDropdown}
				<div
					out:fade={{ duration: 100 }}
					in:scale={{ start: 0.9, duration: 200 }}
					class="avatar_dropdown"
				>
					<div class="user_information">
						<p class="welcome">Hey there,</p>
						<p>testing123@suckmail.co</p>
					</div>
					<div class="account_switcher">
						<ul>
							{#each accounts as account}
								{#if account.email != $mailbox.email}
									<li
										on:click={() =>
											dropdownAction(() => {
												SetMailbox({
													username: account.email,
													password: account.password,
													mailboxNumber: 0,
												});

												AddNotification({
													value: `Switched account to: ${account.email}`,
													timeout: 2000,
													icon: IoMdCheckmark,
												});
											})}
										on:keyup={() => {}}
									>
										<div class="avatar" />
										<p style="margin-left: 10px;">
											{account.email.split("@")[0]}
										</p>
									</li>
								{/if}
							{/each}
						</ul>
					</div>
					<div class="dropdown_options">
						<ul>
							<li
								on:click={() =>
									dropdownAction(() => ShowModel(NewAccount))}
								on:keyup={() => {}}
							>
								<div
									class="icon my-auto"
									style="height: 20px; width: 20px; margin-right: 10px;"
								>
									<FaUserPlus />
								</div>
								Create Account
							</li>
							<li>
								<div
									class="icon my-auto"
									style="height: 20px; width: 20px; margin-right: 10px;"
								>
									<FaSignInAlt />
								</div>
								Login
							</li>
						</ul>
					</div>
					<div class="dropdown_options">
						<ul>
							<li>
								<div
									class="icon my-auto"
									style="height: 20px; width: 20px; margin-right: 10px;"
								>
									<FaTrashAlt />
								</div>
								Delete Mailbox
							</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>

		<div
			on:click={() => GeneratePerminentMailbox()}
			class="my-auto"
			style="height: 30px; margin-left: 10px;"
		>
			<IoIosLogOut />
		</div>
	</div>
</nav>
