import "dotenv/config";
import express from "express";
import cors from "cors";
import SocketIoServer from "./socket.io";
import MailboxRoutes from "./routes/mailbox";
import { config } from "./config";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mailbox", MailboxRoutes);

const server = app.listen(config.port, () => {
  console.log("> API started on port 4000");
});

new SocketIoServer(server);
