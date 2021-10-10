import React, {useEffect, useState} from 'react';
import firebase from '../../firebase/firebase';
import {createUserAccount} from "../../api/api";
import {Grid, TextField, Typography, Button} from '@material-ui/core';

const SignUp = (props) =>{
    
    const [email, setEmail]= useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [user, setUser] = useState({displayName:"guest"});

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