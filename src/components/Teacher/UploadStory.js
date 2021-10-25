import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";
import Compressor from 'compressorjs';

import Audio from '../Audio/Audio'
import "./Teacher.css"
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const UploadStory=()=>{
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
   
   const onFileChange =(e)=>{
       const image = e.target.files[0];
       let size = e.target.files[0].size/1024/1024; 
       if(size>1){
            new Compressor(image, {
                quality:0.1,
                success:(compressedResult)=>{
                    setFile(compressedResult);
                }
            })
        }else{
            new Compressor(image, {
                quality:0.1,
                success:(compressedResult)=>{
                    setFile(compressedResult);
                }
            })
        }
   }

   const onContentLevelAdded =()=>{
       (level!==-1) && setLevels([...levels, level]);
       (content!=="")&& setContents([...contents,content]);
       setAudios([...audios,audioBlob])
       setAudioURLs([...audioURLs, audioURL])
       console.log("audioBlob ", audioBlob)
       console.log("audios ", audios)
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
        await db.collection("story").doc(name).set({
            name:name,
            levels : levels,
            contents: contents,
        })
  
      if (file!==null) {
        const storageRef = storage.ref()
        const fileRef = storageRef.child(`story/pictures/${name}`)
        await fileRef.put(file, {contentType:'image/jpeg'})
        await db.collection("story").doc(name).update({
           image: firebase.firestore.FieldValue.arrayUnion({
               name: name,
               url: await fileRef.getDownloadURL()
           })
        })
    }
    
        const storageRef = storage.ref()
        const audiosRef= storageRef.child(`story/voice/${name}`)
        for (let index=0; index<audios.length; index++) {
            await audiosRef.child(`/${index}`).put(audios[index], {contentType:'audio/mpeg'})
            const audioRef= audiosRef.child(`/${index}`)
            await db.collection("story").doc(name).update({
                voice: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                url: await audioRef.getDownloadURL()
            })
        })
      }

       setFile(null)
       setContents([]);  
       setLevels([]) ;
       setName("");
       setAudios([]);
       setMoveOn(false);
       setSavingToFireBase(false);
   }

    return (

       <div className="form-group StoryUploadDiv">
           <Grid container spacing={3} > 
              <Grid item xs={12} >
                    <button className="btn btn-success" 
                    disabled={savingToFirebase} 
                    onClick={checkStories}>
                    check current stories
                    </button>
              </Grid>
              <Grid item xs={12}  >
              <div className="form-group">
                 <textarea class="form-control" 
                            rows="2" 
                            value={name} 
                            onChange={onNameChange} placeholder="story name"
                            /> 
              </div>
             </Grid>
             {/* <Grid item xs={12}  >
                picture 
                <input type="file" 
                        className="form-control" 
                        id="imageFile" 
                        onChange={onFileChange}/>
            </Grid>    */}
             <Grid item xs={12} >
                    Choose a level
                    <select name="level" id="level" onChange={(e)=> setLevel(e.target.value)}>
                    <option value="-1"> choose </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    </select>
             </Grid>
             <Grid item xs={12}  >
                 <div className="form-group">
                     <textarea className="form-control" 
                                rows="6" 
                                value={content} 
                                onChange={onContentChange} 
                                placeholder="story content" /> 
                 </div>
            </Grid>
            <Grid  item xs={12} >
                <div style={{display:"flex", flexDirection:"row"}}>
                
                { name==="" || level===-1 || content===""? 
                <div className="alert alert-danger" role="alert">
                      {name===""? " name ! " : " "}{level === -1 ? " level!" : " "}{content===""?" content! ":""}
                 </div>
                : <Audio  callbackAudio={handleAudioSave}/>  }

               { audioBlob===null? <div className="alert alert-danger" role="alert"> audio! </div> :null }

                <button className="btn btn-success" 
                        disabled={name===""|| level==="" || audioBlob===null  }
                        onClick={onContentLevelAdded}>save and add
                 </button>

                </div>
            </Grid>
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
                             <audio src={audioURLs[index]} controls /> 
                                </CardContent>    
                                <CardActions>      
                                    <Button size="small" color ="primary" onClick={()=>onDelete(index)}> x </Button>      
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