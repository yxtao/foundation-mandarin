import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms"
import {userlevelstate, wordsetstate} from "../../store/storyWordsAtoms";
import SignIn from './SignIn';
import SignUp from './SignUp';

import './SignInUp.css';

const SignInUp = ()=>{
  const history = useHistory();
  
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [user, setUser] = useRecoilState(usernameState);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(()=>{
    if(isAuthticated){
      // TODO get user readingLevel and notes from db 
      // TODO set Rcoil state for userlevelstate, wordsetstate
      history.push("/");
    }
  },[isAuthticated])
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