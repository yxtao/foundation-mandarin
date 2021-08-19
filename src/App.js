import React, {useState, useEffect} from'react';
import firebase from './firebase/firebase';

import {
    BrowserRouter,
    Switch,
    Route,
  } from "react-router-dom";


import NavBar from "./components/NavBar/NavBar";
import WordWall from "./components/WordWall/WordWall";
import Home from "./components/Home/home";
import Reading from "./components/Reading/Reading";
import Teacher from "./components/Teacher/Teacher";
import ReadingList from "./components/ReadingList/ReadingList"
import './app.css';

const App = ()=>{
    const [storyList, setStoryList] = useState([]);

    useEffect(()=> {
        async function fetchData() {
        const db = await firebase.firestore().collection("story");
        db.onSnapshot((querySnapshot)=>{
            const items=[];
            querySnapshot.forEach((doc)=>{
                items.push({...doc.data()});
            });
            setStoryList(items);
            console.log(storyList);
        })}
        fetchData() 
    }, [])

    return(
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/" exact component ={ Home } />
                <Route path="/wordwall"  component={ WordWall } />
                <Route path="/reading" component={ ()=> <ReadingList stories={storyList} />  } />
                <Route path="/teacher" component={Teacher} />
               <Route path="/story/:name"  component={ () => <Reading stories={storyList} /> }/>
            </Switch>
        </BrowserRouter>
    )          
}

export default App;