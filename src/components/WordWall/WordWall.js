import React, {useEffect, useState} from'react';
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
import WordsPagination from './WordCard/WordsPagination/WordsPagnation';
import "./WordWall.css";
//TODO:store it in firebase

const WordWall = (props)=>{
    
    const [wordList, setWordList] = useState([...props.words]);
    const [wordPageArrays, setwordPageArrays] = useState([]);
    const [pagesNum, setPagesNum]= useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(0);
    
    const handleDeleteCallback = (word) =>{
        //doing nothing  right now
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
        <div className="wall-wrap-div">
            <WordsPagination wordsNum={wordList.length} callbackRowsPerPage={handleCallbackRowsPerPage} callbackCurrentPage={handleCallbackCurrentPage }/>
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
                        <Grid key={index} item xs={6} sm={4} md={3} > 
                        <WordCard wordData={item} parentDeleteCallback={handleDeleteCallback} hideDelete={true}/> 
                        </Grid>) 
                } 
            </Grid>
        </div>
    )
}

export default WordWall