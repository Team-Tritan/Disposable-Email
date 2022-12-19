import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import SocketIoServer from './socket.io';
import MailboxRoutes from './routes/mailbox';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mailbox", MailboxRoutes);

const server = app.listen(4000, () => {
    console.log("cute server uwu started on port 4000");
});

new SocketIoServer(server);