import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useRecoilState } from "recoil";
import { checkedAuthState, 
          usernameState, 
          isAdminState, 
          firebaseState,
          isTeacherState, 
          userIdState,
          likedWordList,
          likedStoryList
         } from "../../store/AuthAtoms"
import {userlevelstate, wordsetstate, wordPagestate, storyPagestate, wordPageCountPerPageState,storyPageCountPerPageState} from "../../store/storyWordsAtoms";
import SignIn from './SignIn';
import SignUp from './SignUp';

import './SignInUp.css';

const SignInUp = ()=>{
  const history = useHistory();
  const firebase = useRecoilValue(firebaseState);
  const [likedWords, setLikedWords] = useRecoilState(likedWordList);
  const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
  const [isTeacher, setIsTeacher] = useRecoilState(isTeacherState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [userLevelState, setUserLevelState] = useRecoilState(userlevelstate);
  const [wordSetState, setWordSetState] = useRecoilState(wordsetstate);
  const [user, setUser] = useRecoilState(usernameState);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [wordPage, setWordPage] = useRecoilState(wordPagestate);
  const [storyPage, setStoryPage] = useRecoilState(storyPagestate);
  const [wordsRow,setWordsRow] = useRecoilState(wordPageCountPerPageState);
  const [storiesRow, setStoriesRow] = useRecoilState(storyPageCountPerPageState);

  useEffect(()=>{
    if(isAuthticated && userId){
     const fetchData = async (userId)=>{
        await updateRecoilUserInfo(userId);
        setWordPage(0);
        setStoryPage(0);
        setWordsRow(8);
        setStoriesRow(8);
     }
      fetchData(userId);
      history.push("/teacherDashboard");
    }
  },[isAuthticated, userId])

  const updateRecoilUserInfo = async (uid) =>{
       try{  
          const data = await getUserDataById(uid); 
          setIsAdmin(data.isAdmin);
          setIsTeacher(data.isTeacher);
          setUserLevelState(data.readingLevel);
          setWordSetState(data.notes); 
          data.likedWordCards && setLikedWords(data.likedWordCards);
          data.likedPassages && setLikedStories(data.likedPassages);
       }catch(error){
         setError(error.message);
       }
  }
  const getUserDataById = async(uid)=>{
    try {
        const docRef = firebase.firestore().collection("users").doc(uid);
        const doc = await docRef.get();
         if(doc.exists){
             const data = doc.data();
             return data;
         }else{
           setError("user not found");
         }
      }catch(error){
        setError(error.message);
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
       <div className="input ">
         <div className="buttons-div">
          <button className="btn text-success btn-bg"  
                      style={{borderBottom:!isSignUp? "2px solid black": "white"}}
                      onClick={setSignIn}> Sign In</button> 
          <button className="btn text-success btn-bg "
                    style={{borderBottom:isSignUp? "2px solid black": "white"}}
                    onClick={setSignUp}> Sign Up</button> 
         </div>  
        {isSignUp? <SignUp/> : <SignIn /> }
       </div>
    </div>
    )
}
export default SignInUp;