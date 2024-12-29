import { Server, Socket } from "socket.io";
import { config } from "../config";
import ImapWrapper from "./imap";
import mailcow from "./posteIO";
import SmtpWrapper from "./smtp";
import {
  getSentMail,
  markAsDeleted,
  storeCreatedInbox,
  storeSentMail,
} from "./db";
import { IEmail, ISentEmail } from "../schemas/mailbox";
import { randomBytes } from "crypto";
import { htmlToText } from "html-to-text";
import randomWords from "random-words";

interface IMailboxPatchData {
  username: string;
  password: string;
}

interface IMailboxDeleteData {
  username: string;
  password: string;
}

interface ISendMailData {
  to: string;
  subject: string;
  body: string;
  username: string;
  password: string;
}

class MailboxSocket {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  initialize() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[SOCKET] New connection from ${socket.handshake.address}`);
      this.handlePatch(socket);
      this.handlePut(socket);
      this.handleDelete(socket);
      this.handleSendMail(socket);
      this.handleDeleteEmail(socket);
    });
  }

  private handlePatch(socket: Socket) {
    socket.on("fetch-mail", async (data: IMailboxPatchData) => {
      const { username, password } = data;
      if (!username || !password) {
        return socket.emit("mailbox-error", {
          error: true,
          status: 400,
          message: "Email or password not provided!",
        });
      }

      const imap = new ImapWrapper(username, password);

      imap.on("ready", async (cli) => {
        const inbox = (await cli
          .fetchMessagesSync()
          .then((res) => res)
          .catch((err) => {
            return null;
          })) as IEmail[];

        imap.imap.end();

        let sent: ISentEmail[] = await getSentMail(username);
        if (inbox == null) {
          return socket.emit("mailbox-response", { inbox: [], sent: sent });
        }

        inbox.forEach((email) => {
          email.body = htmlToText(email.body, {
            preserveNewlines: true,
          });
        });

        return socket.emit("mailbox-response", {
          inbox,
          sent,
        });
      });

      imap.on("error", (e: any) => {
        console.error(`[IMAP Fetch Error] ` + e);
        return socket.emit("mailbox-error", {
          error: true,
          status: 401,
          message: "Unauthorized",
        });
      });
    });
  }

  private handlePut(socket: Socket) {
    socket.on("new-mailbox", async () => {
      const username = `${randomWords(1)}.${randomBytes(3).toString("hex")}`;
      const password = `${randomBytes(22).toString("hex")}`;

      let randomDomain =
        config.domains[Math.floor(Math.random() * config.domains.length)];

      const ip = socket.handshake.address || "";

      await storeCreatedInbox(
        `${username}@${randomDomain}`,
        password,
        new Date(),
        ip
      );

      return socket.emit("mailbox-response", {
        error: false,
        status: 200,
        email: `${username}@${randomDomain}`,
        password: password,
      });
    });
  }

  private handleDelete(socket: Socket) {
    socket.on("mailbox-delete", async (data: IMailboxDeleteData) => {
      const { username, password } = data;
      if (!username || !password) {
        return socket.emit("mailbox-error", {
          error: true,
          status: 400,
          message: "Email or password not provided!",
        });
      }

      const mailcowRes = await mailcow.deleteMailbox(username);

      if (!mailcowRes) {
        return socket.emit("mailbox-error", {
          error: true,
          status: 500,
          message: "Internal server error!",
        });
      }

      await markAsDeleted(username);

      return socket.emit("mailbox-response", {
        error: false,
        status: 200,
        success: true,
      });
    });
  }

  private handleSendMail(socket: Socket) {
    socket.on("send-mail", async (data: ISendMailData) => {
      const username = data.username;
      const password = data.password;

      if (!username || !password) {
        return socket.emit("send-mail-error", {
          error: true,
          status: 401,
          message: "Missing authentication headers",
        });
      }

      const { to, subject, body } = data;

      if (!to || !subject || !body) {
        return socket.emit("send-mail-error", {
          error: true,
          status: 400,
          message: "Missing required body fields",
        });
      }

      const ip = socket.handshake.address || "";

      const smtp = new SmtpWrapper(username, password);

      smtp
        .sendMail(to, subject, body)
        .then(async () => {
          await storeSentMail(username, to, subject, body, ip);

          return socket.emit("send-mail-response", {
            error: false,
            status: 200,
            message: "Email sent successfully",
          });
        })
        .catch((error) => {
          console.error(error);
          return socket.emit("send-mail-error", {
            error: true,
            status: 500,
            message: "Failed to send email",
          });
        });
    });
  }

  private handleDeleteEmail(socket: Socket) {
    socket.on("delete-email", async (data: any) => {
      const username = data.username;
      const password = data.password;
      const id = data.id;

      if (!username || !password) {
        return socket.emit("delete-email-error", {
          error: true,
          status: 401,
          message: "Missing authentication headers",
        });
      }

      if (!id) {
        return socket.emit("delete-email-error", {
          error: true,
          status: 400,
          message: "Missing message id",
        });
      }

      const imap = new ImapWrapper(username, password);

      imap.on("ready", async (cli) => {
        cli.deleteMessage(id).then(() => {
          return socket.emit("delete-email-response", {
            error: false,
            status: 200,
            message: "Email deleted successfully",
          });
        });
      });

      imap.on("error", (err: any) => {
        console.error(err);
        return socket.emit("delete-email-error", {
          error: true,
          status: 500,
          message: "Failed to delete email",
        });
      });
    });
  }
}

export default MailboxSocket;
