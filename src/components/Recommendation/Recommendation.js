import React, {useEffect, useState} from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue} from "recoil";
import { checkedAuthState, usernameState,firebaseState } from "../../store/AuthAtoms";
import {wordsetstate } from "../../store/storyWordsAtoms";
import {Grid} from'@material-ui/core';

import WordCard from '../WordWall/WordCard/WordCard';
import "./Recommendation.css"

const Recommendation =(props)=>{
  const firebase = useRecoilValue(firebaseState);
  const user = useRecoilValue(usernameState);
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
    setWordSets((preSet) => preSet.filter(word=> word!==wordName));
  }
  
  const updateUserDataByName = async()=>{
    try {
        const query = await firebase.firestore().collection("users").where("username", "==", user).get();
         if(!query.empty){
             await firebase.firestore().collection("users").doc(user).update({
                notes:wordSets
             })
         }
      }catch(error){
        alert(error);
      }
  }

    return(
        <div className="recommendation-div">
          <div className="p-2">
            {user!==""?<button 
                       type="button"
                       className="btn btn-outline-danger"
                       onClick = {()=>updateUserDataByName(user, wordDataList)}> save </button> : null}
          </div>
         
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