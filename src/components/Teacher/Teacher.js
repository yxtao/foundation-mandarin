import React, {useEffect, useState} from 'react';
import {Grid, Paper, Card, CardActions, CardContent, Button} from "@material-ui/core";


import "./Teacher.css"
import UploadStory from './UploadStory'; 
import UploadWord from './UploadWord';

const Teacher=()=>{
  const[uploadContent, setUploadContent] = useState("");
  return(
      <div className="container m-5">
          <button className="btn-lg m-lg-3 btn btn-outline-success " onClick={()=>setUploadContent("story")}>create stories</button>
          <button className="btn-lg m-lg-3 btn btn-outline-info" onClick={()=>setUploadContent("word")}>create words</button>
          {uploadContent==="story"? <UploadStory/> : 
           uploadContent==="word"?
           <UploadWord /> :
            null
          }
      </div>
  )
  
}
export default Teacher;