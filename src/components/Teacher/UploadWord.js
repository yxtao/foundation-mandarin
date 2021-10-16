import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";
import Compressor from 'compressorjs';

import Audio from '../Audio/Audio';
import "./Teacher.css";
import firebase from '../../firebase/firebase';

const db = firebase.firestore();
const storage = firebase.storage();

const UploadWord=()=>{
   const [name, setName] = useState("");
   const [phrase, setPhrase] = useState("");
   const [pinyin, setPinyin] = useState("");
   const [wordMeaning, setWordMeaning] = useState("");
   const [phraseMeaning, setPhraseMeaning] = useState("");
   const [sentenceMeaning, setSentenceMeaning] = useState("");
   const [phraseMeanings, setPhraseMeanings] = useState([]);
   const [sentenceMeanings, setSentenceMeanings] = useState([]);
   const [wordLevel,setWordLevel] = useState(-1);
   const [wordAudio, setwordAudio] = useState("");
   const [wordAudioURL, setwordAudioURL] = useState("");
   const [xiangxingImage, setXiangxingImage] = useState(null);
   const [strokeImage, setStrokeImage] = useState(null);
   const [sentence, setSentence] = useState("");
   const [sentences, setSentences] = useState([]);
   const [sentencesAudios, setSentencesAudios] = useState([]);
   const [sentenceAudio, setSentenceAudio] = useState(null);
   const [sentenceAudioURL, setSentenceAudioURL] = useState("");
   const [sentencesAudiosURLs, setSentencesAudiosURLs] = useState([]);
   const [file, setFile] = useState(null);
   const [levels, setLevels] = useState([]);
   const [level, setLevel] = useState(-1);
   const [phrases, setPhrases] = useState([]);
   const [audios, setAudios] = useState([]);
   const [audioBlob, setAudioBlob] = useState(null);
   const [moveOn, setMoveOn] = useState(false);
   const [audioURL, setAudioURL] = useState("");
   const [audioURLs, setAudioURLs] = useState([]);
   const [savingToFirebase, setSavingToFireBase] = useState(false);

   const history = useHistory();

   const checkWords = () => {
      history.push("/wordwall");
   }
   
   const onNameChange = (e)=>{
       setName(e.target.value)
   }
   const onWordMeaningChange = (e) =>{
       setWordMeaning(e.target.value);
   }

   const onPharseMeaningChange =(e) =>{
       setPhraseMeaning(e.target.value);
   }

   const onSentenceMeaningChange =(e)=>{
       setSentenceMeaning(e.target.value);
   }
   
   const onPhraseChange =(e)=>{
       setPhrase(e.target.value)
   }
   const onPinyinChange =(e)=>{
       setPinyin(e.target.value);
   }
   const onXiangxingImageChange =(e)=>{
       const image = e.target.files[0];
       let size = e.target.files[0].size/1024/1024;
       if(size>1){
        new Compressor(image, {
            quality:0.01,
            success:(compressedResult)=>{
                setXiangxingImage(compressedResult);
            }
         }) 
       }else{
        new Compressor(image, {
            quality:0.1,
            success:(compressedResult)=>{
                setXiangxingImage(compressedResult);
            }
         }) 
        }
    }
   
   const onStrokeImageChange =(e)=>{
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
            quality:0.1,
            success:(compressedResult)=>{
             setStrokeImage(compressedResult);
            }
        })
     }
   }
   const onSentenceChange = (e)=>{
       setSentence(e.target.value);
   }
   const handleWordAudioSave = (blobObj, audioURL) =>{
    setwordAudio(blobObj);
    setwordAudioURL(audioURL); 
   }
   const handleSentenceAudioSave = (blobObj, audioURL) =>{
    setSentenceAudio(blobObj);
    setSentenceAudioURL(audioURL); 
   }
  
   const onFileChange =(e)=>{
       let size = e.target.files[0].size/1024/1024;
       const image = e.target.files[0];
       if(size >1) {
            new Compressor(image, {
                quality:0.01,
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
       (phrase!=="")&& setPhrases([...phrases,phrase]);
       (phraseMeaning!=="") && setPhraseMeanings([...phraseMeanings, phraseMeaning]);
       (sentenceMeaning!=="") && setSentenceMeanings([...sentenceMeanings, sentenceMeaning])
       setAudios([...audios,audioBlob]);
       setSentences([...sentences,sentence]);
       setAudioURLs([...audioURLs, audioURL])
       setSentencesAudios([...sentencesAudios, sentenceAudio]);
       setSentencesAudiosURLs([...sentencesAudiosURLs, sentenceAudioURL]);
       
       setPhrase("");
       setSentence("");
       setPhraseMeaning("");
       setSentenceMeaning("");
       setAudioBlob(null);
       setAudioURL("");
       setSentenceAudio(null);
       setSentenceAudioURL("");
       setMoveOn(true);
   }

  const onDelete =(index)=>{
      const newLevels= [...levels];
      const newPhrases = [...phrases];
      const newAudios = [...audios];
      const newAudioUrls = [...audioURLs];
      const newSentences = [...sentences];
      const newSentencesAudios = [...sentencesAudios];
      const newSentencesAudiosURLs = [...sentencesAudiosURLs];
      newLevels.splice(index, 1);
      newPhrases.splice(index,1);
      newAudios.splice(index,1);
      newSentences.splice(index,1);
      newAudioUrls.splice(index,1);
      newSentencesAudios(index,1);
      newSentencesAudiosURLs(index,1);
      setLevels(newLevels);
      setPhrases(newPhrases);
      setAudios(newAudios);
      setSentences(newSentences);
      setAudioURLs(newAudioUrls);
      setSentencesAudios(newSentencesAudios);
      setSentencesAudiosURLs(newSentencesAudiosURLs);
  }

  
  const handleAudioSave = (blobObj, audioURL) =>{
       setAudioBlob(blobObj);
       setAudioURL(audioURL); 
  }

   const onWordCreate = async ()=>{

        setSavingToFireBase(true);

        await db.collection("chinesewords").doc(name).set({
            name : name,
            pinyin: pinyin,
            wordMeaning: wordMeaning,
            phraseMeanings:phraseMeanings,
            sentenceMeanings:sentenceMeanings,
            wordLevel: wordLevel,
            phraseLevels : levels,
            phrases: phrases,
            sentences: sentences,

        })

      
      if (file!==null) {
            const storageRef = storage.ref()
            const fileRef = storageRef.child(`chinese/word/pictures/${name}`)
            await fileRef.put(file, {contentType:'image/jpeg'})
            await db.collection("chinesewords").doc(name).update({
            image: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                url: await fileRef.getDownloadURL()
            })
            })
       }
        if (xiangxingImage!==null) {
            const storageRef = storage.ref()
            const fileRef = storageRef.child(`chinese/word/xiangxingimage/${name}`)
            await fileRef.put(xiangxingImage, {contentType:'image/jpeg'})
            await db.collection("chinesewords").doc(name).update({
                xiangxingImage: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                url: await fileRef.getDownloadURL()
                })
            })
        }
        if (strokeImage!==null) {
            const storageRef = storage.ref()
            const fileRef = storageRef.child(`chinese/word/stokeimage/${name}`)
            await fileRef.put(strokeImage, {contentType:'image/jpeg'})
            await db.collection("chinesewords").doc(name).update({
                strokeImage: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                url: await fileRef.getDownloadURL()
                })
            })
        }
        if (wordAudio!==null) {
            const storageRef = storage.ref()
            const wordAudioRef= storageRef.child(`chinese/word/wordAudio/${name}`)
            await wordAudioRef.put(wordAudio, {contentType:'audio/webm;codecs=opus'})
            await db.collection("chinesewords").doc(name).update({
                wordAudio: firebase.firestore.FieldValue.arrayUnion({
                name: name,
                url: await wordAudioRef.getDownloadURL()
                })
            })
        }

        const storageRef = storage.ref()
        const phraseAudiosRef= storageRef.child(`chinese/word/phrasesAudios/${name}`)
        for (let index=0; index<audios.length; index++) {
                await phraseAudiosRef.child(`/${index}`).put(audios[index], {contentType:'audio/webm;codecs=opus'})
                const audioRef= phraseAudiosRef.child(`/${index}`)
                await db.collection("chinesewords").doc(name).update({
                    phraseAudios: firebase.firestore.FieldValue.arrayUnion({
                    name: name,
                    url: await audioRef.getDownloadURL()
                })
            })
        }
        const sentencesAudiosRef= storageRef.child(`chinese/word/sentencesAudios/${name}`)
        for (let index=0; index<sentencesAudios.length; index++) {
                await sentencesAudiosRef.child(`/${index}`).put(sentencesAudios[index], {contentType:'audio/webm;codecs=opus'})
                const audioRef= sentencesAudiosRef.child(`/${index}`)
                await db.collection("chinesewords").doc(name).update({
                    sentencesAudios: firebase.firestore.FieldValue.arrayUnion({
                    name: name,
                    url: await audioRef.getDownloadURL()
                })
            })
        }
       setName("");
       setPinyin("");
       setFile(null);
       setStrokeImage(null);
       setXiangxingImage(null);
       setPhrases([]);  
       setLevels([]) ;
       setAudios([]);
       setAudioURLs([]);
       setPhrase("");
       setAudioBlob(null);
       setSavingToFireBase(false);
       setSentences([]);
       setSentenceAudio(null);
       setSentenceAudioURL("");
       setSentencesAudios([]);
       setSentencesAudiosURLs([]);
       setMoveOn(false);
   }

    return (
       <div className="form-group StoryUploadDiv">
           <Grid container spacing={3} > 
              <Grid item xs={12} >
                    <button className="btn btn-success" 
                    disabled={savingToFirebase} 
                    onClick={checkWords}>
                    查看已有汉字
                    </button>
              </Grid>
          
             <Grid item  
              container 
              direction="row"
              alignItems="stretch"
              justifyContent="space-around">
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
            </Grid>
             <Grid  item xs={12} > 
                <Audio  callbackAudio={handleWordAudioSave}/> 
            </Grid>  
             <Grid item xs={12} >
                    汉字级别
                    <select name="level" id="level" onChange={(e)=> setWordLevel(e.target.value)}>
                    <option value="-1"> choose </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    </select>
             </Grid>
             
             <Grid item  
              container 
              direction="row"
              alignItems="stretch"
              justifyContent="space-around">
                    <Grid item >       
                        字插图 
                        <input type="file" 
                                className="form-control" 
                                id="imageFile" 
                                onChange={onFileChange}/>
                    </Grid>
                    <Grid item >       
                        笔顺图
                        <input type="file" 
                                className="form-control" 
                                id="imageFile" 
                                onChange={onStrokeImageChange}/>
                    </Grid>
                    <Grid item>  
                        象形图
                        <input type="file" 
                                className="form-control" 
                                id="imageFile" 
                                onChange={onXiangxingImageChange}/>
                    </Grid>
            </Grid>
            
            <Grid item  
              container 
              direction="row"
              alignItems="stretch"
              justifyContent="space-around">
                    <Grid item >       
                        <textarea className="form-control" 
                                    rows="2" 
                                    value={phrase} 
                                    onChange={onPhraseChange} 
                                    placeholder="词语" />  
                    </Grid>
                    <Grid item >       
                       词语级别
                        <select name="level" id="level" onChange={(e)=> setLevel(e.target.value)}>
                        <option value="-1"> choose </option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        </select>
                    </Grid>
                    <Grid item>  
                        <textarea  class="form-control"     
                                    value={phraseMeaning} 
                                    onChange={onPharseMeaningChange} placeholder="词语英语意思" /> 
                    </Grid>
            </Grid>

            <Grid  item xs={12} >
                <div style={{display:"flex", flexDirection:"row"}}>
                
                { name==="" || level===-1 || phrase==="" ? 
                <div className="alert alert-danger" role="alert">
                      {name===""? " 汉字 ! " : " "}{level === -1 ? " 级别!" : " "}{phrase===""?" 词语! ":""}
                 </div>
                : <Audio  callbackAudio={handleAudioSave}/>  }
                </div>
            </Grid>
            <Grid item xs={12}  >
              <div className="form-group">
                 <textarea  class="form-control" 
                            rows="1" 
                            value={sentence} 
                            onChange={onSentenceChange} placeholder="句子"
                            /> 
                 <textarea  class="form-control" 
                            rows="1" 
                            value={sentenceMeaning} 
                            onChange={onSentenceMeaningChange} placeholder="句子英语意思"
                            />             
              </div>
             </Grid>
             <Grid  item xs={12} >
                <div style={{display:"flex", flexDirection:"row"}}>
                
                { name==="" || level===-1 || phrase==="" ? 
                <div className="alert alert-danger" role="alert">
                      {sentence===""? " 句子 ! " : " "}
                 </div>
                : <Audio  callbackAudio={handleSentenceAudioSave}/>  }
                </div>
            </Grid>
            <Grid item xs={12}>
            { audioBlob===null || sentenceAudio===null? <div className="alert alert-danger" role="alert"> 录音! </div> :null }
                <button className="btn btn-success" 
                disabled={name===""|| level==="" || audioBlob===null || pinyin ==="" || wordAudio===null || sentence==="" || sentenceAudio===null}
                onClick={onContentLevelAdded}>保留查看
                </button>
                 等“添加进数据库”按钮出现
            </Grid>
            { moveOn === true? 
            <> 
            <Grid item xs={12}  >
                <Paper elevation={3} >
                    {levels.map((level, index)=> 
                                <Card key={index} raised={true}> 
                                <CardContent>
                                <p> {name} -级别-{wordLevel} </p> 
                                <p>{pinyin} </p>
                                <p>{wordMeaning} </p>
                                <audio src={wordAudioURL} controls /> 
                                <p> {phrases[index]} -词语级别- {level} </p> 
                                <p>{phraseMeanings[index]}</p>
                                <audio src={audioURLs[index]} controls /> 
                                <p> {sentences[index]} </p>
                                <p>{sentenceMeanings[index]}</p> 
                                <audio src={sentencesAudiosURLs[index]} controls /> 
                                </CardContent>    
                                <CardActions>      
                                    <Button size="small" color ="primary" onClick={()=>onDelete(index)}> x 删除 </Button>      
                                </CardActions>   
                                </Card>)}
                </Paper>
            </Grid>
            <Grid item xs={12}  >
                <button className="btn btn-success" disabled={savingToFirebase} onClick={onWordCreate}>添加进数据库 </button> 
            </Grid>
            </> 
            : null 
            }
        </Grid>
       </div>
    )
}

export default UploadWord;