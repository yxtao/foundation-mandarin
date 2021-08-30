import React,{useEffect, useState} from'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {Grid} from'@material-ui/core';

import Story from './Story/Story';
import WordCard from '../WordWall/WordCard/WordCard'

// TODO: save it to firebase
const cardList = [
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {word:"水", phrases:["喝水"],sentences:["我喝水"]},
    {word:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    {word:"很", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    {word:"树", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
]


const useStyles = makeStyles((theme) => ({
    root: {
        width:"90%", 
        marginTop:"20vh",
    },
    noteDiv:{
        width:"90%",
        margin:"auto"
    }
  }));
  
const Reading = (props)=>{
    const classes = useStyles();
    const [notes,setNotes] = useState([])
    const [story, setStory] = useState(null)

    const name = useParams().name

    useEffect(()=> {
        setStory(props.stories.find(element=> element.name === name))
    },[])
 
    const handleDeleteCallback=(word)=>{
      setNotes((preNotes)=>preNotes.filter(note=>note !== word))
    }
    const handleAddCallback =(word) =>{
      setNotes([...notes,word])
    }

    if (!story) return <h1>loading</h1>
    return(
        <div className={classes.root}>
            <Story story= {story}  parentCallback = {handleAddCallback}/>
            <div className={classes.noteDiv}>
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {cardList.filter(item=> notes.includes(item.word)).map((item,index)=> 
                        <Grid key={index} item xs={6} sm={4} md={3} > 
                           <WordCard wordData={item} parentDeleteCallback = {handleDeleteCallback}/>
                         </Grid>)} 
            </Grid>
            </div>
        </div>
    )
}

export default Reading