import React, {useEffect, useState} from 'react';
import {loginUser} from "../../api/api";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" 
import {Grid, TextField, Typography, Button, Paper} from '@material-ui/core';
import "./SignInUp.css";

const SignIn = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useRecoilState(usernameState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{ 
            await loginUser(email,password);
            var currentUser = firebase.auth().currentUser;
            setUser(currentUser.displayName); 
            setIsAuthenticated(true);
        }catch(error){
           alert(error);
        }
    }
   const handleParentCallback =()=>{
       props.parentCallback()
   }
    return (
        <div>
            <div className="container">   
            <Grid container justify="center" wrap="wrap" spacing={3} className="login-form">
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
                        <button className="btn btn-outline-success" type = "submit"> 
                         log in 
                        </button>
                     </Grid>
                </form>
            </Grid>
            </div>
        </div>
    )
}

export default SignIn;