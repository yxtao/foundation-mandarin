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

   const onTitleChange = (e)=>{
       setTitle(e.target.value)
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
        try{
            await db.collection("story").doc(user+title).set({
                creator: user,
                name:title,
                levels : levels,
                contents: contents,
                storyId: user+title,
            })
        }catch(error){
            alert(error);
        }
       setContents([""]);  
       setLevels(["0"]) ;
       setTitle("");
       setSavingToFireBase(false);
   }
   if(!isAdmin && !isTeacher) return (
    <div className = "container m-5">
      You are not the admin or a teacher
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
                            onChange={onTitleChange} placeholder="story title"
                            style={{width:"20vw",margin:"auto"}}
                            /> 
              </div>
             </Grid>
             {contents.map((_,index)=>
                <>
                  <Grid item xs={12} >
                    Level 
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
                               placeholder="story content" /> 
                   </div>
                   </Grid>
               </>
             )}           
            <button
                className="btn btn-outline-info"
                onClick={addCounts}>
                add more contents and levels
             </button>
        
            <Grid item xs={12}  >
              {title && 
              <button 
                className="btn btn-success" 
                disabled={savingToFirebase} 
                onClick={onStoryCreate}>
                Create the story 
                </button> }
            </Grid>
        </Grid>
       </div>
    )
}

export default UploadStory;