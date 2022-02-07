import React ,{useState, useEffect} from 'react';
import { useHistory } from 'react-router';
import { useRecoilState, useRecoilValue } from "recoil";
import {usernameState,
        firebaseState,
        userIdState,
        isTeacherState,
        likedWordList,
        likedStoryList} from "../../store/AuthAtoms"
import {storyliststate, wordliststate,} from "../../store/storyWordsAtoms";
import "./TeacherDashboard.css";

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
    const [likedWordObjs, setLikedWordObjs] = useState([]);
    const [likedStoryObjs, setLikedStoryObjs] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [selectedStories, setSelectedStories] = useState([]);
    const [myWords, setMywords] = useState([]);
    const [myStories,setMyStories] = useState([]);
    const [checkedStates, setCheckedStates] = useState([]);
    const [checkedStoryStates, setCheckedStoryStates] = useState([]);
    const [error,setError] = useState("");
    const [code,setCode] = useState("");
    
    useEffect(()=>{
        let wordObjsTemp = [];
        wordList.forEach((wordObj, index)=>{
            console.log("wordData", wordObj);
            if(likedWords.includes(wordObj.wordId)){     
               let wordInfo = wordObj;
                wordObjsTemp.push(wordInfo);
            }   
        })    
        setLikedWordObjs(wordObjsTemp);
    },[wordList, likedWords])

   useEffect(()=>{
      setMywords(wordList.filter((word)=>word.creator===user));
   }, [wordList,user])

    useEffect(()=>{  
        setCheckedStates( new Array(myWords.length).fill(false));
    },[myWords.length])

   useEffect(()=>{
    setMyStories(storyList.filter((story)=>story.creator===user));
   }, [storyList,user])

   useEffect(()=>{  
      setCheckedStoryStates( new Array(myStories.length).fill(false));
    },[myStories.length])

    useEffect(()=>{
        let objsTemp = [];
            storyList.forEach((storyObj, index)=>{
            console.log("storyData", storyObj);
            console.log("likedstories", likedStories);
            if(likedStories.includes(storyObj.storyId)){     
               let storyInfo = storyObj;
                objsTemp.push(storyInfo);
            }   
        })
        setLikedStoryObjs(objsTemp);
    }, [storyList, likedStories])

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
            console.log(selected)
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

    const handleRemoveLike = async (wordId) =>{
        let words = [...likedWords];
            words= words.filter(word=> word!==wordId);
        try {
            await updatelikedWordCards(userId, words);
        }catch(err){
            setError(err.message)
        }
        setLikedWords(words);
     }
     const updatelikedWordCards = async(uid, words)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedWordCards:words
            })
          }catch(err){    
            setError(err.message);
          }
      }

    const addToWordDB = async (word) =>{
        // WARNING: wordList is updated once firebase snapshot works
        try {
            let wordObj = {
                ...word,
                creator: user,
                wordId:user+word.name}
            await handleRemoveLike(word.wordId); 
            await firebase.firestore().collection("chinesewords").doc(user+word.name).set(wordObj)    
          }catch(err){    
            setError(err.message);
          }
    }
  
    const addToStoryDB = async (story) =>{
        // WARNING: storyList is updated once firebase snapshot works
        try {
            let storyObj = {
                ...story,
                creator: user,
                storyId:user+story.name}
            await handleRemoveStoryLike(story.storyId); 
            await firebase.firestore().collection("story").doc(user+story.name).set(storyObj)    
          }catch(err){    
            setError(err.message);
          }
    }
    const handleRemoveStoryLike = async (storyId) =>{
        let stories = [...likedStories];
            stories= stories.filter(story=> story!==storyId);
        try {
            await updatelikedStories(userId, stories);
        }catch(err){
            setError(err.message)
        }
        setLikedStories(stories);
     }
     const updatelikedStories = async(uid, stories)=>{
        try {
            const docRef = firebase.firestore().collection("users").doc(uid);
            const doc = await docRef.get(); 
            if(!doc.exists) { 
                 setError("NOT FOUND"); 
                 return;
             }
            await docRef.update({
                likedPassages:stories
            })
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
    const redirectToLikedStoryList = ()=>{
        history.push("/likedReading")
    }
    const redirectToOwnerList = () =>{
        history.push("/myWordwall");
    }
    const redirectToLikedList = () =>{
        history.push("/likedWordwall");
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
                        {myWords.map((word, index)=>
                        <li>
                             <div  key={index}> 
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
                        {myStories.map((story, index)=> 
                        <li>
                            <div  key={index}> 
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
                    </div>
                    <div className="flex-item p-md-3">
                        <button className="btn btn-outline-info m-md-2" onClick={redirectToAddWord}>  添加字</button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirectToAddStory}>  添加短文 </button>
                        <button className="btn btn-outline-info m-md-2" onClick= {redirectToWordwall}> 字库 </button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirecToStoryList}> 短文库 </button>
                        <button className="btn btn-outline-info m-md-2" onClick={redirtToAccessCode}>学生码</button>
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
                    {selectedWords.map((word)=><li>{word.name +" "} </li>)}
                    </ul>
                    <ul>
                    {selectedStories.map((story)=><li>{story.name +" "} </li>)}
                    </ul>
                </div>
                <div className = "flex-item p-md-2">
                    <button 
                        className="btn btn-outline-info"
                        onClick={redirectToLikedList}> 
                        收藏的字
                        </button>
                    <div>
                    {likedWordObjs.map((word, index)=>
                        <div  key={index}  className="p-md-2 flex-column">       
                            <button        
                                type="button" 
                                className="btn btn-outline-light" 
                                onClick={()=>redirtToDetailWord(word.wordId) }>    
                                <span className="text-success">{word.name}</span>
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-light"
                                onClick={()=>addToWordDB(word) }>    
                                <span className="text-info"> + 加到我的字库 </span>
                            </button>
                        </div>)}
                    </div>
                </div>
                <div className = "flex-item p-md-2">
                    <button 
                        className="btn btn-outline-info"
                        onClick={redirectToLikedStoryList}>  喜欢的短文
                    </button>
                    <div className = "stories-div">
                    {likedStoryObjs.map((story, index)=>
                        <div  key={index}  className="p-md-2 flex-column">       
                            <button        
                                type="button" 
                                className="btn btn-outline-light" 
                                onClick={()=>redirtToStory(story.storyId) }>    
                                <span className="text-success">  {story.name}</span>
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline-light"
                                onClick={()=>addToStoryDB(story) }>    
                                <span className="text-info"> + 加入我的短文库</span>
                            </button>
                        </div>)}
                    </div>
                </div>
             </div>
        </div>
    )
}

export default TeacherDashboard;