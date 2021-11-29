import React,{useEffect, useState} from'react';
import { useParams } from 'react-router-dom';
import {Grid} from'@material-ui/core';
import {useRecoilState, useRecoilValue} from "recoil";
import {wordsetstate } from "../../store/storyWordsAtoms" ;
import {usernameState, isAdminState, isTeacherState,firebaseState} from "../../store/AuthAtoms";
import Story from './Story/Story';
import WordCard from '../WordWall/WordCard/WordCard'
import "./Reading.css";
  
const Reading = (props)=>{
    const user = useRecoilValue(usernameState);
    const isAdmin = useRecoilValue(isAdminState);
    const isTeacher = useRecoilValue(isTeacherState);
    const [error, setError] = useState("");
    const firebase = useRecoilValue(firebaseState);
    const [notes,setNotes] = useState([])
    const [story, setStory] = useState(null)
    const [words, setWords] = useState(props.words);
    const [cardList, setCardList] = useState(props.words);
    const [wordSet,setWordSet] = useRecoilState(wordsetstate);
    const [editMode, setEditMode] = useState(false);
    const [levels, setLevels] = useState([]);
    const [contents, setContents] = useState([]);
    const id = useParams().id;

    useEffect(()=> {
        const theStory = props.stories.find(element=> element.storyId === id);
        theStory && setStory(theStory);
    },[id, props])

    useEffect(()=> {
        story && story.levels && setLevels(story.levels) ;
        story && story.contents && setContents(story.contents);
    },[story])
    

    const handleDeleteCallback=(wordId)=>{
      setNotes((preNotes)=>preNotes.filter(note=>note !== wordId))
    }
    const handleAddCallback =(wordId) =>{
      setNotes([...notes,wordId])
    }
    const startEditMode=()=>{
        setEditMode(true);
    }
    const handleContentsChange=(e,index)=>{
        let contentsTemp = [...contents]
        contentsTemp[index] = e.target.value;
        setContents(contentsTemp);
    }
    const handlelevelsChange=(e,index)=>{
        let levelsTemp = [...levels];
        levelsTemp[index] = e.target.value;
        setLevels(levelsTemp);
    }
    const offEditMode= async ()=>{
        // TODO save data to db
        // if it is 
        try{
            await firebase.firestore().collection("story").doc(story.storyId).update({
                levels,
                contents
            })
        setEditMode(false);
        }catch(err){
            setError(err.message);
        }
    }
    
    useEffect(()=>{
        if(user!=="" && !isAdmin &&!isTeacher) {
            setWordSet([...wordSet,...notes ]);
        }else{
            setWordSet(notes);
        }
    }, [notes, user, isAdmin, isTeacher])

    if (!story) return <h1>loading</h1>
    if(editMode){
        return( 
        <div className="readingMain">
              {error}
            <div className="text-right">  
                <button 
                className="btn btn-outline-danger"
                onClick={offEditMode}
                > confirm and save 确定保存
                </button>
            </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="container">
                            {contents.map((content, index)=> 
                            <div 
                                className = "row m-3"
                                key={index}>
                                <div className="p-2"> Level
                                        <input 
                                            defaultValue={levels[index]}
                                            value={levels[index]}
                                            onChange={(e)=>handlelevelsChange(e,index)}/>
                                </div>
                                <div className = "col">
                                    <div className="p-2"> 
                                        <textarea 
                                            rows={6}
                                            cols="100"
                                            defaultValue = {content}
                                            value={contents[index]} 
                                            style={{overflowY:"auto",overflowX:"auto",padding:"1vh 1vw 1vh 1vw"}}
                                            onChange={(e)=>handleContentsChange(e, index)}/>
                                    </div> 
                                </div>
                                <hr/>
                            </div>
                            )}
                        </div>
                    </li>
                </ul>    
        </div>
    )} 
    return(
        <div className="readingMain">
        {error}
           { isTeacher && story.creator === user &&
            <div className="p-1 text-right">  
                <button 
                className="btn btn-outline-danger"
                onClick={startEditMode}
                >edit 编辑
                </button>
            </div>
           }
            <Story story= {story}  parentCallback = {handleAddCallback} words={words}/>
            <div className="p-5">
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {cardList.filter(item=> notes.includes(item.name)).map((item,index)=> 
                        <Grid key={index} item xs={6} sm={2} md={2} > 
                           <WordCard wordData={item} 
                                parentDeleteCallback = {handleDeleteCallback} 
                                hideDelete={true}
                                hideLike = {true}
                                hideRemoveLike = {true}/>
                         </Grid>)} 
            </Grid>
            </div>
        </div>
    )
}

export default Reading