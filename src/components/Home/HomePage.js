import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { useRecoilState} from "recoil";
import { teachernamestate } from "../../store/storyWordsAtoms" 
import "./home.css";

const items =["hello","test", "button"]
const books =["This is a sample book","This is a sample book","This is a sample book"]
const HomePage=()=> {
  const [teacherName, setTeacherName] = useRecoilState(teachernamestate);
  const [code, setCode] = useState("");

  const onTeacherNameChange = (e)=>{
    setTeacherName(e.target.value)
  }
  const onCodeChange =(e)=>{
    setCode(e.target.value)
  }
  const checkTeacher = ()=>{
    // TODO get the teacher in users collection 
    // check the code associated with this teacher username
    // if true, get stories and words created by the teacher
    // pass the stories and words to recoil state 
  }
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
                        <div>
                        <textarea class="form-control" 
                            rows="2" 
                            value={teacherName} 
                            onChange={onTeacherNameChange} placeholder="teacher user name"
                            /> 
                        </div>
                    </Grid>
                    <Grid item
                    style={{border:"", width:`${96/items.length}%`}}>
                        <div>
                        <textarea class="form-control" 
                            rows="2" 
                            value={code} 
                            onChange={onCodeChange} placeholder="access code"
                            /> 
                        </div>
                    </Grid>
                    <Grid item
                    style={{border:"", width:`${96/items.length}%`}}>
                        <div>
                        <button className="btn btn-outline-success" 
                          disabled={false} 
                          onClick={checkTeacher}>
                           confirm
                          </button>
                        </div>
                    </Grid>
            </Grid>

            {/* <Grid item  
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
            </Grid> */}
      </Grid>
    </div>
  );
}


export default HomePage