import { ThemeProvider } from '@material-ui/core';
import { FolderShared } from '@material-ui/icons';
import React ,{useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue } from "recoil";
import {usernameState,
        firebaseState,
        userIdState,
        isTeacherState,
        likedWordList,
        likedStoryList} from "../../store/AuthAtoms"
import {storyliststate, 
    wordliststate,
    accesscodestate,
    storyPageCountPerPageState, 
    wordPagestate, 
    storyPagestate, 
    wordPageCountPerPageState } from "../../store/storyWordsAtoms";
import "./TeacherDashboard.css";
const testStories =[
  {name:"title1", folder:"1st"},
  {name:"title1-2", folder:"1st"},
  {name:"title2-1", folder:"2nd"},
  {name:"title2-2", folder:"2nd"},
  {name:"title-6"}

]
const TeacherDashboard = ()=>{
    const history = useHistory();
    const isTeacher = useRecoilValue(isTeacherState);
    const firebase = useRecoilValue(firebaseState);
    const [user, setUser] = useRecoilState(usernameState);
    const [userId, setUserId] = useRecoilState(userIdState);
    const [likedWords, setLikedWords] = useRecoilState(likedWordList);
    const [likedStories, setLikedStories] = useRecoilState(likedStoryList);
    const [storyList, setStoryList] = useRecoilState(storyliststate);
    const [wordList, setWordList] = useRecoilState(wordliststate);
    
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("default");

    const [selectedWords, setSelectedWords] = useState([]);
    const [selectedStories, setSelectedStories] = useState([]);
    const [myWords, setMywords] = useState([]);
    const [myStories,setMyStories] = useState([]);
    const [checkedStates, setCheckedStates] = useState([]);
    const [checkedStoryStates, setCheckedStoryStates] = useState([]);
    const [error,setError] = useState("");
    const [code,setCode] = useState("");
    const [accessCode, setAccessCode] = useRecoilState(accesscodestate);
    const [wordPage, setWordPage] = useRecoilState(wordPagestate);
    const [storyPage, setStoryPage] = useRecoilState(storyPagestate);
    const [wordsRow,setWordsRow] = useRecoilState(wordPageCountPerPageState);
    const [storiesRow, setStoriesRow] = useRecoilState(storyPageCountPerPageState);
    
    useEffect(()=>{
        setWordPage(0);
        setStoryPage(0);
        setWordsRow(8);
        setStoriesRow(8);
        setAccessCode("");
    },[])

    useEffect(()=>{
        const temp =[];
        testStories.forEach((story,index)=>{
            if(story.folder){
                !temp.includes(story.folder) && temp.push(story.folder)
            }
        })
        setFolders(temp);
    },[])

    const handleClickFolder =(folder)=>{
        setSelectedFolder(folder)
   }
   useEffect(()=>{
      setMyStories(testStories.filter((story)=>story.folder === selectedFolder))
   },[selectedFolder])
      
   useEffect(()=>{
      setMywords(wordList.filter((word)=>word.creator===user));
   }, [wordList,user])

    useEffect(()=>{  
        setCheckedStates( new Array(myWords.length).fill(false));
    },[myWords.length])

   useEffect(()=>{
    setMyStories(storyList.filter((story)=>story.creator===user));
    console.log(storyList)
    console.log(myStories)
   }, [storyList,user])

   useEffect(()=>{  
      setCheckedStoryStates( new Array(myStories.length).fill(false));
    },[myStories.length])

    const handleOnChange = (position) => {
        const updatedCheckedStates = checkedStates.map((item, index) =>index === position ? !item : item);
        setCheckedStates(updatedCheckedStates);
        let selected = [];
        updatedCheckedStates.forEach((value,index)=>{
            if(value===true){
                selected.push(myWords[index]);
            }
        })
       setSelectedWords(selected);
    }

    const handleOnStoryCheckChange = (position) => {
        const updatedCheckedStoryStates = checkedStoryStates.map((item, index) =>index === position ? !item : item);
        setCheckedStoryStates(updatedCheckedStoryStates);
        let selected = [];
        updatedCheckedStoryStates.forEach((value,index)=>{
            if(value===true){
                selected.push(myStories[index]);
            }
        })
       setSelectedStories(selected);
    }
    
    const generateAccessCode = async () =>{
        let wordInfos = [];
        let storyInfos = [];
        if(selectedWords.length === 0 && selectedStories.length === 0){
           setError("生成学生码时必须选中字和短文");
           return;
        }
        setError("");
        selectedWords.forEach((word,index)=>{
           let wordInfo = {name: word.name, wordId: word.wordId};
            wordInfos.push(wordInfo);
        })
        selectedStories.forEach((story,index)=>{
            let storyInfo = {name:story.name, storyId: story.storyId}
            storyInfos.push(storyInfo);
        })
        try {    
            const userRef = firebase.firestore().collection("users").doc(userId);
            const userDoc = await userRef.get();
            if(userDoc.exists){
                const codes = userDoc.data().accessCode;
                const newCode = user+(codes.length);
                const newCodes = [...codes,newCode];
                let codeObj = {
                    code: newCode,
                    creator: user,
                    words: wordInfos,
                    passages: storyInfos,
                    codeId: newCode}
                await firebase.firestore().collection("codes").doc(newCode).set(codeObj);
                //TODO CHANGE TO accessCodes
                await userRef.update({accessCode: newCodes});
                redirtToAccessCode();
                setCode(newCode);
            }else{
                setError("User not found")
            }
          }catch(err){    
            setError(err.message);
          }
    } 
    
    const redirectToHomePage = ()=>{
        history.push("/")
    }
    const redirtToDetailWord = (wordId)=>{
      history.push(`/carddetail/${wordId}`)
    }
    const redirtToStory = (id)=>{
       history.push(`/story/${id}`)
    }
    const redirectToAddStory = ()=>{
        history.push("/addStory");
    }
    const redirectToAddWord = ()=>{
        history.push("/addWord");
    }
    const redirectToWordwall = ()=>{
        history.push("/wordwall")
    }
    const redirecToStoryList = ()=>{
        history.push("/reading")
    }
    const redirectToMyStoryList = ()=>{
        history.push("/myreading");
    }
    
    const redirectToOwnerList = () =>{
        history.push("/myWordwall");
    }
    const redirtToAccessCode =() =>[
        history.push("/checkCodes")
    ]
   
    if(!isTeacher) {
        return (<div id="teacher-board" className = "container-wrapper">
           Please sign in as a teacher
        </div>)
        }
    return (
        <div id="teacher-board" className="container-wrapper">
            <button
            className="btn btn-outline-warning"
            onClick={redirectToHomePage}>
            如何使用❓ </button>
            <p className="text-danger"> {error} </p>
            <div className="flex-div">
                    <div className = "flex-item p-md-2">
                        <button 
                            className="btn btn-outline-info"
                            onClick = {redirectToOwnerList}> 
                                我的字库
                         </button>
                        <ul>
                        { checkedStates.length>0 && myWords.map((word, index)=>
                        <li key={index}>
                             <div> 
                             <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>redirtToDetailWord(word.wordId) }>    
                                 <span className="text-success">  {word.name}</span>
                             </button> 
                             <input 
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={word.wordId}
                                value={word.wordId}
                                checked={checkedStates[index]}
                                onChange={() => handleOnChange(index)}
                            />
                            </div> 
                        </li>
                       )}
                    </ul>
                    </div>
                    <div className = "flex-item p-md-2">
                        <button
                            className="btn btn-outline-info"
                            onClick = {redirectToMyStoryList}>  
                           我的短文
                        </button>
                        <ul>
                        { checkedStoryStates.length>0 && myStories.map((story, index)=> 
                        <li  key={index}>
                            <div> 
                            <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>redirtToStory(story.storyId) }>    
                                 <span className="text-success">  {story.name}</span>
                             </button> 
                            <input 
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={story.storyId}
                                value={story.storyId}
                                checked={checkedStoryStates[index]}
                                onChange={() => handleOnStoryCheckChange(index)}
                            /> 
                            </div>
                         </li>
                        )}
                        </ul>

                        <ul>
                        {folders.length>0 && folders.map((folder, index)=> 
                        <li  key={index}>
                            <button        
                                 type="button" 
                                 className="btn btn-outline-light" 
                                 onClick={()=>handleClickFolder(folder)}>    
                                 <span className="text-success">  {folder}</span>
                             </button>
                         </li>
                        )}
                        </ul>
                    </div>
                </div>
            <div className = "flex-div">
                <div className = "flex-item p-md-2">
                    <button 
                        className="btn btn-outline-info" 
                        onClick={generateAccessCode}>
                        生成学生码
                    </button>
                    <ul>
                    {selectedWords.map((word, index)=><li key={index}>{word.name +" "} </li>)}
                    </ul>
                    <ul>
                    {selectedStories.map((story, index)=><li key={index}>{story.name +" "} </li>)}
                    </ul>
                </div>
                <div className="flex-item p-md-3">
                        <button className="btn btn-outline-info m-md-2" onClick={redirectToAddWord}>  添加字</button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirectToAddStory}>  添加短文 </button>
                        <button className="btn btn-outline-info m-md-2" onClick= {redirectToWordwall}> 字库 </button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirecToStoryList}> 短文库 </button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirtToAccessCode}>学生码</button>
                    </div>
             </div>
        </div>
    )
}

export default TeacherDashboard;