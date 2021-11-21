import React,{useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState, isTeacherState } from "../../store/AuthAtoms" 
import {accesscodestate } from "../../store/storyWordsAtoms" 
import Grid from '@material-ui/core/Grid';
import "./home.css";

const HomePage=()=> {
  const history = useHistory();
  const [code, setCode] = useState("");
  const user = useRecoilValue(usernameState);
  const isAdmin = useRecoilValue(isAdminState);
  const isTeacher = useRecoilValue(isTeacherState);
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [accessCode, setAccessCode] = useRecoilState(accesscodestate);
  const onCodeChange =(e)=>{
    setCode(e.target.value)
  }
  const checkCode=()=>{
    setAccessCode(code);
    history.push("/reading");
  }
  if(isTeacher){
    return(
      <div  className="CenterMain pt-5 mt-5 ">
        welcome 
      </div>
    )
  }
  return (
    <div className="CenterMain pt-5 mt-5 ">
          <Grid  
          container 
          direction="row"
          alignItems="stretch"
          justifyContent="center"
          spacing={3}
          style={{height:"30vh"}}
          >
            <Grid item xs={8}>
                <div>
                <textarea class="form-control" 
                    rows="2" 
                    value={code} 
                    onChange={onCodeChange} placeholder="access code"
                    /> 
                </div>
            </Grid>
            <Grid item>
                <div>
                <button className="btn btn-outline-success" 
                  disabled={false} 
                  onClick={checkCode}>
                    confirm
                  </button>
                </div>
            </Grid>
        </Grid>
    </div>
  );
}


export default HomePage