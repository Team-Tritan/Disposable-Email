<script>
    import { models } from "../stores/models";
    import { inbox } from "../stores/mailbox";
    import IoMdArrowBack from 'svelte-icons/io/IoMdArrowBack.svelte'
	import IoMdMail from "svelte-icons/io/IoMdMail.svelte";
	import { io } from "../webSocketConnection";
	import { onMount } from "svelte";

    let currentMail = $inbox.find(i => i.id == $models.mailView);
    let bodyIframe;

    const goBack = () => {
        models.update(e => ({ ...e, mailView: null }));
    }


    const onFrameLoad = (e) => {
        let doc = bodyIframe.contentDocument;

        doc.body.innerHTML = doc.body.innerHTML + `
        <style>
            @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

            * {
                font-family: "IBM Plex Sans";
            }

            body {
                background-color: #2b2d2a;    
                color: white;
            }
        </style>
        `;
    }



    const fetchAttachment = (id) => {
        io.emit("fetchAttachment", currentMail.id, id);

        console.log(bodyIframe);

        io.on(`${id}_inc`, function (e) {

            console.log(bodyIframe);
            let doc = bodyIframe.contentDocument;

            console.log("aaa");

            doc.body.innerHTML = doc.body.innerHTML + `
                <img src='data:image/jpeg;base64,${e}' />
            `;


            io.removeListener(`${id}_inc`);
        })
    }


    // onMount(() => {
    //     io.emit("fetchAttachment", currentMail.id, currentMail.attachments[0].id);

    //     io.on(`${currentMail.attachments[0].id}_inc`, (e) => {
    //         let doc = bodyIframe.contentDocument;

    //         console.log("aaa");

    //         doc.body.innerHTML = doc.body.innerHTML + `
    //             <img src='data:image/jpeg;base64,${e}' />
    //         `;
        
    //     })
    // });
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

            <iframe class="mail_iframe" bind:this={bodyIframe} on:load="{onFrameLoad}" srcdoc="{currentMail.body}" title="mail contnet" />

            <div>
                <p style="margin-top: 10px;">Attachments</p>
                {#each currentMail.attachments as attachment}
                    <div on:click={() => fetchAttachment(attachment.id)} on:keydown={() => {}} on:keydown={() => {}} style="min-width: 250px; width: fit-content; background-color: #2b2d2a; border-radius: 10px; margin-top: 5px; padding: 10px;">
                        {attachment.name}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>