import React, {useEffect} from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { checkedAuthState, usernameState, firebaseState } from "../../store/AuthAtoms" 
import {userlevelstate, wordsetstate} from "../../store/storyWordsAtoms";

import './SignInUp.css';

const SignOut = ()=>{
  const firebase = useRecoilValue(firebaseState);
  const setIsAuthenticated = useSetRecoilState(checkedAuthState);
  const setUser = useSetRecoilState(usernameState);
  const setUserLevel = useSetRecoilState(userlevelstate);
  const setWordSet = useSetRecoilState(wordsetstate);
  useEffect(()=>{
    firebase.auth().signOut();
    setIsAuthenticated(false);
    setUser("");
    setUserLevel(0);
    setWordSet([]);
  }, [])

    return (
     <div className="container wrapperDiv">
       You have signed out 
    </div>
    )
}
export default SignOut;