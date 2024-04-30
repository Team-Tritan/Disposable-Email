import "dotenv/config";
import express from "express";
import cors from "cors";
import SocketIoServer from "./socket.io";
import MailboxRoutes from "./routes/mailbox";
import { config } from "./config";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.disable("x-powered-by");
app.use(express.json());
app.use("/api/mailbox", MailboxRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({
    error: true,
    code: 404,
    message: "Route not found",
  });
});

const server = app.listen(config.port, () => {
  console.log("> API started on port 4000");
});

new SocketIoServer(server);
