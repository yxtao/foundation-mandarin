import React, {useEffect, useState} from 'react';
import { useSetRecoilState, useRecoilState} from "recoil";
import {Grid} from'@material-ui/core';
import {wordsetstate } from "../../store/storyWordsAtoms"

import WordCard from '../WordWall/WordCard/WordCard';
import "./Recommendation.css"

const Recommendation =(props)=>{
  const [wordSets,setWordSets] = useRecoilState(wordsetstate);
  const [wordDataList, setWordDataList] = useState([]);
  useEffect(()=>{
      let array = wordSets;
      let set = [...new Set(array)];
      setWordSets(set);
      let tempList= [];
      for(let i=0; i<set.length; i++){
        const  wordArray = [...props.words];
        const objList = wordArray.filter(data=> data.name===set[i]);
        tempList = [...tempList, ...objList];
      }
      setWordDataList(tempList);
  },[])

  const handleDeleteCallback =(wordName)=>{
    setWordDataList((preList)=> preList.filter(data=> data.name!==wordName));
  }
    
    return(
        <div className="recommendation-div">
          <div class="row">
        
             <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {wordDataList.filter(item=> wordSets.includes(item.name)).map((item,index)=> 
                        <Grid key={index} item xs={6} sm={4} md={3} > 
                           <WordCard wordData={item} parentDeleteCallback = {handleDeleteCallback} hideDelete={false}/>
                         </Grid>)} 
            </Grid>
          </div>    
        </div>
    )
}

export default Recommendation;