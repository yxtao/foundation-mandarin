import React, {useEffect, useState} from'react';
import { useRecoilState, useRecoilValue } from "recoil";
import {usernameState,isTeacherState, userIdState } from "../../store/AuthAtoms"
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
import WordsPagination from './WordCard/WordsPagination/WordsPagnation';
import "./WordWall.css";
//TODO:store it in firebase

const WordWall = (props)=>{
    const isTeacher = useRecoilValue(isTeacherState);
    const [userName, setUserName] = useRecoilState(usernameState);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [wordList, setWordList] = useState([...props.words]);
    const [wordPageArrays, setwordPageArrays] = useState([]);
    const [pagesNum, setPagesNum]= useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    
    const handleDeleteCallback = (wordId) =>{
        // TODO change to creator in database to "none!" 
    }
    const handleLikeCallback = (wordId) =>{
     // Add it to users' liked list 
    }
    const handleRemoveLikeCallback = (wordId) =>{
        // if exist , remove it from users' liked list 
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
      console.log("wordPageArrays", wordPageArrays);
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
                        <input class="form-control" id="ex1" type="text" placeholder="search by chinese character"/>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="col-xs-2 active-cyan">
                        <input class="form-control" id="ex1" type="text" placeholder="search by english meaning"/>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="col-xs-2 active-cyan">
                        <input class="form-control" id="ex1" type="text" placeholder="search by level"/>
                    </div>
                </div>
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
                            hideDelete={item.creator !== userName}
                            hideLike = {isTeacher && item.creator === userName}
                            hideRemoveLike = {isTeacher && item.creator === userName}/> 
                        </Grid>) 
                } 
            </Grid>
        </div>
    )
}

export default WordWall