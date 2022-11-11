import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import useStyles from './styles';

import { commentPost } from '../../actions/posts'

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const user = JSON.parse(sessionStorage.getItem('profile'));
    const dispatch = useDispatch();
    const commentRef = useRef();    

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`;
        const newComment = await dispatch(commentPost(finalComment, post._id));
        setComments(newComment);
        setComment('');

        commentRef.current.scrollIntoView({ behavior: 'smooth' });
    }


    return (
        <div>
            <Typography gutterBottom variant='h6'>comment</Typography>
            <div className={classes.commentsOuterContainer} >
                <div className={classes.commentsInnerContainer} >
                    {comments.map((c, i) => (
                        <Typography key={i} variant='subtitle1'>
                            <strong>{c.split(': ')[0]}</strong>:
                            {c.split(':')[1]}
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
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button style={{ marginTop: '10px' }} color='primary' fullWidth disabled={!comment} variant='contained' onClick={handleClick}>
                            Comment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection;
