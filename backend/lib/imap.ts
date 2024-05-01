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
              simpleParser(stream.read().toString(), (err, mail) => {
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

        let messagePromises: Promise<Mail>[] = [];

        this.imap.seq.search(["ALL"], (err, uids) => {
          if (err) throw err;

          if (uids.length === 0) {
            return resolve([]);
          }

          let sortedUids = uids.sort((a, b) => b - a);

          try {
            let fetch = this.imap.seq.fetch(sortedUids, {
              bodies: "",
            });

            fetch.on("message", (msg, seqno) => {
              let messageData = "";
              msg.on("body", (stream, info) => {
                stream.on("data", (chunk) => {
                  messageData += chunk.toString("utf8");
                });
                stream.once("end", () => {
                  let messagePromise = new Promise<Mail>((resolve, reject) => {
                    simpleParser(messageData, (err, mail) => {
                      if (err) return reject(err);

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
                        // @ts-ignore
                        to: mail.to.text || "",
                      };

                      resolve(mail_);
                    });
                  });

                  messagePromises.push(messagePromise);
                });
              });

              msg.on("error", (err: any) => reject(err));
            });

            fetch.once("end", () => {
              Promise.all(messagePromises)
                .then((messages) => resolve(messages))
                .catch((err) => reject(err));
            });

            fetch.on("error", (err) => reject(err));
          } catch (e) {}
        });
      });
    });
  }

  // maybe?
  deleteMessage(id: string) {
    return new Promise<void>((resolve, reject) => {
      this.openInbox((err, box) => {
        if (err) return reject(err);

        this.imap.seq.search([["HEADER", "MESSAGE-ID", id]], (err, uids) => {
          if (err) return reject(err);

          if (uids.length === 0) {
            return resolve();
          }

          this.imap.seq.addFlags(uids, "\\Deleted", (err) => {
            if (err) return reject(err);

            this.imap.expunge((err) => {
              if (err) return reject(err);

              resolve();
            });
          });
        });
      });
    });
  }

  private ready() {
    this.fetchMessagesSync();
    this.emit("ready", this);
  }
}

export default ImapWrapper;
