import React, {useEffect, useState} from'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import {
        usernameState, 
        firebaseState,
        isTeacherState, 
        userIdState,
        likedStoryList } from "../../../store/AuthAtoms"
import { storyPagestate } from '../../../store/storyWordsAtoms';
import {Grid} from "@material-ui/core";
import ReadingPagination from '../ReadingPagination/ReadingPagination';

import './DisplayReading.css'

const DisplayReading= (props)=>{
    const history = useHistory();
    const firebase = useRecoilValue(firebaseState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [storyPageArrays, setStoryPageArrays] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useRecoilState(storyPagestate);
    const [error,setError] = useState("");

    useEffect(()=>{
        const pagesArray=[]; 
        let stories = props.stories;
        if(stories.length<rowsPerPage) {
            pagesArray.push(stories);
            setStoryPageArrays(pagesArray);
        } else{
              for(let i = 0; i<stories.length; i=i+rowsPerPage) {
                  const storiesCopy =[...stories];
                  let shortArray = storiesCopy.slice(i,i+rowsPerPage)
                  pagesArray.push(shortArray);
              }
              setStoryPageArrays(pagesArray);
          }
      },[rowsPerPage, props.stories])

    const handleCallbackRowsPerPage = (e)=>{
        setRowsPerPage(e)
    }
    const handleCallbackCurrentPage = (e)=>{ 
         setCurrentPage(e)
    } 

    const openStory = (id) => {
       history.push(`/story/${id}`);
    }
     
    return (
        <div className="display-reading-main">
            <ReadingPagination wordsNum={props.stories.length} 
            callbackRowsPerPage={handleCallbackRowsPerPage} 
            callbackCurrentPage={handleCallbackCurrentPage }/>
            <p className="text-danger">{error}</p>

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
                </div> 
            </Grid>) }
         </Grid>
    </div>        
    )
}

export default DisplayReading