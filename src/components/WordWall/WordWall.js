import React, {useEffect, useState} from'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import {checkedAuthState, 
    usernameState, 
    firebaseState,
    isTeacherState, 
    userIdState,
    likedWordList } from "../../store/AuthAtoms"
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
import WordsPagination from './WordCard/WordsPagination/WordsPagnation';
import "./WordWall.css";
//TODO:store it in firebase

const WordWall = (props)=>{
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [target, setTarget] = useState("");
    const [likedWords, setLikedWords] = useRecoilState(likedWordList);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [wordList, setWordList] = useState([...props.words]);
    const [wordListBackUp, setWordListBackUp] = useState([...props.words]);
    const [wordPageArrays, setwordPageArrays] = useState([]);
    const [pagesNum, setPagesNum]= useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    const [error,setError] = useState("");
    const [creators, setCreators] = useState([]);
    const [checkedStates, setCheckedStates] = useState([]);
    const [checkedPinyinStates, setCheckedPinyinStates] = useState([]);
    const [selectedCreators,setSelectedCreators] = useState([]);
    const [selectedPinyin, setSelectedPinyin] = useState([]);
    const pinyinLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    useEffect(()=>{  
        let temp = [];
        wordListBackUp.forEach((e)=>{
            if(!temp.includes(e.creator)){
                temp.push(e.creator);
            }
        })
        setCreators(temp); 
        setCheckedPinyinStates( new Array(26).fill(false));  
    },[])
   
   useEffect(()=>{
    setCheckedStates( new Array(creators.length).fill(false)); 
   },[creators.length])
   
   useEffect(()=>{
     let wordListCopy = [...wordListBackUp];
     if(selectedCreators.length!==0){
         const result = wordListCopy.filter((word)=>selectedCreators.includes(word.creator));
         setWordList(result);
     }else{
        setWordList(wordListBackUp);
     } 
   },[selectedCreators,wordListBackUp])

   useEffect(()=>{
    let wordListCopy = [...wordListBackUp];
    if(selectedPinyin.length!==0){
        const result = wordListCopy.filter((word)=>selectedPinyin.includes(word.pinyin.toUpperCase().charAt(0)));
        setWordList(result);
    }else{
       setWordList(wordListBackUp);
    } 
  },[selectedPinyin, wordListBackUp])

    const handleOnChange = (position) => {
        const updatedCheckedStates = checkedStates.map((item, index) =>index === position ? !item : item);
        setCheckedStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(creators[index]);
            }
            console.log(selected)
        })
        setSelectedCreators(selected);
    }
    const handleSelectedPinyinOnChange = (position) => {
        const updatedCheckedStates = checkedPinyinStates.map((item, index) =>index === position ? !item : item);
        setCheckedPinyinStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(pinyinLetters[index]);
            }
            console.log(selected)
        })
        setSelectedPinyin(selected);
    }

    const handleTargetChange= (e)=>{
        if(e.target.value===""){
            setWordList(wordListBackUp);
        }
        setTarget(e.target.value.trim());
    }
    const onSearch = ()=>{
        let wordListCopy = [...wordList];
        if(target !== ""){
            const result = wordListCopy.filter((word)=>word.name === target);
            setWordList(result);
        }else{
            setWordList(wordListBackUp);
        } 
    }
     
    const onClearFilter =()=>{
        setCheckedPinyinStates( new Array(26).fill(false));  
        setCheckedStates( new Array(creators.length).fill(false)); 
        setSelectedCreators([]);
        setSelectedPinyin([]);
    }
    const handleDeleteCallback = async (wordId) =>{
        try{
            await firebase.firestore().collection("chinesewords").doc(wordId).delete();
        }catch(err){
            setError(err.message);
        }
    }
    const handleLikeCallback = async (wordId) =>{ 
        try {
            await updatelikedWordCards(userId, [...likedWords,wordId]);
        }catch(err){
            setError(err.message)
        }
        setLikedWords((pre) => [...pre,wordId]);
    }
    const handleRemoveLikeCallback = async (wordId) =>{
        let words = [...likedWords];
            words= words.filter(word=> word!==wordId);
        try {
            await updatelikedWordCards(userId, words);
        }catch(err){
            setError(err.message)
        }
        setLikedWords(words);
     }
     const updatelikedWordCards = async(uid, words)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedWordCards:words
            })
          }catch(err){    
            setError(err.message);
          }
      }
    
    useEffect(()=>{
      const pagesArray=[]; 
      if(wordList.length<rowsPerPage) {
          pagesArray.push(wordList);
          setwordPageArrays(pagesArray);
          setPagesNum(1);
      } else{
            for(let i = 0; i<wordList.length; i=i+rowsPerPage) {
                const words =[...wordList];
                let shortArray = words.slice(i,i+rowsPerPage)
                pagesArray.push(shortArray);
            }
            setwordPageArrays(pagesArray);
            setPagesNum(wordPageArrays.length);
        }
    },[rowsPerPage, wordList, pagesNum])

    const handleCallbackRowsPerPage = (e)=>{
      setRowsPerPage(e)
    }
    const handleCallbackCurrentPage = (e)=>{
     setCurrentPage(e)
    }

    return(
        <div className="wallMain">
            <div className="row">
                <div className="col-sm-2">
                    <div class="col-xs-2 active-cyan">
                        <input 
                            className="form-control" 
                            type="text" 
                            placeholder="Chinese character"
                            value = {target}
                            onChange ={(e)=>handleTargetChange(e)}
                         /> {error}
                         <div className="pt-1 active-cyan">
                            <button className="btn btn-outline-info" onClick={onSearch}>  search </button>
                        </div>
                    </div>
                </div>   

                <div className="col-sm-3">
                    by usernames
                  <div className= "creators-checkbox-div">
                    <ul>
                    {creators.sort((a,b)=> a.toLowerCase().localeCompare(b.toLowerCase()))
                             .map((name, index)=>
                            <li>
                                <div  key={index}> 
                                <input 
                                    type="checkbox"
                                    id={`custom-checkbox-${index}`}
                                    name={name}
                                    value={name}
                                    checked={checkedStates[index]}
                                    onChange={() => handleOnChange(index)}
                                />
                                &nbsp;
                                <label for={`custom-checkbox-${index}`}>{name}</label>
                                </div> 
                            </li>
                        )}
                        </ul>
                    </div>
                </div> 
                <div className="col-sm-3 ">
                    1st letter of Pinyin
                    <div className="creators-checkbox-div"> 
                    <ul>
                        {pinyinLetters.sort().map((letter, index)=>
                            <li>
                                <div  key={index}> 
                                <input 
                                    type="checkbox"
                                    id={`custom-checkbox-pinyin-${index}`}
                                    name={letter}
                                    value={letter}
                                    checked={checkedPinyinStates[index]}
                                    onChange={() => handleSelectedPinyinOnChange(index)}
                                />
                                &nbsp;
                                <label for={`custom-checkbox-pinyin-${index}`}>{letter}</label>
                                </div> 
                            </li>
                        )}
                        </ul>
                    </div>
                </div>  
                <div className="col-sm-2 ">
                    <button className="btn btn-sm btn-outline-primary" onClick={onClearFilter}>  clear filter </button>
                </div>   
            </div>
            <WordsPagination
                wordsNum={wordList.length} 
                callbackRowsPerPage={handleCallbackRowsPerPage} 
                callbackCurrentPage={handleCallbackCurrentPage }/>
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {wordPageArrays.length!==0 && 
                wordPageArrays[currentPage] &&
                wordPageArrays[currentPage].length!==0 && 
                wordPageArrays[currentPage].sort((a,b)=>a.wordLevel-b.wordLevel).map((item,index)=> 
                        <Grid key={index} item xs={12} sm={4} md={3} > 
                        <WordCard wordData={item} 
                            parentDeleteCallback={handleDeleteCallback} 
                            parentLikeCallback = {handleLikeCallback}
                            parentRemoveLikeCallback = {handleRemoveLikeCallback }
                            hideDelete={!isTeacher || item.creator !== userName }
                            hideLike = {!isTeacher || item.creator === userName || likedWords.includes(item.wordId)}
                            hideRemoveLike = {!isTeacher || item.creator === userName || !likedWords.includes(item.wordId) }/> 
                        </Grid>) 
                } 
            </Grid>
        </div>
    )
}

export default WordWall