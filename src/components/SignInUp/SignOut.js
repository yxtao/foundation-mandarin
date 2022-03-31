import React, {useEffect} from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, firebaseState , isAdminState} from "../../store/AuthAtoms" 
import {userlevelstate, wordsetstate ,  wordPagestate, storyPagestate, wordPageCountPerPageState,storyPageCountPerPageState } from "../../store/storyWordsAtoms";

import './SignInUp.css';

const SignOut = ()=>{
  const firebase = useRecoilValue(firebaseState);
  const setIsAuthenticated = useSetRecoilState(checkedAuthState);
  const setIsAdmin = useSetRecoilState(isAdminState);
  const setUser = useSetRecoilState(usernameState);
  const setUserLevel = useSetRecoilState(userlevelstate);
  const setWordSet = useSetRecoilState(wordsetstate);
  const [wordPage, setWordPage] = useRecoilState(wordPagestate);
  const [storyPage, setStoryPage] = useRecoilState(storyPagestate);
  const [wordsRow,setWordsRow] = useRecoilState(wordPageCountPerPageState);
  const [storiesRow, setStoriesRow] = useRecoilState(storyPageCountPerPageState);

  useEffect(()=>{
    firebase.auth().signOut();
    setIsAuthenticated(false);
    setUser("");
    setUserLevel(0);
    setWordSet([]);
    setIsAdmin(false);
    setWordPage(0);
    setStoryPage(0);
    setWordsRow(8);
    setStoriesRow(8);
  }, [])

    return (
     <div className="wrapperDiv">
       You have signed out 
    </div>
    )
}
export default SignOut;