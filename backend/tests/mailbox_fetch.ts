import 'dotenv/config';
import ImapWrapper from "../lib/imap";

const imap = new ImapWrapper("", "");

imap.on("messageReceived", (m) => {
    console.log(m);
});

imap.on("ready", () => {
    imap.fetchMessages(); 
});