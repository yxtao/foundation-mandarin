import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import "./home.css";
const items =["hello","test"]
const books =["This is a sample book","This is a sample book","This is a sample book"]
const Home=()=> {
  return (
    <div className="CenterMain pt-5 ">
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
                        style={{border:"", width:`${96/items.length}%`}}>
                        <div>this is a message div</div>
                    </Grid>
                    <Grid item
                    style={{border:"", width:`${96/items.length}%`}}>
                        <div>this is an about div</div>
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
                                <Grid key={index} item style={{border:"", width:`${98/books.length}%`}}>
                                      <div key={index} className="bookDiv">{item}</div>
                                </Grid>
                        )}
            </Grid>
            <Grid item style={{margin:"5vh"}}>
              <div> This is contact div  </div>
            </Grid>
      </Grid>
    </div>
  );
}


export default Home