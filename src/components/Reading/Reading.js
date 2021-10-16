import React,{useEffect, useState} from'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {Grid} from'@material-ui/core';

import Story from './Story/Story';
import WordCard from '../WordWall/WordCard/WordCard'

// TODO: save it to firebase
//TODO: Delete staticCardList
const staticCardList = [
    // {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    // {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    // {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    // {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    // {name:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    // {name:"水", phrases:["喝水"],sentences:["我喝水"]},
    // {name:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    // {name:"很", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    // {name:"树", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
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
    const [words, setWords] = useState(props.words);
    const [cardList, setCardList] = useState([]);
    const name = useParams().name

    useEffect(()=> {
        setStory(props.stories.find(element=> element.name === name))
        console.log(props)
    },[name, props])

    useEffect(()=>{
        //TODO: Delete staticCardList
        const tempCardList =[...staticCardList]
        words.forEach(element => {
            tempCardList.push(element)
        });
         setCardList(tempCardList);
         console.log("cardList", cardList)
    },[words])

    const handleDeleteCallback=(name)=>{
      setNotes((preNotes)=>preNotes.filter(note=>note !== name))
    }
    const handleAddCallback =(name) =>{
      setNotes([...notes,name])
    }

    if (!story) return <h1>loading</h1>
    return(
        <div className={classes.root}>
            <Story story= {story}  parentCallback = {handleAddCallback} words={words}/>
            <div className={classes.noteDiv}>
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {cardList.filter(item=> notes.includes(item.name)).map((item,index)=> 
                        <Grid key={index} item xs={6} sm={4} md={3} > 
                           <WordCard wordData={item} parentDeleteCallback = {handleDeleteCallback} hideDelete={true}/>
                         </Grid>)} 
            </Grid>
            </div>
        </div>
    )
}

export default Reading