import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {createUserAccount} from "../../api/api";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" 
import {Grid, TextField, Typography, Button} from '@material-ui/core';

const SignUp = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [user, setUser] = useRecoilState(usernameState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
           await createUserAccount({ email,password,userName});
      }catch(error){
          alert(error.response.data);
      }
      var currentUser = firebase.auth().currentUser;
        if(currentUser){
           setUser(currentUser);
           setIsAuthenticated(true);
        }
    }
   
  const handleParentCallback=()=>{
    props.parentCallback();
  }
  
    return (
        <div>
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
                        <TextField 
                        value = {userName}
                        onInput = {e => setUserName(e.target.value)}
                        placeholder="user name"
                      />
                      </Grid>
                      <Grid >
                      <button className="btn btn-primary" 
                       type = "submit"
                      > 
                      Sign Up
                     </button>
                     </Grid>
                     <Grid >
                      <button className="btn btn-primary" onClick={handleParentCallback}> 
                      Sign In
                     </button>
                     </Grid>
                </form>
            </Grid>
        </div>
    )
}

export default SignUp;