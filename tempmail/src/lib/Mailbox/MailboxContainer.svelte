<script lang="ts">
    import { mailbox } from "../stores/mailbox";
	
    const setCurrentMailView = (id: string) => {
        console.log(id);
        mailbox.update(e => ({ ...e, currentlySelectedEmail: id }));
    }
</script>

<table class="mailbox_container"> 
    <thead>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </thead>
    <tbody>
        {#each $mailbox.inbox as { from, subject, body, id, date }}
            <tr class="mailbox_container_row" on:click="{setCurrentMailView(id)}">
                <td style="font-weight: 600; padding-left: 10px;">{from.split(" ")[0]}</td>
                <td class="mailbox_row_content"><p><span style="font-weight: 600;">{subject}</span> - {body}</p></td>
                <td style="padding-left: 15px; text-align: right; padding-right: 25px;"><span>{new Date(date).toLocaleString("en-US")}</span></td> 
            </tr>
        {/each}
    </tbody>
</table>