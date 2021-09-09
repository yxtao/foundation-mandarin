import React, {useEffect, useState} from 'react';
import firebase from '../../firebase/firebase';
import {loginUser} from "../../api/api";
import {Paper, TextField, Typography, Button} from '@material-ui/core';

const SignIn = (props) =>{
    
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({displayName:"guest"});
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const result= loginUser(email,password);
        var currentUser = firebase.auth().currentUser;
        if(currentUser){
           setUser(currentUser);
        }else{
           alert("no user");
        }
    }
  
    return (
        <div>
            <p>welcome {JSON.stringify(user)} </p>
            <Paper>
                <form onSubmit = {handleSubmit}>
                    <TextField 
                        value = {email}
                        onInput = {e => setEmail(e.target.value)}
                        placeholder = "email"
                      />
                      <TextField 
                        value = {password}
                        onInput = {e => setPassword(e.target.value)}
                        placeholder="password"
                      />
                      <Button 
                       type = "submit"
                      > 
                      Sign In
                     </Button>

                </form>
            </Paper>
        </div>
    )
}

export default SignIn;