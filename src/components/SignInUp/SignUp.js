import React, { useState} from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import {createUserAccount, loginUser} from "../../api/api";
import { checkedAuthState, usernameState, firebaseState } from "../../store/AuthAtoms" 
import {Grid, TextField} from '@material-ui/core';

import firebase from '../../firebase/firebase';

const SignUp = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const db = firebase.firestore();
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [user, setUser] = useRecoilState(usernameState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);

    const checkUsernameExist = async (username) =>{
      const userRef = db.collection("users").doc(username);
      try {
        const doc = await userRef.get();
        if(doc.exists){ 
          alert("username has taken");
          return true;
         }else{
          return false;
        }
      }catch(error){
        alert(error);
      }
    }

    const addAdultUser = async(username,password,email)=>{
      await db.collection("users").doc(username).set({
        username,
        password,
        email,
        isadult:true
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      let alreadyTaken = true;
      try{
        alreadyTaken = await checkUsernameExist(userName);
      }catch(error){
        alert(error);
      }
      if(!alreadyTaken){  
        try{
          await addAdultUser(userName,password,email);
          await createUserAccount({ email,password,userName});
          alert("sucess");
        }catch(error){
          // alert(error.response.data);
          alert(error);
        }
        await loginUser(email,password);
        var currentUser = firebase.auth().currentUser;
        if(currentUser){
        setUser(currentUser.displayName);
        setIsAuthenticated(true); 
        }
      }
    } 
  const handleParentCallback=()=>{
    props.parentCallback();
   }
  
    return (
        <div>
            <Grid container justify="center" wrap="wrap" spacing={2} className="login-form">
                <form onSubmit ={handleSubmit}>
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