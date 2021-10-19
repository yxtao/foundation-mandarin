import React, {useEffect} from 'react';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { checkedAuthState, usernameState, firebaseState , isAdminState} from "../../store/AuthAtoms" 
import {userlevelstate, wordsetstate} from "../../store/storyWordsAtoms";

import './SignInUp.css';

const SignOut = ()=>{
  const firebase = useRecoilValue(firebaseState);
  const setIsAuthenticated = useSetRecoilState(checkedAuthState);
  const setIsAdmin = useSetRecoilState(isAdminState);
  const setUser = useSetRecoilState(usernameState);
  const setUserLevel = useSetRecoilState(userlevelstate);
  const setWordSet = useSetRecoilState(wordsetstate);
  useEffect(()=>{
    firebase.auth().signOut();
    setIsAuthenticated(false);
    setUser("");
    setUserLevel(0);
    setWordSet([]);
    setIsAdmin(false);
  }, [])

    return (
     <div className="container wrapperDiv">
       You have signed out 
    </div>
    )
}
export default SignOut;