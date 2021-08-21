import React, {useEffect, useState} from'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid, Typography} from '@material-ui/core';

//TODO : store keywords in firebase, category them to different levels 
const keywords=["只","水","看","很","树"]

const useStyles = makeStyles((theme) => ({
    root: {
        width:"90%", 
        margin:"auto",
    },
    gridContainer:{
        width:"100%", 
        margin:"auto"
    },
    gridItem:{
    },
    paper:{
        height:"60vh"
    },
    contentDiv:{
        padding:"10%",
        fontSize:"2vw"
    },
    //TODO: Adjust the image position in mobile model
    imageDiv:{
        width:"40vw",
        height:"40vh",
        padding:"10%"
    },
    buttonAdd:{
      backgroundColor:"#BFF3C4",
      color: "black",
      border:"none",
      borderRadius:"50%"
    }

  }));
  
const Story =({story, parentCallback})=>{
    const classes = useStyles();
    const [contentIndex, setContentIndex] = useState(0);
    const [bookLevel, setBookLevel] = useState(story.levels[contentIndex]);
    const [charactersPages, setCharactersPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

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
        <div className={classes.root}>
             Choose a level
                    <select name="level" id="level" onChange={changeBookLevel}>
                    {/* <option value={bookLevel}>{bookLevel}</option> */}
                    {story.levels.map((level, levelIndex)=> <option key ={levelIndex} value={levelIndex}> {level} </option>)}
                    </select> 
       
        <Typography style={{textAlign:"center"}} variant="h4" component="h4"> {story.name} level {bookLevel}</Typography>
        {story.voice && <audio src={story.voice[contentIndex].url} controls />  }
        <Grid className={classes.gridContainer}
             container 
             alignItems="stretch"
             justifyContent="center"
        >
            <Grid className={classes.gridItem} item xs={12} sm={6} > 
                <Paper className={classes.paper} elevation={5} > 
                    <div className={classes.imageDiv}>
                       {story.image && <img src={story.image[0].url} alt={story.name} style={{width:"30vw", height:"40vh"}}/>  }
                    </div>                
                </Paper> 
             </Grid>
            <Grid className={classes.gridItem} item xs={12} sm={6} > 
             {charactersPages.length>0 ? 
             <> 
              <Paper className={classes.paper} elevation={5} > 
                    <div className={classes.contentDiv}>
                        {charactersPages[currentPage].map((character, index)=> keywords.includes(character)?
                        <button key={index}  className={classes.buttonAdd} onClick={()=>sendCallback(character)}>{character}</button>
                        :character)}
                    </div>
               </Paper> 
             <button className= "btn" onClick={handleSetPreviousPage}> {"<"} </button>
             <button className="btn" onClick={handleSetNextPage} >  {">"} </button> 
                </>
               : null}
            </Grid>
        </Grid>
    </div>
    )
}

export default Story