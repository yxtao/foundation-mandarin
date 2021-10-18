import React,{useState, useEffect} from 'react';
import { useRecoilValue , useRecoilState} from "recoil";
import {userlevelstate } from "../../store/storyWordsAtoms";
import { useHistory } from 'react-router-dom';
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" ;


import "./Assessment.css"

const Assessment= (props)=>{
    const history = useHistory();
    const user = useRecoilValue(usernameState);
    const [levelState,setLevelState] = useRecoilState(userlevelstate);
    // TODO get all levels words from db
    // TODO randomly select 5 words from each level
    const wordList = ["我","们","鸟"];
    const [readingLevel, setReadingLevel] = useState(0);
    const [index, setIndex] = useState(1);
    const [word, setWord] = useState(wordList[0]);
    const [completed, setCompleted] = useState(false);
    const [knowList, setKnowList] = useState([]);
    const [unknowList, setUnknowList] = useState([]);

    useEffect(()=>{
       setReadingLevel(1);
       setLevelState(readingLevel);
       // TODO update readingLevel in db
    },[completed])

    const addKnow = ()=>{
        setKnowList(pre=>[...pre,word]);  
        setIndex(preIndex => preIndex+1);
        if(index<=wordList.length-1){
            setWord(wordList[index]);
        }else{
            setCompleted(true);
        }  
    }
    const addUnKnow = ()=>{
        setUnknowList(pre=>[...pre,word]); 
        setIndex(preIndex => preIndex+1);
        if(index<=wordList.length-1){
            setWord(wordList[index]);
        }else{
            setCompleted(true);
        }  
    }
   
    const vistReading = () => {
        history.push(`/reading`);
     }
    const vistLoginUp = () =>{
        history.push("/SignInUp")
    }

     if(!user){
        return(
            <div class ="justify-content-center row">
                <div class="jumbotron bg-light w-50 ">
                    <h1 class="display-4">Please sign in or sign up</h1>  
                    <p class="lead">
                       <button type="button" class="btn btn-outline-secondary" onClick={vistLoginUp}>sign in </button>  
                    </p>
                </div>
            </div>
        )
    }
    
    if(completed){
        return(
            <div class ="justify-content-center row">
                <div class="jumbotron bg-light w-50 ">
                    <h1 class="display-4">Hello {user}</h1>
                    <p class="lead">We recommend you read level {levelState} books.</p>
                    <hr class="my-4" />
                    <p> Please feel free to check recommendation pages to study the words, and vist the reading page.</p>
                    <p class="lead">
                       <button type="button" class="btn btn-outline-secondary" onClick={vistReading}>reading page</button>  
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="container-wrapper">
            <div class="row">
                <div class="col-sm-4">
                {user}
                </div>
                <div class="col-sm-4">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="display-1 text-center">{word}</h1>
                            <hr />
                            <div class="d-flex flex-row justify-content-between">
                                <div class="p-4">
                                    <button type="button" class="btn btn-outline-info" onClick={addKnow}>know</button>
                                </div>
                                <div class="p-4">
                                    <button type="button" class="btn btn-outline-secondary" onClick={addUnKnow}>don't know</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4"> 
                </div>
            </div>
           
        </div>
    )
}

export default Assessment;