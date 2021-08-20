import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";

import Audio from '../Audio/Audio'
import "./Teacher.css"
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const Teacher=()=>{
   const [name, setName] = useState("");
   const [content, setContent] = useState("");
   const [file, setFile] = useState(null);
   const [levels, setLevels] = useState([]);
   const [level, setLevel] = useState(-1);
   const [contents, setContents] = useState([]);
   const [audios, setAudios] = useState([]);
   const [audioBlob, setAudioBlob] = useState("");
   const [moveOn, setMoveOn] = useState(false);

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
       setFile(e.target.files[0])
   }

   const onContentLevelAdded =()=>{
       (level!==-1) && setLevels([...levels, level]);
       (content!=="")&& setContents([...contents,content]);
       let audioArray = [...audios];
       audioArray.push(audioBlob)
       setAudios([audioArray]);
       console.log("aeed", audioBlob)
       console.log("audios", audios)
       setContent("");
       setMoveOn(true);
   }
  const onDelete =(index)=>{
      const newLevels= [...levels];
      const newContents = [...contents];
      const newAudios = [...audios];
      newLevels.splice(index, 1)
      newContents.splice(index,1)
      newAudios.splice(index,1)
      setLevels(newLevels);
      setContents(newContents);
      setAudios(newAudios);
  }

  const onUpdate = (index) =>{
      setLevel(levels[index]);
      setContent(contents[index]);
      onDelete(index);
  }
  const handleAudioSave = async (blobObj) =>{
      console.log("handleAudioSave from ", blobObj)
      //const blob = await fetch(blobObj).then(r=>r.blob())
    //  let audioFile= new File(blob, "audio1.wav", {type:'audio/wav'}) 
      console.log(typeof(blobObj))
       setAudioBlob(blobObj);
       console.log(JSON.stringify(blobObj))
      console.log("handleAudioSave", audioBlob);
      
  }

   const onStoryCreate = async ()=>{
       
        await db.collection("story").doc(name).set({
            name : name,
            levels : levels,
            contents: contents,
        })

    //     const storageRef = storage.ref()
    //     const audiosRef= storageRef.child(`story/audio/${name}`)

    //     for (let index=0; index<audios.length; index++) {
    //         await audiosRef.child(`/${index}`).put(audios[index], {contentType:'image/jpeg'})
    //         const audioRef= audiosRef.child(`/${index}`)
    //         await db.collection("story").doc(name).update({
    //             audios: firebase.firestore.FieldValue.arrayUnion({
    //             name: name,
    //             url: await audioRef.getDownloadURL()
    //         })
    //     })
    //   }
      
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

    if(audioBlob !==null) {
        const storageRef = storage.ref()
          const fileRef = storageRef.child(`story/voice/${name}`)
          await fileRef.put(audioBlob, {contentType:'audio/webm;codecs=opus'})
          console.log("voice upload", audioBlob)
          await db.collection("story").doc(name).update({
             voice: firebase.firestore.FieldValue.arrayUnion({
                 name: name,
                 url: await fileRef.getDownloadURL()
             })
          })
      } else{alert("audioBlob is null ")}

       setFile(null)
       setContents([]);  
       setLevels([]) ;
       setName([]);
       setAudios([]);
       setMoveOn(false);
   }

    return (
       <div className="form-group ContainerMain">
          <div className="alert alert-danger" role="alert">
                     {name===""? " name ! " : " "}{level=== -1 ? " level !" : " "}{audioBlob===null ? " audio upload !" : " "}
         </div>
           <Grid container spacing={3} > 
              <Grid item xs={12}  >
              <div className="form-group">
                 <textarea class="form-control" 
                            rows="2" 
                            value={name} 
                            onChange={onNameChange} placeholder="story name"
                            /> 
              </div>
             </Grid>
             <Grid item xs={12}  >
                picture 
                <input type="file" 
                        className="form-control" 
                        id="imageFile" 
                        onChange={onFileChange}/>
            </Grid>   
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
                {/* <input type="file" 
                       className="form-control" 
                       id="audioFile"
                       onChange={onAudioChange} />
                
                 <button className="btn btn-success" 
                        onClick={()=>handleAudioUpload}> 
                        upload audio */}
                {/* </button>     */}
                </div>
                <Audio callbackAudio={handleAudioSave}/> 
            </Grid>
            <Grid item xs={12} >
                <button className="btn btn-success" 
                        disabled={name===""|| level==="" || audioBlob===null  }
                        onClick={onContentLevelAdded}>save and check
                 </button>
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
                                <p>AUDIO</p>
                                </CardContent>    
                                <CardActions>      
                                    <Button size="small" color ="primary" onClick={()=>onDelete(index)}> x </Button>
                                    <Button size="small" color ="primary" onClick={()=>onUpdate(index)}>update</Button>
                                    
                                </CardActions>   
                                </Card>)}
                </Paper>
            </Grid>
            <Grid item xs={12}  >
                <button className="btn btn-success"  onClick={onStoryCreate}>Create the story </button> 
            </Grid>
            </> 
            : null 
            }
           <Grid item xs={12} >
                <button className="btn btn-success" onClick={checkStories}>check current stories</button>
            </Grid>
        </Grid>
       </div>
    )
}

export default Teacher;