import React,{useState} from'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from'@material-ui/core';

import Story from './Story/Story';
import WordCard from '../WordWall/WordCard/WordCard'
import crowImage from '../../assets/images/reading/crowDrinksWater/crow.jpg'
// TODO: save it to firebase
const cardList = [
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {word:"水", phrases:["喝水"],sentences:["我喝水"]},
    {word:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
]

const useStyles = makeStyles((theme) => ({
    root: {
        width:"90%", 
        marginTop:"10vh",
    },
    noteDiv:{
        width:"90%",
        margin:"auto"
    }
  }));
  

const stories = [
    {name: "乌鸦喝水", 
    content:"一只乌鸦口渴了，到处找水喝。乌鸦看见一个瓶子，瓶子里有水。但是，瓶子里水不多，瓶口又小，乌鸦喝不着水，怎么办呢? 乌鸦看见旁边有许多小石子，想出办法来了。乌鸦把小石子一颗一颗地放进瓶子里。瓶子里的水渐渐升高，乌鸦就喝着水了",
    voice:"",
    image:{crowImage},
    level:"3"
     },
]

const Reading = ()=>{
    const classes = useStyles();
    const [notes,setNotes] = useState(["水"])
    const handleDeleteCallback=(word)=>{
      setNotes((preNotes)=>preNotes.filter(note=>note !== word))
    }
    const handleAddCallback =(word) =>{
      setNotes([...notes,word])
    }
    return(
        <div className={classes.root}>
            {/* <img src={crowImage}/> */}
            {stories.map((story,index)=> <Story key={index} story={story} parentCallback = {handleAddCallback}/>)}
            <div className={classes.noteDiv}>
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {cardList.filter(item=> notes.includes(item.word)).map((item,index)=> <Grid key={index} item xs={6} sm={4} md={3} > <WordCard wordData={item} parentDeleteCallback = {handleDeleteCallback}/> </Grid>)} 
            </Grid>
            </div>
        </div>
    )
}

export default Reading