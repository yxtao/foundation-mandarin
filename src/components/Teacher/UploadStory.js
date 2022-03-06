import React, {useEffect, useState} from 'react';
import {Grid} from "@material-ui/core";
import { useRecoilState, useRecoilValue } from "recoil";
import { usernameState ,isAdminState, firebaseState, isTeacherState} from "../../store/AuthAtoms"
import "./Teacher.css"
import firebase from '../../firebase/firebase';

const db = firebase.firestore();

const UploadStory=()=>{
   const isAdmin = useRecoilValue(isAdminState);
   const isTeacher = useRecoilValue(isTeacherState);
   const [user, setUser] = useRecoilState(usernameState);
   const [title, setTitle] = useState("");
   const [levels, setLevels] = useState(["0"]);
   const [contents, setContents] = useState([""]);
   const [savingToFirebase, setSavingToFireBase] = useState(false);
   const [checkedTagsStates, setCheckedTagsStates] = useState([]);
   const [selectedTags,setSelectedTags] = useState([]);
   const [source, setSource] = useState("");
   const  tags= ["Biographies",
        "Creatures",
        "Nature",
        "Myths and Legends",
        "Me and my life",
        "Poetry",
        "Feelings",
        "Science and math",
        "Friends and family",
        "Fun and funny",
        "Seasons",
        "World cultures",
        "Social studies",
        "Holidays and celebrations",
        ];

   useEffect(()=>{
    setCheckedTagsStates( new Array(tags.length).fill(false)); 
   },[tags.length])
   
   const handleOnSelectedTagsChange = (position) => {
        const updatedCheckedStates = checkedTagsStates.map((item, index) =>index === position ? !item : item);
        setCheckedTagsStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(tags[index]);
            }
        })
        setSelectedTags(selected);
   }
   const onTitleChange = (e)=>{
       setTitle(e.target.value)
   }
   const onSourceChange = (e)=>{
       setSource(e.target.value)
   }
  const handleLevelsChange = (e, index)=>{
      const temp = [...levels];
      temp[index] = e.target.value;
      setLevels(temp);
  }
  const handleContentsChange = (e, index)=>{
      const temp = [...contents]
      temp[index] = e.target.value;
      setContents(temp);
  }
  const addCounts =()=>{
      const temp = [...contents,""]
      setContents(temp);
      const temp2 = [...levels];
      setLevels(temp2);
  }
   const onStoryCreate = async ()=>{
        setSavingToFireBase(true);
        let contentsCopy = [...contents];
        let levelsCopy = [...levels];
        for(let i=0; i<contentsCopy.length; i++){
            if(contentsCopy[i].length === 0){
                contentsCopy.splice(i,1);
                levelsCopy.splice(i,1);
            }
        }
        if(contentsCopy.length!==0){
            try{
                await db.collection("story").doc(user+title).set({
                    creator: user,
                    name:title,
                    levels : levelsCopy,
                    contents: contentsCopy,
                    source: source,
                    storyId: user+title,
                    tags:selectedTags.length!==0?selectedTags:["default"]
                })
            }catch(error){
                alert(error);
            }
        }
       setContents([""]);
       setSource("");
       setLevels(["0"]) ;
       setTitle("");
       setSelectedTags([]);
       setCheckedTagsStates( new Array(tags.length).fill(false)); 
       setSavingToFireBase(false);
   }
   if(!isAdmin && !isTeacher) return (
    <div className = "container m-5">
      Please sign in
    </div>
  )
    return (
       <div className="form-group StoryUploadDiv">
           <Grid container spacing={3} > 
              <Grid item xs={12}  >
              <div className="form-group">
                 <textarea class="form-control" 
                            rows="2" 
                            value={title} 
                            onChange={onTitleChange} placeholder="短文名"
                            style={{width:"40vw",margin:"auto"}}
                            /> 
              </div>
             </Grid>
             <Grid item xs={12}  >
              <div className="form-group">
                 <textarea class="form-control" 
                            rows="1" 
                            value={source} 
                            onChange={onSourceChange} placeholder="如果短文内容是从别的网站或者书里引用的，请注明来源"
                            style={{width:"50vw",margin:"auto"}}
                            /> 
              </div>
             </Grid>
             <Grid item xs={4}  >
             topics
              <div className="form-group tags-checkbox-div">
                    <ul>
                    {tags.sort().map((name, index)=>
                            <li>
                                <div  key={index}> 
                                <input 
                                    type="checkbox"
                                    id={`custom-checkbox-story-tag${index}`}
                                    name={name}
                                    value={name}
                                    checked={checkedTagsStates[index]}
                                    onChange={() => handleOnSelectedTagsChange(index)}
                                />
                                &nbsp;
                                <label for={`custom-checkbox-story-tag${index}`}>{name}</label>
                                </div> 
                            </li>
                        )}
                    </ul>
                </div> 
             </Grid>
             {contents.map((_,index)=>
                <>
                  <Grid item xs={12} >
                    级别
                    <input 
                        className="h5" 
                        name="level" 
                        value = {levels[index]}
                        onChange={(e)=> handleLevelsChange(e, index)} />
                  </Grid>
                  <Grid item xs={12}  >
                  <div className="form-group">
                    <textarea  className="form-control" 
                               rows="6" 
                               value={contents[index]} 
                               onChange={(e)=> handleContentsChange(e, index)} 
                               style={{overflowY:"auto",overflowX:"auto"}}
                               placeholder="短文内容" /> 
                   </div>
                   </Grid>
               </>
             )}           
            <button
                className="btn btn-outline-success ml-4 mb-5"
                onClick={addCounts}>
                添加内容和级别
             </button>
        
            <Grid item xs={12}  >
              {title && 
              <button 
                className="btn btn-success" 
                disabled={savingToFirebase} 
                onClick={onStoryCreate}>
                确定保存
                </button> }
            </Grid>
        </Grid>
       </div>
    )
}

export default UploadStory;