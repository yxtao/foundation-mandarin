import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";
import { useRecoilState, useRecoilValue } from "recoil";
import { usernameState ,isAdminState, firebaseState, isTeacherState} from "../../store/AuthAtoms"
import Compressor from 'compressorjs';
import Audio from '../Audio/Audio'
import "./Teacher.css"
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const UploadStory=()=>{
   const isAdmin = useRecoilValue(isAdminState);
   const isTeacher = useRecoilValue(isTeacherState);
   const [user, setUser] = useRecoilState(usernameState);
   const [name, setName] = useState("");
   const [content, setContent] = useState("");
   const [file, setFile] = useState(null);
   const [levels, setLevels] = useState([]);
   const [level, setLevel] = useState(-1);
   const [contents, setContents] = useState([]);
   const [audios, setAudios] = useState([]);
   const [audioBlob, setAudioBlob] = useState(null);
   const [moveOn, setMoveOn] = useState(false);
   const [audioURL, setAudioURL] = useState("");
   const [audioURLs, setAudioURLs] = useState([]);
   const [savingToFirebase, setSavingToFireBase] = useState(false);

   const history = useHistory();

   const checkStories = () => {
      history.push("/reading");
   }
   
   const onNameChange = (e)=>{
       setName(e.target.value)
   }

   const onContentChange =(e)=>{
       setContent(e.target.value)
   }
   
   const onContentLevelAdded =()=>{
       setLevels([...levels, level]);
       setContents([...contents,content]);
       setAudios([...audios,audioBlob])
       setAudioURLs([...audioURLs, audioURL])
       setContent("");
       setAudioBlob(null);
       setMoveOn(true);
   }

  const onDelete =(index)=>{
      const newLevels= [...levels];
      const newContents = [...contents];
      const newAudios = [...audios];
      const newAudioURLs = [...audioURLs]
      newLevels.splice(index, 1);
      newContents.splice(index,1);
      newAudios.splice(index,1);
      newAudioURLs.splice(index,1);
      setLevels(newLevels);
      setContents(newContents);
      setAudios(newAudios);
      setAudioURLs(newAudioURLs);
  }

  const handleAudioSave = async (blobObj, audioURL) =>{
       setAudioBlob(blobObj);
       setAudioURL(audioURL);
  }

   const onStoryCreate = async ()=>{

        setSavingToFireBase(true);
        try{
            await db.collection("story").doc(user+name).set({
                creator: user,
                name:name,
                levels : levels,
                contents: contents,
                storyId: user+name,
            })
        }catch(error){
            alert(error);
        }
  
    //     const storageRef = storage.ref()
    //     const audiosRef= storageRef.child(`story/voice/${name}`)
    //     for (let index=0; index<audios.length; index++) {
    //         await audiosRef.child(`/${index}`).put(audios[index], {contentType:'audio/webm;codecs=opus'})
    //         console.log(audios[index]);
    //         const audioRef= audiosRef.child(`/${index}`)
    //         await db.collection("story").doc(name).update({
    //             voice: firebase.firestore.FieldValue.arrayUnion({
    //             name: name,
    //             url: await audioRef.getDownloadURL()
    //         })
    //     })
    //   }
      // setFile(null)
       setContents([]);  
       setLevels([]) ;
       setName("");
    //    setAudios([]);
       setMoveOn(false);
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
                            value={name} 
                            onChange={onNameChange} placeholder="story name"
                            style={{width:"20vw",margin:"auto"}}
                            /> 
              </div>
             </Grid>
             
             <Grid item xs={12} >
                    Choose
                    <select className="h5" name="level" id="level" onChange={(e)=> setLevel(e.target.value)}>
                    <option value="0"> level 0</option>
                    <option value="1"> level 1</option>
                    <option value="2">level 2</option>
                    <option value="3">levle 3</option>
                    </select>
             </Grid>
             <Grid item xs={12}  >
                 <div className="form-group">
                     <textarea  className="form-control" 
                                rows="6" 
                                value={content} 
                                onChange={onContentChange} 
                                style={{overflowY:"auto",overflowX:"auto"}}
                                placeholder="story content" /> 
                 </div>
            </Grid>
            {/* <Grid  item xs={12} >
                <div style={{display:"flex", flexDirection:"row"}}>

                 <Audio  callbackAudio={handleAudioSave}/>  
                </div>
            </Grid> */}
            <Grid  item xs={12}>
            </Grid >
            <button className="btn btn-success" 
                        disabled={name===""}
                        onClick={onContentLevelAdded}>save and add
                 </button>
            { moveOn === true? 
            <> 
            <Grid item xs={12}  >
                <Paper elevation={3} >
                    {levels.map((level, index)=> 
                                <Card key={index} raised={true}> 
                                <CardContent>
                                <p> {name} </p> 
                                <p> level {level} </p>
                                <p> {contents[index]} </p> 
                             {/* <audio src={audioURLs[index]} controls />  */}
                                </CardContent>    
                                <CardActions>      
                                    <Button size="small" color ="primary" onClick={()=>onDelete(index)}> delete x </Button>      
                                </CardActions>   
                                </Card>)}
                </Paper>
            </Grid>
            <Grid item xs={12}  >
                <button className="btn btn-success" disabled={savingToFirebase} onClick={onStoryCreate}>Create the story </button> 
            </Grid>
            </> 
            : null 
            }
        </Grid>
       </div>
    )
}

export default UploadStory;