import ioClient from 'socket.io-client';

export const io = () => ioClient("http://localhost:4000/");