import React, {useEffect, useState} from 'react';
import firebase from '../../firebase/firebase';
import {createUserAccount} from "../../api/api";
import {Paper, TextField, Typography, Button} from '@material-ui/core';

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
      
        const res = await createUserAccount({
                          email,
                          phoneNumber,
                          password,
                          firstName,
                          lastName,
                          userName,
                      });
        if(res.error){
          alert(res.error);
        }
    

      var currentUser = firebase.auth().currentUser;
        if(currentUser){
           setUser(currentUser);
        }
    }
   
    return (
        <div>
          {user.displayName} 
            <Paper>
                <form onSubmit = {handleSubmit}>
                    <TextField 
                        value = {email}
                        onInput = {e => setEmail(e.target.value)}
                        placeholder = "email"
                      />
                      <TextField 
                        value = {phoneNumber}
                        onInput = {e => setPhoneNumber(e.target.value)}
                        placeholder ="phone number"
                      />
                      <TextField 
                        value = {password}
                        onInput = {e => setPassword(e.target.value)}
                        placeholder="password"
                      />
                      <TextField 
                        value = {firstName}
                        onInput = {e => setFirstName(e.target.value)}
                        placeholder="first name"
                      />
                      <TextField 
                        value = {lastName}
                        onInput = {e => setLastName(e.target.value)}
                        placeholder="last name"
                      />
                        <TextField 
                        value = {userName}
                        onInput = {e => setUserName(e.target.value)}
                        placeholder="user name"
                      />
                      <Button 
                       type = "submit"
                      > 
                      Sign Up
                     </Button>

                </form>
            </Paper>
        </div>
    )
}

export default SignUp;