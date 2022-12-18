<script lang="ts">    
    import IoIosLogOut from 'svelte-icons/io/IoIosLogIn.svelte';
	import IoMdMail from 'svelte-icons/io/IoMdMail.svelte';
	import IoMdSave from 'svelte-icons/io/IoMdSave.svelte';

    import { GeneratePerminentMailbox, mailbox } from '../stores/mailbox';
</script>

<nav class="navbar_container">
    <div style="display: flex;">
        <div
            style="height: 20px; margin-top: auto; margin-bottom: auto; margin-right: 7px;"
        >
            <IoMdMail />
        </div>
        <h1>{$mailbox.email ? $mailbox.email : "loading.."}</h1>
    </div>
    <div class="right_sidebar">
        <div on:click="{() => GeneratePerminentMailbox()}" style="height: 25px; margin-left: 10px;">
            <IoIosLogOut />
        </div>
        <div style="height: 25px; border-radius: 50px; margin-left: 10px;">
        </div>
    </div>
</nav>