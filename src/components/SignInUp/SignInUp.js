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

  const setSignUp = () =>{
    setIsSignUp(true);
  }
  const setSignIn = ()=>{
    setIsSignUp(false);
  }

    return (
     <div className="wrapperDiv">
       <div className="bg-light p-1 input ">
        <div class = "row justify-content-around">
          <div class="col-2 ">
            <button className="btn text-success btn-bg"  
                    style={{borderBottom:!isSignUp? "2px solid black": "white"}}
                    onClick={setSignIn}> Sign In</button> 
          </div>
          <div class="col-2 ">
          <button className="btn text-success btn-bg "
                  style={{borderBottom:isSignUp? "2px solid black": "white"}}
                  onClick={setSignUp}> Sign Up</button> 
          </div>
        </div>
        {isSignUp? <SignUp/> : <SignIn /> }
       </div>
    </div>
    )
}
export default SignInUp;