import React, {useEffect, useState} from'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import {checkedAuthState, 
    usernameState, 
    firebaseState,
    isTeacherState, 
    userIdState,
    likedWordList,
    likedStoryList } from "../../store/AuthAtoms"
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
import WordsPagination from './WordCard/WordsPagination/WordsPagnation';
import "./WordWall.css";
//TODO:store it in firebase

const WordWall = (props)=>{
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [likedWords, setLikedWords] = useRecoilState(likedWordList);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [wordList, setWordList] = useState([...props.words]);
    const [wordPageArrays, setwordPageArrays] = useState([]);
    const [pagesNum, setPagesNum]= useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    const [error,setError] = useState("");
    
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
                //TODO: Delete static word List
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
        <div className="wallMain p-5">
            <div class="row">
                <div class="col-sm-4">
                    <div class="col-xs-2 active-cyan">
                        <input class="form-control" id="ex1" type="text" placeholder="search by chinese character"/> {error}
                    </div>
                </div>   
                {userName? 
                <div class="col-sm-4">
                  <div class="col-xs-2 active-cyan">
                  <button className="btn btn-outline-info">  search </button>
                  </div>
                </div> : null  }
            </div>
            <WordsPagination wordsNum={wordList.length} 
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
                wordPageArrays[currentPage].map((item,index)=> 
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