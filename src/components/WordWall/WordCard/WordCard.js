import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import test1 from "../../../assets/images/wordcards/test1.jpg"

const useStyles = makeStyles({
  root: {
    background:"#EDFCFC",
    maxWidth: 280,
    boxShadow: "5px 10px 10px 0 rgb(4, 200, 200)", 
  },
});

const WordCard = ({wordData, parentDeleteCallback, parentLikeCallback, parentRemoveLikeCallback,hideDelete, hideLike, hideRemoveLike})=> {
  const classes = useStyles();
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
    <Card className={classes.root} style={{height:"35vh"}}> 
      <CardActionArea style={{height:"30vh" ,overflowY:"auto",overflowX:"auto"}} >
      <Typography gutterBottom variant="h4" component="h4" style={{width: "50%",margin:"auto"}}>
            {wordData.name}
          </Typography>
      <Link to = {`/carddetail/${wordData.wordId}`}>
        <CardContent>
         <Typography>{wordData.pinyin? wordData.pinyin : ""}</Typography> 
         <Typography>{wordData.wordMeaning? wordData.wordMeaning: ""}</Typography> 
         {wordData.phrases.map((phrase,index)=>
              <Typography key={index} variant="body2" color="textSecondary" component="p">
                  {phrase}
              </Typography>)}
         {wordData.sentences.map((phrase,index)=>
              <Typography key={index} variant="body2" color="textSecondary" component="p">
                  {phrase}
              </Typography>)}
        </CardContent>
        </Link>
      </CardActionArea>
      <CardActions>
        {hideDelete === true? null : 
        <Button size="small" color="primary" onClick={()=>sendDeleteCallback(wordData.wordId)}>
          delete 
        </Button> }
        {hideLike === true? null : 
        <Button size="small" color="primary" onClick={sendLikeCallback}>
          like
        </Button> }
        {hideRemoveLike === true? null : 
        <Button size="small" color="primary" onClick={sendRemoveCallback}>
          Unlike
        </Button> }
      </CardActions>
    </Card>
  );
}

export default WordCard