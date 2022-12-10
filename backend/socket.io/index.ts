import { Server, Socket } from "socket.io";
import SocketClient from "./client";

class SocketIoServer {
    io: Server;

    clients: Map<string, SocketClient>;

    constructor(server: any) {
        this.clients = new Map();

        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.io.on("connection", this.connection.bind(this));
    }

    connection(socket: Socket) {
        console.log("connected");
        new SocketClient(socket, true, this);
    }
}

export default SocketIoServer;
