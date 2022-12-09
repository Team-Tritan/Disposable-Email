<script lang="ts">
    import { inbox } from "../../stores/mailbox";

    let inbox_ = [];

    inbox.subscribe(e => { 
        console.log(e);
        inbox_ = e 
    });

    console.log(inbox_);
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
        {#each inbox_ as { from, subject, body }}
            <tr class="mailbox_container_row">
                <td style="font-weight: 600; padding-left: 10px;">{from.split(" ")[0]}</td>
                <td class="mailbox_row_content"><p><span style="font-weight: 600;">{subject}</span> - {body}</p></td>
                <td style="padding-left: 15px; text-align: right; padding-right: 25px;"><span>02:56 - 8/12/2022</span></td> 
            </tr>
        {/each}
    </tbody>
</table>