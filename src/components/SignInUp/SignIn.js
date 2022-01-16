import React, {useEffect, useState} from 'react';
import {loginUser} from "../../api/api";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState, userIdState} from "../../store/AuthAtoms" 
import {Grid, TextField, Typography, Button, Paper} from '@material-ui/core';
import "./SignInUp.css";

const SignIn = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useRecoilState(usernameState);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [error, setError] = useState("");
    const [disabled, setDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        try{ 
            await loginUser(email,password);
            var currentUser = firebase.auth().currentUser;
            setUser(currentUser.displayName); 
            setUserId(currentUser.uid);
            setIsAuthenticated(true);
        }catch(error){
            setError(JSON.stringify(error.message));
            setDisabled(false);
        }   
    }
    return (
        <div>
            <div className="container">   
            <Grid container justifyContent="center" wrap="wrap" spacing={3} className="login-form">
                <form onSubmit = {handleSubmit}>
                    <br/>
                    <Grid item>
                    <TextField 
                        value = {email}
                        onInput = {e => setEmail(e.target.value)}
                        placeholder = "email"
                      />
                    </Grid>
                    <br/>
                    <Grid item>
                      <TextField 
                        value = {password}
                        onInput = {e => setPassword(e.target.value)}
                        placeholder="password"
                      />
                    </Grid>
                    <br/>
                    <Grid item>
                        <button className="btn btn-outline-success login-btn" type = "submit" disabled={disabled}> 
                         log in 
                        </button>
                     </Grid>
                </form>
            </Grid>
              <div className="text-danger p-lg-3">{error}</div>   
            </div>
        </div>
    )
}

export default SignIn;