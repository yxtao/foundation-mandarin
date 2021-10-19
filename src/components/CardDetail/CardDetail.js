import React,{useState, useEffect} from 'react';
import { useRecoilValue , useRecoilState} from "recoil";
import { useParams } from 'react-router-dom';

import test1 from "../../assets/images/wordcards/test1.jpg";
import "./CardDetail.css"

const CardDetail = (props)=>{
    const name = useParams().word; 
    const [wordData, setWordData] = useState(null);
    const [phrasesData, setPhrasesData] = useState([]);
    const [sentencesData, setSentencesData] = useState([]);
    
    useEffect(()=>{
       setWordData(props.wordList.find(element => element.name===name));
       let phrasesInfo = [];
       let sentencesInfo = [];
       
       if(!wordData) return;
       if(wordData && "phrases" in wordData){
    
           for(let i=0; i<wordData.phrases.length; i++){
               let phraseObj =null;
               if("phraseMeanings" in wordData){
                    phraseObj = {
                        phrase:wordData.phrases[i],
                        phraseAudio:wordData.phraseAudios[i].url,
                        phraseLevel:wordData.phraseLevels[i],
                        phraseMeaning:wordData.phraseMeanings[i]
                    }
                } else{
                    phraseObj = {
                        phrase:wordData.phrases[i],
                        phraseAudio:wordData.phraseAudios[i].url,
                        phraseLevel:wordData.phraseLevels[i],
                    }
               }
            phrasesInfo.push(phraseObj);
           }
           setPhrasesData(phrasesInfo);
        }
       
    
       if(wordData && "sentences" in wordData){
           for(let k=0; k<wordData.sentences.length; k++){
                let sentenceObj = null;
                if("sentenceMeanings" in wordData){
                        sentenceObj = {
                        sentence:wordData.sentences[k],
                        sentenceAudio:wordData.sentencesAudios[k].url,
                        sentenceMeaning: wordData.sentenceMeanings[k]
                    }
                } else{
                        sentenceObj = {
                        sentence:wordData.sentences[k],
                        sentenceAudio:wordData.sentencesAudios[k].url
                    } 
                }
                sentencesInfo.push(sentenceObj);
            }
            setSentencesData(sentencesInfo);
        }

    },[name, props.wordList, wordData])

    if (!wordData) {
        return <div className="container-wrapper-detail"> loading... </div>
    }
    return (
        <div className="container-wrapper-detail p-3 p-lg-5"> 
            <div class="card cardDiv">
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
                                <h1 class="card-title">{wordData && wordData.name? wordData.name: "name has not uploaded"}</h1>
                                <h2 class="card-title">{wordData && wordData.pinyin? wordData.pinyin: "pinyin has not uploaded"}</h2>
                                <h6 class="card-title">{wordData && wordData.wordMeaning? wordData.wordMeaning: ""}</h6>
                            </div>
                            <div className = "col">
                            { wordData && wordData.wordAudio ? 
                                <audio controls class="embed-responsive-item">
                                    <source src= {wordData.wordAudio[0].url} />
                                </audio>
                                :null
                             }
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <div className="container">
                            {phrasesData.map(obj=> 
                            <div className = "row">
                                <div className = "col">
                                    <h2 class="card-title">{obj.phrase}</h2>
                                    <h6 class="card-title"> {"phraseMeaning" in obj?obj.phraseMeaning:""}</h6>
                                    <br/>
                                    <h6 class="card-title">{" "}Level {obj.phraseLevel}</h6>
                                </div>
                                <div className = "col">
                                    <audio controls class="embed-responsive-item">
                                        <source src={ obj.phraseAudio} />
                                    </audio>
                                </div>
                            </div>
                            )}
                        </div>
                    </li>
                    <li class="list-group-item">
                        <div className="container">
                            {sentencesData.map(obj=> 
                            <div className = "row">
                                <div className = "col">
                                    <h3 class="card-title">{obj.sentence}</h3>
                                    <h7 class="card-title">{"sentenceMeaning" in obj?obj.sentenceMeaning:""}</h7>
                                </div>
                                <div className = "col">
                                    <audio controls class="embed-responsive-item">
                                        <source src={ obj.sentenceAudio} />
                                    </audio>
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

export default CardDetail;