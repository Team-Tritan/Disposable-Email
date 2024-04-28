import Imap from "imap";
import { EventEmitter } from "events";
import { inspect } from "util";
import { ParsedMail, simpleParser } from "mailparser";
import { createHash } from "crypto";
import { config } from "../config";

interface Attachments {
  type: string;
  name: string;
  checksum: string;
  id: string;
}

export interface Mail {
  id: string;
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
      host: config.imapServer,
      port: parseInt(config.imapPort || "143"),
      tls: false,
      autotls: "required",
    });

    this.imap.once("ready", this.ready.bind(this));
    this.imap.once("error", (err: any) => this.emit("error", err));
    //this.imap.once("end", () => console.log("we closed the connection!"));

    this.imap.connect();
  }

  private openInbox(callback: (error: Error, mailbox: Imap.Box) => void) {
    this.imap.openBox("INBOX", true, callback);
  }

  async fetchMessageById(id: string): Promise<ParsedMail | null> {
    return new Promise((resolve, reject) => {
      this.openInbox((err, box) => {
        if (err) return;

        this.imap.seq.search([["HEADER", "MESSAGE-ID", id]], (err, uids) => {
          if (err) return;

          const fetch = this.imap.fetch(uids, { bodies: "" });

          fetch.on("message", (msg, seqno) => {
            msg.on("body", (stream, info) => {
              simpleParser(stream, (err, mail) => {
                if (err) return;
                resolve(mail);
              });
            });
          });

          fetch.on("error", () => {
            console.log("lmfaoo");
          });
        });
      });
    });
  }

  fetchMessagesSync() {
    return new Promise((resolve, reject) => {
      this.openInbox((err, box) => {
        if (err) return reject(err);

        let messages: Mail[] = [];

        //We have a message count because 'fetch.on('end')' dosent wait for the code inside msg.body to run.
        let messageCount = 0;

        let fetch = this.imap.seq.fetch("1:*", {
          bodies: "",
        });

        fetch.on("message", (msg, seqno) => {
          msg.on("body", (stream, info) => {
            messageCount++;
            simpleParser(stream, (err, mail) => {
              const mail_: Mail = {
                id: mail.messageId || "",
                attachments:
                  mail?.attachments?.map((i) => ({
                    type: i.type,
                    name: i.filename || "file",
                    checksum: i.checksum,
                    id: i.checksum,
                  })) || [],
                body: mail.textAsHtml || "",
                date: mail.date || new Date(),
                from: mail.from?.text || "",
                subject: mail.subject || "",
                //@ts-ignore
                to: mail.to.text || "",
              };

              messages.push(mail_);

              if (messages.length == messageCount) resolve(messages);
            });
          });

          msg.on("error", (err: any) => reject(err));
        });

        fetch.on("error", (err) => reject(err));
      });
      console.log(this.messages);
    });
  }

  fetchMessages() {
    this.openInbox((err, box) => {
      if (err) return;

      let fetch = this.imap.seq.fetch("1:*", {
        bodies: "",
      });

      fetch.on("message", (msg, seqno) => {
        msg.on("body", (stream, info) => {
          simpleParser(stream, (err, mail) => {
            if (err) return;

            const uniqueHash = createHash("md5")
              .update(`${mail.textAsHtml}${mail.date}${mail.subject}`)
              .digest("hex");

            if (this.messages.get(uniqueHash)) return;

            const mail_: Mail = {
              id: mail.messageId || "",
              attachments:
                mail?.attachments?.map((i) => ({
                  type: i.type,
                  name: i.filename || "file",
                  checksum: i.checksum,
                  id: i.checksum,
                })) || [],
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

      fetch.on("error", (e) => {});

      fetch.on("end", () => this.emit("finishFetch"));
    });
  }

  private ready() {
    this.fetchMessages();
    this.emit("ready", this);
  }
}

export default ImapWrapper;
