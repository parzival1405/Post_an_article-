import React, { useState } from 'react'
import { Container, Avatar, Button, Paper, Grid, Typography } from '@material-ui/core'
import {GoogleLogin} from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from './styles'
import { useHistory } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import Input from './Input'
import Icon from './Icon'
import {signup,signin} from '../../actions/auth'

const initialState = {
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:'',
}

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup){
            dispatch(signup(formData,history))
        }else{
            dispatch(signin(formData,history))
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const googleSucsess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({type: 'AUTH',data: {result,token}});
            history.push('/')
        } catch (error) {
            console.log(error);
        }
    }
    const googleFailure = (error) => {
        console.log(error);
        console.log('Sign in with gg failure')
    }

    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon className={classes.lock} />
                </Avatar>
                <Typography variant='h5'>{isSignup ? 'Sign up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2} >
                        {
                            isSignup && (
                                <>
                                    <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                                    <Input name='lastName' label='Last Name' handleChange={handleChange} autoFocus half />

                                </>
                            )
                        }
                        <Input name='email' label='Email address' handleChange={handleChange} type='email' />
                        <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && (<Input name='confirmPassword' label='Confirm Password' handleChange={handleChange} type='password' />)}
                    </Grid>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Sign up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId='229039514221-otjitmt8od31qigv8slv2pef6hg3kg1i.apps.googleusercontent.com'
                        render={(renderProps) => (
                            <Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} variant='contained'>Google Sign In</Button>
                        )}
                        onSuccess={googleSucsess}
                        onFailure={googleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    <Grid container justify='flex-end'>
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already have an account? Sign In ' : "Don't have an account? Sign up "}
                        </Button>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;


