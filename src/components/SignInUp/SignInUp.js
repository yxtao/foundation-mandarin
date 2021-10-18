import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms"
import {userlevelstate, wordsetstate} from "../../store/storyWordsAtoms";
import SignIn from './SignIn';
import SignUp from './SignUp';

import './SignInUp.css';

const SignInUp = ()=>{
  const history = useHistory();
  const firebase = useRecoilValue(firebaseState);
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [userLevelState, setUserLevelState] = useRecoilState(userlevelstate);
  const [wordSetState, setWordSetState] = useRecoilState(wordsetstate);
  const [user, setUser] = useRecoilState(usernameState);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(()=>{
    if(isAuthticated && user){
     const fetchData = async (user)=>{
        await updateRecoilUserInfo(user);
     }
      fetchData(user);
      history.push("/");
    }
  },[isAuthticated, user])

  const updateRecoilUserInfo = async (name) =>{
       try{  
          const data = await getUserDataByName(name);  
          setIsAdmin(data.isAdmin);
          setUserLevelState(data.readingLevel);
          setWordSetState(data.notes); 
       }catch(error){
         alert(error);
       }
  }
  const getUserDataByName = async(name)=>{
    try {
        const query = await firebase.firestore().collection("users").where("username", "==",name).get();
         if(!query.empty){
             const snapshot = query.docs[0];
             const data = snapshot.data();
             return data;
         }
      }catch(error){
        alert(error);
      }
  }

  const handleCallback = () =>{
    setIsSignUp(true);
  }
  const handleSignUpCallback = ()=>{
    setIsSignUp(false);
  }

    return (
     <div className="container wrapperDiv">
       {isSignUp? <SignUp parentCallback = {handleSignUpCallback}/> : <SignIn parentCallback = {handleCallback} /> }
    </div>
    )
}
export default SignInUp;