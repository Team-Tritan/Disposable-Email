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

        this.socket.on("disconnect", this.onDisconnect.bind(this)) 
        this.generateMailbox();
    }

    async generateMailbox() {
        console.log("hi");
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
