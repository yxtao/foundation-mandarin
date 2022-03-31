import React,{useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState, isTeacherState } from "../../store/AuthAtoms" 
import {accesscodestate, codeliststate} from "../../store/storyWordsAtoms" 
import Grid from '@material-ui/core/Grid';
import "./home.css";

const HomePage=()=> {
  const history = useHistory();
  const [code, setCode] = useState("");
  const user = useRecoilValue(usernameState);
  const isAdmin = useRecoilValue(isAdminState);
  const isTeacher = useRecoilValue(isTeacherState);
  const [codeList, setCodeList] = useRecoilState(codeliststate);
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [accessCode, setAccessCode] = useRecoilState(accesscodestate);
  const [error, setError] = useState("");
  const onCodeChange =(e)=>{
    setCode(e.target.value.trim())
  }
  const checkCode=()=>{
    let obj = codeList.find((element)=> element.code === code);
    console.log("obj code", obj)
    if (obj){
      setAccessCode(code);
      history.push("/reading");
    }else{
       setError("This Access Code Does Not Exist!")
    }
  }
  if(isTeacher){
    return(
      <div  className="CenterMain pt-5 mt-5 ">
        welcome {user}
        <div className="video-responsive">
          <iframe
            width="853"
            height="480"
            src = "https://www.youtube.com/embed/Erw0XCYaHI4?rel=0"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="user guide"
          />
        </div>
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
                <textarea className="form-control" 
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
            <Grid item>
            <div>
              <p className="text-danger"> {error} </p>
            </div>
          </Grid> 
        </Grid>    
    </div>
  );
}


export default HomePage