import React, {useEffect, useState} from'react';
import { useRecoilState, useRecoilValue } from "recoil";
import {
        usernameState, 
        firebaseState,
        isTeacherState, 
        userIdState,
        likedWordList,
        likedStoryList } from "../../store/AuthAtoms"
import {Grid} from "@material-ui/core";

import './ReadingList.css'

import { useHistory } from 'react-router-dom';

const ReadingList = (props)=>{
    const history = useHistory();
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [error,setError] = useState("");
   
    const openStory = (id) => {
       history.push(`/story/${id}`);
       console.log(props.stories)
    }
    const handleLike = async (storyId) =>{ 
        try {
            await updatelikedStories(userId, [...likedStories,storyId]);
        }catch(err){
            setError(err.message)
        }
        setLikedStories((pre) => [...pre,storyId]);
    }
    const handleRemoveLikeCallback = async (storyId) =>{
        let stories = [...likedStories];
            stories= stories.filter(word=> word!==storyId);
        try {
            await updatelikedStories(userId, stories);
        }catch(err){
            setError(err.message)
        }
        setLikedStories(stories);
     }
     const updatelikedStories = async(uid, stories)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedPassages:stories
            })
          }catch(err){    
            setError(err.message);
          }
      }
    
    return (<div className="readingListMain">
               <div className="container">
                   {error}
                   <Grid container spacing={5} >  
                  { props.stories.map((story, index)=>
                   <Grid item >
                       <div>
                       <button  className="btn btn-link"
                                key={index} 
                                onClick={()=>openStory(story.storyId)}>
                                    <span class="h2 text-dark">
                                    {story.name}
                                    </span>            
                        </button>
                        <p className="pl-3 text-dark">{" by-"+story.creator} </p>
                        <div className = "words-div">
                             <div  key={index}  className="p-2 flex-row">  
                             {isTeacher && story.creator!== userName && !likedStories.includes(story.storyId) &&
                             <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>handleLike(story.storyId)}>    
                                 <span class="text-success">like</span>
                             </button>
                             }
                             {likedStories.includes(story.storyId) &&
                             <button 
                                 type="button" 
                                 className="btn btn-outline-light"
                                 onClick={()=>handleRemoveLikeCallback(story.storyId) }>    
                                 <span class="text-success"> unlike </span>
                             </button> }
                            </div> 
                        </div>
                     </div> 
                    </Grid>)}
                </Grid>
               </div>
          </div>        
    )
}

export default ReadingList