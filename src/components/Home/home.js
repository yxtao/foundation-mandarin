
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height:"100vh",
   // border:"1px solid red",
    marginTop:"20vh",
  },
  Card: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


const items =["hello","test"]
const books =["book","book","book"]
const Home=()=> {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container 
             direction="column"
             alignItems="stretch"
             justifycontent="space-between"
             spacing={1}
            //  style={{border:"1px solid green"}}
        >
             <Grid item  
              container 
              direction="row"
              alignItems="stretch"
              justifyContent="space-between"
              style={{height:"30vh"}}
             >
                    <Grid item 
                        style={{border:"1px solid purple", width:`${96/items.length}%`}}>
                        <div>this is a message div</div>
                    </Grid>
                    <Grid item
                    style={{border:"1px solid purple", width:`${96/items.length}%`}}>
                        <div>this is a picture div</div>
                    </Grid>
            </Grid>

            <Grid item  
              container 
              direction="row"
              alignItems="stretch"
              justifyContent="space-between"
              style={{height:"30vh"}}
             >
                    {books.map((item,index)=>
                                <Grid key={index} item style={{border:"1px solid purple", width:`${98/books.length}%`}}> 
                                    <Card key={index} className={classes.paper}>{item}</Card>
                                </Grid>
                        )}
            </Grid>
      </Grid>
    </div>
  );
}


export default Home