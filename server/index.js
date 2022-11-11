import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import {createServer } from "http";


import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

import { addUser, removeUser, getUser, getUsersInRoom } from './users.js'

const app = express();
dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

io.on('connection', (socket) => {
    console.log('new conection')

    socket.on('join', ({ name, id }, callback) => {
        console.log(name, id);
        const { error, user } = addUser({ idUser: socket.id, name, id });

        if (error) {
            callback(error);
            return;
        }

        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.id}` });

        socket.broadcast.to(user.id).emit('message', { user: 'admin', text: `${user.name} has joined` });

        socket.join(user.id);

        io.to(user.id).emit('roomData', {room:user.id, users : getUsersInRoom(user.id)});
        callback();
    })

    socket.on('sendMessage', ({ message },callback) => {
        const user = getUser(socket.id);

        io.to(user.id).emit('message', { user: user.name, text: message });

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.id).emit('message', { user: 'admin', text: `${user.name} has left` });
            io.to(user.id).emit('roomData', {users : getUsersInRoom(user.room)});
        }
    })
})

app.get('/', (req, res) => {
    res.send('welcome :)');
});

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => httpServer.listen(PORT, () => console.log(`server running onport : ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);


