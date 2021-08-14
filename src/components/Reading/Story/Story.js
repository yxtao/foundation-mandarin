import React from'react';
import { makeStyles } from '@material-ui/core/styles';
import {Paper, Grid, Typography} from '@material-ui/core';
//TODO: set up image access firebase 
import crowImage from '../../../assets/images/reading/crowDrinksWater/crow.jpg'
//TODO : store keywords in firebase, category them to different levels 
const keywords=["只","水","看"]

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
    const characters = story.content.split("");
    const sendCallback =(word)=>{
        parentCallback(word);
    }

    return(
        <div className={classes.root}>
        <Typography style={{textAlign:"center"}} variant="h4" component="h4"> {story.name}</Typography>
        <Grid className={classes.gridContainer}
             container 
             alignItems="stretch"
             justifyContent="center"
        >
            <Grid className={classes.gridItem} item xs={12} sm={6} > 
                <Paper className={classes.paper} elevation={5} > 
                    <div className={classes.imageDiv}>
                        <img src={crowImage} alt="crow" />  
                    </div>                
                </Paper> 
             </Grid>
            <Grid className={classes.gridItem} item xs={12} sm={6} > 
               <Paper className={classes.paper} elevation={5} > 
                    <div className={classes.contentDiv}>
                        {characters.map((character, index)=> keywords.includes(character)?
                        <button key={index}  className={classes.buttonAdd} onClick={()=>sendCallback(character)}>{character}</button>
                        :character)}
                    </div>
               </Paper> 
            </Grid>
        </Grid>
    </div>
    )
}

export default Story