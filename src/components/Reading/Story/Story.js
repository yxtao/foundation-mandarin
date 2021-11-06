import React, {useEffect, useState} from'react';
import { useRecoilValue , useRecoilState} from "recoil";
import {userlevelstate } from "../../../store/storyWordsAtoms";
import {Paper, Grid, Typography} from '@material-ui/core';
import "./Story.css"

  
const Story =({story, parentCallback, words})=>{
    const [contentIndex, setContentIndex] = useState(0);
    const [bookLevel, setBookLevel] = useState(story.levels[contentIndex]);
    const [charactersPages, setCharactersPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [keywords, setKeywords] = useState([]);
    const  userLevelState = useRecoilValue(userlevelstate);
    const [userLevelIndex, setUserLevelIndex] = useState(0);
    
    useEffect(()=>{
        let foundIndex= story.levels.findIndex((e)=> Number(e)===userLevelState);
        console.log(foundIndex, story.levels,userLevelState)
        if(foundIndex!==-1){
            setUserLevelIndex(foundIndex);
            setContentIndex(foundIndex);
            setBookLevel(userLevelState);
        }
        console.log(userLevelIndex)

        const wordList = [...keywords];
    
        words.forEach(element => {
            wordList.push(element.name)
        });
        setKeywords(wordList)

    },[userLevelState, story.levels])
  
    useEffect(()=>{
        const characters = story.contents[contentIndex].split("");
        const pagesArray=[]; 
      for (let index=0; index<characters.length; index=index+100){
          const copyCharacters = [...characters];
          let shortCharactersArray = copyCharacters.slice(index, index+100) 
          pagesArray.push(shortCharactersArray)
      }
      setCharactersPages(pagesArray);
    },[contentIndex, story.contents])

    const handleSetNextPage = ()=>{
        if(currentPage < charactersPages.length-1){
            setCurrentPage(currentPage+1)
        }
    }
    const handleSetPreviousPage =()=>{
        if(currentPage > 0){
        setCurrentPage(currentPage-1)
        }
    }
    const sendCallback =(word)=>{
        parentCallback(word);
    }

  const changeBookLevel = (e)=> {
    const levelIndex = e.target.value;
    setContentIndex(levelIndex); 
    setBookLevel(story.levels[levelIndex])
  }

    return(
        <div className="storyMain">
            <Typography style={{textAlign:"center"}} variant="h5" component="h5"> {story.name} level {bookLevel}</Typography>
                    <div class="h5">
                        <select name="level" id="level" onChange={changeBookLevel}>
                        <option key ={userLevelState} value={userLevelIndex}> Level {userLevelState} </option>
                        {story.levels.map((level, levelIndex)=> <option key ={levelIndex} value={levelIndex}>Level {level} </option>)}
                        </select> 
                    </div>
            {story.voice && <audio src={story.voice[contentIndex].url} controls />  }
            <Grid 
                container 
                alignItems="stretch"
                justifyContent="center"
            >

            <Grid  item xs={12} sm={12} > 
             {charactersPages.length>0 ? 
             <div> 
              <Paper elevation={5} > 
                    <div className="h4 p-4 storyContent">
                        {charactersPages[currentPage].map((character, index)=> keywords.includes(character)?
                        <button key={index}  
                               type="button" 
                               className="btn btn-outline-light"
                               onClick={()=>sendCallback(character)}>
                                <span class="h4 text-warning"> {character} </span>
                        </button>
                        :character)}
                    </div>
               </Paper> 
                <div class="row align-items-center justify-content-center">
                    <div className="col-4 ">
                        <button className= "btn" onClick={handleSetPreviousPage}> <span className="nextpage"> pre page {"<"} </span>  </button>
                    </div>
                    <div className="col-4">
                        <button className="btn" onClick={handleSetNextPage} > <span className="nextpage"> {">"} next page</span>  </button> 
                    </div>
                </div> 
                </div>
               : <div ></div>}
            </Grid>
        </Grid>
    </div>
    )
}

export default Story