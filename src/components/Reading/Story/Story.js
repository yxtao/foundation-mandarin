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
    const [bookLevel, setBookLevel] = useState(story.levels[0]);
    const [contentIndex, setContentIndex] = useState(0);
    const [hasContent, setHasContent] = useState(true);
    const [charactersPages, setCharactersPages] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const level = story.levels[0]
    const characters = story.contents[contentIndex].split("");

    useEffect(()=>{
        const pagesArray=[]; 
      for (let index=0; index<characters.length; index=index+100){
          const copyCharacters = [...characters];
          let shortCharactersArray = copyCharacters.slice(index, index+100) 
          pagesArray.push(shortCharactersArray)
      }
      setCharactersPages(pagesArray);
    },[characters])

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

    useEffect(()=>{
       const whichLevel = (element)=> element === bookLevel;
       const levelIndex = story.levels.findIndex(whichLevel);
       if (levelIndex !==-1) {
        setContentIndex(levelIndex)
        setHasContent(true)
       } else{
           setHasContent(false);
       }
    },[bookLevel, story.levels])

    return(
        <div className={classes.root}>
             Choose a level
                    <select name="level" id="level" onChange={(e)=> setBookLevel(e.target.value)}>
                    <option value={bookLevel}>{bookLevel}</option>
                    {story.levels.map((level, index)=> <option key ={index} value={level}> {level} </option>)}
                    </select> 
         {hasContent? 
         <>          
        <Typography style={{textAlign:"center"}} variant="h4" component="h4"> {story.name} level {level}</Typography>
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
             <button className= "btn" onClick={handleSetPreviousPage}> previous page</button>
             <button className="btn" onClick={handleSetNextPage} > next page </button>
                </>
               : null}
            </Grid>
        </Grid>
        </> : <p> no content, suggest go to level {story.levels[0]} </p> }
    </div>
    )
}

export default Story