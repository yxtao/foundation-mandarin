import React from'react';
import {Grid} from "@material-ui/core";
import WordCard from'./WordCard/WordCard';
//TODO:store it in firebase
const cardList = [
    {word:"我", phrases:["我们","我在"],sentences:["我们在家"]},
    {word:"你", phrases:["你们","你在"],sentences:["你们在家"]},
    {word:"在", phrases:["我在"],sentences:["我们在家"]},
    {word:"们", phrases:["我们"],sentences:["我们在家"]},
    {word:"看", phrases:["看见","看到"],sentences:["我看到一只猫"]},
    {word:"水", phrases:["喝水"],sentences:["我喝水"]},
    {word:"只", phrases:["一只鸟","一只猫"],sentences:["这是一只猫"]},
]

const WordWall = ()=>{
    const handleDeleteCallback =(word) =>{
        //doing nothing  right now
    }
    return(
        <div style={{marginTop:"15vh"}}>
            <Grid container 
                direction="row"
                alignItems="stretch"
                justifyContent="flex-start"
                spacing={2}
               >
                {cardList.map((item,index)=> 
                        <Grid key={index} item xs={6} sm={4} md={3} > 
                        <WordCard wordData={item} parentDeleteCallback={handleDeleteCallback} hideDelete={true}/> 
                        </Grid>)} 
            </Grid>
        </div>
    )
}

export default WordWall