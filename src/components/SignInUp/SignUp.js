import React, { useState} from 'react';
import { useRecoilValue, useRecoilState, waitForAllSettled } from "recoil";
import {createUserAccount, loginUser} from "../../api/api";
import { checkedAuthState, usernameState, firebaseState, userIdState } from "../../store/AuthAtoms" 
import {Grid, TextField} from '@material-ui/core';


const SignUp = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const db = firebase.firestore();
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useRecoilState(userIdState);
    const [user, setUser] = useRecoilState(usernameState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [isClicked, setIsClicked] = useState(false);
    const [error, setError] = useState("");
    const addUser = async(username,password,email, uid)=>{
      await db.collection("users").doc(uid).set({
        uid,
        username,
        password,
        email,
        likedWordCards:[],
        likedPassages:[],
        //TODO CHANGE TO accessCodes
        accessCode:[],
        isTeacher: true,
        isAdmin: false
      })
    }
    const isNameValid = (name) =>{
      return /^[0-9a-zA-Z]+$/.test(name);
    }
    const handleSubmit = async (e) => {
      setIsClicked(true);
      e.preventDefault();
      if(!isNameValid(userName)){
        setError("User name is not valid, can only contain numbers and letters.")
        setIsClicked(false);
        return;
      }
      try{
         await createUserAccount({ email,password,userName}); 
      }catch(error){
        setError(error.response.data.message);
        setIsClicked(false);
        return;
      }
      try{
        await loginUser(email,password);
      }catch(error){
        setError(error.message)
        setIsClicked(false);
        return;
      }
      var currentUser = firebase.auth().currentUser;
      if(currentUser){
        setUser(currentUser.displayName);
        setUserId(currentUser.uid);
        setIsAuthenticated(true); 
        await addUser(userName,password,email, currentUser.uid);
      }else{
        setError("failed sign in/up, please retry");
        setIsClicked(false);
      }
    } 
  
    return (
        <div className="container">           
            <Grid container justifyContent="center"spacing={3}>
                <form onSubmit ={handleSubmit}>
                    <Grid item>
                    <br/>
                    <TextField 
                        value = {email}
                        onInput = {e => setEmail(e.target.value.trim())}
                        placeholder = "email" 
                      />
                    </Grid>
                    <br/>
                    <Grid item>
                      <TextField 
                        value = {password}
                        onInput = {e => setPassword(e.target.value.trim())}
                        placeholder="password"
                      />
                    <br/>
                    <br/>
                    </Grid>
                      <Grid item>
                        <TextField 
                        value = {userName}
                        onInput = {e => setUserName(e.target.value.trim())}
                        placeholder="user name"
                      />
                      </Grid>
                      <br/>
                      <Grid item>
                        <button className="btn btn-outline-success" disabled={isClicked} type = "submit"> 
                        Sign up
                       </button>
                     </Grid>
                </form>
            </Grid>
            <div className="text-danger p-lg-3 m-3">{ error!=="" && JSON.stringify(error)}</div>             
        </div>
    )
 }


export default SignUp;