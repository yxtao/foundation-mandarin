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
        setIsClicked(false);
      }
    }

    const addAdultUser = async(username,password,email)=>{
      // TODO : add readingLevel and notes
      await db.collection("users").doc(username).set({
        username,
        password,
        email,
        isadult:true,
        readingLevel:0,
        notes:[],
        isAdmin: false,
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsClicked(true);
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
      setIsClicked(false);
    } 
  const handleParentCallback=()=>{
    props.parentCallback();
   }
  
    return (
        <div className="container">           
            <Grid container justify="center"spacing={3}>
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
        </div>
    )
 }


export default SignUp;