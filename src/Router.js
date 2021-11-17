import React, {useEffect, useState} from'react';
import firebase from './firebase/firebase';
import { useRecoilState } from "recoil";
import { storyliststate, wordliststate} from "./store/storyWordsAtoms" 
import {checkedAuthState, 
    usernameState, 
    firebaseState,
    isTeacherState, 
    userIdState,
    likedWordList,
    likedStoryList } from "./store/AuthAtoms"
import {
    BrowserRouter,
    Switch,
    Route,
  } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import WordWall from "./components/WordWall/WordWall";
import Home from "./components/Home/HomePage";
import Reading from "./components/Reading/Reading";
import ReadingList from "./components/ReadingList/ReadingList"
import SignInUp from './components/SignInUp/SignInUp';
import SignOut from './components/SignInUp/SignOut';
import TeacherDashboard from './components/TeacherDashboard/TeacherDashboard';
import CardDetail from "./components/CardDetail/CardDetail";
import UploadStory from './components/Teacher/UploadStory';
import UploadWord from './components/Teacher/UploadWord';

const Router = ()=>{
    const [storyList, setStoryList] = useRecoilState(storyliststate);
    const [wordList, setWordList] = useRecoilState(wordliststate);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [likedWords, setLikedWords] = useRecoilState(likedWordList);
    const [likedWordObjs, setLikedWordObjs] = useState([]);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [likedStoryObjs, setLikedStoryObjs] = useState([]);
    useEffect(()=>{
        let wordObjsTemp = [];
        wordList.forEach((wordObj, index)=>{
            console.log("wordData", wordObj);
            if(likedWords.includes(wordObj.wordId)){     
               let wordInfo = wordObj;
                wordObjsTemp.push(wordInfo);
            }   
        })
        setLikedWordObjs(wordObjsTemp);
    },[wordList, likedWords])

    useEffect(()=>{
        let objsTemp = [];
            storyList.forEach((storyObj, index)=>{
            if(likedStories.includes(storyObj.storyId)){     
               let storyInfo = storyObj;
                objsTemp.push(storyInfo);
            }   
        })
        setLikedStoryObjs(objsTemp);
    }, [storyList, likedStories])

    useEffect(()=> {     
       const fetchData= async()=> {
            setStoryList([]);
            const db = firebase.firestore().collection("story");
            db.onSnapshot((querySnapshot)=>{
                const items=[];
                querySnapshot.forEach((doc)=>{
                    items.push({...doc.data()});
                });
                setStoryList(items);
                console.log(storyList);
            })
            setWordList([]);
            const chineseWordsDb = firebase.firestore().collection("chinesewords")
            chineseWordsDb.onSnapshot((querySnapshot)=>{
                const wordsItems=[];
                querySnapshot.forEach((doc)=>{
                    wordsItems.push({...doc.data()});
                });
                setWordList(wordsItems);
                console.log("wordListfromfirebase", wordList);
            })
       }
        fetchData()  
    }, [])
   
    return(
        <BrowserRouter>
            <NavBar clasName="NavBar" /> 
            <Switch>
                <Route path="/" exact component ={ Home } />
                <Route path="/teacherDashboard" component = {()=> <TeacherDashboard/> } />
                <Route path="/SignInUp" component ={ ()=> <SignInUp />  } />
                <Route path="/SignOut" component ={ ()=> <SignOut/>  }  />
                <Route path="/wordwall" component={()=> < WordWall words={wordList} /> } />
                <Route path="/myWordwall" component={()=>userName? < WordWall words={wordList.filter((word)=> word.creator === userName)}/> : <SignOut/>} />
                <Route path="/likedWordwall" component={()=>userName? < WordWall words={likedWordObjs} /> : <SignOut/> } />
                <Route path="/myreading" component={()=>userName? < ReadingList stories={storyList.filter((story)=> story.creator === userName)}/> : <SignOut/>} />
                <Route path="/likedReading" component={()=>userName? < ReadingList stories={likedStoryObjs} /> : <SignOut/> } />
                <Route path="/reading" component={ ()=> <ReadingList stories={storyList} words={wordList}/>  } />
                <Route path="/addStory" component={UploadStory} />
                <Route path="/addWord" component={UploadWord} />
                <Route path="/story/:id"  component={ () => <Reading stories={storyList} words={wordList} /> }/>
                <Route path="/carddetail/:word" component={()=> <CardDetail wordList={wordList} /> } />
            </Switch>
        </BrowserRouter>
    )          
}

export default Router;