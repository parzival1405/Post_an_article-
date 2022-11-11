import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { RealtimeChatPost } from '../../actions/posts'
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
// import Pusher from 'pusher-js';

import useStyles from './styles';

let socket;
const RealtimeChat = ({ post }) => {

    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(sessionStorage.getItem('profile'));
    const commentRef = useRef();
    const ENDPOINT = 'localhost:5000';
    const [pesonInTheRoom, setPesonInTheRoom] = useState(0);
    const { id } = useParams();
    const name = user?.result.name;


    useEffect(() => {
        socket = io(ENDPOINT, { transports: ['websocket'] });

        socket.emit('join', { name, id }, (error) => {
            if (error) {
                alert(error);
            }
        });

        socket.on('roomData', ({ users }) => {
            const count = users.length;
            setPesonInTheRoom(count);

        })

        return () => {
            socket.disconnect();
            socket.off();
        }

    }, [id])

    console.log(message, messages);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
            // console.log(messages);
        })
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit('sendMessage', { message }, () => setMessage(''))
        }
    }

    // const pusher = new Pusher('79aefb9f20b6c8d4da04', {
    //     cluster: 'ap1'
    // });

    return (

        <div>
            <Typography gutterBottom variant='h6'>Realtime Chat:</Typography>
            <Typography gutterBottom variant='h6'>Person in the room Chat: {pesonInTheRoom}</Typography>
            <div className={classes.commentsOuterContainer} >
                <div className={classes.commentsInnerContainer} >
                    
                    {messages.map((c, i) => (
                        <Typography key={i} variant='subtitle1'>
                            {name.toLowerCase() === c.user ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div>
                                        {c.text}:
                                        <strong>{c.user}</strong>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div>
                                        <strong>{c.user}</strong>:
                                        {c.text}
                                    </div>
                                </div>
                            )
                            }
                        </Typography>
                    ))}
                    <div ref={commentRef} />
                </div>
                {user?.result.name && (
                    <div style={{ width: '50%' }}>
                        <Typography gutterBottom variant='h6'>Write a Comment</Typography>
                        <TextField
                            fullWidth
                            rows={4}
                            variant='outlined'
                            label='comment'
                            multiline
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} color='primary' fullWidth variant='contained'
                            onClick={(e) => sendMessage(e)}
                        >
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RealtimeChat;