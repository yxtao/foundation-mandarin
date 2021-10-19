import React,{useEffect, useState} from'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from'@material-ui/core';
import {useRecoilState, useRecoilValue} from "recoil";
import {wordsetstate } from "../../store/storyWordsAtoms" ;
import {usernameState, isAdminState} from "../../store/AuthAtoms";
import Story from './Story/Story';
import WordCard from '../WordWall/WordCard/WordCard'
import "./Reading.css";
  
const Reading = (props)=>{
    const user = useRecoilValue(usernameState);
    const isAdmin = useRecoilValue(isAdminState);
    const [notes,setNotes] = useState([])
    const [story, setStory] = useState(null)
    const [words, setWords] = useState(props.words);
    const [cardList, setCardList] = useState(props.words);
    const [wordSet,setWordSet] = useRecoilState(wordsetstate);
    const name = useParams().name;

    useEffect(()=> {
        setStory(props.stories.find(element=> element.name === name))   
    },[name, props])

    const handleDeleteCallback=(name)=>{
      setNotes((preNotes)=>preNotes.filter(note=>note !== name))
    }
    const handleAddCallback =(name) =>{
      setNotes([...notes,name])

      if(user!=="" && !isAdmin) {
        if(wordSet.length !==0) {
            setWordSet((currentState)=>[
                ...currentState,
                ...notes
            ])
        }else{
            setWordSet(notes);
        }
    }
      
    }
  
    if (!story) return <h1>loading</h1>
    return(
        <div className="readingMain">
            <Story story= {story}  parentCallback = {handleAddCallback} words={words}/>
            <div className="p-5">
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