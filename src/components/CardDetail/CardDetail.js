import React,{useState, useEffect} from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import {usernameState,
        firebaseState,
        userIdState,
        isTeacherState,
        } from "../../store/AuthAtoms"
import { useParams } from 'react-router-dom';

import test1 from "../../assets/images/wordcards/test1.jpg";
import "./CardDetail.css"

const CardDetail = (props)=>{
    const wordId = useParams().word; 
    const isTeacher = useRecoilValue(isTeacherState);
    const user = useRecoilValue(usernameState);
    const [error, setError] = useState("");
    const firebase = useRecoilValue(firebaseState);
    const [wordData, setWordData] = useState(null);
    const [level, setlevel] = useState(0);
    const [phrasesData, setPhrasesData] = useState([]);
    const [sentencesData, setSentencesData] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [pinyin, setPinyin] = useState("");
    const [meaning,setMeaning] = useState("");
    const [phrases, setPhrases] = useState([]);
    const [phrasesMeanings, setPharasesMeanings] = useState([]);
    const [phrasesLevels, setPhrasesLevels] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [sentencesMeanings, setSentencesMeanings] = useState([]);
    
    useEffect(()=>{
       setWordData(props.wordList.find(element => element.wordId===wordId));
       let phrasesInfo = [];
       let sentencesInfo = [];
       
       if(!wordData) return;
       if(wordData && "phrases" in wordData){
    
           for(let i=0; i<wordData.phrases.length; i++){
               let phraseObj =null;
               if("phraseMeanings" in wordData){
                    phraseObj = {
                        phrase:wordData.phrases[i],
                      //  phraseAudio:wordData.phraseAudios[i].url,
                        phraseLevel:wordData.phraseLevels[i],
                        phraseMeaning:wordData.phraseMeanings[i]
                    }
                } else{
                    phraseObj = {
                        phrase:wordData.phrases[i],
                     //   phraseAudio:wordData.phraseAudios[i].url,
                        phraseLevel:wordData.phraseLevels[i],
                    }
               }
            phrasesInfo.push(phraseObj);
           }
           setPhrasesData(phrasesInfo);
           wordData.pinyin && setPinyin(wordData.pinyin);
           wordData.wordMeaning && setMeaning(wordData.wordMeaning);
           wordData.phrases && setPhrases(wordData.phrases);
           wordData.phraseMeanings && setPharasesMeanings(wordData.phraseMeanings);
           wordData.phraseLevels && setPhrasesLevels(wordData.phraseLevels);   
        }
       
    
       if(wordData && "sentences" in wordData){
           for(let k=0; k<wordData.sentences.length; k++){
                let sentenceObj = null;
                if("sentenceMeanings" in wordData){
                        sentenceObj = {
                        sentence:wordData.sentences[k],
                     //   sentenceAudio:wordData.sentencesAudios[k].url,
                        sentenceMeaning: wordData.sentenceMeanings[k]
                    }
                } else{
                        sentenceObj = {
                        sentence:wordData.sentences[k],
                      //  sentenceAudio:wordData.sentencesAudios[k].url
                    } 
                }
                sentencesInfo.push(sentenceObj);
            }
            setSentencesData(sentencesInfo);
            setSentences(wordData.sentences);
            wordData.sentenceMeanings && setSentencesMeanings(wordData.sentenceMeanings);
        }

    },[wordId, props.wordList, wordData])

    const startEditMode=()=>{
        setEditMode(true);
    }
    const offEditMode=async ()=>{
        try{
            await firebase.firestore().collection("chinesewords").doc(wordData.wordId).update({
                pinyin: pinyin,
                wordMeaning: meaning,
                phraseMeanings:phrasesMeanings,
                sentenceMeanings:sentencesMeanings,
                wordLevel: level,
                phraseLevels : phrasesLevels,
                phrases,
                sentences, 
            })
        setEditMode(false);
        }catch(err){
            setError(err.message);
        }
    }
    const handlePinyinChange=(e)=>{
        setPinyin(e.target.value);
    }
    const handleMeaningChange=(e)=>{
        setMeaning(e.target.value);
    }
    const handleLevelChange=(e)=>{
        setlevel(e.target.value);
    }
    const handlePharsesChange=(e, index)=>{
       let phrasesTemp = [...phrases];
       phrasesTemp[index]=e.target.value;
       setPhrases(phrasesTemp);
    }
    const handlePhrasesMeaningsChange=(e,index)=>{
        let meaningsTemp = [...phrasesMeanings]
        meaningsTemp[index] = e.target.value;
        setPharasesMeanings(meaningsTemp);
    }
    const handlePhrasesLevelsChange=(e,index)=>{
        let levelsTemp = [...phrasesLevels];
        levelsTemp[index] = e.target.value;
        setPhrasesLevels(levelsTemp);
    }
    const handleSentencesChange =(e,index)=>{
        let sentencesTemp = [...sentences];
        sentencesTemp[index] = e.target.value;
        setSentences(sentencesTemp);
    }
    const handleSentencesMeaningsChange=(e,index)=>{
        let meaningsTemp = [...sentencesMeanings];
        meaningsTemp[index] = e.target.value;
        setSentencesMeanings(meaningsTemp);
    }

    if (!wordData) {
        return <div className="container-wrapper-detail p-lg-5 "> loading... </div>
    }
    
    if(editMode){
        return(
            <div className="container-wrapper-detail p-lg-5"> 
            <div class="card cardDiv m-5">
                    <div className="m-3 text-right">
                        <button 
                            className="btn btn-outline-danger edit-button"
                            onClick={offEditMode}
                        > 确定保存
                        </button>
                    </div>
                <div className="container">   
                    <div className = "row p-2 p-lg-3">
                        {wordData && "image" in wordData ?
                        <div className = "col">
                        <img src={ wordData && wordData.image ? wordData.image[0].url : test1} className="img-responsive detail-image" alt="..." />
                        </div> :null
                        }
                        {wordData && "strokeImage" in wordData?
                        <div className = "col">
                        <img src={ wordData && wordData.strokeImage ? wordData.strokeImage[0].url : test1} className="img-responsive detail-image" alt="..." />
                        </div> : null
                        }
                    </div>
                </div>
                <div class="card-body">
                    <div className="container">
                        <div className = "row">
                            <div className = "col">
                                {error}
                                <h3 className="card-title">{wordData && wordData.name? wordData.name: "name has not uploaded"}</h3>
                                <div> 级别
                                    <input 
                                        className="card-title" 
                                        defaultValue= {wordData && wordData.wordLevel? wordData.level: ""}
                                        value={level}
                                        onChange={(e)=>handleLevelChange(e)}/>
                                </div>
                                <div> 拼音
                                    <input 
                                        className="card-title" 
                                        defaultValue= {wordData && wordData.pinyin? wordData.pinyin: "pinyin has not uploaded"}
                                        value={pinyin}
                                        onChange={(e)=>handlePinyinChange(e)}/>
                                </div>
                                 <div> 翻译
                                    <input 
                                        className="card-title" 
                                        defaultValue={wordData && wordData.wordMeaning? wordData.wordMeaning: ""}
                                        value={meaning}
                                        onChange={(e)=>handleMeaningChange(e)}/>
                                 </div>
                            </div>
                            <div className = "col">
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div className="container">
                            {phrasesData.map((obj, index)=> 
                            <div 
                                className = "row"
                                key={index}>
                                <div className = "col">
                                    <div> 词语
                                        <input 
                                            className="card-title"
                                            defaultValue = {obj.phrase}
                                            value={phrases[index]} 
                                            onChange={(e)=>handlePharsesChange(e, index)}/>
                                    </div>
                                    <div> 词语级别
                                        <input 
                                            className="card-title"
                                            defaultValue={phrasesLevels[index]}
                                            value={phrasesLevels[index]}
                                            onChange={(e)=>handlePhrasesLevelsChange(e,index)}/>
                                    </div>
                                </div>
                                <div className = "col">
                                    翻译
                                    <input 
                                        className="card-title"
                                        defaultValue={"phraseMeaning" in obj?obj.phraseMeaning:""}
                                        value={phrasesMeanings[index]}
                                        onChange={(e)=>handlePhrasesMeaningsChange(e,index)}/> 
                                </div>
                            </div>
                            )}
                        </div>
                    </li>
                    <li class="list-group-item">
                        <div className="container">
                            {sentencesData.map((obj, index)=> 
                            <div  className = "row" key={index}>
                                <div className = "col">
                                    句子
                                    <input 
                                        className="card-title"
                                        size = "50"
                                        value={sentences[index]}
                                        defaultValue={obj.sentence}
                                        onChange={(e)=> handleSentencesChange(e,index)}
                                     />
                                </div>
                                <div className = "col">
                                    句子意思
                                    <input 
                                        className="card-title"
                                        size = "50"
                                        value={sentencesMeanings[index]}
                                        defaultValue={"sentenceMeaning" in obj?obj.sentenceMeaning:""}
                                        onChange={(e)=>handleSentencesMeaningsChange(e,index)}/>
                                </div>
                            </div>
                            )}
                        </div>
                    </li>
                </ul>
                <div className="card-body">
                {wordData && "xiangxingImage" in wordData && wordData.xiangxingImage[0].url ?
                            <div> 
                                <img src={ wordData && wordData.strokeImage ? wordData.xiangxingImage[0].url : test1} className="img-responsive xiangxing-image" alt="..." />
                           </div>:null
                            }
                </div>
            </div>
        </div>
        )
    }
    return (
        <div className="container-wrapper-detail p-lg-2"> 
           
            <div className="card cardDiv">
            {isTeacher && wordData.creator === user &&
            <div className="m-3 text-right">
                <button 
                    className="btn btn-outline-danger"
                    onClick={startEditMode}
                > edit 编辑
                </button>
             </div>}
                <div className="container">
                    <div className = "row p-2 p-lg-3">
                        {wordData && "image" in wordData ?
                        <div className = "col">
                        <img src={ wordData && wordData.image ? wordData.image[0].url : test1} className="img-responsive detail-image" alt="..." />
                        </div> :null
                        }
                        {wordData && "strokeImage" in wordData?
                        <div className = "col">
                        <img src={ wordData && wordData.strokeImage ? wordData.strokeImage[0].url : test1} className="img-responsive detail-image" alt="..." />
                        </div> : null
                        }
                    </div>
                </div>
                <div className="card-body">
                    <div className="container">
                        <div className = "row">
                            <div className = "col">
                                <h3 className="card-title">{wordData && wordData.name? wordData.name: "name has not uploaded"}</h3>
                                <p className="card-title">level {wordData && wordData.wordLevel? wordData.wordLevel: "0"}</p>
                                <h3 className="card-title">{wordData && wordData.pinyin? wordData.pinyin: "pinyin has not uploaded"}</h3>
                                
                            </div>
                            <div className = "col">
                            <p className="card-title">{wordData && wordData.wordMeaning? wordData.wordMeaning: ""}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <div className="container">
                            {phrasesData.map((obj, index)=> 
                            <div className = "row" key={index}>
                                <div className = "col">
                                    <h3 className="card-title">{obj.phrase}</h3>
                                    <p className="card-title">{" "}Level {obj.phraseLevel}</p>
                                </div>
                                <div className = "col">
                                    <p className="card-title"> {"phraseMeaning" in obj?obj.phraseMeaning:""}</p>
                                </div>
                            </div>
                            )}
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="container">
                            {sentencesData.map(obj=> 
                            <div className = "row">
                                <div className = "col">
                                    <h6 className="card-title">{obj.sentence}</h6>
                                </div>
                                <div className = "col">
                                    <p className="card-title">{"sentenceMeaning" in obj?obj.sentenceMeaning:""}</p>
                                </div>
                            </div>
                            )}
                        </div>
                    </li>
                </ul>
                <div className="card-body">
                </div>
            </div>
        </div>
    )
}

export default CardDetail;