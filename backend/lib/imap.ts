import Imap from "imap";
import { EventEmitter } from "events";
import { inspect } from "util";
import { simpleParser } from "mailparser";
import { createHash } from "crypto";

interface Attachments {
    type: string;
    internal_safe_url: string;
}

interface Mail {
    from: string;
    to: string;
    date: Date;
    subject: string;
    body: string;
    attachments: Attachments[];
}

declare interface ImapWrapper {
    on(event: "ready", listener: (imap: this) => void): this;
    on(event: "messageReceived", listener: (message: Mail) => void): this;
    on(event: string, listener: Function): this;
}

class ImapWrapper extends EventEmitter {
    username: string;
    password: string;
    imap: Imap;
    messages: Map<string, Mail>;

    constructor(username: string, password: string) {
        super();

        this.username = username;
        this.password = password;

        this.messages = new Map();

        this.imap = new Imap({
            user: this.username,
            password: this.password,
            host: process.env.IMAP_HOST,
            port: parseInt(process.env.IMAP_PORT || "443"),
            tls: false,
            autotls: "required",
        });

        this.imap.once("ready", this.ready.bind(this));

        this.imap.connect();
    }

    private openInbox(callback: (error: Error, mailbox: Imap.Box) => void) {
        this.imap.openBox("INBOX", true, callback);
    }

    fetchMessages() {
        this.openInbox((err, box) => {
            if (err) return;

            console.log(box.messages);

            let fetch = this.imap.seq.fetch("1:*", {
                bodies: "",
            });

            fetch.on("message", (msg, seqno) => {
                msg.on("body", (stream, info) => {
                    simpleParser(stream, (err, mail) => {
                        if (err) return;

                        const uniqueHash = createHash("md5")
                            .update(
                                `${mail.textAsHtml}${mail.date}${mail.subject}`
                            )
                            .digest("hex");

                        if (this.messages.get(uniqueHash)) return;

                        const mail_: Mail = {
                            attachments: [],
                            body: mail.textAsHtml || "",
                            date: mail.date || new Date(),
                            from: mail.from?.text || "",
                            subject: mail.subject || "",
                            //@ts-ignore
                            to: mail.to.text || "",
                        };

                        this.emit("messageReceived", mail_);

                        this.messages.set(uniqueHash, mail_);
                    });
                });
            });
        });
    }

    private ready() {
        this.fetchMessages();
        this.emit("ready", this);
    }
}

export default ImapWrapper;