import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import SocketIoServer from './socket.io';

const app = express();

app.use(cors());

const server = app.listen(4000, () => {
    console.log("cute server uwu started on port 4000");
});

new SocketIoServer(server);