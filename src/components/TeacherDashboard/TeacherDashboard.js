import React ,{useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue } from "recoil";
import { usernameState,isAdminState,isTeacherState } from "../../store/AuthAtoms"
import {storyliststate, wordliststate} from "../../store/storyWordsAtoms";
import "./TeacherDashboard.css";

const TeacherDashboard = ()=>{
    const history = useHistory();
    const isTeacher = useRecoilValue(isTeacherState);
    const [user, setUser] = useRecoilState(usernameState);
    const [storyList, setStoryList] = useRecoilState(storyliststate);
    const [wordList, setWordList] = useRecoilState(wordliststate);
    const [code,setCode] = useState("")
    const redirectToAddStory = ()=>{
        history.push("/addStory");
    }
    const redirectToAddWord = ()=>{
        history.push("/addWord");
    }
    const redirectToWordwall = ()=>{
        history.push("/wordwall")
    }
    const redirecToStoryList = ()=>{
        history.push("/reading")
    }
    const generateAccessCode =()=>{
        setCode(user+storyList.length+wordList.length);
        //TODO update user accesscode in user collection
    }
   
    if(!isTeacher) {
        return (<div className = "container-wrapper">
            you are not a teacher
        </div>)
        }
    return (
        <div className="container-wrapper">
            <div className="flex-div">
                    <div className = "flex-item p-2">
                        <button className="btn btn-outline-info">  My word list </button>
                        <div className = "words-div">
                        {wordList.map((word)=>
                          word.creator === user?
                            <div className="p-2"> 
                                <h3>{word.name}</h3> 
                            </div> : null
                            )}
                        </div>
                    </div>
                    <div className = "flex-item p-2">
                    <button className="btn btn-outline-info">  My story list </button>
                        <div className = "stories-div">
                        {storyList.map((story)=>
                           story.creator === user ?
                            <div className="p-2"> 
                                <h3>{story.name}</h3>
                            </div> : null
                            )}
                        </div>
                    </div>
                    <div className="flex-item p-5">
                        <button className="btn btn-outline-info m-2" onClick={redirectToAddWord}>  Add word </button>
                        <button className="btn btn-outline-info m-2 " onClick={redirectToAddStory}>  Add story </button>
                        <button className="btn btn-outline-info m-2" onClick= {redirectToWordwall}> all words </button>
                        <button className="btn btn-outline-info m-2" onClick={redirecToStoryList}> all stories </button>
                    </div>
                </div>
            <div className = "flex-div">
                <div className = "flex-item p-3">
                    <button className="btn btn-outline-info m-2" onClick={generateAccessCode}> generate access code</button>
                    <div className="p-3 m-3 text-danger">  {code} </div>
                    <div className="p-3"> {code?"copy paste this code and share it with your students ":""}</div>
                </div>
                <div className = "flex-item p-2">
                        <button className="btn btn-outline-info">  Liked word list </button>
                        <div className = "words-div">
                        {wordList.map((word)=>
                            <div className="p-2"> 
                                <h3>{word.name}</h3> 
                            </div>)}
                        </div>
                    </div>
                    <div className = "flex-item p-2">
                        <button className="btn btn-outline-info">  Liked story list </button>
                        <div className = "stories-div">
                        {storyList.map((story)=>
                            <div className="p-2"> 
                                <h3>{story.name}</h3>
                            </div>)}
                        </div>
                    </div>
             </div>
        </div>
    )
}

export default TeacherDashboard;