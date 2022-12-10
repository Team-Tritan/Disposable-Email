<script>
    import { models } from "../stores/models";
    import { inbox } from "../stores/mailbox";
    import IoMdArrowBack from 'svelte-icons/io/IoMdArrowBack.svelte'
	import IoMdMail from "svelte-icons/io/IoMdMail.svelte";

    var currentMail = $inbox.find(i => i.id == $models.mailView);

    const goBack = () => {
        models.update(e => ({ ...e, mailView: null }));
    }
</script>

<div class="mailview_container">
    <div>
        <div class="flex" on:click={goBack}>
            <div style="height: 20px; display: flex; margin-top: auto; width: fit-content; margin-bottom: auto; margin-right: 7px;" >
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
                <div class="sender_profile my-auto">

                </div>
                <div class="my-auto">
                    <h1>{currentMail.from.split("<")[0]}</h1>
                    <p class="flex">
                        <span class="my-auto" style="height: 18px; margin-right: 9px;">
                            <IoMdMail />
                        </span>
                        <span class="my-auto" style="font-size: 0.9rem">{currentMail.from.split("<")[1].replace("<", "").replace(">", "")}</span>
                    </p>
                </div>
            </div>

            <iframe class="mail_iframe" srcdoc="{currentMail.body}" title="mail contnet" />
        </div>
    </div>
</div>