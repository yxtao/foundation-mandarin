import React from 'react';
import {Grid} from "@material-ui/core";

import './ReadingList.css'

import { useHistory } from 'react-router-dom';

const ReadingList = (props)=>{
    const history = useHistory();
   
    const openStory = (name) => {
       history.push(`/story/${name}`);
       console.log(props.stories)
    }
    return (<div className="ReadingListDiv container">
               <div className="container">
                   <Grid container spacing={5} >  
                  { props.stories.map((story, index)=>
                   <Grid item >
                       <button  className="btn btn-info"
                                key={index} 
                                onClick={()=>openStory(story.name)}>
                                    {story.name} 
                        </button>
                    </Grid>)}
                </Grid>
               </div>
          </div>        
    )}

export default ReadingList