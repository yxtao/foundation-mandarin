import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import "./WordCard.css"

const WordCard = ({wordData,
                   parentDeleteCallback, 
                   parentLikeCallback,
                   parentRemoveLikeCallback,
                   hideDelete, 
                   hideLike, 
                   hideRemoveLike})=> {
  const sendDeleteCallback=()=>{
    parentDeleteCallback(wordData.wordId);
  }
  const sendLikeCallback =() =>{
    parentLikeCallback(wordData.wordId);
  }
  const sendRemoveCallback = ()=>{
    parentRemoveLikeCallback(wordData.wordId);
  }
  return (
    <Card id="word-card"> 
      <CardActionArea id="action-card">
      <div className="card-title">
            <h2>{wordData.name}</h2>
            <h5>{wordData.creator}</h5>
      </div>
      <Link id="link-detail" to= {`/carddetail/${wordData.wordId}`}>
        <div id="card-content">
         <h4>{wordData.pinyin? wordData.pinyin : ""}</h4> 
         <p>{wordData.wordMeaning? wordData.wordMeaning: ""}</p> 
         {wordData.phrases.map((phrase,index)=>
              <p> {phrase} </p>)}
        </div>
        </Link>
      </CardActionArea>
      <CardActions>
        {hideDelete === true? null : 
        <Button size="small" color="primary" onClick={()=>sendDeleteCallback(wordData.wordId)}>
          x 删除 
        </Button> }
        {hideLike === true? null : 
        <Button size="small" color="primary" onClick={sendLikeCallback}>
          <h4>♡</h4>
        </Button> }
        {hideRemoveLike === true? null : 
        <Button size="small" color="primary" onClick={sendRemoveCallback}>
          <h4>♥</h4>
        </Button> }
      </CardActions>
    </Card>
  );
}

export default WordCard