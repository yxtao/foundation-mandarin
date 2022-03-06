import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { usernameState,isAdminState,isTeacherState } from "../../store/AuthAtoms"
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";
import Compressor from 'compressorjs';

import Audio from '../Audio/Audio';
import "./Teacher.css";
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const UploadWord=()=>{
   const isAdmin = useRecoilValue(isAdminState);
   const isTeacher = useRecoilValue(isTeacherState);
   const [user, setUser] = useRecoilState(usernameState);
   const [name, setName] = useState("");
   const [pinyin, setPinyin] = useState("");
   const [wordLevel,setWordLevel] = useState(0);
   const [strokeImage, setStrokeImage] = useState(null);
   const [image, setImage] = useState(null);
   const [wordMeaning, setWordMeaning] = useState("");
   const [phraseMeanings, setPhraseMeanings] = useState([""]);
   const [sentenceMeanings, setSentenceMeanings] = useState([""]);
   const [sentences, setSentences] = useState([""]);
   const [levels, setLevels] = useState(["0"]);
   const [phrases, setPhrases] = useState([""]);
   const [savingToFirebase, setSavingToFireBase] = useState(false);
   const [error, setError] = useState("");
   const [imageSource, setImageSource] = useState("");
   const [strokeSource, setStrokeSource] = useState("");

   const onNameChange = (e)=>{
       setName(e.target.value)
   }
   const onWordMeaningChange = (e) =>{
       setWordMeaning(e.target.value);
   }
   const handlePharsesChange =(e, index) =>{
        const temp = [...phrases]
        temp[index] = e.target.value;
        setPhrases(temp);
   } 
   const handlePharsesMeaningChange =(e, index) =>{
        const temp = [...phraseMeanings]
        temp[index] = e.target.value;
        setPhraseMeanings(temp);
   }
   const handleLevelsChange=(e,index)=>{
        const temp = [...levels]
        temp[index] = e.target.value;
        setLevels(temp);
   }
   const handleSentencesChange =(e, index)=>{
        const temp = [...sentences]
        temp[index] = e.target.value;
        setSentences(temp);
   }
   const handleSentencesMeaningChange =(e, index)=>{
        const temp = [...sentenceMeanings]
        temp[index] = e.target.value;
        setSentenceMeanings(temp);
   }
   const addCounts =()=>{
    const temp = [...sentences,""];
    setSentences(temp);
    const temp1 = [...phrases,""];
    setPhrases(temp1);
    const temp2 = [...levels,""];
    setLevels(temp2);
    const temp3= [...sentenceMeanings,""];
    setSentenceMeanings(temp3);
    const temp4 =[...phraseMeanings,""];
    setPhraseMeanings(temp4);
   }
   const onPinyinChange =(e)=>{
       setPinyin(e.target.value);
   }
   const isFileImage = (file)=> {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
   }
   const onStrokeSourceChange = (e) =>{
       setStrokeSource(e.target.value)
   }
   const onStrokeImageChange =(e)=>{
    setError("");
    if(e.target.files[0]==null) return;
    if(!isFileImage(e.target.files[0])){
        setStrokeImage(null);
        setError("Only allow jpeg and png files")
        return;
    }
       let size = e.target.files[0].size/1024/1024;
       const image = e.target.files[0];
       if(size > 1){
        new Compressor(image, {
            quality:0.01,
            success:(compressedResult)=>{
                setStrokeImage(compressedResult);
            }
        })
     }else{
        new Compressor(image, {
            quality:0.3,
            success:(compressedResult)=>{
             setStrokeImage(compressedResult);
            }
        })
     }
   }

   const onImageSourceChange = (e) =>{
       setImageSource(e.target.value)
   }
   const onImageChange =(e)=>{
    setError("");
    if(e.target.files[0]==null) return;
    if(!isFileImage(e.target.files[0])){
        setImage(null);
        setError("Only allow jpeg and png files")
        return;
    }
       let size = e.target.files[0].size/1024/1024;
       const image = e.target.files[0];
       if(size > 1){
        new Compressor(image, {
            quality:0.01,
            success:(compressedResult)=>{
                setImage(compressedResult);
            }
        })
     }else{
        new Compressor(image, {
            quality:0.3,
            success:(compressedResult)=>{
             setImage(compressedResult);
            }
        })
     }
   }
  
   const onWordCreate = async ()=>{

        setSavingToFireBase(true);
        try{
            await db.collection("chinesewords").doc(user+name).set({
                creator: user,
                wordId:user+name,
                name : name,
                pinyin: pinyin,
                wordMeaning: wordMeaning,
                phraseMeanings:phraseMeanings,
                sentenceMeanings:sentenceMeanings,
                wordLevel: wordLevel,
                phraseLevels : levels,
                phrases: phrases,
                sentences: sentences, 
                imageSource: imageSource,
                strokeSource: strokeSource
            })
            if (strokeImage!==null) {
                const storageRef = storage.ref()
                const fileRef = storageRef.child(`chinese/word/stokeimage/${user+name}`)
                await fileRef.put(strokeImage, {contentType:'image/jpeg'})
                await db.collection("chinesewords").doc(user+name).update({
                    strokeImage: firebase.firestore.FieldValue.arrayUnion({
                    name: name,
                    url: await fileRef.getDownloadURL()
                    })
                })
            }
            if (image!==null) {
                const storageRef = storage.ref()
                const fileRef = storageRef.child(`chinese/word/image/${user+name}`)
                await fileRef.put(image, {contentType:'image/jpeg'})
                await db.collection("chinesewords").doc(user+name).update({
                    image: firebase.firestore.FieldValue.arrayUnion({
                    name: name,
                    url: await fileRef.getDownloadURL()
                    })
                })
            }
        }catch(error){
            setError(error.message);
        }
       setName("");
       setPinyin("");
       setStrokeImage(null);
       setImage(null);
       setWordMeaning("");
       setStrokeImage(null);
       setWordLevel("0");
       setPhrases([""]);  
       setLevels([""]) ;
       setPhraseMeanings([""])
       setSentenceMeanings([""])
       setSentences([""])
       setSavingToFireBase(false);
   }
   if(!isAdmin && !isTeacher) return (
    <div className = "container m-5">
      You are not the admin or a teacher
    </div>
  )
    return (
       <div className="form-group StoryUploadDiv">
           <Grid container spacing={3} style={{ border: "1px solid grey" }}> 
             <Grid item  
              container 
              spacing={3}
              direction="row"
              alignItems="stretch">
                    <Grid item >       
                        <textarea  class="form-control" 
                                value={name} 
                                onChange={onNameChange} placeholder="汉字"/> 
                    </Grid>
                    <Grid item >       
                        <textarea  class="form-control" 
                                value={pinyin} 
                                onChange={onPinyinChange} placeholder="拼音" /> 
                    </Grid>
                    <Grid item>  
                        <textarea  class="form-control"     
                                    value={wordMeaning} 
                                    onChange={onWordMeaningChange} placeholder="英语意思" /> 
                    </Grid>
                    <Grid item>
                        <div className="h4 border p-2">
                        汉字级别    
                        <input 
                         placeholder = "word"
                         value={wordLevel}
                         onChange={(e)=> setWordLevel(e.target.value)}/>
                        </div>
                    </Grid>
                    <Grid item >       
                        图片 <span className="text-danger">{error}</span>
                        <input type="file" 
                                className="form-control" 
                                id="imageFile" 
                                onChange={onImageChange}/>
                        <input placeholder = "注明图片来源"
                               onChange = {onImageSourceChange}/>    
                    </Grid>
                    <Grid item >       
                        笔顺图 <span className="text-danger">{error}</span>
                        <input type="file" 
                                className="form-control" 
                                id="imageFile" 
                                onChange={onStrokeImageChange}/>
                        <input placeholder = "注明图片来源"
                               onChange = {onStrokeSourceChange}/>  
                    </Grid>
            </Grid>
            {phrases.map((phrase,index)=>
                <>
                 <Grid item  
                 container 
                 direction="row"
                 alignItems="stretch"
                 spacing ={3}>
                   <Grid item >       
                           <textarea className="form-control" 
                                       rows="2" 
                                       value={phrases[index]} 
                                       onChange={(e)=>handlePharsesChange(e,index)} 
                                       placeholder="词语" />  
                       </Grid>
                       <Grid item>  
                           <textarea  className="form-control"     
                                       value={phraseMeanings[index]} 
                                       onChange={(e)=>handlePharsesMeaningChange(e,index)} placeholder="词语英语意思" /> 
                       </Grid>
                       <Grid item >       
                          <div className="h4 border p-2">
                               词语级别
                               <input
                                 defaultValue = {levels[index]}
                                 value={levels[index]}
                                 onChange={(e)=> handleLevelsChange(e, index)}/>
                           </div>
                       </Grid>           
               </Grid>
   
               <Grid item xs={12}  >
               
                 <div className="form-group">
                    <textarea  className="form-control m-2" 
                               rows="1" 
                               value={sentences[index]} 
                               onChange={(e)=>handleSentencesChange(e,index)} 
                               placeholder="句子"
                               />
                    <textarea  className="form-control m-2" 
                               rows="1" 
                               value={sentenceMeanings[index]} 
                               onChange={(e)=> handleSentencesMeaningChange(e,index)} 
                               placeholder="句子英语意思"
                               />             
                 </div>
                </Grid>
                </>
            )}
             <button
                className="btn btn-outline-info ml-4 mb-5"
                onClick={addCounts}>
                + 添加词语和句子
             </button>
            { name &&
            <> 
            <Grid item xs={12}  >
                <button 
                    className="btn btn-success" 
                    disabled={savingToFirebase} 
                    onClick={onWordCreate}>
                    确定保存 
                </button> 
            </Grid>
            </> }
        </Grid>
       </div>
    )
}

export default UploadWord;