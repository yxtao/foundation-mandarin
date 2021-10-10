import React, {useEffect, useState} from 'react';
import firebase from '../../firebase/firebase';
import {loginUser} from "../../api/api";
import {Grid, TextField, Typography, Button, Paper} from '@material-ui/core';

import "./SignInUp.css";

const SignIn = (props) =>{
    
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({displayName:"guest"});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{ 
            await loginUser(email,password);
            var currentUser = firebase.auth().currentUser;
            setUser(currentUser);
        }catch(error){
           alert(error);
        }
    }
   const handleParentCallback =()=>{
       props.parentCallback()
   }
    return (
        <div> {user.displayName}
            <div className="login-background">
            <Grid container justify="center" wrap="wrap" spacing={2} className="login-form">
                <form onSubmit = {handleSubmit}>
                    <Grid item>
                    <TextField 
                        value = {email}
                        onInput = {e => setEmail(e.target.value)}
                        placeholder = "email"
                      />
                    </Grid>
                    <Grid item>
                      <TextField 
                        value = {password}
                        onInput = {e => setPassword(e.target.value)}
                        placeholder="password"
                      />
                    </Grid>
                    <Grid item>
                        <button className="btn btn-primary" type = "submit"> 
                        Sign In
                        </button>
                     </Grid>
                     <Grid item>  
                        <button className="btn btn-primary" onClick={handleParentCallback}> 
                        Sign up
                        </button>
                     </Grid>
                </form>
            </Grid>
            </div>
        </div>
    )
}

export default SignIn;