import React, { useState} from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import {createUserAccount, loginUser} from "../../api/api";
import { checkedAuthState, usernameState, firebaseState } from "../../store/AuthAtoms" 
import {Grid, TextField} from '@material-ui/core';


const SignUp = (props) =>{
    const firebase = useRecoilValue(firebaseState);
    const db = firebase.firestore();
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [user, setUser] = useRecoilState(usernameState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [isClicked, setIsClicked] = useState(false);
    const [error, setError] = useState("");

    const checkUsernameExist = async (username) =>{
      try {
        const query = await firebase.firestore().collection("users").where("username", "==", username).get();
         if(!query.empty){
             return true;
         }else{
            return false;
         }
      }catch(error){
        alert(error);
        setError(JSON.stringify(error));
        setIsClicked(false);
      }
    }

    const isEmailExist = async (email) =>{
      try {
        const query = await firebase.firestore().collection("users").where("email", "==", email).get();
         if(query.empty){     
            return false;
         }else{
            return true;
         }
      }catch(error){
        setError(JSON.stringify(error.message));
        setIsClicked(false);
      }
    }
  
    const addAdultUser = async(username,password,email, uid)=>{
      await db.collection("users").doc(uid).set({
        uid,
        username,
        password,
        email,
        likedWordCards:[],
        likedPassages:[],
        accessCode:username,
        isTeacher: true,
        isAdmin: false
      })
    }
    const isNameValid = (name) =>{
      return /^[0-9a-zA-Z]+$/.test(name);
    }
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(!isNameValid(userName)){
        setError("User name is not valid, can only contain numbers and letters.")
        return;
      }
      let alreadyTaken = true;
      let emailExist = true;
      try{
        alreadyTaken = await checkUsernameExist(userName)
        if(alreadyTaken){
          setError("The username has taken 已经有此用户名，请另取");
        }
        emailExist = await isEmailExist(email);
        if(emailExist){
          setError("The email already exist");
        }
      }catch(error){
        setError(JSON.stringify(error.message));
      }
      setIsClicked(true);
      if(!alreadyTaken && !emailExist){  
        try{
          await createUserAccount({ email,password,userName});
        }catch(error){
          setError(JSON.stringify(error.message.name));
        }
        await loginUser(email,password);
        var currentUser = firebase.auth().currentUser;
        if(currentUser){
        setUser(currentUser.displayName);
        setIsAuthenticated(true); 
        await addAdultUser(userName,password,email, currentUser.uid);
        }
      }
      setIsClicked(false);
    } 
  
    return (
        <div className="container">           
            <Grid container justifyContent="center"spacing={3}>
                <form onSubmit ={handleSubmit}>
                    <Grid item>
                    <br/>
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
                    <br/>
                    <br/>
                    </Grid>
                      <Grid item>
                        <TextField 
                        value = {userName}
                        onInput = {e => setUserName(e.target.value)}
                        placeholder="user name"
                      />
                      </Grid>
                      <br/>
                      <Grid item>
                        <button className="btn btn-outline-primary" disabled={isClicked}type = "submit"> 
                        Sign up
                       </button>
                     </Grid>
                </form>
            </Grid>
            <div className="text-danger p-lg-3">{error}</div>             
        </div>
    )
 }


export default SignUp;