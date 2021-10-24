import React, {useEffect, useState} from'react';
import firebase from './firebase/firebase';
import { useRecoilState } from "recoil";
import { storyliststate, wordliststate} from "./store/storyWordsAtoms" 
import {
    BrowserRouter,
    Switch,
    Route,
  } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import WordWall from "./components/WordWall/WordWall";
//import Home from "./components/Home/Home";
import Reading from "./components/Reading/Reading";
import Teacher from "./components/Teacher/Teacher";
import ReadingList from "./components/ReadingList/ReadingList"
import SignInUp from './components/SignInUp/SignInUp';
import SignOut from './components/SignInUp/SignOut';
import Assessment from './components/Assessment/Assessment';
import Recommendation from './components/Recommendation/Recommendation';
import CardDetail from "./components/CardDetail/CardDetail";

const Router = ()=>{
    const [storyList, setStoryList] = useRecoilState(storyliststate);
    const [wordList, setWordList] = useRecoilState(wordliststate);
    const [wordSet, setWordSet] = useState([]);
    useEffect(()=> {
       const fetchData= async()=> {
            const db = await firebase.firestore().collection("story");
            db.onSnapshot((querySnapshot)=>{
                const items=[];
                querySnapshot.forEach((doc)=>{
                    items.push({...doc.data()});
                });
                setStoryList(items);
                console.log(storyList);
            })
            const chineseWordsDb = await firebase.firestore().collection("chinesewords")
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
                <Route path="/" exact component ={ Assessment } />
                <Route path="/SignInUp" component ={ ()=> <SignInUp />  } />
                <Route path="/SignOut" component ={ ()=> <SignOut/>  }  />
                <Route path="/wordwall"  component={()=> < WordWall words={wordList} /> } />
                <Route path="/reading" component={ ()=> <ReadingList stories={storyList} words={wordList}/>  } />
                <Route path="/teacher" component={Teacher} />
                <Route path="/story/:name"  component={ () => <Reading stories={storyList} words={wordList} /> }/>
                <Route path="/assessment" component={Assessment} />
                <Route path="/recommendation"  component={()=> <Recommendation words={wordList} /> }/>
                <Route path="/carddetail/:word" component={()=> <CardDetail wordList={wordList} /> } />
            </Switch>
        </BrowserRouter>
    )          
}

export default Router;