import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import test1 from "../../../assets/images/wordcards/test1.jpg"

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    border:"3px solid grey"
  },
});

const WordCard = ({wordData, parentDeleteCallback, hideDelete})=> {
  const classes = useStyles();
  const sendDeleteCallback=(word)=>{
    parentDeleteCallback(word);
  }
  return (
    <Card className={classes.root}>
      <CardActionArea href="#">
      <CardMedia
          component="img"
          alt={wordData.word}
          height="140"
          image={test1}
          title={wordData.word}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {wordData.name}
          </Typography>
         {wordData.phrases.map((phrase,index)=>
              <Typography key={index} variant="body2" color="textSecondary" component="p">
                  {phrase}
              </Typography>)}
         {wordData.sentences.map((phrase,index)=>
              <Typography key={index} variant="body2" color="textSecondary" component="p">
                  {phrase}
              </Typography>)}
        </CardContent>
      </CardActionArea>
      <CardActions>
        {hideDelete===true? null : 
        <Button size="small" color="primary" onClick={()=>sendDeleteCallback(wordData.word)}>
          delete 
        </Button> }
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

export default WordCard