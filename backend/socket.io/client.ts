import { Socket } from "socket.io";
import SocketIoServer from ".";
import ImapWrapper, { Mail } from "../lib/imap";
import { randomBytes } from "crypto";
import randomWords from "random-words";
import Mailcow from "../lib/mailcow";

class SocketClient {
    email: string;
    password: string;
    socket: Socket;
    isMasterSession: boolean;
    imap?: ImapWrapper;
    server: SocketIoServer;

    constructor(
        socket: Socket,
        isMasterSession: boolean,
        server: SocketIoServer
    ) {
        this.server = server;
        this.socket = socket;
        this.isMasterSession = isMasterSession;

        this.email = `${randomWords(1)}${randomBytes(4).toString("hex")}`;
        this.password = `S${randomBytes(9).toString("hex")}A2!`;

        this.socket.on("refresh", this.onMailRefresh.bind(this));
        this.socket.on("disconnect", this.onDisconnect.bind(this));

        this.socket.on("fetchAttachment", this.fetchAttachment.bind(this));

        this.generateMailbox();
    }

    async fetchAttachment(mailId: string, attachmentId: string) {
        let message = await this.imap?.fetchMessageById(mailId);


        console.log(message);

        if(message == null)
            return;
        
        const attachment = message.attachments.find(i => i.checksum == attachmentId);

        console.log(attachment);

        if(!attachment)
            return;
            
        this.socket.emit(`${attachmentId}_inc`, attachment.content.toString("base64"));
    }

    async generateMailbox() {
        const mailcow = new Mailcow(process.env.MAILCOW_API_KEY as string);

        const res = await mailcow.createMailbox({
            domain: "suckmail.co",
            forcePwUpdate: "0",
            quota: "0",
            name: this.email,
            password: this.password,
        });

        console.log(res);

        if (!res) {
            this.socket.emit("mailServerError");
            this.socket.disconnect(true);
        }

        this.imap = new ImapWrapper(`${this.email}@suckmail.co`, this.password);

        this.imap.on("messageReceived", this.messageReceived.bind(this));
        this.imap.on("ready", () => this.socket.emit("imapConnected", this.email+"@suckmail.co", this.password));
    }

    setMasterSession(masterSession: boolean) {
        this.isMasterSession = masterSession;
        this.socket.emit("masterSessionUpdate", masterSession);
    }

    messageReceived(msg: Mail) {
        this.socket.emit("messageReceived", msg);
    }

    onMailRefresh() {
        if(this.imap?.imap.state == "authenticated")
            this.imap.fetchMessages();
    }

    async onDisconnect() {
        const mailcow = new Mailcow(process.env.MAILCOW_API_KEY as string);

        await mailcow.deleteMailbox(`${this.email}@suckmail.co`);
        console.log("disconnected");
    }
}

export default SocketClient;
