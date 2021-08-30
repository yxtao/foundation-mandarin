import React, {useEffect, useState} from'react';
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
import WordsPagination from './WordCard/WordsPagination/WordsPagnation';
//TODO:store it in firebase
const cardList = [
    {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {name:"你", phrases:["你们","你在"],sentences:["你们在家"]},
    {name:"在", phrases:["我在"],sentences:["我们在家"]},
    {name:"们", phrases:["我们"],sentences:["我们在家"]},
    {name:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {name:"水", phrases:["喝水"],sentences:["我喝水"]},
    {name:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    {name:"test", phrases:["我们","我在"],sentences:["我们在家"]},
    {name:"test1", phrases:["你们","你在"],sentences:["你们在家"]},
    {name:"test2", phrases:["我在"],sentences:["我们在家"]},
    {name:"们", phrases:["我们"],sentences:["我们在家"]},
    {name:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {name:"水", phrases:["喝水"],sentences:["我喝水"]},
    {name:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
    {name:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {name:"你", phrases:["你们","你在"],sentences:["你们在家"]},
    {name:"在", phrases:["我在"],sentences:["我们在家"]},
    {name:"们", phrases:["我们"],sentences:["我们在家"]},
    {name:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {name:"水", phrases:["喝水"],sentences:["我喝水"]},
    {name:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
]

const WordWall = (props)=>{
    
    const [wordList, setWordList] = useState([...props.words, ...cardList]);
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
        <div style={{marginTop:"20vh"}}>
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