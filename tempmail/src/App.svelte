<script lang="ts">
    import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
    import IoMdSave from 'svelte-icons/io/IoMdSave.svelte'
    import IoMdMail from 'svelte-icons/io/IoMdMail.svelte';
    import Placeholder from './lib/PlaceholderMessage.svelte';
    import MailContainer from './lib/Mailbox/MailboxContainer.svelte';
    import { inbox } from './stores/mailbox';
    
    let inbox_ = [];

    inbox.subscribe(e => {
        inbox_ = e;
    })

</script>

<main class="main_container">
    <nav class="navbar_container">
        <div style="display: flex;">
            <div style="height: 20px; margin-top: auto; margin-bottom: auto; margin-right: 7px;">
                <IoMdMail />
            </div>
            <h1>something@tritan.dev</h1>
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
    <div class="inbox_container">
        {#if inbox_.length == 0}
            <Placeholder />
        {:else}
            <MailContainer />
        {/if}
    </div>
    <div class="footer">
        <p>Abuse - TOS - Privacy Policy</p>
    </div>
</main>