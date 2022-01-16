import React, {useEffect, useState} from'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import {
        usernameState, 
        firebaseState,
        isTeacherState, 
        userIdState,
        likedWordList,
        likedStoryList } from "../../store/AuthAtoms"
import {Grid} from "@material-ui/core";
import WordsPagination from '../WordWall/WordCard/WordsPagination/WordsPagnation';

import './ReadingList.css'

const ReadingList = (props)=>{
    const history = useHistory();
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [stories, setStories] = useState(props.stories)
    const [target, setTarget] = useState("");
    const [storyPageArrays, setStoryPageArrays] = useState([]);
    const [pagesNum, setPagesNum]= useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    const [error,setError] = useState("");

    useEffect(()=>{
        const pagesArray=[]; 
        if(stories.length<rowsPerPage) {
            pagesArray.push(stories);
            setStoryPageArrays(pagesArray);
            setPagesNum(1);
        } else{
              for(let i = 0; i<stories.length; i=i+rowsPerPage) {
                  const storiesCopy =[...stories];
                  let shortArray = storiesCopy.slice(i,i+rowsPerPage)
                  pagesArray.push(shortArray);
              }
              setStoryPageArrays(pagesArray);
              setPagesNum(storyPageArrays.length);
          }
      },[rowsPerPage,stories, pagesNum])

    const handleCallbackRowsPerPage = (e)=>{
        setRowsPerPage(e)
    }
    const handleCallbackCurrentPage = (e)=>{
        setCurrentPage(e)
    } 
    const handleTargetChange= (e)=>{
        if(e.target.value===""){
            setStories(props.stories);
        }
        setTarget(e.target.value.trim());
    }
    const onSearch = ()=>{
        let storiesCopy = [...stories];
        if(target !== ""){
            const result = storiesCopy.filter((s)=>s.name === target);
            setStories(result);
        }else{
            setStories(props.stories);
        } 
    }
    
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
    const handleRemoveLike = async (storyId) =>{
        let likedStoriesCopy = [...likedStories];
            likedStoriesCopy = likedStoriesCopy.filter(s=> s!==storyId);
        try {
            await updatelikedStories(userId, likedStoriesCopy);
        }catch(err){
            setError(err.message)
        }
        setLikedStories(likedStoriesCopy);
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
    const handleDeleteStory = async(storyId)=>{
        try{
            await firebase.firestore().collection("story").doc(storyId).delete();
        }catch(err){
            setError(err.message);
        }
    }
    
    return (
        <div className="readingListMain">
            <div class="row">
                <div class="col-sm-4">
                    <div class="col-xs-2 active-cyan">
                        <input 
                            class="form-control" 
                            type="text" 
                            placeholder="search by story name"
                            value = {target}
                            onChange ={(e)=>handleTargetChange(e)}
                        /> {error}
                    </div>
                </div>   
                <div class="col-sm-4">
                    <div class="col-xs-2 active-cyan">
                        <button className="btn btn-outline-info" onClick={onSearch}>  search </button>
                    </div>
                </div> 
            </div>
            <WordsPagination wordsNum={stories.length} 
            callbackRowsPerPage={handleCallbackRowsPerPage} 
            callbackCurrentPage={handleCallbackCurrentPage }/>
            <Grid 
                container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2} >
            {storyPageArrays.length!==0 && 
            storyPageArrays[currentPage] &&
            storyPageArrays[currentPage].length!==0 && 
            storyPageArrays[currentPage].map((story,index)=> 
            <Grid key={index} item xs={12} sm={4} md={3} > 
                <div className="reading-list-card">
                    <div onClick={()=>openStory(story.storyId)}>  
                        <p className="h2 pl-3 text-dark">{story.name} </p>            
                        <p className="pl-3 text-dark">{" by-"+story.creator} </p>
                    </div>
                    <div className = "words-div">
                        <div  key={index}  className="p-2 flex-row">  
                            {isTeacher && story.creator!== userName && !likedStories.includes(story.storyId) &&
                            <button        
                                type="button" 
                                className="btn btn-outline-light" 
                                onClick={()=>handleLike(story.storyId)}>    
                                <h4 className="text-success">♡</h4>
                            </button> }
                            {likedStories.includes(story.storyId) &&
                            <button 
                                type="button" 
                                className="btn btn-outline-light"
                                onClick={()=>handleRemoveLike(story.storyId) }>    
                                <h4 className="text-success">♥</h4>
                            </button> }
                            { story.creator === userName &&
                            <button 
                                type="button" 
                                className="btn btn-outline-light"
                                onClick={()=>handleDeleteStory(story.storyId) }>    
                                <span className="text-success"> 🗑  删除 </span>
                            </button> }
                        </div> 
                    </div>
                </div> 
            </Grid>) }
         </Grid>
    </div>        
    )
}

export default ReadingList